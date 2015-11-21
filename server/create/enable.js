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
    return result;
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
    return result;
  }
});
