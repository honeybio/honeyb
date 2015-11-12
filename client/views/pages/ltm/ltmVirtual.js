Template.ltmVirtuals.helpers({
  allVirtuals: function () {
    var result = Virtuals.find();
    return result;
  },
  getDeviceList: function () {
    var result = Devices.find({});
    return result;
  }
});

Template.ltmVirtuals.events({
  'submit .vipForm': function (event, template) {
    event.preventDefault();
    var the_action = event.target.objectAction.value;
    var checkedList = [];
    $('input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].name);
    });
    for (var i = 0; i < checkedList.length; i++) {
      if (the_action == "delete") {
        Meteor.call("deleteVirtual", checkedList[i], event.target.stage.value);
      }
      else if (the_action == "copy") {
        Meteor.call("copyVirtual", checkedList[i], event.target.stage.value);
      }
      else if (the_action == "enable") {
        Meteor.call("enableVirtual", checkedList[i], event.target.stage.value);
      }
      else if (the_action == "disable") {
        Meteor.call("disableVirtual", checkedList[i], event.target.stage.value);
      }
    }
  }
});

Template.tcpProfileDropdown.helpers({
  allclientssl: function () {
    var result = Profiles.find({profType: "client-ssl"});
    return result;
  },
  allHttp: function () {
    var result = Profiles.find({profType: "http"});
    return result;
  },
  allTcp: function () {
    var result = Profiles.find({profType: "tcp"});
    return result;
  },
  allOneconnect: function () {
    var result = Profiles.find({profType: "one-connect"});
    return result;
  },
  allCookie: function () {
    var result = Persistence.find({profType: "cookie"});
    return result;
  },
  allUniversal: function () {
    var result = Persistence.find({profType: "universal"});
    return result;
  },
});

Template.ltmVirtualsCreate.events({
  'change #device': function (event) {
    var newValue = device.options[device.selectedIndex].value;
    Session.set("onDevice", newValue);
  },
  "submit #vipForm": function (event, template) {
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
    Meteor.call("addLtmPool", device_id, poolObj, toStage);
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
  getDeviceList: function () {
    var result = Devices.find({});
    return result;
  },
  getPoolList: function () {
    var device = Session.get("onDevice");
    if (device !== undefined) {
      var poolList = Pools.find({onDevice: device});
      return poolList;
    }
    else {
      return [ "none" ];
    }
  },
  getMonitorList: function () {
    var device = Session.get("onDevice");
    if (device !== undefined) {
      var monList = Monitors.find({onDevice: device});
      return monList;
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
      var persList = Persistence.find({onDevice: device});
      return persList;
    }
    else {
      return [ "none" ];
    }
  }
});
