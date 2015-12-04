ChangeFunction = { };
ChangeFunction.create = { };
ChangeFunction.create.honeyb = { };
ChangeFunction.create.device = { };
ChangeFunction.create.ltm = { };
ChangeFunction.create.gtm = { };
ChangeFunction.create.asm = { };
ChangeFunction.create.apm = { };
ChangeFunction.create.aam = { };
ChangeFunction.create.vcmp = { };
ChangeFunction.read = { };
ChangeFunction.read.honeyb = { };
ChangeFunction.read.device = { };
ChangeFunction.read.ltm = { };
ChangeFunction.read.gtm = { };
ChangeFunction.read.asm = { };
ChangeFunction.read.apm = { };
ChangeFunction.read.aam = { };
ChangeFunction.read.vcmp = { };
ChangeFunction.update = { };
ChangeFunction.update.honeyb = { };
ChangeFunction.update.device = { };
ChangeFunction.update.ltm = { };
ChangeFunction.update.gtm = { };
ChangeFunction.update.asm = { };
ChangeFunction.update.apm = { };
ChangeFunction.update.aam = { };
ChangeFunction.update.vcmp = { };
ChangeFunction.delete = { };
ChangeFunction.delete.honeyb = { };
ChangeFunction.delete.device = { };
ChangeFunction.delete.ltm = { };
ChangeFunction.delete.gtm = { };
ChangeFunction.delete.asm = { };
ChangeFunction.delete.apm = { };
ChangeFunction.delete.aam = { };
ChangeFunction.delete.vcmp = { };
ChangeFunction.enable = { };
ChangeFunction.disable = { };
ChangeFunction.enable.ltm = { };
ChangeFunction.disable.ltm = { };
ChangeFunction.force = { };
ChangeFunction.force.ltm = { };
ChangeFunction.download = { };
ChangeFunction.download.device = { };
ChangeFunction.download.ltm = { };
ChangeFunction.download.asm = { };
ChangeFunction.download.apm = { };
ChangeFunction.download.aam = { };
ChangeFunction.upload = { };
ChangeFunction.upload.device = { };
ChangeFunction.upload.ltm = { };
ChangeFunction.upload.asm = { };
ChangeFunction.upload.apm = { };
ChangeFunction.upload.aam = { };
ChangeFunction.discover = { };
ChangeFunction.discover.device = { };

ChangeFunction.create.gtm.wideip = function(argList) {
  /**
  * Method that builds a GTM wideip
  *
  * @method ChangeFunction.create.gtm.wideip
  * @param {object} JSON object containing all monitor values
  * @return {boolean} returns true if success
  */
  wipType = argList.type;
  if (wipType === "a") {
    var post_data = {
      kind: "tm:gtm:wideip:a:astate",
      name: argList.name,
      pools: argList.poolList
    };
    var syncgroup = Gtmsyncgroups.findOne({_id: argList.syncId});
    var device_id = syncgroup.onDevice[0];
    var requrl = "https://localhost/mgmt/tm/gtm/wideip/a";
    var result = mdrBigipRestPost(device_id, requrl, post_data);
    var db_id = Meteor.call("discoverOneWideip", device_id, result.data.selfLink);
    return result;
  }
  else if (wipType === "aaaa") {

  }
}
ChangeFunction.create.gtm.pool = function(argList) {
  /**
  * Method that builds a GTM wideip
  *
  * @method ChangeFunction.create.gtm.pool
  * @param {object} JSON object containing all monitor values
  * @return {boolean} returns true if success
  */
  poolType = argList.type;
  if (poolType === "a") {
    var post_data = {
      kind: "tm:gtm:pool:a:astate",
      name: argList.name
    };
    var syncgroup = Gtmsyncgroups.findOne({_id: argList.syncId});
    var device_id = syncgroup.onDevice[0];
    var requrl = "https://localhost/mgmt/tm/gtm/pool/a";
    var result = mdrBigipRestPost(device_id, requrl, post_data);
    var db_id = Meteor.call("discoverOneWPool", argList.syncId, result.data.selfLink);
    return result;
  }
  else if (poolType === "aaaa") {

  }
}
ChangeFunction.create.gtm.server = function(argList) {
  /**
  * Method that builds a GTM server
  *
  * @method ChangeFunction.create.gtm.server
  * @param {object} JSON object containing all monitor values
  * @return {boolean} returns true if success
  */
}
ChangeFunction.create.gtm.monitor = function(argList) {
  /**
  * Method that builds a GTM monitor
  *
  * @method ChangeFunction.create.gtm.monitor
  * @param {object} JSON object containing all monitor values
  * @return {boolean} returns true if success
  */
}
ChangeFunction.create.gtm.vserver = function(argList) {
  /**
  * Method that builds a GTM virtual server
  *
  * @method ChangeFunction.create.gtm.vserver
  * @param {object} JSON object containing all monitor values
  * @return {boolean} returns true if success
  */
}
ChangeFunction.create.gtm.member = function(argList) {
  /**
  * Method that builds a GTM virtual server
  *
  * @method ChangeFunction.create.gtm.vserver
  * @param {object} JSON object containing all monitor values
  * @return {boolean} returns true if success
  */
  //{"name":"{F5-LTM-name}:/Common/{virtual-server-on-LTM"}
  var syncgroup = Gtmsyncgroups.findOne({_id: argList.syncId});
  var device_id = syncgroup.onDevice[0];
  var pool = Widepools.findOne({_id: argList.onPool});
  var requrl = pool.selfLink.replace(/\?.*/, "/members");
  var post_data = {
    kind: "tm:gtm:pool:a:members:membersstate",
    name: argList.name,
  };
  var result = mdrBigipRestPost(device_id, requrl, post_data);
  var db_id = Meteor.call("updateOneWPool", argList.syncId, pool.selfLink);
  return result;
}
ChangeFunction.create.asm.policy = function(argList) { }
ChangeFunction.create.apm.policy = function(argList) { }
ChangeFunction.create.aam.policy = function(argList) { }
ChangeFunction.read.device.archive = function(argList) { }
ChangeFunction.read.device.qkview = function(argList) { }
ChangeFunction.read.device.route = function(argList) { }
ChangeFunction.read.device.selfip = function(argList) { }
ChangeFunction.read.device.license = function(argList) { }
ChangeFunction.read.device.certificate = function(argList) { }
ChangeFunction.read.ltm.virtual = function(argList) { }
ChangeFunction.read.ltm.pool = function(argList) { }
ChangeFunction.read.ltm.monitor = function(argList) { }
ChangeFunction.read.ltm.node = function(argList) { }
ChangeFunction.read.ltm.profile = function(argList) { }
ChangeFunction.read.ltm.irule = function(argList) { }
ChangeFunction.read.ltm.idatagroup = function(argList) { }
ChangeFunction.read.gtm.wideip = function(argList) { }
ChangeFunction.read.gtm.server = function(argList) { }
ChangeFunction.read.gtm.monitor = function(argList) { }
ChangeFunction.read.gtm.pool = function(argList) { }
ChangeFunction.read.gtm.vserver = function(argList) { }
ChangeFunction.read.gtm.member = function(argList) { }
ChangeFunction.read.asm.policy = function(argList) { }
ChangeFunction.read.apm.policy = function(argList) { }
ChangeFunction.read.aam.policy = function(argList) { }
ChangeFunction.update.device.archive = function(argList) { }
ChangeFunction.update.device.qkview = function(argList) { }
ChangeFunction.update.device.route = function(argList) { }
ChangeFunction.update.device.selfip = function(argList) { }
ChangeFunction.update.device.license = function(argList) { }
ChangeFunction.update.device.certificate = function(argList) { }
ChangeFunction.update.ltm.virtual = function(argList) { }
ChangeFunction.update.ltm.monitor = function(argList) { }
ChangeFunction.update.ltm.node = function(argList) { }
ChangeFunction.update.ltm.monitor = function(argList) { }
ChangeFunction.update.ltm.profile = function(argList) { }
ChangeFunction.update.ltm.irule = function(argList) { }
ChangeFunction.update.ltm.idatagroup = function(argList) { }
ChangeFunction.update.gtm.wideip = function(argList) { }
ChangeFunction.update.gtm.server = function(argList) { }
ChangeFunction.update.gtm.monitor = function(argList) { }
ChangeFunction.update.gtm.pool = function(argList) { }
ChangeFunction.update.gtm.vserver = function(argList) { }
ChangeFunction.update.asm.policy = function(argList) { }
ChangeFunction.update.apm.policy = function(argList) { }
ChangeFunction.update.aam.policy = function(argList) { }
ChangeFunction.delete.device.archive = function(argList) { }
ChangeFunction.delete.device.qkview = function(argList) { }
ChangeFunction.delete.device.route = function(argList) { }
ChangeFunction.delete.device.selfip = function(argList) { }
ChangeFunction.delete.device.license = function(argList) { }
ChangeFunction.delete.device.certificate = function(argList) { }
ChangeFunction.delete.ltm.virtual = function(argList) {
  var device_id = argList.onDevice;
  var selfLink = argList.selfLink;
  var obj_id = argList.obj_id;
  var response = mdrBigipRestDelete(device_id, selfLink);
  if (response) {
    Virtuals.update({_id : obj_id}, {$set: {deleted: true}});
    return response;
  }
  return false;
}
ChangeFunction.delete.ltm.pool = function(argList) {
  var device_id = argList.device_id;
  var pool_url = argList.pool_url;
  var pool_id = argList.pool_id;
  var response = mdrBigipRestDelete(device_id, pool_url);
  if (response) {
    Pools.update({_id : pool_id}, {$set: {deleted: true}});
    return response;
  }
  return false;
}
ChangeFunction.delete.ltm.node = function(argList) { }
ChangeFunction.delete.ltm.monitor = function(argList) {
  var device_id = argList.device_id;
  var selfLink = argList.selfLink;
  var mon_id = argList.monitor_id;
  var response = mdrBigipRestDelete(device_id, selfLink );
  if (response) {
    Monitors.update({_id : argList.obj_id}, {$set: {deleted: true}});
    return response;
  }
  return false;
}
ChangeFunction.delete.ltm.pool_member = function(argList) {
  var poolMember = argList.poolMember;
  var device_id = argList.device_id;
  var pool_id = argList.pool_id;
  var response = mdrBigipRestDelete(device_id, poolMember);
  if (response) {
    Meteor.call("updatePoolMemberStatus", device_id, pool_id);
    return response;
  }
  return false;
}
ChangeFunction.delete.ltm.profile = function(argList) {
  var device_id = argList.device_id;
  var selfLink = argList.selfLink;
  var obj_id = argList.obj_id;
  var response = mdrBigipRestDelete(device_id, selfLink);
  if (response) {
    Profiles.update({_id : obj_id}, {$set: {deleted: true}});
    return true;
  }
  return false;
}
ChangeFunction.delete.ltm.irule = function(argList) {

}
ChangeFunction.delete.ltm.idatagroup = function(argList) {

}
ChangeFunction.delete.gtm.wideip = function(argList) {

}
ChangeFunction.delete.gtm.server = function(argList) {

}
ChangeFunction.delete.gtm.monitor = function(argList) { }
ChangeFunction.delete.gtm.pool = function(argList) { }
ChangeFunction.delete.gtm.vserver = function(argList) { }
ChangeFunction.delete.gtm.member = function(argList) {
  var syncgroup = Gtmsyncgroups.findOne({_id: argList.syncId});
  var device_id = syncgroup.onDevice[0];
  var selfLink = argList.selfLink;
  var response = mdrBigipRestDelete(device_id, selfLink);
  if (response) {
    //Rediscover pool
    // Profiles.update({_id : obj_id}, {$set: {deleted: true}});
    var db_id = Meteor.call("updateOneWPool", argList.syncId, argList.poolLink);
    return response;
  }
  return false;
}
ChangeFunction.delete.asm.policy = function(argList) { }
ChangeFunction.delete.apm.policy = function(argList) { }
ChangeFunction.delete.aam.policy = function(argList) { }
ChangeFunction.enable.ltm.virtual = function(argList) {
    var vipLink = argList.vipLink;
    var device_id = argList.onDevice;
    var put_data = { "enabled": true };
    var re = /\?ver=12/i;
    var v12 = vipLink.match(re);
    var response;
    if (v12) {
      var newLink = vipLink.replace(/\?ver.*/, "?ver=11.6.0");
      response = mdrBigipRestPut(device_id, newLink, put_data);
    } else {
      response = mdrBigipRestPut(device_id, vipLink, put_data);
    }
    Meteor.call("getOneVirtualStats", device_id, vipLink, argList.objId);
    return response;
}
ChangeFunction.enable.ltm.pool_member = function(argList) {
  var poolMember = argList.poolMember;
  var device_id = argList.device_id;
  var put_data = {"state": "user-up", "session": "user-enabled"};
  var response = mdrBigipRestPut(device_id, poolMember, put_data);
  return response;
}
ChangeFunction.disable.ltm.virtual = function(argList) {
  var vipLink = argList.vipLink;
  var device_id = argList.onDevice;
  var put_data = { "disabled": true };
  var re = /\?ver=12/i;
  var v12 = vipLink.match(re);
  var response;
  if (v12) {
    var newLink = vipLink.replace(/\?ver.*/, "?ver=11.6.0");
    response = mdrBigipRestPut(device_id, newLink, put_data);
  } else {
    response = mdrBigipRestPut(device_id, vipLink, put_data);
  }
  Meteor.call("getOneVirtualStats", device_id, vipLink, argList.objId);
  return response;
}
ChangeFunction.disable.ltm.pool_member = function(argList) {
  var poolMember = argList.poolMember;
  var device_id = argList.device_id;
  var put_data = {"session": "user-disabled"};
  var response = mdrBigipRestPut(device_id, poolMember, put_data);
  return response;
}
ChangeFunction.force.ltm.pool_member = function(argList) {
  var poolMember = argList.poolMember;
  var device_id = argList.device_id;
  var put_data = {"state": "user-down", "session": "user-disabled"};
  var response = mdrBigipRestPut(device_id, putUrl, put_data);
  return response;
}
ChangeFunction.create.ltm.pool = function(argList) {
  /**
  * Method that pushes out adding an LTM pool
  *
  * @method addLtmPoolCommand
  * @param {string} The id of the device this is going to add on
  * @param {string} The name of the Pool being added
  * @param {string} The load balancing method of the pool
  * @param {string} The fullPath of the monitor to add to the pool
  * @param {array} The members being added to the pool
  * @return {boolean} returns true if success
  */
  var device_id = argList.device_id;
  var post_data;
  var monData;
  if (argList.monitor !== undefined) {
    // monData = "\"" + argList.monitor + " \"";
    //monitor: monitor,
    post_data = {
      name: argList.name,
      loadBalancingMode: argList.loadBalancingMode,
      members: argList.members
    }
  }
  else {
    post_data = {
      name: argList.name,
      loadBalancingMode: argList.loadBalancingMode,
      members: argList.members
    }
  }
  var requrl = "https://localhost/mgmt/tm/ltm/pool";
  /* for (var i in post_data) {
    if (post_data[i] == null) {
      delete post_data[i];
    }
  }
  */
  var result = mdrBigipRestPost(device_id, requrl, post_data);
  Meteor.call("discoverOnePool", device_id, result.data.selfLink);
  return result;
}
ChangeFunction.create.ltm.virtual = function(argList) {
    /**
    * Method that builds an LTM virtual
    *
    * @method addLtmVirtualCommand
    * @param {string} The id of the device this is going to add on
    * @param {string} The name of the virtual being added
    * @param {string} The destination (listening IP/Port)
    * @param {string} The network mask of the VIP
    * @param {string} The snat options for the virtual
    * @return {boolean} returns true if success
    */
    var device_id = argList.device_id;
    var vip_name = argList.vip_name;
    var vip_dest = argList.vip_dest;
    var vip_mask = argList.vip_mask;
    var snat = argList.snat;

    var post_data = {
      name: vip_name,
      destination: vip_dest,
      mask: vip_mask
    };
    for (var i in post_data.argList) {
      if (post_data.argList[i] == null) {
        delete test[i];
      }
    }
    var requrl = "https://localhost/mgmt/tm/ltm/virtual";
    var result = mdrBigipRestPost(device_id, requrl, post_data);
    var db_id = Meteor.call("discoverOneVirtual", device_id, result.data.selfLink);
    return result;
}
ChangeFunction.create.ltm.pool_member = function(argList) {
  /**
  * Method that builds adding an LTM pool member
  *
  * @method addPoolMemberCommand
  * @param {string} The id of the device this is going to add on
  * @param {string} The id of the pool to add the member
  * @param {string} The ip address of the new member
  * @param {string} The port of the new member
  * @param {string} 1 if sbeing staged, 0 if pushed immediately
  * @return {boolean} returns true if success
  */
  var device_id = argList.device_id;
  var poolInfo = Pools.findOne({_id: argList.pool_id});
  var requrl = poolInfo.selfLink.replace(/\?ver.*/, "/members");
  var post_data = {
    name: argList.ipAddr + ":" + argList.port,
    address: argList.ipAddr
  };
  // This next method always returns a 404
  var result = mdrBigipRestPost(argList.device_id, requrl, post_data);
  var temp = Meteor.call("updatePoolMemberStatus", argList.device_id, argList.pool_id);
  return result;
}
ChangeFunction.create.ltm.node = function(argList) { }
ChangeFunction.create.ltm.profile = function(argList) { }
ChangeFunction.create.ltm.irule = function(argList) { }
ChangeFunction.create.ltm.idatagroup = function(argList) { }
ChangeFunction.create.ltm.monitor = function(argList) {
  /**
  * Method that builds an http monitor
  *
  * @method addTcpHalfOpenMonitorCommand
  * @param {object} JSON object containing all monitor values
  * @return {boolean} returns true if success
  */
  var device_id = argList.device_id;
  if (argList.type == "http") {
    var post_data = {
      defaultsFrom: "/Common/http",
      kind: "tm:ltm:monitor:http:httpstate",
      adaptive: "disabled",
      adaptiveDivergenceType: "relative",
      adaptiveDivergenceValue: 25,
      adaptiveLimit: 200,
      adaptiveSamplingTimespan: 300,
      ipDscp: 0,
      reverse: "disabled"
    };
    for (var attrname in argList) {
      post_data[attrname] = argList[attrname];
    }
    for (var i in post_data.argList) {
      if (post_data.argList[i] == null) {
        delete test[i];
      }
    }
    var requrl = "https://localhost/mgmt/tm/ltm/monitor/http";
    var result = mdrBigipRestPost(device_id, requrl, post_data);
    var db_id = Meteor.call("discoverOneMonitor", device_id, result.data.selfLink);
    return result;
  }
  else if (argList.type == "https") {
    var post_data = {
      defaultsFrom: "/Common/https",
      kind: "tm:ltm:monitor:https:httpsstate",
      adaptive: "disabled",
      adaptiveDivergenceType: "relative",
      adaptiveDivergenceValue: 25,
      adaptiveLimit: 200,
      adaptiveSamplingTimespan: 300,
      cipherlist: "DEFAULT:+SHA:+3DES:+kEDH",
      compatibility: "enabled",
      ipDscp: 0,
      reverse: "disabled"
    };
    for (var attrname in argList) {
      post_data[attrname] = argList[attrname];
    }
    for (var i in post_data.argList) {
      if (post_data.argList[i] == null) {
        delete test[i];
      }
    }
    var requrl = "https://localhost/mgmt/tm/ltm/monitor/https";
    var result = mdrBigipRestPost(device_id, requrl, post_data);
    var db_id = Meteor.call("discoverOneMonitor", device_id, result.data.selfLink);
    return result;
  } else if (argList.type == "tcp-half-open") {
    var post_data = {
      defaultsFrom: "/Common/tcp_half_open",
      kind: "tm:ltm:monitor:tcp-half-open:tcp-half-openstate",
    };
    for (var attrname in argList) {
      post_data[attrname] = argList[attrname];
    }
    for (var i in post_data.argList) {
      if (post_data.argList[i] == null) {
        delete test[i];
      }
    }
    var requrl = "https://localhost/mgmt/tm/ltm/monitor/tcp-half-open";
    var result = mdrBigipRestPost(device_id, requrl, post_data);
    var db_id = Meteor.call("discoverOneMonitor", device_id, result.data.selfLink);
    return result;
  }
}
ChangeFunction.create.device.archive = function(argList) { }
ChangeFunction.create.device.qkview = function(argList) { }
ChangeFunction.create.device.route = function(argList) { }
ChangeFunction.create.device.selfip = function(argList) { }
ChangeFunction.create.device.license = function(argList) { }
ChangeFunction.create.device.certificate = function(argList) { }
ChangeFunction.discover.device.all = function(argList) {
  var ip = argList.device.mgmtip;
  var discoverRest = argList.device.discoverRest;
  var user = argList.device.mgmtuser;
  var pass = argList.device.mgmtpass;
  var discoverSsh = argList.device.discoverSsh;
  var sshuser = argList.device.sshuser;
  var sshpass = argList.device.sshpass;
  // Check if mgmt IP is added, if so, don't add again
  //console.log(reactiveStatus);

  // reactiveStatus.set('status', 'Connected!' );
  // reactiveStatus.set('progress', 10 );
  var checkAdded = Devices.findOne({mgmtAddress: ip}, {_id: 1, self: 1});
  if (typeof checkAdded !== 'undefined') {
    Jobs.update({_id: argList.jobId}, {$set: {progress: 0, status: 'Device already added...'}});
    return false;
  }
  var device_id = Devices.insert({
    group: 'default-group',
    mgmtAddress: ip
  });
  try {
    Jobs.update({_id: argList.jobId}, {$set: {progress: 2, status: 'Connecting to device...'}});
    // upload ssh key
    settings = Settings.findOne({type: 'system'});
    if (discoverSsh) {
      if (settings.keyName === undefined) {
        Jobs.update({_id: argList.jobId}, {$set: {progress: 100, status: 'Failed: No SSH Key created... Please create one in your honeyb settings'}});
        Devices.remove({_id: device_id});
        throw new Meteor.Error(500, 'Error 500', 'No SSH Key Configured');
      } else {
        var theKey = settings.keyName.pub;
        var sshArgs = [ip, sshuser, sshpass, theKey];
        var sshShellCommand = "install_ssh_key.sh";
        try {
          var output = Meteor.call("runShellCmd", sshShellCommand, sshArgs);
          console.log(output);
          if (output == '0') {
            Jobs.update({_id: argList.jobId}, {$set: {progress: 5, status: 'Copied SSH Key...'}});
          } else if (output == 255) {
            Jobs.update({_id: argList.jobId}, {$set: {progress: 5, status: 'Host unreachable...'}});
            Devices.remove({_id: device_id});
            throw new Meteor.Error(255, 'Host unreachable', 'Please check IP & Network connection and try again');
          } else {
            Jobs.update({_id: argList.jobId}, {$set: {progress: 5, status: 'SSH Key failed to install...'}});
            Devices.remove({_id: device_id});
            throw new Meteor.Error(401, 'SSH Authorization failed', 'Please check SSH user & password, the key failed to install');
          }
        } catch (err) {
          throw new Meteor.Error(500, 'Error 401', 'SSH Issue', 'Please check SSH user & password & access, the key failed to install');
          Devices.remove({_id: device_id});
        }
      }
      Devices.update({_id: device_id},
        { $set: {
          sshEnabled: true,
          sshUser: sshuser,
          sshPass: sshpass
        }
      });
      if (discoverRest == false) {
        var myHost = Meteor.call("discoverSshHostname", device_id);
        var state = 'Rest Not Discovered';
        Devices.update({_id: device_id}, {
          $set: { self: {
              name: myHost,
              failoverState: state
            }
          }
        })
      }
    } else {
      Devices.update({_id: device_id},
        { $set: {
          sshEnabled: false,
          sshUser: null,
          sshPass: null
        }
      });
    }
    if (discoverRest) {
      Jobs.update({_id: argList.jobId}, {$set: {progress: 10, status: 'Checking Provisioning...'}});
      var provisioning = Meteor.call("discoverProvisioning", ip, user, pass);
      if (provisioning === undefined) {
        console.log('provisioning check failed, not adding');
        Devices.remove({_id: device_id});
        Jobs.update({_id: argList.jobId}, {$set: {progress: 100, status: 'Rest Discovery failed, check device...'}});
        throw new Meteor.Error(500, 'Error 500', 'REST discovery failure, please check BIG-IP Version and try again');
      }
      var device = Meteor.call("discoverDevice", ip, user, pass);
      if (device.items[0].managementIp == ip) {
         Devices.update({_id: device_id},
           { $set: {
             group: 'default-group',
             mgmtAddress: ip,
             restEnabled: true,
             mgmtUser: user,
             mgmtPass: pass,
             self: device.items[0],
             peer: device.items[1],
             provision_level: provisioning
           }
        });
      } else if (device.items[1] !== undefined) {
        if (device.items[1].managementIp == ip) {
          Devices.update({_id: device_id},
            { $set: {
              group: 'default-group',
              mgmtAddress: ip,
              restEnabled: true,
              mgmtUser: user,
              mgmtPass: pass,
              self: device.items[1],
              peer: device.items[0],
              provision_level: provisioning
            }
          });
        }
      } else {
        Jobs.update({_id: argList.jobId}, {$set: {progress: 100, status: 'Failed: Management IP required, not self IP'}});
        throw new Meteor.Error(500, 'Error 500', 'Use Management IP, not traffic IP');
        Devices.remove({_id: device_id});
      }
      Jobs.update({_id: argList.jobId}, {$set: {progress: 15, status: 'Basic info gathered...'}});
      Meteor.call("getDiskStats", device_id);
      var trafGroups = Meteor.call("discoverTrafficGroups", device_id);
      Devices.update({_id: device_id}, {$set: {trafficGroups: trafGroups}});
      Meteor.call("discoverKeys", ip, user, pass, device_id);
      Meteor.call("discoverCerts", ip, user, pass, device_id);

      // Get sync group if not exists in db
      if(provisioning.gtm !== "none") {
        Meteor.call("discoverGTM", ip, user, pass, device_id);
        Jobs.update({_id: argList.jobId}, {$set: {progress: 20, status: 'Getting GTM info...'}});
      }
      // Get LTM stuff
      if (provisioning.apm !== "none") {
        Meteor.call("discoverApmProfiles", ip, user, pass, device_id);
        Jobs.update({_id: argList.jobId}, {$set: {progress: 25, status: 'Getting APM info...'}});
      }
      if (provisioning.asm !== "none") {
        Meteor.call("discoverAsmPolicies", ip, user, pass, device_id);
        Jobs.update({_id: argList.jobId}, {$set: {progress: 30, status: 'Getting ASM info...'}});
      }
      Meteor.call("discoverLtmMonitors", ip, user, pass, device_id);
      Meteor.call("discoverLtmProfiles", ip, user, pass, device_id);
      Meteor.call("discoverPersistence", ip, user, pass, device_id);
      Meteor.call("discoverIdatagroups", ip, user, pass, device_id);
      Meteor.call("discoverEdatagroups", ip, user, pass, device_id);
      Meteor.call("discoverRules", ip, user, pass, device_id);
      Meteor.call("discoverPools", ip, user, pass, device_id);
      Jobs.update({_id: argList.jobId}, {$set: {progress: 50, status: 'Getting LTM info...'}});
      Meteor.call("discoverVirtuals", ip, user, pass, device_id);
      Meteor.call("discoverVirtualAddress", ip, user, pass, device_id);
      Jobs.update({_id: argList.jobId}, {$set: {progress: 65, status: 'Discovered LTM objects...'}});
      Meteor.call("getVirtualStats", ip, user, pass, device_id);
      Jobs.update({_id: argList.jobId}, {$set: {progress: 75, status: 'Getting LTM Stats...'}});
      Meteor.call("getPoolStats", ip, user, pass, device_id);
    } else {
      Devices.update({_id: device_id},
        { $set: {
          restEnabled: false,
          mgmtUser: null,
          mgmtPass: null
        }
      });
    }
    Jobs.update({_id: argList.jobId}, {$set: {progress: 100, status: 'Complete!'}});
    var response = 'Successfully Discovered';
    return response;
  }
  catch (err) {
    Devices.remove({_id: device_id});
    throw new Meteor.Error(err.error, err.reason, err.details);
  }
}

ChangeFunction.discover.device.remove = function (argList) {
  var deviceId = argList.deviceId;

  // Remove all objects from all database collections
  var tmp = Virtualaddresses.remove({onDevice: deviceId});
  var tmp = Devices.remove({onDevice: deviceId});
  var tmp = Certificates.remove({onDevice: deviceId});
  var tmp = Virtuals.remove({onDevice: deviceId});
  var tmp = Rules.remove({onDevice: deviceId});
  var tmp = Pools.remove({onDevice: deviceId});
  var tmp = Nodes.remove({onDevice: deviceId});
  var tmp = Monitors.remove({onDevice: deviceId});
  var tmp = Idatagroups.remove({onDevice: deviceId});
  var tmp = Edatagroups.remove({onDevice: deviceId});
  var tmp = Persistence.remove({onDevice: deviceId});
  var tmp = Asmpolicies.remove({onDevice: deviceId});
  var tmp = Profiles.remove({onDevice: deviceId});
  var tmp = Objectstatus.remove({onDevice: deviceId});
  var tmp = Statistics.remove({device: deviceId});
  var tmp = Devices.remove({_id: deviceId});

  // GTM is special
  // Check if its the last member of a sync group
  var syncgroups = Gtmsyncgroups.find({}, {fields: { onDevice: 1}});
  syncgroups.forEach(function (row) {
    var i = row.onDevice.length;
    while (i--) {
      if (row.onDevice[i] == deviceId) {
        row.onDevice.splice(i, 1);
      }
    }
    if (row.onDevice.length == 0) {
      //delete gtm sync group & objects
      Wideips.remove({inSyncGroup: row._id});
      Widepools.remove({inSyncGroup: row._id});
      Gtmdatacenters.remove({inSyncGroup: row._id});
      Gtmservers.remove({inSyncGroup: row._id});
      Gtmvservers.remove({inSyncGroup: row._id});
      Gtmlinks.remove({inSyncGroup: row._id});
      Gtmmonitors.remove({inSyncGroup: row._id});
      Gtmsyncgroups.remove({_id: row._id});
    }
  });
}

var checkAuth = function(change_id, cmethod, cb) {
  // check if part of Changeset
  // check if changeset is approved
  // allow push
  // else
  var myChange = Changes.findOne({_id: change_id});
  var theRole = Roles.getRolesForUser(Accounts.user(), myChange.group);
  var group = Permissions.findOne({onRole: theRole[0]});
  if (group === undefined) {
    cb(null, false);
    return;
  }
  if (group.permissionList === undefined) {
    cb(null, false);
    return;
  }
  for(var perm in group.permissionList) {
    if (group.permissionList[perm].permission == cmethod.action + "." + cmethod.module + "." + cmethod.object) {
      cb(null, true);
      return;
    }
  }
  // return Meteor.Error(401, "Unauthorized for this function");
  cb(null, false);
}

Meteor.methods({
  getUserInfo: function(change) {
    return { userId: Meteor.user()._id, username: Meteor.user().username }
  },
  createJob: function(change_id) {
    /**
    * Method that pushes a change from being staged to deployed.
    *
    * @method pushChange
    * @param {object} A Mongo ID of the change
    * @return {boolean} returns true on success
    */
    //
    // Add this to a change queue instead of pushing immediately
    //
    var userObj = Meteor.call("getUserInfo");
    var myChange = Changes.findOne({_id: change_id});
    var backoutChange = {}
    var changeMethod = myChange.change.theMethod;
    var argList = myChange.change.argList;
    // Apply method will take array of args
    var response;
    checkAuth(change_id, myChange.change.theMethod, function (err, res) {
      if (res) {
        response = ChangeFunction[changeMethod.action][changeMethod.module][changeMethod.object](argList);
        Changes.update({_id: change_id},
          {
            $set: {
              pushed: true,
              pushedBy: userObj,
              success: true,
              successOutput: response
            }
          });
      }
      else {
        Changes.update({_id: change_id}, {
          $set: {
            pushed: true,
            pushedBy: userObj,
            success: false,
            successOutput: 'Unauthorized'
          }
        });
        throw new Meteor.Error(401, 'Error 401', 'Unauthorized');
      }
    });
    return response;
  },
  pushChange: function(change_id) {
    /**
    * Method that pushes a change from being staged to deployed.
    *
    * @method pushChange
    * @param {object} A Mongo ID of the change
    * @return {boolean} returns true on success
    */
    var userObj = Meteor.call("getUserInfo");
    var myChange = Changes.findOne({_id: change_id});
    var backoutChange = {}
    var changeMethod = myChange.change.theMethod;
    var argList = myChange.change.argList;
    // Apply method will take array of args
    var result;
    checkAuth(change_id, myChange.change.theMethod, function (err, res) {
      if (res) {
        response = ChangeFunction[changeMethod.action][changeMethod.module][changeMethod.object](argList);
        Changes.update({_id: change_id}, {
          $set: {
            pushed: true,
            pushedBy: userObj,
            success: true,
            successOutput: response
          }
        });
      } else {
        console.log('error, updating change to failed');
        Changes.update({_id: change_id}, {
          $set: {
            pushed: true,
            pushedBy: userObj,
            success: false,
            successOutput: 'Unauthorized'
          }
        });
        throw new Meteor.Error(401, 'Error 401', 'Unauthorized');
      }
    });
    return result.statusCode;
  },
  // A "change"
  //  var theChange = { description: event.target.stageDescription.value, theMethod: "setStatusPoolMember",
  //  args: [ the_action, checkedList[i], onDevice ]};
  createStagedChange: function(change) {
    /**
    * Method that stages/adds a change in the database.
    *
    * @method createStagedChange
    * @param {object} A change object
    * @return {string} Mongo ID of the change
    */
    var userObj = Meteor.call("getUserInfo");
    var result = Changes.insert({
      created: new Date(),
      createdBy: userObj,
      group: 'default-group',
      approved: false,
      scheduled: false,
      pushed: false,
      canceled: false,
      change });
    return result;
  },
  createPushedChange: function(change) {
    /**
    * Method that creates a change and immediately pushes change to device.
    *
    * @method createPushedChange
    * @param {object} A change object
    * @return {string} Mongo ID of the change
    */
    var userObj = Meteor.call("getUserInfo");
    var newChange = Changes.insert({
      created: new Date(),
      group: 'default-group',
      approved: false,
      scheduled: false,
      pushed: false,
      canceled: false,
      change });
    var result = pushChange(newChange);
    return result;
  },
  cancelChange: function(change_id) {
    /**
    * Method that cancels a change from being able to be deployed.
    *
    * @method cancelChange
    * @param {object} A Mongo ID of the change
    * @return {boolean} returns true on success
    */
    var userObj = Meteor.call("getUserInfo");
    var result = Changes.update({_id: change_id}, { $set: {canceled: true, cancelDate: new Date(), cancelledBy: userObj, scheduled: false}});
    return result;
  },

  backoutChange: function(change_id) {
    /**
    * Method that creates a new changeid that runs the opposite of the orig change.
    *
    * @method backoutChange
    * @param {object} A Mongo ID of the change
    * @return {string} returns id of backout change
    */
    var userObj = Meteor.call("getUserInfo");
    var myChange = Changes.findOne({_id: change_id});
    // Apply method will take array of args
    var backoutMethod = Meteor.call(getBackout);
    var backoutID = Changes.insert({ group: 'default-group', description: "Backout of: " + myChange.description, theMethod: backoutMethod, args: myChange.args});
    Changes.update({_id: change_id}, { $set: {backoutDate: new Date(), backout_id: backoutID }});
    return backoutID;
  },
  approveChange: function(change_id) {
    /**
    * Method that sets the approve flag on a change.
    *
    * @method approveChange
    * @param {object} A Mongo ID of the change
    * @return {boolean} returns true if success
    */
    var userObj = Meteor.call("getUserInfo");
    var result = Changes.update({_id: change_id}, { $set: {approved: true, approvedBy: userObj, approveDate: new Date()}});
    return result;
  },
  scheduleChange: function(change_id, pushDate) {
    /**
    * Method that sets the scheduled flag on a change.
    *
    * @method scheduleChange
    * @param {object} A Mongo ID of the change
    * @param {date} The time to push the change
    * @return {boolean} returns true if success
    */
    Changes.update({_id: change_id}, { $set: {scheduled: true, scheduleDate: new Date()}});
  },
  unapproveChange: function(change_id) {
    /**
    * Method that unsets the approved flag on a change.
    *
    * @method unapproveChange
    * @param {object} A Mongo ID of the change
    * @return {boolean} returns true if success
    */
    Changes.update({_id: change_id}, { $set: {approved: false, unapproveDate: new Date()}});
  },
  uncancelChange: function(change_id) {
    /**
    * Method that unsets the cancelled flag on a change.
    *
    * @method uncancelChange
    * @param {object} A Mongo ID of the change
    * @return {boolean} returns true if success
    */
    Changes.update({_id: change_id}, { $set: {canceled: false, cancelDate: null}});
  },
  addToSet: function(change_id, changeset_id) {
    /**
    * Method that adds a change to a changeset changeList array
    *
    * @method addToSet
    * @param {string} The id of a change
    * @param {string} The id of the changeset
    * @return {boolean} returns true if success
    */
    var response = Changeset.update({_id: changeset_id}, { $push: { changeList: change_id}});
    return response;
  },
  createChangeset: function(name, list_of_changes) {
    /**
    * Method that creates a new changeset to add changes to
    *
    * @method createChangeset
    * @param {string} The name for the new changeset
    * @param {list} A list of changeIds for the changeset
    * @return {string} returns id of new changeset
    */
    if (name == undefined) {
      name = "New Changeset created on " + new Date();
    }
    if (list_of_changes == undefined) {
      list_of_changes = [];
    }
    var changeset_id = Changeset.insert({ group: 'default-group', name: name, changeList: list_of_changes, created: new Date()});
    return changeset_id;
  },
  pushChangeset: function(changesetID) {
    /**
    * Method that takes a changeset, and pushes each change from being staged to deployed.
    *
    * @method pushChangeset
    * @param {object} The Changeset to be pushed
    * @return {boolean} returns true on success
    */
    var theSet = Changeset.findOne({_id: changesetID});
    for (i = 0; i < theSet.changeList; i++) {
      Meteor.call("pushChange", theSet.changeList[i]);
    }
    return true;
  },
  updateChangesetName: function(changeset_id, theName) {
    /**
    * Method that updates a changeset name
    *
    * @method updateChangesetName
    * @param {string} The Changeset id
    * @param {string} The new Changeset name
    * @return {boolean} returns true on success
    */
    Changeset.update({_id: changeset_id}, {$set: {name: theName}});
  },
  updateChangesetDescription: function(changeset_id, theDescription) {
    /**
    * Method that updates a changeset name
    *
    * @method updateChangesetName
    * @param {string} The Changeset id
    * @param {string} The new Changeset description
    * @return {boolean} returns true on success
    */
    Changeset.update({_id: changeset_id}, {$set: {description: theDescription}});
  }
});
