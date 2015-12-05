
Template.ltmMonitors.helpers({
  allMonitors: function () {
    var result = Monitors.find({}, {name: 1});
    return result;
  }
});

Template.ltmMonitors.events({
  "submit #ltm-monitors": function (event, template) {
    event.preventDefault();
    var the_action = event.target.objectAction.value;
    var checkedList = [];
    $('#ltm-monitors :input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].name);
    });
    for (var i = 0; i < checkedList.length; i++) {
      if (the_action == "delete") {
        Meteor.call("deleteMonitor", checkedList[i], 0, function (err, res) {
          if (err) {
            toastr.error(err.details, err.reason)
          } else {
            toastr.success(res.message, res.subject);
          }
        });
      }
      else if (the_action == "copy") {
        // Meteor.call("copyPool", checkedList[i], event.target.to_device.value, event.target.stage.value);
      }
    }
  }
});

Template.ltmMonitorsTcpHalfOpenCreate.helpers({
  getDeviceList: function () {
    var result = Devices.find({});
    return result;
  }
});

Template.ltmMonitorsTcpHalfOpenCreate.events({
  "submit #monForm": function (event, template) {
    event.preventDefault();
    var device_id = event.target.device.value;
    console.log(device_id);
    var monObj = {
      type: 'tcp-half-open',
      name: event.target.mon_name.value,
      destination: event.target.destination.value,
      interval: event.target.interval.value,
      timeout: event.target.timeout.value,
      upInterval: event.target.upInterval.value,
      timeUntilUp: event.target.timeUntilUp.value,
      manualResume: event.target.manualResume.value,
      transparent: event.target.transparent.value
    }
    Meteor.call("addTcpHalfOpenMonitor", device_id, monObj, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  }
});

Template.ltmMonitorsHttpCreate.helpers({
  getDeviceList: function () {
    var result = Devices.find({});
    return result;
  }
});

Template.ltmMonitorsHttpCreate.events({
  "submit #monForm": function (event, template) {
    event.preventDefault();
    var device_id = event.target.device.value;
    var monObj = {
      type: "http",
      name: event.target.mon_name.value,
      destination: event.target.destination.value,
      interval: event.target.interval.value,
      timeout: event.target.timeout.value,
      upInterval: event.target.upInterval.value,
      timeUntilUp: event.target.timeUntilUp.value,
      manualResume: event.target.manualResume.value,
      transparent: event.target.transparent.value,
      adaptive: event.target.adaptive.value,
      adaptive: event.target.adaptive.value,
      adaptiveDivergenceType: event.target.adaptiveDivergenceType.value,
      adaptiveDivergenceValue: event.target.adaptiveDivergenceValue.value,
      adaptiveLimit: event.target.adaptiveLimit.value,
      adaptiveSamplingTimespan: event.target.adaptiveSamplingTimespan.value,
      send: event.target.send.value,
      recv: event.target.recv.value,
      reverse: event.target.reverse.value
    }
    Meteor.call("addHttpMonitor", device_id, monObj, stage, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  }
});
