Meteor.methods({
  discoverGTM: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var gtm_settings = BigipClient.list.gtm.global_settings.general(bigip);
    // var gtm_settings = mdrBigipRestGetv2(device_id, "https://localhost/mgmt/tm/gtm/global-settings/general");
    var exist_sync = Gtmsyncgroups.findOne({synchronizationGroupName: gtm_settings.synchronizationGroupName});
    var on_device_list = [ ];
    if (typeof exist_sync !== 'undefined') {
      // If sync group exists, its already been discovered by another GTM
      // Should update the existing sync group instead
      // Gtmservers.update({ onDevice: device_id }, { $set: {statusImg: imgName, stats: gtmserverStatObject} });
      var on_device_list = exist_sync.onDevice;
      for (i = 0; i < on_device_list.length; i++) {
        if (on_device_list[i] == device_id) {
          return false;
        }
      }
      on_device_list.push(device_id);
      Gtmsyncgroups.update({_id: exist_sync._id}, { $set: {onDevice: on_device_list}});
      return false;
    }
    gtm_settings['onDevice'] = [ device_id ];
    gtm_settings.group = 'default-group';
    var sync_id = Gtmsyncgroups.insert(gtm_settings);
    var dc_list = BigipClient.list.gtm.datacenter(bigip);
    //var dc_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/gtm/datacenter");
    for(var i = 0; i < dc_list.length; i++) {
      var dc = Meteor.call("splitAndInsert", dc_list[i], device_id);
      dc['inSyncGroup'] = sync_id;
      dc.group = 'default-group';
      Gtmdatacenters.insert(dc);
    }
    // array of wideips
    var wip_list = BigipClient.list.gtm.wideip.a(bigip);
    // var wip_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/gtm/wideip/a");
    // loop through wideips
    for (var i=0; i < wip_list.length; i++) {
      // get list of pools for each wideip
      var wip_pool_list = wip_list[i].pools;
      // loop through list of pools for each wideip
      if (wip_pool_list !== undefined) {
        for (var j=0; j < wip_pool_list.length; j++) {
          // URL for this specific pool
          // var wip_pool_details = mdrBigipRestGetv2(device_id, wip_pool_list[j].nameReference.link);
          var wip_pool_details = mdrBigipRestGetv2(device_id, wip_pool_list[j].nameReference.link);
          var pmems = mdrBigipRestGetItems(device_id, wip_pool_details.membersReference.link);
          wip_list[i].pools[j].members = pmems;
        }
      }
      wip_list[i].group = 'default-group';
      wip_list[i]['inSyncGroup'] = sync_id;
      Wideips.insert(wip_list[i]);
    }
    var pool_list = BigipClient.list.gtm.pool.a(bigip);
    // var pool_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/gtm/pool/a?expandSubcollections=true");
    for(var i = 0; i < pool_list.length; i++) {
      pool_list[i].group = 'default-group';
      pool_list[i]['inSyncGroup'] = sync_id;
      Widepools.insert(pool_list[i]);
    }
    var server_list = BigipClient.list.gtm.server(bigip);
    //var server_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/gtm/server");
    for(var i = 0; i < server_list.length; i++) {
      var server = Meteor.call("splitAndInsert", server_list[i], device_id);
      var gtm_server_id = Gtmservers.insert(server);
      var gtm_server_name = server.fullPath;
      var gvservers = mdrBigipRestGetItems(device_id, server.virtualServersReference.link);
      for(var j = 0; j < gvservers.length; j++) {
        var gvsobj = Meteor.call("GtmSplitAndInsert", gvservers[j], gtm_server_id, gtm_server_name );
        gvsobj.group = 'default-group';
        gvsobj['inSyncGroup'] = sync_id;
        Gtmvservers.insert(gvsobj);
      }
      var statsUrl = server.virtualServersReference.link.replace(/\?ver.*/, "/stats");
      Meteor.call("getGtmvserverStats", device_id, statsUrl);
    }
    Meteor.call("getDatacenterStats", device_id);
    Meteor.call("getGtmserverStats", device_id);
  },
  discoverPools: function (ip, user, pass, device_id) {
    this.unblock();
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var pool_list = BigipClient.list.ltm.pool(bigip);
    // var pool_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/ltm/pool?expandSubcollections=true");
    for ( var i = 0; i < pool_list.length; i++ ) {
      var pmem = pool_list[i].membersReference.items;
      var poolObject = { onDevice: device_id, members: pmem };
      for(var attrname in pool_list[i]) {
        poolObject[attrname] = pool_list[i][attrname];
        if (poolObject.members !== undefined) {
          for ( var j = 0; j < poolObject.members.length; j++) {
            poolObject.members[j].statusImg = Meteor.call("getStatusImage", poolObject.members[j].state, poolObject.members[j].session);
          }
        }
        // for (var j = 0; j < poolObject.members.length);
      };
      poolObject.group = 'default-group';
      Pools.insert(poolObject);
    }
  },
  discoverOnePool: function(device_id, poolLink) {
    var aPool = mdrBigipRestGetv2(device_id, poolLink);
    var pmem = mdrBigipRestGetItems(device_id, aPool.membersReference.link)
    var poolObject = { onDevice: device_id, members: pmem };
    for (var attrname in aPool) {
      poolObject[attrname] = aPool[attrname];
      for ( var j = 0; j < poolObject.members.length; j++) {
        poolObject.members[j].statusImg = Meteor.call("getStatusImage", poolObject.members[j].state, poolObject.members[j].session);
      }
    }
    poolObject.group = 'default-group';
    var poolID = Pools.insert(poolObject);
    return poolID;
  },
  discoverOneWPool: function(syncid, poolLink) {
    var syncgroup = Gtmsyncgroups.findOne({_id: syncid});
    var device_id = syncgroup.onDevice[0];
    var aPool = mdrBigipRestGetv2(device_id, poolLink + "&expandSubcollections=true");
    var poolObject = { group: 'default-group' };
    for (var attrname in aPool) {
      poolObject[attrname] = aPool[attrname];
    }
    poolObject['inSyncGroup'] = syncid;
    Widepools.insert(poolObject);
  },
  updateOneWPool: function(syncId, selfLink, poolId) {
    var syncgroup = Gtmsyncgroups.findOne({_id: syncId});
    var device_id = syncgroup.onDevice[0];
    var aPool = mdrBigipRestGetv2(device_id, selfLink + "&expandSubcollections=true");
    var poolObject = {};
    for (var attrname in aPool) {
      poolObject[attrname] = aPool[attrname];
      Widepools.update({_id: poolId}, {$set: { [attrname]: aPool[attrname]}});
    }
  },
  discoverOneWideip: function(syncid, wipLink) {
    var syncgroup = Gtmsyncgroups.findOne({_id: syncid});
    var device_id = syncgroup.onDevice[0];
    var aWip = mdrBigipRestGetv2(device_id, wipLink);
    var wipObject = { group: 'default-group' };
    for (var attrname in aWip) {
      wipObject[attrname] = aWip[attrname];
    }
    var wip_pool_list = aWip.pools;
    // loop through list of pools for each wideip
    if (wip_pool_list !== undefined) {
      for (var j=0; j < wip_pool_list.length; j++) {
        // URL for this specific pool
        var wip_pool_details = mdrBigipRestGetv2(device_id, wip_pool_list[j].nameReference.link);
        var pmems = mdrBigipRestGetItems(device_id, wip_pool_details.membersReference.link);
        wipObject.pools[j].members = pmems;
      }
    }
    wipObject['inSyncGroup'] = syncid;
    Wideips.insert(wipObject);
  },
  discoverOneMonitor: function(device_id, monLink) {
    var tmp = monLink;
    var newTmp = tmp.replace(/https:\/\/localhost\/mgmt\/tm\/ltm\/monitor\//, "");
    var final = newTmp.replace(/\/.*/, "");
    var aMon = mdrBigipRestGetv2(device_id, monLink);
    var monObject = { onDevice: device_id, type: final, group: 'default-group'};
    for (var attrname in aMon) {
      monObject[attrname] = aMon[attrname];
    }
    var monId = Monitors.insert(monObject);
    return monId;
  },
  discoverOneVirtual: function(device_id, vipLink, vipId) {
    var aVip = mdrBigipRestGetv2(device_id, vipLink);
    var profile_list = mdrBigipRestGetItems(device_id, aVip.profilesReference.link);
    for (var j = 0; j < profile_list.length; j++) {
      var prof = Profiles.findOne({fullPath: profile_list.fullPath, onDevice: device_id });
      if (typeof prof !== 'undefined') {
        profile_list.profile_id = prof._id;
      }
      else {
        profile_list.profile_id = "unsupported_profile";
      }
    }
    var vipObject = { onDevice: device_id, profileList: profile_list };
    for(var attrname in aVip) {
      vipObject[attrname] = aVip[attrname];
    };
    vipObject.group = 'default-group';
    if (vipId === undefined) {
      var vipId = Virtuals.insert(vipObject);
      return vipId;
    } else {
      for(var attrname in vipObject) {
        Virtuals.update({_id: vipId}, {$set: { attrname: vipObject[attrname] }});
      };
    }
  },
  discoverRules: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var rule_list = BigipClient.list.ltm.rule(bigip);
    //var rule_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/ltm/rule");
    for (var i = 0; i < rule_list.length; i++) {
      var ruleObj = { onDevice: device_id};
      for (var attrname in rule_list[i]) {
        ruleObj[attrname] = rule_list[i][attrname];
      };
      ruleObj.group = 'default-group';
      Rules.insert(ruleObj);
    }
  },
  discoverIdatagroups: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var group_list = BigipClient.list.ltm.data_group.internal(bigip);
    //var group_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/ltm/data-group/internal");
    for (var i = 0; i < group_list.length; i++) {
      var groupObj = { onDevice: device_id};
      for (var attrname in group_list[i]) {
        groupObj[attrname] = group_list[i][attrname];
      };
      groupObj.group = 'default-group';
      Idatagroups.insert(groupObj);
    }
  },
  discoverEdatagroups: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var group_list = BigipClient.list.ltm.data_group.external(bigip);
    //var group_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/ltm/data-group/external");
    for (var i = 0; i < group_list.length; i++) {
      var groupObj = { onDevice: device_id};
      for (var attrname in group_list[i]) {
        groupObj[attrname] = group_list[i][attrname];
      };
      groupObj.group = 'default-group';
      Edatagroups.insert(groupObj);
    }
  },
  discoverLtmMonitors: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var monitor_type_list = BigipClient.list.ltm.monitor(bigip);
    //var monitor_type_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/ltm/monitor");
    for (var i = 0; i < monitor_type_list.length; i++) {
      tmp = monitor_type_list[i].reference.link;
      newTmp = tmp.replace(/https:\/\/localhost\/mgmt\/tm\/ltm\/monitor\//, "");
      final = newTmp.replace(/\?.*/, "");
      tmpUrl = "/ltm/monitor/" + final;
      // monObj = { type: monType };

      thisMonitorList = mdrBigipRestGet(ip, user, pass, tmpUrl);
      for(var j = 0; j < thisMonitorList.length; j++) {
        var monObj = { onDevice: device_id, type: final };
        for (var attrname in thisMonitorList[j]) {
          monObj[attrname] = thisMonitorList[j][attrname];
        }
        monObj.group = 'default-group';
        Monitors.insert(monObj);;
      }
    };
  },
  discoverLtmProfiles: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var profile_type_list = BigipClient.list.ltm.profile(bigip);
    //var profile_type_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/ltm/profile");
    for (var i = 0; i < profile_type_list.length; i++) {
      var tmp = profile_type_list[i].reference.link;
      var newTmp = tmp.replace(/https:\/\/localhost\/mgmt\/tm\/ltm\/profile\//, "");
      var final = newTmp.replace(/\?.*/, "");
      var tmpUrl = "/ltm/profile/" + final;
      // monObj = { type: monType };
      thisProfileList = mdrBigipRestGet(ip, user, pass, tmpUrl);
      for(var j = 0; j < thisProfileList.length; j++) {
        var profileObj = { onDevice: device_id, profType: final };
        for (var attrname in thisProfileList[j]) {
          profileObj[attrname] = thisProfileList[j][attrname];
        }
        profileObj.group = 'default-group';
        Profiles.insert(profileObj);;
      }
    };
  },
  discoverVirtualAddress: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var virtualAddressList = BigipClient.list.ltm.virtual_address(bigip);
    // var virtualAddressList = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/ltm/virtual-address");
    if (virtualAddressList !== undefined) {
      for (var i = 0; i < virtualAddressList.length; i++) {
        var virtualAddressObj = { group: 'default-group', onDevice: device_id }
        for (var attrname in virtualAddressList[i]) {
          virtualAddressObj[attrname] = virtualAddressList[i][attrname];
        }
        Virtualaddresses.insert(virtualAddressObj);
      }
    }
  },
  discoverAsmPolicies: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var asmPolicyList = BigipClient.list.asm.policy(bigip);
    // var asmPolicyList = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/asm/policies");
    if (asmPolicyList !== undefined) {
      for (var i = 0; i < asmPolicyList.length; i++) {
        var policyObj = { group: 'default-group', onDevice: device_id }
        for (var attrname in asmPolicyList[i]) {
          policyObj[attrname] = asmPolicyList[i][attrname]
        }
        Asmpolicies.insert(policyObj);
      }
    }
  },
  discoverApmProfiles: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var profile_type_list = BigipClient.list.apm.profile(bigip);
    //var profile_type_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/apm/profile");
    if (profile_type_list.length !== undefined) {
      for (var i = 0; i < profile_type_list.length; i++) {
        var tmp = profile_type_list[i].reference.link;
        var newTmp = tmp.replace(/https:\/\/localhost\/mgmt\/tm\/apm\/profile\//, "");
        var final = newTmp.replace(/\?.*/, "");
        var tmpUrl = "/apm/profile/" + final;
        // monObj = { type: monType };
        thisProfileList = mdrBigipRestGet(ip, user, pass, tmpUrl);
        for(var j = 0; j < thisProfileList.length; j++) {
          var profileObj = { onDevice: device_id, profType: final };
          for (var attrname in thisProfileList[j]) {
            profileObj[attrname] = thisProfileList[j][attrname];
          }
          profileObj.group = 'default-group';
          Profiles.insert(profileObj);
        }
      }
    }
  },
  discoverPersistence: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var persistence_type_list = BigipClient.list.ltm.persistence(bigip);
    // var persistence_type_list = mdrBigipRestGetv2(device_id, "https://localhost/mgmt/tm/ltm/persistence");
    if (persistence_type_list.length !== undefined) {
      for (var i = 0; i < persistence_type_list.length; i++) {
        tmp = persistence_type_list[i].reference.link;
        newTmp = tmp.replace(/https:\/\/localhost\/mgmt\/tm\/ltm\/persistence\//, "");
        final = newTmp.replace(/\?.*/, "");
        tmpUrl = "/ltm/persistence/" + final;
        // monObj = { type: monType };
        thisPersistenceList = mdrBigipRestGet(ip, user, pass, tmpUrl);
        for(var j = 0; j < thisPersistenceList.length; j++) {
          var persistenceObj = { onDevice: device_id, type: final };
          for (var attrname in thisPersistenceList[j]) {
            persistenceObj[attrname] = thisPersistenceList[j][attrname];
          }
          persistenceObj.group = 'default-group';
          Persistence.insert(persistenceObj);;
        }
      }
    }
  },
  discoverCerts: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var cert_list = BigipClient.list.sys.crypto.cert(bigip);
    // var cert_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/sys/crypto/cert");
    if (cert_list.length !== undefined) {
      for (var i = 0; i < cert_list.length; i++) {
        var certObject = { onDevice: device_id, ssltype: "certificate" };
        for(var attrname in cert_list[i]) {
          certObject[attrname] = cert_list[i][attrname];
        };
        certObject.group = 'default-group';
        var myCert = Certificates.insert(certObject);
        // Meteor.call("getCertPem", device_id, myCert);
      }
    }
  },
  discoverKeys: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var key_list = BigipClient.list.sys.crypto.key(bigip);
    //var key_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/sys/crypto/key");
    if (key_list.length !== undefined) {
      for (var i = 0; i < key_list.length; i++) {
        var keyObject = { onDevice: device_id, ssltype: "key" };
        for(var attrname in key_list[i]) {
          keyObject[attrname] = key_list[i][attrname];
        };
        keyObject.group = 'default-group';
        var myKey = Certificates.insert(keyObject);
        // Meteor.call("getKeyPem", device_id, myKey);
      }
    }
  },
  discoverVirtuals: function (ip, user, pass, device_id) {
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var virtual_list = BigipClient.list.ltm.virtual(bigip);
    //var virtual_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/ltm/virtual");
    for (var i = 0; i < virtual_list.length; i++) {
      var profile_url = virtual_list[i].profilesReference.link.replace(/https:\/\/localhost\/mgmt\/tm/, "");
      // var statistics = getStats(ip, user, pass, virtual_list[i].selfLink)
      // console.log(statistics);
      var profile_list = mdrBigipRestGet(ip, user, pass, profile_url);
      for (var j = 0; j < profile_list.length; j++) {
        var prof = Profiles.findOne({fullPath: profile_list[j].fullPath, onDevice: device_id });
        if (typeof prof !== 'undefined') {
          profile_list[j].profile_id = prof._id;
        }
        else {
          profile_list[j].profile_id = "unsupported_profile";
        }
      }
      var vipObject = { onDevice: device_id, profileList: profile_list };
      for(var attrname in virtual_list[i]) {
        vipObject[attrname] = virtual_list[i][attrname];
      };
      vipObject.group = 'default-group';
      Virtuals.insert(vipObject);
    };
  },
  discoverModules: function (ip, user, pass) {
    var module_url = {   ltm:   "/mgmt/tm/ltm",
                          gtm:  "/mgmt/tm/gtm",
                          wam:  "/mgmt/tm/wam",
                          asm:  "/mgmt/tm/asm",
                          wom:  "/mgmt/tm/wom",
                          vcmp: "/mgmt/tm/vcmp",
                          apm:  "/mgmt/tm/apm",
                          pem:  "/mgmt/tm/pem",
                          avr:  "/mgmt/tm/analytics",
                          afm:  "/mgmt/tm/security/firewall"
                      };
  },
  discoverProvisioning: function (ip, user, pass) {
    var is_provisioned = {};
    var bigip = { iControl: 'rest', ip: ip, user: user, pass: pass };
    var provision_list = BigipClient.list.sys.provision(bigip);
    //var provision_list = mdrBigipRestGet(ip, user, pass, "/sys/provision");
    if (provision_list.length !== undefined) {
      for(var i = 0; i < provision_list.length; i++) {
        if (provision_list[i].level === undefined) {
          is_provisioned[provision_list[i].name] = 'none';
        } else {
          is_provisioned[provision_list[i].name] = provision_list[i].level;
        }
      }
      return is_provisioned;
    } else {
      throw new Meteor.Error(401, 'Error 401', 'Error discovering Provisioning');
    }
  },
  discoverNetwork: function (ip, user, pass) {
    var bigip = {
      iControl: 'rest',
      ip: ip,
      user: user,
      pass: pass,
    };
    var interfaceList = BigipClient.list.net.interface(bigip);
    var routeList = BigipClient.list.net.route(bigip);
    var selfList = BigipClient.list.net.self(bigip);
    var trunkList = BigipClient.list.net.trunk(bigip);
    var vlanList = BigipClient.list.net.vlan(bigip);
    var net = {
      interfaces: interfaceList,
      routes: routeList,
      selfs: selfList,
      trunks: trunkList,
      vlans: vlanList
    }
    return net;
  },
  discoverDevice: function (ip, user, pass) {
    var url = "https://" + ip + "/mgmt/tm/cm/device";
    var authString = user + ":" + pass;
    try {
      var result = HTTP.get(url, {auth: authString}).data;
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  getActiveTrafficGroup: function (device_id) {
    var device = Devices.findOne({_id: device_id});
    for (var i = 0; i < device.trafficGroups.length; i++) {
      if (device.trafficGroups[i].isFloating) {
        // check if self is active
        var link = device.trafficGroups[i].selfLink.replace(/\?.*/, '');

      }
    }
  },
  discoverTrafficGroups: function (device_id) {
    var device = Devices.findOne({_id: device_id});
    var trafficGroupList = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/cm/traffic-group");
    if (trafficGroupList !== undefined) {
      for (var i = 0; i < trafficGroupList.length; i++) {
        if (trafficGroupList[i].isFloating == 'true') {
          var link = trafficGroupList[i].selfLink.replace(/\?.*/, '/stats');
          var response = mdrBigipRestGetv2(device_id, link);
          if (response !== undefined) {
            if (response.entries.deviceName === undefined) {
              for (var entry in response.entries) {
                if (response.entries[entry].nestedStats.entries.deviceName.description === device.self.fullPath) {
                  if (response.entries[entry].nestedStats.entries.failoverState.description === 'active') {
                    trafficGroupList[i].isActive = true;
                  } else {
                    trafficGroupList[i].isActive = false;
                  }
                }
              }
              trafficGroupList[i].isActive = true;
            }
          }
        }
      }
      return trafficGroupList;
    } else {
      return [];
    }
  },
  discoverAllDevice: function (device, jobId) {
    // device_id, monObj, stage) {
    var theChange = {
      description: "Discover BIG-IP: " + device.mgmtip,
      theMethod: {
        action: "discover",
        module: "device",
        object: "all"
      },
      argList: {
        device: device,
        jobId: jobId
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);

    var result = Meteor.call('createJob', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  removeDevice: function (device) {
    var theChange = {
      description: "Remove BIG-IP: " + device.mgmtip,
      theMethod: {
        action: "discover",
        module: "device",
        object: "remove"
      },
      argList: {
        deviceId: device.deviceId,
        mgmtip: device.mgmtip
      }
    };
    var change_id = Meteor.call('createStagedChange', theChange);

    var result = Meteor.call('createJob', change_id);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  discoverSshHostname: function(device_id) {
    var device = Devices.findOne({_id: device_id});
    // var settings = Settings.findOne({type: 'system'});
    var shellCommand = "get_host_name.sh";
    var args = [device.mgmtAddress, device.sshUser];
    var output = Meteor.call("runShellCmd", shellCommand, args);
    return output.trim();
  },
});
