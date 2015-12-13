Template.vcmpHosts.helpers({
  vcmpHostList: function () {
    var hostList = Devices.find();
    var result = [];
    hostList.forEach(function (eachDevice) {
      if (eachDevice.provision_level.vcmp == "dedicated"){
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
  'click #Migrate': function (event, template) {
    console.log('migrate');
  },
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

Template.vcmpGuestsCreate.onCreated( function() {
  this.softwareVersion = new ReactiveVar();
  this.softwareVersion.set(null);
});

Template.vcmpGuestsCreate.helpers({
  getImageList: function () {
    var deviceId = Session.get("onDevice");
    if (deviceId) {
       var device = Devices.findOne({_id: deviceId}, {fields: {software: 1}});
       return device.software.images;
    } else {
      return [ "none" ];
    }
  },
  getHotfixList: function () {
    var deviceId = Session.get("onDevice");
    if (deviceId) {
      var version = Template.instance().softwareVersion.get();
      var device = Devices.findOne({_id: deviceId}, {fields: {software: 1}});
      if (device != undefined) {
        var hotfixList = [];
        for (var i = 0; i < device.software.hotfixes.length; i++) {
          if (device.software.hotfixes[i].version == version) {
            hotfixList.push({ name: device.software.hotfixes[i].name, version: device.software.hotfixes[i].id });
          }
        }
        return hotfixList;
      }
    }
    return false;
  },
  getHostIp: function () {
    var deviceId = Session.get("onDevice");
    if (deviceId) {
       var device = Devices.findOne({_id: deviceId}, {fields: {management: 1}});
       return device.management.ip[0];
    } else {
      return [ "none" ];
    }
  },
  getHostGw: function () {
    var deviceId = Session.get("onDevice");
    if (deviceId) {
       var device = Devices.findOne({_id: deviceId}, {fields: {management: 1}});
       return device.management.gateway;
    } else {
      return [ "none" ];
    }
  },
  getGuestInfo: function (deviceId) {
    var deviceId = Session.get("onDevice");
    if (deviceId) {
      var coreCount = 0;
      var numRunning = 0;
      var guestList = Vcmpguests.find({onDevice: deviceId});
      // 5200/7200, should add other models
      var availCores = 8;
      guestList.forEach(function (eachGuest) {
        if (eachGuest.state == 'deployed') {
          numRunning++;
          coreCount = coreCount + (eachGuest.coresPerSlot * eachGuest.slots);
        }
      });
      return coreCount + "/" + availCores + " cores in use (" + coreCount / availCores * 100 + "%)";
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
      initialImage: event.target.image.value,
      initialHotfix: event.target.hotfix.value,
      managementIp: event.target.managementIp.value,
      managementGw: event.target.mgmtGw.value,
      managementNetwork: 'bridged',
      slots: 1,
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
  },
  'change #image': function (event, template) {
    template.softwareVersion.set(image.options[image.selectedIndex].id);
  }
});


Template.vcmpHosts.onRendered(function() {
  $('.footable').footable();
});

Template.vcmpGuests.onRendered(function() {
  $('.footable').footable();
});
