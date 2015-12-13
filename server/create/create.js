Meteor.methods({
  // A "change"
  //  var theChange = { description: event.target.stageDescription.value, theMethod: "setStatusPoolMember",
  //  args: [ the_action, checkedList[i], onDevice ]};
  createLtmPool: function(device_id, poolObject, stage) {
    /**
    * Method that builds a change to add an LTM pool
    *
    * @method addLtmPool
    * @param {string} The id of the device this is going to add on
    * @param {string} The name of the Pool being added
    * @param {string} The load balancing method of the pool
    * @param {string} The fullPath of the monitor to add to the pool
    * @param {array} The members being added to the pool
    * @param {string} 1 if sbeing staged, 0 if pushed immediately
    * @return {boolean} returns true if success
    */
    var device = Devices.findOne({_id: device_id});
    var argList = { device_id: device_id };
    for (var attrname in poolObject) {
      argList[attrname] = poolObject[attrname];
    }
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Add Pool " + argList.name + " on device: " + device.self.name,
      theMethod: {
        action: "create",
        module: "ltm",
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
  createLtmRule: function(device_id, ruleName, iruleContent, stage) {
    /**
    * Method that builds a change to add an LTM pool
    *
    * @method addLtmPool
    * @param {string} The id of the device this is going to add on
    * @param {string} The name of the Pool being added
    * @param {string} The load balancing method of the pool
    * @param {string} The fullPath of the monitor to add to the pool
    * @param {array} The members being added to the pool
    * @param {string} 1 if sbeing staged, 0 if pushed immediately
    * @return {boolean} returns true if success
    */
    var device = Devices.findOne({_id: device_id});
    var argList = {
      device_id: device_id,
      ruleData: iruleContent
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Add iRule " + argList.name + " on device: " + device.self.name,
      theMethod: {
        action: "create",
        module: "ltm",
        object: "rule"
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
  addLtmVirtual: function(device_id, monObj, stage) {
    /**
    * Method that builds a change to add an LTM virtual
    *
    * @method addLtmVirtual
    * @param {string} The id of the device this is going to add on
    * @param {string} The name of the virtual being added
    * @param {string} The destination (listening IP/Port)
    * @param {string} The network mask of the VIP
    * @param {string} The snat options for the virtual
    * @param {string} The name of the object
    * @param {string} 1 if sbeing staged, 0 if pushed immediately
    * @return {boolean} returns true if success
    */
    var device = Devices.findOne({_id: device_id});
    var theChange = {
      description: "Add Virtual " + vip_name + " on device: " + device.self.name,
      theMethod: {
        action: "create",
        module: "ltm",
        object: "virtual"
      },
      argList: {
        device_id: device_id,
        vipObj: vipObj
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
  addPoolMember: function(device_id, memberObj, stage) {
    /**
    * Method that builds a change to add an LTM pool member
    *
    * @method addPoolMember
    * @param {string} The id of the device this is going to add on
    * @param {string} The id of the pool to add the member
    * @param {string} The ip address of the new member
    * @param {string} The port of the new member
    * @param {string} 1 if sbeing staged, 0 if pushed immediately
    * @return {boolean} returns true if success
    */
    var device = Devices.findOne({_id: device_id});
    var pool = Pools.findOne({_id: memberObj.pool_id});
    var argList = {
      device_id: device_id,
      pool_id: memberObj.pool_id
    };
    for (var attrname in memberObj) {
      argList[attrname] = memberObj[attrname];
    }
    var theChange = { description: "Add Pool Member " + argList.ipAddr + ":" + argList.port + " to pool: " + pool.name + " on device: " + device.self.name,
      theMethod: {
        action: "create",
        module: "ltm",
        object: "pool_member"
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
  createGtmAPool: function(sync_id, poolObject, stage) {
    /**
    * Method that builds a change to add an LTM pool
    *
    * @method createGtmAPool
    * @return {boolean} returns true if success
    */
    var syncgroup = Gtmsyncgroups.findOne({_id: sync_id});
    var argList = { syncId: sync_id, type: "a" };
    for (var attrname in poolObject) {
      argList[attrname] = poolObject[attrname];
    }
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Add Gtm Pool " + argList.name + " on sync group: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "create",
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
  createGtmAWideip: function(sync_id, wipObject, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var syncgroup = Gtmsyncgroups.findOne({_id: sync_id});
    var argList = { syncId: sync_id, type: "a" };
    for (var attrname in wipObject) {
      argList[attrname] = wipObject[attrname];
    }
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Add Gtm Wideip " + argList.name + " on sync group: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "create",
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
  addGmember: function(sync_id, gMemberObj, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var syncgroup = Gtmsyncgroups.findOne({_id: sync_id});
    var argList = {
      syncId: sync_id,
      onPool: gMemberObj.onPool,
      name: gMemberObj.name
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Add Gtm Member " + argList.name + " on sync group: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "create",
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
  createGtmServer: function(syncId, obj, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var syncgroup = Gtmsyncgroups.findOne({_id: syncId});
    var argList = {
      syncId: syncId,
      name: obj.name
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Add Gtm Server " + argList.name + " on sync group: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "create",
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
  createGtmVserver: function(syncId, obj, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var syncgroup = Gtmsyncgroups.findOne({_id: syncId});
    var argList = {
      syncId: syncId,
      name: obj.name,
      onServer: obj.onServer
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Add Gtm Virtual Server " + argList.name + " to Server " + obj.server + " on sync group: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "create",
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
  },
  createGtmMonitor: function(syncId, obj, stage) {
    /**
    * Method that builds a change to add a GTM wideip
    *
    * @method createGtmAWideip
    * @return {boolean} returns true if success
    */
    var syncgroup = Gtmsyncgroups.findOne({_id: syncId});
    var argList = {
      syncId: syncId,
      name: obj.name
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Add Gtm monitor " + argList.name + " on sync group: " + syncgroup.synchronizationGroupName,
      theMethod: {
        action: "create",
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
  createVcmpGuest: function (deviceId, obj, stage) {
    var device = Devices.findOne({_id: deviceId});
    var methodName = {
      action: "create",
      module: "vcmp",
      object: "guest"
    };
    var theChange = {
      description: "Create VCMP Guest " + obj.name + " on device: " + device.self.name,
      theMethod: methodName,
      argList: {
        name: obj.name,
        image: obj.image,
        managementIp: obj.managementIp,
        managementGw: obj.managementGw,
        coresPerSlot: obj.coresPerSlot,
        deviceId: deviceId
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    var myRes = { subject: 'Success!', message: 'Created guest ' + obj.name };
    return myRes;
  },
});
