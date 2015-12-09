Template.deviceList.helpers({
  getDeviceList: function () {
    return Devices.find();
  }
});

Template.syncGroupSelect.helpers({
  getSyncList: function () {
    return Gtmsyncgroups.find();
  }
});
