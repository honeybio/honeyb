Template.ltmMonitors.helpers({
  allMonitors: function () {
    var result = Monitors.find({}, {name: 1});
    return result;
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
    Meteor.call("addTcpHalfOpenMonitor", device_id, monObj, stage);
  },
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
    Meteor.call("addHttpMonitor", device_id, monObj, stage);
  }
});
