Template.ltmPools.helpers({
  allPools: function () {
    var result = Pools.find({}, {name: 1});
    return result;
  },
  getDeviceList: function () {
    var result = Devices.find({});
    return result;
  }
});

Template.ltmPools.events({
  'submit .poolMemberForm': function (event, template) {
    event.preventDefault();
    var the_action = event.target.objectAction.value;
    var checkedList = [];
    $('input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].name);
    });
    for (var i = 0; i < checkedList.length; i++) {
      if (the_action == "delete") {
        Meteor.call("deletePool", checkedList[i], event.target.stage.value);
      }
      else if (the_action == "copy") {
        Meteor.call("copyPool", checkedList[i], event.target.to_device.value, event.target.stage.value);
      }
    }
      // Meteor.call("updatePoolList", onDevice, pool_id);
  }
});

Template.poolDetails.events({
  'submit .poolMemberForm': function (event, template) {
    event.preventDefault();
    var onDevice = event.target.onDevice.value;
    var the_action = event.target.memberAction.value;
    var pool_id = event.target.poolName.value;
    var checkedList = [];
    $('input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].name);
    });
    for (var i = 0; i < checkedList.length; i++) {
      if (the_action == "enable") {
        Meteor.call("enablePoolMember", checkedList[i], onDevice, event.target.stage.value);
      }
      else if (the_action == "disable") {
        Meteor.call("disablePoolMember", checkedList[i], onDevice, event.target.stage.value);
      }
      else if (the_action == "force") {
        Meteor.call("forcePoolMember", checkedList[i], onDevice, event.target.stage.value);
      }
      else if (the_action == "delete") {
        Meteor.call("deletePoolMember", checkedList[i], onDevice, pool_id, event.target.stage.value);
      }
    }
    Meteor.call("updatePoolMemberStatus", onDevice, pool_id);
  },
  'submit .addPoolMemberForm': function (event, template) {
    event.preventDefault();
    var memberObj = {
      ipAddr: event.target.memIP.value,
      port: event.target.memPort.value,
      pool_id: event.target.poolID.value
    }
    Meteor.call("addPoolMember", event.target.onDevice.value, memberObj, event.target.stage.value);
  }
});

Template.poolDetails.helpers({
  lmethods: function () {
    var result = Profiles.find({})
  }
});

Template.ltmPoolsCreate.onRendered(function(){
  dragula([document.querySelector('#monitorDrop'), document.querySelector('#right')]);
});

Template.ltmPoolsCreate.onCreated( function() {
  Session.set('inputs', []);
  Session.set('onDevice', 'none');
});

Template.ltmPoolsCreate.helpers({
  getDeviceList: function () {
    var result = Devices.find({});
    return result;
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
  }
});

Template.ltmPoolsCreate.events({
  'change #device': function (event) {
    var newValue = device.options[device.selectedIndex].value;
    Session.set("onDevice", newValue);
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
    Session.set('inputs', inputs);
    // inputs.pop({uniqid: uniqid});
  },
  "submit #poolForm": function (event, template) {
    event.preventDefault();
    // console.log(event.target.monitor);
    var members = Session.get('inputs');
    var device_id = event.target.device.options[device.selectedIndex].value;
    var toStage = event.target.stage.value;
    var memberList = [];
    if (members.length != 0) {
      for (i = 0; i < members.length; i++) {
        var ipID = members[i].uniqid + "_ip";
        var portID = members[i].uniqid + "_port";
        // console.log("MemIP: " + event.target + " " + ipID);
        member = {
          name: event.target[ipID].value + ":" + event.target[portID].value,
          address: event.target[ipID].value
        };
        memberList.push(member);
      }
    }
    var poolObject = {
      name: event.target.pool_name.value,
      monitor: [],
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
      queueDepthLimit : null,
      queueOnConnectionLimit : null,
      queueTimeLimit : null,
      reselectTries : null,
      serviceDownAction : null,
      slowRampTime : null
    };
    // addLtmPool: function(device_id, pool_name, lbMethod, monitor, members)
    Meteor.call("createLtmPool", device_id, poolObject, toStage);
  }
});
