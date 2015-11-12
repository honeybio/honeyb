Meteor.methods({
  copyPool: function(pool_id, to_device_id, stage) {
    /**
    * Method that sets up a change to copy a pool from one device to another.
    *
    * @method copyPool
    * @param {pool_id} A pool configuration item
    * @param {to_device_id} The id of the device to coppy to
    * @param {stage} boolean 0/1 to stage or immediately push change
    * @return {string} Mongo ID of the change
    */
    var poolObj = Pools.findOne({_id: pool_id});
    var device = Devices.findOne({_id: poolObj.onDevice});
    var toDevice = Devices.findOne({_id: to_device_id});
    var poolConfig = Meteor.call("bigipRestGetv2", poolObj.onDevice, poolObj.selfLink);
    var poolMembers = Meteor.call("bigipRestGetv2", poolObj.onDevice, poolObj.membersReference.link);
    var postMembers = [];
    for (i = 0; i < poolMembers.items.length; i++) {
      postMembers[i] = {
        kind: "tm:ltm:pool:members",
        name: poolMembers.items[i].name,
        address: poolMembers.items[i].address,
        connectionLimit: poolMembers.items[i].connectionLimit,
        dynamicRatio: poolMembers.items[i].dynamicRatio,
        fqdn: {
          autopopulate: poolMembers.items[i].fqdn.autopopulate
        },
        inheritProfile: poolMembers.items[i].inheritProfile,
        logging: poolMembers.items[i].logging,
        monitor: poolMembers.items[i].monitor,
        priorityGroup: poolMembers.items[i].priorityGroup,
        rateLimit: poolMembers.items[i].rateLimit,
        ratio: poolMembers.items[i].ratio
      };
    }
    var newPool = {
      name: poolConfig.name,
      partition: poolConfig.partition,
      allowNat: poolConfig.allowNat,
      allowSnat: poolConfig.allowSnat,
      ignorePersistedWeight: poolConfig.ignorePersistedWeight,
      ipTosToClient: poolConfig.ipTosToClient,
      ipTosToServer: poolConfig.ipTosToServer,
      linkQosToClient: poolConfig.linkQosToClient,
      linkQosToServer: poolConfig.linkQosToServer,
      loadBalancingMode: poolConfig.loadBalancingMode,
      minActiveMembers: poolConfig.minActiveMembers,
      minUpMembers: poolConfig.minUpMembers,
      minUpMembersAction: poolConfig.minUpMembersAction,
      minUpMembersChecking: poolConfig.minUpMembersChecking,
      monitor: poolConfig.monitor,
      queueDepthLimit: poolConfig.queueDepthLimit,
      queueOnConnectionLimit: poolConfig.queueOnConnectionLimit,
      queueTimeLimit: poolConfig.queueTimeLimit,
      reselectTries: poolConfig.reselectTries,
      serviceDownAction: poolConfig.serviceDownAction,
      slowRampTime: poolConfig.slowRampTime,
      members: postMembers
    };
    var methodName = { action: "create", module: "ltm", object: "pool" };
    var theChange = {
      description: "Copy pool " + poolObj.fullPath + "on " +
       device.self.name + " to device: " + toDevice.self.name,
      theMethod: methodName,
      argList: {
        to_device_id,
        newPool
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    // console.log(result);
    return result;
  }
});
