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

Template.vcmpGuests.events({
  'click #Delete': function (event, template) {
    event.preventDefault();
    var stage = false;
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      Meteor.call("deleteVcmpGuest", $(this)[0].id, stage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  },
  'click #Shutdown': function (event, template) {
    event.preventDefault();
    var stage = false;
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      Meteor.call("disableVcmpGuest", $(this)[0].id, stage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  },
  'click #Power-off': function (event, template) {
    event.preventDefault();
    var stage = false;
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      Meteor.call("forceVcmpGuest", $(this)[0].id, stage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  },
  'click #Start': function (event, template) {
    event.preventDefault();
    var stage = false;
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      Meteor.call("enableVcmpGuest", $(this)[0].id, stage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  }
});

Template.vcmpGuestsCreate.onCreated( function() {
  Session.set('onDevice', false);
});


Template.vcmpGuestsCreate.helpers({
  getImageList: function () {
    var deviceId = Session.get("onDevice");
    if (deviceId) {
       var device = Devices.findOne({_id: deviceId}, {fields: {software: 1}});
       return device.software.images;
    }
    else {
      return [ "none" ];
    }
  },
  getHotfixList: function () {
    var deviceId = Session.get("onDevice");
    if (deviceId) {
       var device = Devices.findOne({_id: deviceId}, {fields: {software: 1}});
       return device.hotfixes.images;
    }
    else {
      return [ "none" ];
    }
  }
});

Template.vcmpGuestsCreate.events({
  'submit #create-form': function (event) {
    event.preventDefault();

    var deviceId = event.target.device.options[device.selectedIndex].value;
    var toStage = false;

    var obj = {
      name: event.target.guestName.value,
      image: event.target.image.value,
      managementIp: event.target.mgmtIp.value,
      managementGw: event.target.mgmtGw.value,
      coresPerSlot: event.target.cores.value
    }
    // addLtmPool: function(device_id, pool_name, lbMethod, monitor, members)
    Meteor.call("createVcmpGuest", deviceId, obj, toStage, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  }
});


Template.vcmpHosts.onRendered(function() {
  $('.footable').footable();
});

Template.vcmpGuests.onRendered(function() {
  $('.footable').footable();
});
