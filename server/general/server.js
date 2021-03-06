rebuildUserRoles = function () {
  // Clear roles in case they change between logins
  var myUser = Meteor.user();
  var myGroups = Roles.getGroupsForUser(myUser._id);
  for (var group in myGroups) {
    var roles = Roles.getRolesForUser(myUser._id, myGroups[group]);
    Roles.removeUsersFromRoles(myUser._id, roles, myGroups[group]);
  }
  // Roles.removeUsersFromRoles(myUser._id, 'default-group', 'default-group');
  // console.log(Meteor.user());
  //return;
  var adSettings = Settings.findOne({type: 'authentication'});
  //console.log(Meteor.user());
  if (myUser.memberOf !== undefined) {
    for (var i = 0; i < myUser.memberOf.length; i++) {
      if (myUser.memberOf[i] == adSettings.adAuthentication.defaultAdminGroup) {
        Roles.addUsersToRoles(myUser._id, ['admin'], 'default-group');
      } else if (myUser.memberOf[i] == adSettings.adAuthentication.defaultOperatorGroup) {
        Roles.addUsersToRoles(myUser._id, ['operator'], 'default-group');
      } else if (myUser.memberOf[i] == adSettings.adAuthentication.defaultGuestGroup) {
        Roles.addUsersToRoles(myUser._id, ['guest'], 'default-group');
      }
    }
  }
}

var checkIP4 = function (ip) {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
  return true;
} else {
  return false;
  }
}

Meteor.methods({
  testGtm: function (deviceId) {
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
      }
    });
    return { message: 'GTM Tested!', subject: 'Success' };
  },
  testRest: function () {

    var myCert = "-----BEGIN CERTIFICATE-----\nMIIDDjCCAfagAwIBAgIEC0/oLTANBgkqhkiG9w0BAQsFADBJMQswCQYDVQQGEwJV\nUzELMAkGA1UECBMCTlYxEjAQBgNVBAcTCUxhcyBWZWdhczEZMBcGA1UEAxMQdGVz\ndDMxLmhvbmV5Yi5pbzAeFw0xNjAxMDYyMjIyMzdaFw0xNjAyMDYyMjIyMzdaMEkx\nCzAJBgNVBAYTAlVTMQswCQYDVQQIEwJOVjESMBAGA1UEBxMJTGFzIFZlZ2FzMRkw\nFwYDVQQDExB0ZXN0MzEuaG9uZXliLmlvMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A\nMIIBCgKCAQEAqV9IzTNrKma3T0RL07W/NVNcMIQFqYj8cl6G3nr/fETMs4jqmBvj\nVNXkcMhwkPw8uz1E+KJBejqLEO7jokJeYaHRTErWzcMatKbPKbicOMTITuPVYtYY\nDd+O9O9agEFKHapM+41r8h8O1woYjistb1coenS5mMd77TRNAn5dvtRPi6YGLoRH\nyZihVmmG6X5oqaOmz/a5iRZeU1LRQI+6gixqrXcPbgmhKJg8pKQngudep/UVlY41\nZ2yApCzX8RESk4XcVwGauUKjl8l/b272P1eJMqQA0C7dWSh51Yrq3ShVxYyIiDFx\nuR0bFpp7NERHeWgoZkPEhWnpljIrs4zl/wIDAQABMA0GCSqGSIb3DQEBCwUAA4IB\nAQBjNZ3fUTr6npW6oSicKQamM3VvuypuhmkFwgwXI10JsvcCDbcPQL+eIh4s71TR\nGBfOlDxfZaOmGNMrXWEik3Cn86Ya2HTbDEKixH5ts1o+NqQBl2yFWkJAn9fVltdt\nh2EibF65Z4wuKatQrMMmKouMqVzD0IXMa7bMW+oGNs/2I5c+psztj2Wpu736ZWif\nM7ugil7GmEKYnnyjPGeHOfjgftlVjLGI9JEQRWyNA9WDzuKyir7Vu3y4Wk17nJqU\nHE1IJ/8nUGEP52LNcs2wzMiW+pUWDIhx+y+47MHdQ4b7QJROFnQBsgLqAn5Sqy6C\n9xyOm1f0EjDkPY3F7WtPpjLN\n-----END CERTIFICATE-----\n\n";
    certificateParser(myCert);
    //var device = Devices.findOne({_id: deviceId});
    //var bigip = {
    //  iControl: 'rest',
    //  ip: device.mgmtAddress,
    //  user: device.mgmtUser,
    //  pass: device.mgmtPass,
    //};
    //var obj = { name: '/Common/ca-bundle' };
    //var myVar = BigipClient.download.certificate(bigip, obj);
    //console.log(myVar);
    //var myVar = BigipClient.list.net.interface(bigip);
    //console.log(myVar);
    //BigipClient.list.net.interface
    //var cpuStats = mdrBigipRestGetv2(deviceId, "https://localhost/mgmt/tm/sys/cpu/stats");
    // var rule_list = deprecatedRestClient.bigipRestGetItems(deviceId, "https://localhost/mgmt/tm/ltm/rule");
    // var all = BigipClient.list.gtm.pool.a(bigip);
    //console.log(cpuStats);
    //var response = BigipClient.list.ltm.virtual(bigip, '/Common/vs_tomfoalery_422');
    //console.log(response);

    return { message: 'Did the thing!', subject: 'Success' };
  },
  getReadGroups: function (object) {
    //return array of groups with read access
    var readGroups = [];
    var myGroups = Roles.getGroupsForUser(Meteor.user());
    for (var theGroup in myGroups) {
      var roles = Roles.getRolesForUser(Meteor.user(), myGroups[theGroup]);
      for (role in roles) {
        var permList = Permissions.findOne({onRole: roles[role]})
        if (permList !== undefined) {
          for (permission in permList.permissionList) {
            // console.log(object + " equals " + permList.permissionList[permission].permission);
            if (object === permList.permissionList[permission].permission) {
              readGroups.push(myGroups[theGroup]);
            }
          }
        }
      }
    }
    return readGroups;
  },
  pinUcs: function (archiveId) {
    var argList = {
      archiveId: archiveId,
      action: 'pin'
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Pin Archive",
      theMethod: {
        action: "update",
        module: "device",
        object: "archive"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    var result = Meteor.call('pushChange', change_id);

    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  unpinUcs: function (archiveId) {
    var argList = {
      archiveId: archiveId,
      action: 'unpin'
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Unpin Archive",
      theMethod: {
        action: "update",
        module: "device",
        object: "archive"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    var result = Meteor.call('pushChange', change_id);

    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deleteUcs: function (archiveId) {
    var argList = {
      archiveId: archiveId,
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Delete Archive",
      theMethod: {
        action: "delete",
        module: "device",
        object: "archive"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    var result = Meteor.call('pushChange', change_id);

    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  deleteImage: function () {
    var isos = Images.find().fetch();
    console.log(isos);
  },
  updateRoles: function () {
    rebuildUserRoles();
  },
  getAuthType: function () {
    auth = Settings.findOne({type: 'authentication'});
    if (auth.ldap) {
      return 'ad';
    } else {
      return 'local';
    }
  },
  setLocalAuth: function () {
    if (Roles.userIsInRole(Accounts.user(), ['admin'], 'default-group')) {
      Settings.update(
        {type: 'authentication'},
        {$set: {
          ldap: false,
        }
      });
  } else {
    throw new Meteor.Error(401, 'Error 401', 'Unauthorized');
  }
  },
  setAdAuth: function (authObject) {
    // check if admin
    if (Roles.userIsInRole(Accounts.user(), ['admin'], 'default-group')) {
      Settings.update(
        {type: 'authentication'},
        {$set: {
          ldap: true,
          adAuthentication: authObject
        }
      });
      Meteor.settings.ldap = { };
      Meteor.settings.ldap.debug = true;
      Meteor.settings.ldap.domain = authObject.ldapDomain;
      Meteor.settings.ldap.domain = authObject.ldapDomain;
      Meteor.settings.ldap.baseDn = authObject.ldapBaseDn;
      Meteor.settings.ldap.url = authObject.ldapUrl;
      Meteor.settings.ldap.bindCn = authObject.ldapBindCn;
      Meteor.settings.ldap.bindPassword = authObject.ldapBindPassword;
      Meteor.settings.ldap.autopublishFields = [ 'displayName' ];
      if (Meteor.settings.ldap.groupMembership === undefined) {
        Meteor.settings.ldap.groupMembership = [
          authObject.defaultAdminGroup,
          authObject.defaultOperatorGroup,
          authObject.defaultGuestGroup
        ];
      } else {
        Meteor.settings.ldap.groupMembership = [
          authObject.defaultAdminGroup,
          authObject.defaultOperatorGroup,
          authObject.defaultGuestGroup
        ];
      }
    } else {
      throw new Meteor.Error(401, 'Error 401', 'Unauthorized');
    }
  },
  wizardUpdate: function (settings) {
    if (Roles.userIsInRole(Accounts.user(), ['admin'], 'default-group')) {
      if (settings.authenticationType == 'activedirectory') {
        var authObj = {
          ldapDomain: settings.ldapDomain,
          ldapBaseDn: settings.ldapBaseDn,
          ldapUrl: settings.ldapUrl,
          ldapBindCn: settings.ldapBindCn,
          ldapBindPassword: settings.ldapBindPassword,
          defaultAdminGroup: settings.defaultAdminGroup,
          defaultOperatorGroup: settings.defaultOperatorGroup,
          defaultGuestGroup: settings.defaultGuestGroup
        };
        Meteor.call('setAdAuth', authObj);
      }
      if (settings.ihealthUser === undefined || settings.ihealthPass === undefined) {
        console.log(settings);
      } else {
        Meteor.call('updateSystemSettings', 'blankHostname', settings.ihealthUser, settings.ihealthPass, settings.ihealthFreq);
      }
      Meteor.call('updateSchedule',settings.archiveFreq, settings.ihealthFreq);
    } else {
      throw new Meteor.Error(401, 'Error 401', 'Unauthorized');
    }
  },
  exportAsmPolicy: function (policy_id) {
    this.unblock();
    var policy = Asmpolicies.findOne({_id: policy_id});
    var policyLink = "https://localhost/mgmt/tm/asm/policies/" + policy.id;
    var policyExportLink = "https://localhost/mgmt/tm/asm/tasks/export-policy";
    // generate inline download of policy
    var post_data = { inline: true, policyReference: { link: policyLink } };
    var output = mdrBigipRestPost(policy.onDevice, policyExportLink, post_data );
    Meteor.setTimeout(function() {
      Meteor.call("getAsmPolicy", policy_id, policy.onDevice, output.data.selfLink);
    }, 30000);
  },
  getAsmPolicy: function (policy_id, onDevice, link) {
    var output = mdrBigipRestGetv2(onDevice, link);
    this.unblock();
    if (output.status == 'COMPLETED') {
      // insert policy export into fs
      var device = Devices.findOne({_id: onDevice});
      var policy = Asmpolicies.findOne({_id: policy_id});
      var fileObj = new FS.File();
      fileObj.metadata = {
        onDevice: onDevice,
        onDeviceName: device.self.name,
        policyName: policy.versionPolicyName,
        policyId: policy_id
      };

      var buffer = Buffer(output.result.file.length);

      for (var i = 0; i < output.result.file.length; i++) {
        buffer[i] = output.result.file.charCodeAt(i);
      }
      var rightNow = new Date();
      var res = rightNow.toISOString().slice(0,10).replace(/-/g,"");
      myFileName = res + '.' + policy.versionPolicyName.replace(/\//g, '') + '.' + device.self.name + '.xml';
      fileObj.name(myFileName);
      fileObj.attachData(buffer, {type: 'application/xml'});
      Asmpolicyfile.insert(fileObj);
      var myRes = { subject: 'Success!', message: 'Saved Policy to honeyb: ' + device.self.name };
      return myRes;
    }
    else {
      Meteor.setTimeout(function() {
        Meteor.call("getAsmPolicy", policy_id, onDevice, link);
      }, 60000);
    }
  },
  myLog: function(toLog) {
    console.log(toLog);
  },
  createUCS: function (ip, user, pass) {
    this.unblock();
    var url = "https://" + ip + "/mgmt/tm/task/sys/ucs";
    var authString = user + ":" + pass;
    var post_data = '{ "command": "save", "name": "newucs" }';
    try {
      var result = HTTP.post(url, {params: post_data}).data;
      console.log(result);
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  getStatusImage: function (availabilityState, enabledState) {
    var avail = "status_square_blue.png";
      if (availabilityState == "available" || availabilityState == "up") {
        if (enabledState == "enabled" || enabledState == "monitor-enabled") {
          avail = "status_circle_green.png";
        }
        else {
          avail = "status_circle_black.png";
        }
      }
      else if (availabilityState == "offline" || availabilityState == "down" || availabilityState == "user-down") {
        if (enabledState == "enabled" || enabledState == "monitor-enabled") {
          avail = "status_diamond_red.png";
        }
        else {
          avail = "status_diamond_black.png";
        }
      }
      else {
        if (enabledState == "enabled" || enabledState == "user-enabled") {
          avail = "status_square_blue.png";
        }
        else {
          avail = "status_square_black.png";
        }
      }
      return avail;
  },
  getMarkers: function (deviceId) {
    var allConnections = Meteor.call("getCurConns", deviceId);
    var markers = {
      device: allConnections.onDevice,
      conns: allConnections.totalConns,
      data: []
    };
    for (var i = 0; i < allConnections.connections.length; i++) {
      if (allConnections.connections[i].geo !== null) {
        mark = {
          latLng: [
            allConnections.connections[i].geo.location.latitude,
            allConnections.connections[i].geo.location.longitude
          ],
          name: allConnections.connections[i].geo.city.name + ', ' + allConnections.connections[i].geo.country.code
        }
        markers.data.push(mark);
      }
    }
    return markers;
  },
  getCurConns: function (deviceId) {
    var output = mdrBigipRestGetv2(deviceId, 'https://localhost/mgmt/tm/sys/connection/stats');
    var lines = output.apiRawValues.apiAnonymous.split("\n");
    var total = lines[lines.length - 2].split(' ');
    var totalConnections = {
      onDevice: deviceId,
      totalConns: total[3],
      connections: []
    };
    for (var i = 1; i < lines.length - 2; i++) {
      var entry = lines[i].split(/ +/);
      var stat = {
        csClientIP: entry[0].split(":")['0'],
        csClientPort: entry[0].split(":")['1'],
        csServerIP: entry[1].split(":")['0'],
        csClientPort: entry[1].split(":")['1'],
        ssClientIP: entry[2].split(":")['0'],
        ssClientPort: entry[2].split(":")['1'],
        ssServerIP: entry[3].split(":")['0'],
        ssClientPort: entry[3].split(":")['1'],
        proto: entry[4],
        connEntry: entry[5],
        tmm: entry[6]
      }
      if (checkIP4(stat.csClientIP)) {
        stat.geo = IPGeocoder.geocode(stat.csClientIP);
        totalConnections.connections.push(stat);
      } else {
        // probably ip6 address, ignore for now
      }
    }
    return totalConnections;
  },
  updateLtmStats: function () {
    device_list = Devices.find();
  },
  GtmSplitAndInsert: function (obj, on_id, on_name) {
    var result = { serverId: on_id, serverName: on_name, serverFullPath: on_name + ":" + obj.fullPath};
      for(var attrname in obj) {
        result[attrname] = obj[attrname];
      };
    return result;
  },
  splitAndInsert: function (obj, deviceid) {
    var result = { onDevice: deviceid };
      for(var attrname in obj) {
        result[attrname] = obj[attrname];
      };
    return result;
  },
  checkQkviewPS: function(onDevice) {
    // {\"command\":\"run\",\"utilCmdArgs\":\"-c \\\"ps ax\\| grep qk\\\"\"}
    var lurl = 'https://localhost/mgmt/tm/util/bash';
    var postData = {"command":"run", "utilCmdArgs":"-c \"ps ax | grep qk\""};
    var result = mdrBigipRestPost(onDevice, lurl, postData);
    var re = /qkview/;
    var qkRun = result.data.commandResult.search(re);
    if (qkRun > 0) {
      return true;
    }
    else {
      return false;
    }
  },
  updateIntervalSettings: function (dcInt, serInt, vserInt, virtInt, poolInt, memInt) {
    //
    var update = Settings.update({type: "system"}, { $set: { interval: {
      updateGtmDc: dcInt * 1000, updateGtmServer: serInt * 1000, updateGtmVserver: vserInt * 1000,
      updateLtmVirtual: virtInt * 1000, updateLtmPool: poolInt * 1000, updateLtmPoolMember: memInt * 1000 },
    }});
    return update;
  },
  updateSystemSettings: function(hname, ihealthUser, ihealthPass, ihealthFreq, qkviewFreq, certAdmin) {
    var update = Settings.update({type: "system"}, { $set: { ihealthUser: ihealthUser,
      ihealthPass: ihealthPass, ihealthFreq: ihealthFreq, certificateEmail: certAdmin,
      qkviewSchedule: qkviewFreq }});
    Settings.update({name: 'navigation'}, {$set: {showIhealth: true}});
    return update;
  },
  updateSchedule: function (archiveFreq) {
    Settings.update({type: "system"}, { $set: { archiveSchedule: archiveFreq }});
  },
  updateChangeSettings: function (enable) {
    Settings.update({type: 'system'}, { $set: { changeControl: enable }});
    Settings.update({type: 'navigation'}, { $set: { showChange: enable }});
  },
  schedArch: function() {
    console.log("scheduler running");
    return "success!";
  },
  archiveAllTask: function() {
    this.unblock();
    bigip_devices = Devices.find({sshEnabled: true});
    bigip_devices.forEach(function (eachDevice) {
      Meteor.call("createUCSCommand", eachDevice._id);
    });
    response = {
      subject: 'Archives Complete!',
      message: 'successfully archived devices!'
    }
    return response;
  },
  getNextArchiveDate: function (jobName) {
    var d = SyncedCron.nextScheduledAtDate(jobName);
    return d;
  },
  taskScheduler: function(device_id, jobName, command, jobSchedule, desc) {
    command = 'schedArch';
    var cront = SyncedCron.add({
      name: jobName,
      schedule: function(parser) {
        // parser is a later.parse object
        // return parser.recur().on(jobSchedule.min).minute().on(jobSchedule.hr).hour().on(jobSchedule.day).dayOfWeek();
        return parser.recur().on(parseInt(jobSchedule.min)).minute().on(parseInt(jobSchedule.hr)).hour().on(parseInt(jobSchedule.day)).dayOfWeek();
      },
      job: function() {
        var output = Meteor.call(command);
        return output;
      }
    });
    Jobs.insert({name: jobName, description: desc, onDevice: device_id, schedule: jobSchedule, command});
  },
  // Meteor.call("taskOnce", device_id, jobName, "schedArch", timeObj, description);
  setDate: function(timeObj) {
    var now = new Date;
    var sched_date;
    if (timeObj.text == 1) {
      if (timeObj.unit == 'minute') {
        sched_date = new Date(now.getTime() + timeObj.number*60000);
      }
      else if (timeObj.unit == 'hour') {
        sched_date = new Date(now.getTime() + timeObj.number*3600000);
      }
      else if (timeObj.unit == 'day') {
        sched_date = new Date(now.getDate() + timeObj.number);
      }
      else if (timeObj.unit == 'week') {
        sched_date = new Date(now.getDate() + timeObj.number*7);
      }
    }
    return sched_date;
  },
  getDateString: function() {
    var d = new Date();
    var dateString = moment(d).format("YYYYMMDD");
    return dateString;
  },
  grabQkview: function(onDevice, qkviewFileName) {
    var device = Devices.findOne({_id: onDevice});
    var pythonCmd = 'getFile.py';
    var qkFile = "/var/tmp/" + qkviewFileName;
    var locFile = "/tmp/" + qkviewFileName;
    var args = [ device.mgmtAddress, device.mgmtUser, device.mgmtPass, qkFile ];
    var result = Meteor.call("runPythonCmd", pythonCmd, args);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  createAndScheduleQkview: function(device_id, timeObject) {
    var changeID = Meteor.call("createQkview", device_id)
    var jobId = Meteor.call("taskOnce", changeID, timeObject);
    return true;
  },
  createQkview: function(device_id) {
    var device = Devices.findOne({_id: device_id});
    var methodName = 'createQkviewCommand';
    var theChange = { description: "Create QkView for Device: " + device.self.name,
      theMethod: methodName, args: [ device_id ]};
    var change_id = Meteor.call('createStagedChange', theChange);
    var changeset_id = Meteor.call('createChangeset', theChange.description, [change_id]);
    // var result = Meteor.call('pushChange', change_id);
    // callback(changeset_id);
    return changeset_id;
  },
  createUCSCommand: function(device_id) {
    this.unblock();
    var device = Devices.findOne({_id: device_id});
    var settings = Settings.findOne({type: 'system'});
    var shellCommand = "create_and_get_ucs.sh";
    var args = [device.mgmtAddress, device.sshUser];
    var output = Meteor.call("runShellCmd", shellCommand, args);
    var fileObj = new FS.File(output);
    fileObj.owner = Meteor.userId();
    fileObj.metadata = { onDevice: device_id, onDeviceName: device.self.name };
    Archives.insert(fileObj);
    var myRes = { subject: 'Success!', message: 'Created archive: ' + device.self.name };
    // remove output file
    var fs = Npm.require('fs');
    fs.unlinkSync(output);
    return myRes;
  },
  isHoneybAdmin: function() {
    if (Roles.userIsInRole(Meteor.user(), 'admin', 'default-group')) {
      return true;
    } else {
      return false;
    }
  },
  generateSshKey: function(keyName) {
    if (Meteor.call('isHoneybAdmin')) {
      var shellCommand = "generate_ssh_key.sh";
      var args = [keyName];
      var output = Meteor.call("runShellCmd", shellCommand, args);
      //
      //var priv = Meteor.call("runShellCmd", newCmd, newArgs);
      Settings.update({
        type: 'system'
      },
      {
        $set: {
          keyName: {
            name: keyName,
            pub: output
          }
        }
      });
      // return output;
    }
  },
  createQkviewCommand: function(device_id, f5case) {
    var settings = Settings.findOne({type: 'system'});
    if (settings.ihealthUser === undefined || settings.ihealthPass === undefined) {
      console.log('no ihealth settings configured');
      throw new Meteor.Error(401, 'iHealth not configured', 'Please set iHealth User and Pass in settings');
    }
    var device = Devices.findOne({_id: device_id});
    if (device.restEnabled) {
      var check_if_running = Meteor.call("checkQkviewPS", device_id);
      if (check_if_running) {
        var myRes = { subject: 'QKView In Progress!', message: 'Another QKView is already running' };
        return myRes;
      }
    }
    var args;
    if (f5case === undefined) {
      args = [device.mgmtAddress, device.sshUser, settings.ihealthUser, settings.ihealthPass];
    } else {
      args = [device.mgmtAddress, device.sshUser, settings.ihealthUser, settings.ihealthPass, f5case];
    }
    var shellCommand = "create_and_get_qkview.sh";
    var result = Meteor.call("runShellCmd", shellCommand, args);
    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
  getKeyPem: function (onDevice, keyID) {
    var device = Devices.findOne({_id: onDevice});
    var key = Certificates.findOne({_id: keyID});
    var pythonCmd = 'getKey.py';
    var args = [ device.mgmtAddress, device.mgmtUser, device.mgmtPass, key.fullPath ];
    var result = Meteor.call("runPythonCmd", pythonCmd, args);
    Certificates.update({_id: keyID}, { $set: { pemFormat: result}});
    // var obj = Pkifiles.insert(result, function (err, fileObj) {
      // stuff
    // });
  },
  getCertPem: function (onDevice, certID) {
    var device = Devices.findOne({_id: onDevice});
    var cert = Certificates.findOne({_id: certID});
    var pythonCmd = 'getCert.py';
    var args = [ device.mgmtAddress, device.mgmtUser, device.mgmtPass, cert.fullPath ];
    var result = Meteor.call("runPythonCmd", pythonCmd, args);
    Certificates.update({_id: certID}, { $set: { pemFormat: result}});
  },
  runPythonCmd: function (cmd, argList) {
    var pythonPath = '';
    var runCmd = cmd;
    for (i = 0; i < argList.length; i++) {
      runCmd = runCmd + " '" + argList[i] + "'";
    }
    var exec = Npm.require("child_process").exec;
    var Future = Npm.require("fibers/future");
    this.unblock();
    var future = new Future();
    var meteor_root = Npm.require('fs').realpathSync(process.cwd());
    var baseAssets = meteor_root + "/assets/app/";
    var command = "python " + baseAssets + runCmd;
    exec(command, function(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        future.return(stdout.toString());
    });
    return future.wait();
  },
  runShellCmd: function (cmd, argList) {
    var runCmd = cmd;
    for (i = 0; i < argList.length; i++) {
      runCmd = runCmd + " '" + argList[i] + "'";
    }
    var exec = Npm.require("child_process").exec;
    var Future = Npm.require("fibers/future");
    this.unblock();
    var future = new Future();
    var meteor_root = Npm.require('fs').realpathSync(process.cwd());
    var baseAssets = meteor_root + "/assets/app/";
    var command = "/bin/bash " + baseAssets + runCmd;
    exec(command, function(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        future.return(stdout.toString());
    });
    return future.wait();
  },
  sslWrapperCn: function (pem) {
    var exec = Npm.require("child_process").exec;
    var Future = Npm.require("fibers/future");
    this.unblock();
    var future = new Future();
    var command = "/bin/echo '" + pem + "' | openssl x509 -noout -subject -nameopt RFC2253 | sed 's/.*CN=//' | sed 's/,.*//' | tr -d '\n'";
    exec(command, function(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        future.return(stdout.toString());
    });
    return future.wait();
  },
  sslWrapperMod: function (pem) {
    var exec = Npm.require("child_process").exec;
    var Future = Npm.require("fibers/future");
    this.unblock();
    var future = new Future();
    var command = "/bin/echo '" + pem + "' | openssl x509 -noout -modulus";
    exec(command, function(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        future.return(stdout.toString());
    });
    return future.wait();
  },
  sslWrapperExpires: function (pem) {
    var exec = Npm.require("child_process").exec;
    var Future = Npm.require("fibers/future");
    this.unblock();
    var future = new Future();
    var command = "/bin/echo '" + pem + "' | openssl x509 -noout -enddate | sed 's/.*=//'";
    exec(command, function(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        future.return(stdout.toString());
    });
    return future.wait();
  },
  keyWrapperMod: function (pem) {
    var exec = Npm.require("child_process").exec;
    var Future = Npm.require("fibers/future");
    this.unblock();
    var future = new Future();
    var command = "/bin/echo '" + pem + "' | openssl rsa -noout -modulus";
    exec(command, function(error, stdout, stderr) {
        if (error) {
            console.log(error);
        }
        future.return(stdout.toString());
    });
    return future.wait();
  },
  certEmailNotifications: function () {
    var certList = Certificates.find({ssltype: 'certificate'});
    var now = new Date();
    var expired = [];
    var sevenCerts = [];
    var twentyEightCerts = [];
    certList.forEach(function (eachCert) {
      if (eachCert.epochExpirationDate - now.getTime() < 0) {
        expired.push(eachCert.name);
        // 7 * 24 * 60 * 60 * msec
      } else if (eachCert.epochExpirationDate - now.getTime() < 604800000) {
        sevenCerts.push(eachCert.name);
        // 28 * 24 * 60 * 60 * msec
      } else if (eachCert.epochExpirationDate - now.getTime() < 2419200000) {
        twentyEightCerts.push(eachCert.name);
      }
    });

    var expiredCertList = '<p>' + expired + '</p>';
    var sevenDayCertList = '<p>' + sevenCerts + '</p>';
    var twentyEightDayCertList = '<p>' + twentyEightCerts + '</p>';

    var mySettings = Settings.findOne({type: 'system'});
    if (mySettings.certificateEmail === undefined) {
      console.log('Email not set for alerts!');
      return;
    }
    if (expired !== null && sevenCerts !== null && twentyEightCerts !== null) {
      Email.send({
        from: 'honeyb@company.com',
        to: mySettings.certificateEmail,
        subject: '[Honeyb] - F5 Expired & Soon to be Expired Certificates',
        html: '<p>The following Certs are expired</p>' + expiredCertList +
          '<p>The following Certs expire in less than 7 days</p>' + sevenDayCertList +
          '<p>The following Certs expire in less than 28 days</p>' + twentyEightDayCertList,
      });
    }
  },
  updatePermission: function (role, permissionList) {
    if (Meteor.call('isHoneybAdmin')) {
      var pList = [];
      if (permissionList.length > 0) {
        for (var i = 0; i < permissionList.length; i++) {
          pList.push({permission: permissionList[i]});
        }
      }
      Permissions.update({onRole: role}, {$set: {permissionList: pList}});
      return ;
      return {
        message: 'Permissions Updated!',
        subject: 'Success!'
      };
    } else {
      throw new Meteor.Error(401, "Not authorized to update roles");
    }
  },
  saveDeviceSettings: function (deviceId, settings) {
    if (Meteor.call('isHoneybAdmin')) {
      Devices.update({_id: deviceId}, {$set: {collectStats: settings.collectStats}})
      return {
        message: 'Device Settings Updated!',
        subject: 'Success!'
      };
    } else {
      throw new Meteor.Error(401, 'Not authorized to update device settings');
    }
  },
  refreshDevice: function (deviceId) {
    //var device = Devices.findOne({_id: deviceId});
    var argList = {
      deviceId: deviceId,
    };
    // var pool = Pools.findOne({_id: pool_id});
    var theChange = { description: "Refreshing Device id: " + deviceId,
      theMethod: {
        action: "discover",
        module: "device",
        object: "update"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    var result = Meteor.call('pushChange', change_id);

    var myRes = { subject: 'Success!', message: result };
    return myRes;
  },
});
