Meteor.methods({
  deletePoolMember: function (poolMember, device_id, pool_id, stage) {
    var device = Devices.findOne({_id: device_id});
    var methodName = {
      action: "delete",
      module: "ltm",
      object: "pool_member"
    };
    var pmem_name = poolMember.replace(/https:\/\/localhost\/mgmt\/tm\/ltm\/pool\//, "");
    var theChange = {
      description: "Delete Pool Member " + pmem_name + " on device: " + device.self.name,
      theMethod: methodName,
      argList: {
         pool_id: pool_id,
         poolMember: poolMember,
         device_id: device_id
       }
     };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deletePool: function(poolId, stage) {
    var poolObj = Pools.findOne({_id: poolId});
    var device = Devices.findOne({_id: poolObj.onDevice});
    var methodName = { action: "delete", module: "ltm", object: "pool" };
    var theChange = {
      description: "Delete Pool " + poolObj.fullPath + " on device: " + device.self.name,
      theMethod: methodName,
      argList: {
        onDevice: poolObj.onDevice,
        poolUrl: poolObj.selfLink,
        poolId: poolId
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deleteVirtual: function(vip_id, stage) {
    var vipObj = Virtuals.findOne({_id: vip_id});
    var device = Devices.findOne({_id: vipObj.onDevice});
    var methodName = {
      action: "delete",
      module: "ltm",
      object: "virtual"
    };
    var theChange = {
      description: "Delete Virtual " + vipObj.fullPath + " on device: " + device.self.name,
      theMethod: methodName,
      argList: {
        onDevice: vipObj.onDevice,
        selfLink: vipObj.selfLink,
        obj_id: vip_id
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deleteProfile: function(profile_id, stage) {
    var obj = Profiles.findOne({_id: profile_id});
    var device = Devices.findOne({_id: obj.onDevice});
    var methodName = {
      action: "delete",
      module: "ltm",
      object: "profile"
    };
    var theChange = {
      description: "Delete Profile " + obj.fullPath + " on device: " + device.self.name,
      theMethod: methodName,
      argList: {
        device_id: obj.onDevice,
        selfLink: obj.selfLink,
        obj_id: profile_id
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deleteMonitor: function(objId, stage) {
    var obj = Monitors.findOne({_id: objId});
    var device = Devices.findOne({_id: obj.onDevice});
    var methodName = {
      action: "delete",
      module: "ltm",
      object: "monitor"
    };
    var theChange = {
      description: "Delete Monitor " + obj.fullPath + " on device: " + device.self.name,
      theMethod: methodName,
      argList: {
        device_id: obj.onDevice,
        selfLink: obj.selfLink,
        obj_id: objId
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    if (result === 401) {
      console.log(result);
      throw new Meteor.Error(401, 'Error 401', 'Unauthorized');
    } else {
      var myRes = { subject: 'Success!', message: result };
      return myRes;
    }
  },
  deleteGmember: function(sync_id, gMemberObj, memberLink, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var syncgroup = Gtmsyncgroups.findOne({_id: sync_id});
    var wpool = Widepools.findOne({_id: gMemberObj.onPool});
    var argList = {
      syncId: sync_id,
      onPool: gMemberObj.pool_id,
      selfLink: memberLink,
      poolLink: wpool.selfLink
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Delete Gtm Member " + argList.selfLink + "from pool: " + argList.onPool + " on sync group: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "delete",
        module: "gtm",
        object: "member"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deleteGtmWideip: function(syncId, objId, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var obj = Wideips.findOne({_id: objId});
    var syncgroup = Gtmsyncgroups.findOne({_id: obj.inSyncGroup});

    var argList = {
      syncId: syncId,
      objId: objId,
      selfLink: wideip.selfLink
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Delete Gtm Wideip " + obj.name + "from SyncGroup: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "delete",
        module: "gtm",
        object: "wideip"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deleteGtmServer: function(syncId, objId, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var obj = Gtmservers.findOne({_id: objId});
    var syncgroup = Gtmsyncgroups.findOne({_id: obj.inSyncGroup});

    var argList = {
      syncId: syncId,
      objId: objId,
      selfLink: obj.selfLink
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Delete Gtm Server " + obj.name + "from SyncGroup: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "delete",
        module: "gtm",
        object: "server"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deleteGtmMonitor: function(syncId, objId, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var obj = Monitors.findOne({_id: objId});
    var syncgroup = Gtmsyncgroups.findOne({_id: wideip.inSyncGroup});

    var argList = {
      syncId: syncId,
      objId: objId,
      selfLink: obj.selfLink
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Delete Gtm Wideip " + obj.name + "from SyncGroup: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "delete",
        module: "gtm",
        object: "monitor"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deleteGtmPool: function(syncId, objId, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var obj = Widepools.findOne({_id: objId});
    var syncgroup = Gtmsyncgroups.findOne({_id: obj.inSyncGroup});

    var argList = {
      syncId: syncId,
      objId: objId,
      selfLink: obj.selfLink
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Delete Gtm Pool " + obj.name + "from SyncGroup: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "delete",
        module: "gtm",
        object: "pool"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deleteGtmVserver: function(syncId, objId, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var obj = Gtmvservers.findOne({_id: objId});
    var syncgroup = Gtmsyncgroups.findOne({_id: obj.inSyncGroup});

    var argList = {
      syncId: syncId,
      objId: objId,
      selfLink: obj.selfLink
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Delete Gtm Virtual Server " + obj.name + "from SyncGroup: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "delete",
        module: "gtm",
        object: "vserver"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  }
});
