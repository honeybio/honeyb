Template.vcmpHosts.helpers({
  vcmpHostList: function () {
    var hostList = Devices.find();
    var result = [];
    hostList.forEach(function (eachDevice) {
      if (eachDevice.provision_level.vcmp != "none"){
        result.push(eachDevice);
      }
    });
    return result;
  },
  getGuestInfo: function (deviceId) {
    var allNames = [];
    var runningNames = [];
    var coreCount = 0;
    var numGuests = 0;
    var numRunning = 0;
    var guestList = Vcmpguests.find({onDevice: deviceId});
    // 5200/7200, should add other models
    var availCores = 8;
    guestList.forEach(function (eachGuest) {
      allNames.push(eachGuest.name);
      numGuests++;
      if (eachGuest.state == 'deployed') {
        runningNames.push(eachGuest.name)
        numRunning++;
        coreCount = coreCount + (eachGuest.coresPerSlot * eachGuest.slots);
      }
    });
    return {
      allConfigured: numGuests,
      allList: allNames.join("\n"),
      allRunning: numRunning,
      runningList: runningNames.join("\n"),
      coresUsed: coreCount,
      totalCores: availCores
    };
  }
});

Template.vcmpGuests.helpers({
  vcmpGuests: function () {
    return Vcmpguests.find();
  },
  getCores: function (slots, cores) {
    return slots * cores;
  },
  getState: function (state) {
    if (state == 'deployed') {
      return true;
    } else {
      return false;
    }
  }
});

Template.vcmpHosts.onRendered(function() {
  $('.footable').footable();
});

Template.vcmpGuests.onRendered(function() {
  $('.footable').footable();
});
