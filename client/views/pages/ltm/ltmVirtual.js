Template.ltmVirtuals.onRendered(function() {
  $('.footable').footable();
});

Template.ltmVirtuals.helpers({
  allVirtuals: function () {
    return Virtuals.find();
  },
  logme: function (object) {
    console.log(object);
  }
});

Template.virtualDetails.helpers({
  getAllrules: function (device) {
    return Rules.find({onDevice: device})
  },
  getAllvlans: function (device) {
    return [];
  }
});

Template.ltmVirtuals.events({
  'click #Enable': function (event, template) {
    event.preventDefault();
    var stage = false;
    $('#virtual-servers :input[type=checkbox]:checked').each(function(index){
      Meteor.call("enableVirtual", $(this)[0].name, stage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  },
  'click #Disable': function (event, template) {
    event.preventDefault();
    var stage = false;
    $('#virtual-servers :input[type=checkbox]:checked').each(function(index){
      Meteor.call("disableVirtual", $(this)[0].name, stage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  },
  'click #Delete': function (event, template) {
    event.preventDefault();
    var stage = false;
    $('#virtual-servers :input[type=checkbox]:checked').each(function(index){
      Meteor.call("deleteVirtual", $(this)[0].name, stage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  }
});

Template.tcpProfileDropdown.helpers({
  allclientssl: function () {
    return Profiles.find({profType: "client-ssl"});
  },
  allHttp: function () {
    return Profiles.find({profType: "http"});
  },
  allTcp: function () {
    return Profiles.find({profType: "tcp"});
  },
  allOneconnect: function () {
    return Profiles.find({profType: "one-connect"});
  },
  allCookie: function () {
    return Persistence.find({profType: "cookie"});
  },
  allUniversal: function () {
    return Persistence.find({profType: "universal"});
  },
});

Template.ltmVirtualsCreate.events({
  'change #device': function (event) {
    var newValue = device.options[device.selectedIndex].value;
    Session.set("onDevice", newValue);
  },
  "submit #virtual-settings": function (event, template) {
    event.preventDefault();
    var vipObj = {
      kind: "tm:ltm:virtual:virtualstate",
      name: event.target.vip_name.value,
      destination: "/Common/" + event.target.vip_dest.value + ":" + event.target.vip_port.value,
      mask: event.target.vip_mask.value,
      pool: event.target.default_pool.value,
      snat: event.target.snat.value
    };
    var device_id = event.target.device.options[device.selectedIndex].value;
    var toStage = event.target.stage.value;
    var description = event.target.longDescription.value;
  },
  "click #poolForm button[class=addMore]": function (event) {
    event.preventDefault();
    var inputs = Session.get('inputs');
    var uniqid = Math.floor(Math.random() * 100000);
    inputs.push({uniqid: uniqid});
    Session.set('inputs', inputs);
  },
  "click #poolForm button[class=remove-input]": function (event) {
    event.preventDefault();
    var inputs = Session.get('inputs');
    var i = inputs.indexOf(this.uniqid);
    inputs.splice(i, 1);
    // console.log(inputs);
    Session.set('inputs', inputs);
    // inputs.pop({uniqid: uniqid});
  },
  "submit #poolForm": function (event) {
    event.preventDefault();
    var members = Session.get('inputs');
    var device_id = event.target.device.options[device.selectedIndex].value;
    var toStage = event.target.stage.value;
    var memberList = [];
    for (i = 0; i < members.length; i++) {
      var ipID = members[i].uniqid + "_ip";
      var portID = members[i].uniqid + "_port";
      // console.log("MemIP: " + event.target + " " + ipID);
      member = { name: event.target[ipID].value + ":" + event.target[portID].value, address: event.target[ipID].value };
      memberList.push(member);
    }
    var poolObject = {
      name: event.target.pool_name.value,
      monitor: event.target.monitor.value,
      members: memberList,
      partition : null,
      allowNat : null,
      allowSnat : null,
      ignorePersistedWeight : null,
      ipTosToClient : null,
      ipTosToServer : null,
      linkQosToClient : null,
      linkQosToServer : null,
      loadBalancingMode : event.target.lbMethod.value,
      minActiveMembers : null,
      minUpMembers : null,
      minUpMembersAction : null,
      minUpMembersChecking : null,
      monitor : monitor,
      queueDepthLimit : null,
      queueOnConnectionLimit : null,
      queueTimeLimit : null,
      reselectTries : null,
      serviceDownAction : null,
      slowRampTime : null
    }
    // addLtmPool: function(device_id, pool_name, lbMethod, monitor, members)
    Meteor.call("addLtmPool", device_id, poolObj, toStage, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  }

  /*
  "click #poolForm button[class=addMore]": function (event) {
    event.preventDefault();
    var inputs = Session.get('inputs');
    var uniqid = Math.floor(Math.random() * 100000);
    inputs.push({uniqid: uniqid});
    Session.set('inputs', inputs);
  },
  */
  /*
    "click #poolForm button[class=remove-input]": function (event) {
    event.preventDefault();
    var inputs = Session.get('inputs');
    var i = inputs.indexOf(this.uniqid);
    inputs.splice(i, 1);
    console.log(inputs);
    Session.set('inputs', inputs);
    // inputs.pop({uniqid: uniqid});
  },
  */
/*  "submit #poolForm": function (event) {
    event.preventDefault();
    var members = Session.get('inputs');
    var pool_name = event.target.pool_name.value;
    var lbMethod = event.target.lbMethod.value;
    var monitorPath = event.target.monitor.value;
    var device_id = event.target.device.options[device.selectedIndex].value;
    var toStage = event.target.stage.value;
    var memberList = [];
    for (i = 0; i < members.length; i++) {
      var ipID = members[i].uniqid + "_ip";
      var portID = members[i].uniqid + "_port";
      // console.log("MemIP: " + event.target + " " + ipID);
      member = { name: event.target[ipID].value + ":" + event.target[portID].value, address: event.target[ipID].value };
      memberList.push(member);
    }
    // addLtmPool: function(device_id, pool_name, lbMethod, monitor, members)
    Meteor.call("addLtmPool", device_id, pool_name, lbMethod, monitorPath, memberList, toStage);
  }
  */
});

Template.ltmVirtualsCreate.onRendered(function(){
  dragula([document.querySelector('#poolDrop'), document.querySelector('#right')]);
});

Template.ltmVirtualsCreate.onCreated( function() {
  Session.set('onDevice', 'none');
  Session.set('inputs', []);
});

Template.ltmVirtualsCreate.helpers({
  getPoolList: function () {
    var device = Session.get("onDevice");
    if (device !== undefined) {
      return Pools.find({onDevice: device});
    }
    else {
      return [ "none" ];
    }
  },
  getMonitorList: function () {
    var device = Session.get("onDevice");
    if (device !== undefined) {
      return Monitors.find({onDevice: device});
    }
    else {
      return [ "none" ];
    }
  },
  inputs: function () {
    return Session.get('inputs');
  },
  getPersistenceList: function () {
    var device = Session.get("onDevice");
    if (device !== undefined) {
      return Persistence.find({onDevice: device});
    }
    else {
      return [ "none" ];
    }
  }
});
