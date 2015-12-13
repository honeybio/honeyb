Template.deviceList.helpers({
  getDeviceList: function () {
    return Devices.find();
  }
});

Template.vcmpDeviceList.helpers({
  getDeviceList: function () {
    var hostList = Devices.find();
    var result = [];
    hostList.forEach(function (eachDevice) {
      if (eachDevice.provision_level.vcmp != "none"){
        result.push(eachDevice);
      }
    });
    return result;
  }
});

Template.vcmpDeviceList.events({
  'change #device': function (event) {
    var newValue = device.options[device.selectedIndex].value;
    Session.set("onDevice", newValue);
  },
});

Template.syncGroupSelect.helpers({
  getSyncList: function () {
    return Gtmsyncgroups.find();
  }
});
