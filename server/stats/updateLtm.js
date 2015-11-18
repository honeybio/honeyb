Meteor.methods({
  updateAllPoolMemberStats: function () {
    this.unblock();
    var device_list = Devices.find();
    device_list.forEach(function (eachDevice) {
      Meteor.call("updateAllPoolMembersStatus", eachDevice._id);
    });
  },
  updateAllDevicePoolMemberStats: function (device_id) {
    this.unblock();
    var pool_list = Pools.find({onDevice: device_id});
    pool_list.forEach(function (eachPool) {
      Meteor.call("updateAllPoolMembersStatus", device_id, eachPool._id);
    });
  },
  updateAllPoolMembersStatus: function (device_id) {
    this.unblock();
    var stats = Meteor.call("bigipRestGetItems", device_id, "https://localhost/mgmt/tm/ltm/pool?expandSubcollections=true");
    for (i = 0; i < stats.length; i++) {
      var pmem = stats[i].membersReference.items;
      for(var attrname in stats[i]) {
        if (pmem !== undefined) {
          for ( var j = 0; j < pmem.length; j++) {
            pmem[j].statusImg = Meteor.call("getStatusImage", pmem[j].state, pmem[j].session);
          }
        }
        // for (var j = 0; j < poolObject.members.length);
      };
      Pools.update({onDevice: device_id, fullPath: stats[i].fullPath}, {$set: { members: pmem}});
    }
  },
  updatePoolMemberStatus: function (device_id, pool_id) {
    this.unblock();
    var device = Devices.findOne({_id: device_id});
    var ip = device.mgmtAddress;
    var user = device.mgmtUser;
    var pass = device.mgmtPass;
    var curPool = Pools.findOne({_id: pool_id});
    var requrl = curPool.selfLink.replace(/localhost/, ip);
    var authString = user + ":" + pass;
    try {
      var result = HTTP.get(requrl, {auth: authString}).data;
      var pmemUrl = result.membersReference.link.replace(/https:\/\/localhost\/mgmt\/tm/, "");
      var pmem = Meteor.call("bigipRestGet", ip, user, pass, pmemUrl);
      var poolObject = { onDevice: device_id, members: pmem };
      for(var attrname in result) {
        poolObject[attrname] = result[attrname];
        for ( var j = 0; j < poolObject.members.length; j++) {
          poolObject.members[j].statusImg = Meteor.call("getStatusImage", poolObject.members[j].state, poolObject.members[j].session);
        }
      }
      Pools.update({_id: pool_id}, {
         $set: { members: poolObject.members, name: poolObject.name,
            allowNat: poolObject.allowNat, allowSnat: poolObject.allowSnat, monitor: poolObject.monitor,
            slowRampTime: poolObject.slowRampTime
         }});
      Meteor.call("getPoolStats", ip, user, pass, device_id);
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  getVirtualStats: function (ip, user, pass, device_id) {
    this.unblock();
    var stats = Meteor.call("bigipRestGetv2", device_id, "https://localhost/mgmt/tm/ltm/virtual/stats");
    for (var entry in stats.entries) {
      var virtualStatObject = { onDevice: device_id, objType: "virtual", object: entry };
      virtualStatObject.availabilityState = stats.entries[entry].nestedStats.entries['status.availabilityState'].description;
      virtualStatObject.enabledState = stats.entries[entry].nestedStats.entries['status.enabledState'].description;
      virtualStatObject.objFullPath = stats.entries[entry].nestedStats.entries.tmName.description;
      virtualStatObject.group = 'default-group';
      Statistics.insert(virtualStatObject);
      var imgName = Meteor.call("getStatusImage", virtualStatObject.availabilityState, virtualStatObject.enabledState);
      var tmpPath = entry.replace(/\/stats/, "\\?ver");
      var vipObject = tmpPath.replace(/\//g, "\\/");
      Virtuals.update({ onDevice: device_id, selfLink: { $regex:vipObject }}, { $set: {statusImg: imgName} });
      // Virtuals.update()
    }
  },
  getPoolStats: function (ip, user, pass, device_id) {
    this.unblock();
    var stats = Meteor.call("bigipRestGetv2", device_id, "https://localhost/mgmt/tm/ltm/pool/stats");
    for (var entry in stats.entries) {
      var poolStatObject = { onDevice: device_id, objType: "pool", object: entry };
      poolStatObject.availabilityState = stats.entries[entry].nestedStats.entries['status.availabilityState'].description;
      poolStatObject.enabledState = stats.entries[entry].nestedStats.entries['status.enabledState'].description;
      poolStatObject.objFullPath = stats.entries[entry].nestedStats.entries.tmName.description;
      poolStatObject.group = 'default-group';
      Statistics.insert(poolStatObject);
      var imgName = Meteor.call("getStatusImage", poolStatObject.availabilityState, poolStatObject.enabledState);
      var tmpPath = entry.replace(/\/stats/, "\\?ver");
      var poolObject = tmpPath.replace(/\//g, "\\/");
      Pools.update({ onDevice: device_id, selfLink: { $regex:poolObject }}, { $set: {statusImg: imgName} });
    }
  }
});
