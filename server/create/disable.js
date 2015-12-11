Meteor.methods({
  disableVirtual: function (vip_id, stage) {
    // Bug disallows this for v12
    var vip = Virtuals.findOne({_id: vip_id});
    var device = Devices.findOne({_id: vip.onDevice});
    var methodName = {
      action: "disable",
      module: "ltm",
      object: "virtual"
    };
    var theChange = {
      description: "Disable Virtual Server " + vip.fullPath + " on device: " + device.self.name,
      theMethod: methodName,
      argList: {
        vipLink: vip.selfLink,
        onDevice: vip.onDevice,
        objId: vip_id
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: 'Disable ' + vip.fullPath };
    return myRes;
  },
  disablePoolMember: function (poolMember, device_id, stage) {
    var device = Devices.findOne({_id: device_id});
    var methodName = {
      action: "disable",
      module: "ltm",
      object: "pool_member"
    };
    var pmem_name = poolMember.replace(/https:\/\/localhost\/mgmt\/tm\/ltm\/pool\//, "");
    var theChange = {
      description: "Disable Pool Member " + pmem_name + " on device: " + device.self.name,
      theMethod: methodName,
      argList: {
        poolMember: poolMember,
        device_id: device_id
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage) {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: 'Disable ' + pmem_name };
    return myRes;
  },
  forcePoolMember: function (poolMember, device_id, stage) {
    var device = Devices.findOne({_id: device_id});
    var methodName = {
      action: "force",
      module: "ltm",
      object: "pool_member"
    };
    var pmem_name = poolMember.replace(/https:\/\/localhost\/mgmt\/tm\/ltm\/pool\//, "");
    var theChange = {
      description: "Force Down Pool Member " + pmem_name + " on device: " + device.self.name,
      theMethod: methodName,
      argList: {
        poolMember: poolMember,
        device_id: device_id
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    var result = Meteor.call('pushChange', change_id);
    if (stage == "1") {
      return;
    }
    var myRes = { subject: 'Success!', message: 'Force Offline ' + pmem_name };
    return myRes;
  },
  disableDatacenter: function (objId, stage) {
    var obj = Gtmdatacenters.findOne({_id: objId});
    var syncGroup = Gtmsyncgroups.findOne({_id: obj.inSyncGroup});
    var methodName = {
      action: "disable",
      module: "gtm",
      object: "datacenter"
    };
    var theChange = {
      description: "Disable GTM Datacenter " + obj.fullPath + " on sync group: " + syncGroup.name,
      theMethod: methodName,
      argList: {
        objUrl: obj.selfLink,
        syncGroup: obj.inSyncGroup
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    var result = Meteor.call('pushChange', change_id);
    if (stage == "1") {
      return;
    }
    var myRes = { subject: 'Success!', message: 'Disabled ' + obj.fullPath };
    return myRes;
  },
});
