Template.deviceList.helpers({
  getDeviceList: function () {
    return Devices.find({'self.failoverState': 'active'});
  }
});

Template.vcmpDeviceList.helpers({
  getVcmpDeviceList: function () {
    var hostList = Devices.find();
    var result = [];
    hostList.forEach(function (eachDevice) {
      if (eachDevice.provision_level.vcmp == "dedicated"){
        result.push(eachDevice);
      }
    });
    return result;
  }
});

Template.vcmpDeviceList.events({
  'change #device': function (event) {
    var newValue = device.options[device.selectedIndex].value;
    if (newValue == 'none') {
      Session.set('onDevice', false);
    } else {
      Session.set("onDevice", newValue);
    }
  },
});

Template.toVcmpDeviceList.helpers({
  getVcmpDeviceList: function () {
    var hostList = Devices.find();
    var result = [];
    hostList.forEach(function (eachDevice) {
      if (eachDevice.provision_level.vcmp == "dedicated"){
        result.push(eachDevice);
      }
    });
    return result;
  }
});

Template.toVcmpDeviceList.events({
  'change #device': function (event) {
    var newValue = device.options[device.selectedIndex].value;
    if (newValue == 'none') {
      Session.set('toDevice', false);
    } else {
      Session.set("toDevice", newValue);
    }
  },
});

Template.syncGroupSelect.helpers({
  getSyncList: function () {
    return Gtmsyncgroups.find();
  }
});
