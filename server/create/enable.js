Meteor.methods({
  enablePoolMember: function (poolMember, device_id, stage) {
    var device = Devices.findOne({_id: device_id});
    var methodName = {
      action: "enable",
      module: "ltm",
      object: "pool_member"
    };
    var pmem_name = poolMember.replace(/https:\/\/localhost\/mgmt\/tm\/ltm\/pool\//, "");
    var theChange = {
      description: "Enable Pool Member " + pmem_name + " on device: " + device.self.name,
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
    var myRes = { subject: 'Success!', message: 'Enabled ' + pmem_name };
    return myRes;
  },
  enableVirtual: function (vip_id, stage) {
    var vip = Virtuals.findOne({_id: vip_id});
    var device = Devices.findOne({_id: vip.onDevice});
    var methodName = {
      action: "enable",
      module: "ltm",
      object: "virtual"
    };
    var theChange = {
      description: "Enable Virtual Server " + vip.fullPath + " on device: " + device.self.name,
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
    var myRes = { subject: 'Success!', message: 'Enabled ' + vip.fullPath };
    return myRes;
  },
  enableDatacenter: function (objId, stage) {
    var obj = Gtmdatacenters.findOne({_id: objId});
    var syncGroup = Gtmsyncgroups.findOne({_id: obj.inSyncGroup});
    var methodName = {
      action: "enable",
      module: "gtm",
      object: "datacenter"
    };
    var theChange = {
      description: "Enable GTM Datacenter " + obj.fullPath + " on sync group: " + syncGroup.name,
      theMethod: methodName,
      argList: {
        datacenterUrl: obj.selfLink,
        syncGroup: obj.inSyncGroup
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    var result = Meteor.call('pushChange', change_id);
    if (stage == "1") {
      return;
    }
    var myRes = { subject: 'Success!', message: 'Enabled ' + obj.fullPath };
    return myRes;
  },
  enableGtmserver: function (objId, stage) {
    var obj = Gtmservers.findOne({_id: objId});
    var syncGroup = Gtmsyncgroups.findOne({_id: datacenter.inSyncGroup});
    var methodName = {
      action: "enable",
      module: "gtm",
      object: "server"
    };
    var theChange = {
      description: "Enable GTM Server " + obj.fullPath + " on sync group: " + syncGroup.name,
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
    var myRes = { subject: 'Success!', message: 'Enabled ' + obj.fullPath };
    return myRes;
  },
  enableVcmpGuest: function (guestId, stage) {
    // Bug disallows this for v12
    var obj = Vcmpguests.findOne({_id: guestId});
    var device = Devices.findOne({_id: obj.onDevice});
    var methodName = {
      action: "enable",
      module: "vcmp",
      object: "guest"
    };
    var theChange = {
      description: "Startup/Enable VCMP Guest " + obj.name + " on device: " + device.self.name,
      theMethod: methodName,
      argList: {
        selfLink: obj.selfLink,
        onDevice: obj.onDevice,
        objId: guestId
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: 'Enable ' + obj.fullPath };
    return myRes;
  },
});
