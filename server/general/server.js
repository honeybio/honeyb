Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  myLog: function(toLog) {
    console.log(toLog);
  },
  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
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
    var result = Meteor.call("bigipRestPost", onDevice, lurl, postData);
    var re = /qkview/;
    var qkRun = result.data.commandResult.search(re);
    if (qkRun > 0) {
      return true;
    }
    else {
      return false;
    }
  },
  updateSettings: function (hname, dcInt, serInt, vserInt, virtInt, poolInt, memInt, iUser, iPass) {
    //
    var update = Settings.update({type: "system"}, { $set: { name: hname, ihealthUser: iUser,
      ihealthPass: iPass, interval: { updateGtmDc: dcInt, updateGtmServer: serInt,
      updateGtmVserver: vserInt, updateLtmVirtual: virtInt, updateLtmPool: poolInt,
      updateLtmPoolMember: memInt },
    }});
    return update;
  },
  updateSchedule: function (archiveFreq, qkviewFreq) {
    Settings.update({type: "system"}, { $set: { archiveSchedule: archiveFreq, qkviewSchedul: qkviewFreq}});
  },
  schedArch: function() {
    console.log("scheduler running");
    return "success!";
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
  taskOnce: function(changeSetId, timeObj) {
    var runDate = Meteor.call("setDate", timeObj);
    var changeSet = Changeset.findOne({_id: changeSetId});
    var taskName = changeSet.name + " task " + runDate.toString();
    var cront = SyncedCron.add({
      name: taskName,
      schedule: function(parser) {
        // parser is a later.parse object
        // return parser.recur().on(jobSchedule.min).minute().on(jobSchedule.hr).hour().on(jobSchedule.day).dayOfWeek();
        return parser.recur().on(runDate).fullDate();
      },
      job: function() {
        var output = Meteor.call("pushChangeset", changeSetId);
        return output;
      }
    });
    Jobs.insert({name: taskName, changeSetId: changeSetId, onDate: runDate});
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
    var device = Devices.findOne({_id: device_id});
    var settings = Settings.findOne();
    var shellCommand = "create_and_get_ucs.sh";
    var args = [device.mgmtAddress, device.sshUser];
    var output = Meteor.call("runShellCmd", shellCommand, args);
    // console.log(output);
    var fileObj = new FS.File(output);
    fileObj.owner = Meteor.userId();
    fileObj.metadata = { onDevice: device_id, onDeviceName: device.self.name };
    Archives.insert(fileObj);
  },
  generateSshKey: function(keyName) {
    var shellCommand = "generate_ssh_key.sh";
    var args = [keyName];
    var output = Meteor.call("runShellCmd", shellCommand, args);
    //
    //var priv = Meteor.call("runShellCmd", newCmd, newArgs);
    Settings.update({type: 'system'}, { $set: { keyName: { name: keyName, pub: output }}});
    // return output;
  },
  createQkviewCommand: function(device_id, f5case) {
    var settings = Settings.findOne();
    var device = Devices.findOne({_id: device_id});
    var check_if_running = Meteor.call("checkQkviewPS", device_id);
    if (check_if_running) {
      console.log('qkview running');
      return "qkview already running";
    }
    else if (settings.ihealthUser === undefined || settings.ihealthPass === undefined) {
      console.log('no ihealth settings configured');
      return 'need to set iHealth User and Pass in settings';
    }
    else {
      var args;
      if (f5case === undefined) {
        args = [device.mgmtAddress, device.sshUser, settings.ihealthUser, settings.ihealthPass];
      } else {
        args = [device.mgmtAddress, device.sshUser, settings.ihealthUser, settings.ihealthPass, f5case];
      }
      var shellCommand = "create_and_get_qkview.sh";
      var output = Meteor.call("runShellCmd", shellCommand, args);
    }
  },
  getKeyPem: function (onDevice, keyID) {
    var device = Devices.findOne({_id: onDevice});
    var key = Certificates.findOne({_id: keyID});
    var pythonCmd = 'getKey.py';
    var args = [ device.mgmtAddress, device.mgmtUser, device.mgmtPass, key.fullPath ];
    var result = Meteor.call("runPythonCmd", pythonCmd, args);
    Certificates.update({_id: keyID}, { $set: { pemFormat: result}});
    // var obj = Certfiles.insert(result, function (err, fileObj) {
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
  }
});
