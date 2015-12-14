Template.gtmDatacenters.onRendered(function() {
  $('.footable').footable();
});

Template.gtmSyncgroups.onRendered(function() {
  $('.footable').footable();
});

Template.gtmServers.onRendered(function() {
  $('.footable').footable();
});

Template.gtmVservers.onRendered(function() {
  $('.footable').footable();
});

Template.gtmWideips.onRendered(function() {
  $('.footable').footable();
});

Template.gtmLinks.onRendered(function() {
  $('.footable').footable();
});

Template.gtmPools.onRendered(function() {
  $('.footable').footable();
});

Template.gtmMonitors.onRendered(function() {
  $('.footable').footable();
});

Template.gtmDatacenters.helpers({
  allDatacenters: function () {
    return Gtmdatacenters.find();
  }
});

Template.gtmServers.helpers({
  allGtmservers: function () {
    return Gtmservers.find();
  }
});

Template.gtmSyncgroups.helpers({
  allSyncgroups: function () {
    return Gtmsyncgroups.find();
  }
});

Template.gtmVservers.helpers({
  allGtmvservers: function () {
    return Gtmvservers.find();
  },
  getName: function (onDevice) {
    var result = Gtmservers.findOne({_id: onDevice}, {name: 1});
    return result.name;
  }
});

Template.gtmWideips.helpers({
  allWideips: function () {
    return Wideips.find();
  }
});

Template.gtmLinks.helpers({
  allLinks: function () {
    return Gtmlinks.find();
  }
});

Template.gtmPools.helpers({
  allWidepools: function () {
    return Widepools.find();
  }
});

Template.gtmMonitors.helpers({
  allGtmmonitors: function () {
    return Gtmmonitors.find();
  }
});

Template.gtmWideipsCreate.helpers({
  getSyncList: function () {
    return Gtmsyncgroups.find({});
  },
  getPoolList: function () {
    var sync_id = Session.get("syncgroup");
    return Widepools.find({inSyncGroup: sync_id});
  }
});

Template.gtmWideipsCreate.helpers({
  getSyncList: function () {
    return Gtmsyncgroups.find({});
  },
  gtmVserversCreate: function () {
    var sync_id = Session.get("syncgroup");
    return Gtmservers.find({inSyncGroup: sync_id});
  }
});

Template.gtmDatacenters.events({
  'click #Enable': function (event, template) {
    event.preventDefault();
    console.log('enable datacenter');
    var stage = false;
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      console.log($(this)[0]);
      Meteor.call("enableDatacenter", $(this)[0].name, stage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  },
  'click #Disable': function (event, template) {
    event.preventDefault();
    var stage = false;
    console.log('disable datacenter');
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      Meteor.call("disableDatacenter", $(this)[0].name, stage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  }
});

Template.gtmPoolsCreate.events({
  'change #syncgroup': function (event) {
    var newValue = syncgroup.options[syncgroup.selectedIndex].value;
    Session.set("syncgroup", newValue);
  },
  "submit #poolForm": function (event, template) {
    event.preventDefault();
    // console.log(event.target.monitor);
    var syncid = event.target.syncgroup.options[syncgroup.selectedIndex].value;
    var toStage = event.target.stage.value;
    var poolObject = {
      name: event.target.pool_name.value,
      type: event.target.pool_type.value
    };
    // addLtmPool: function(device_id, pool_name, lbMethod, monitor, members)

    if (event.target.pool_type.value === "a") {
      Meteor.call("createGtmAPool", syncid, poolObject, toStage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    }
    else if (event.target.pool_type.value === "aaaa") {
      Meteor.call("createGtmAAAAPool", syncid, poolObject, toStage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    }
  }
});

Template.gtmWideips.events({
  'click #Delete': function (event, template) {
    event.preventDefault();
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      Meteor.call("deleteGtmWideip", $(this)[0].id, 0, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  }
});

Template.gtmWideipsCreate.events({
  'change #syncgroup': function (event) {
    var newValue = syncgroup.options[syncgroup.selectedIndex].value;
    Session.set("syncgroup", newValue);
  },
  "submit #create-form": function (event, template) {
    event.preventDefault();
    // console.log(event.target.monitor);
    var syncid = event.target.syncgroup.options[syncgroup.selectedIndex].value;
    var toStage = event.target.stage.value;
    var wipObject = {
      name: event.target.wip_name.value,
      type: event.target.wipType.value,
      defaultPool: event.target.target.wpool
    };
    if (event.target.wipType.value === "a") {
      console.log('calling a method');
      Meteor.call("createGtmAWideip", syncid, wipObject, toStage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    }
    else if (event.target.wipType.value === "aaaa") {
      Meteor.call("createGtmAAAAWideip", syncid, wipObject, toStage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    }
  }
});

Template.gtmServersCreate.events({
  'change #syncgroup': function (event) {
    var newValue = syncgroup.options[syncgroup.selectedIndex].value;
    Session.set("syncgroup", newValue);
  },
  'submit #create-form': function (event, template) {
    event.preventDefault();
    // console.log(event.target.monitor);
    var syncid = event.target.syncgroup.options[syncgroup.selectedIndex].value;
    var toStage = event.target.stage.value;
    var obj = {
      name: event.target.name.value,
    };
    Meteor.call("createGtmServer", syncid, obj, toStage, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  }
});

Template.gtmVserversCreate.events({
  'change #syncgroup': function (event) {
    var newValue = syncgroup.options[syncgroup.selectedIndex].value;
    Session.set("syncgroup", newValue);
  },
  'submit #create-form': function (event, template) {
    event.preventDefault();
    // console.log(event.target.monitor);
    var syncid = event.target.syncgroup.options[syncgroup.selectedIndex].value;
    var toStage = event.target.stage.value;
    var obj = {
      name: event.target.name.value,
    };
    Meteor.call("createGtmVserver", syncid, obj, toStage, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  }
});

Template.gtmMonitorCreate.events({
  'change #syncgroup': function (event) {
    var newValue = syncgroup.options[syncgroup.selectedIndex].value;
    Session.set("syncgroup", newValue);
  },
  'submit #create-form': function (event, template) {
    event.preventDefault();
    // console.log(event.target.monitor);
    var syncid = event.target.syncgroup.options[syncgroup.selectedIndex].value;
    var toStage = event.target.stage.value;
    var obj = {
      name: event.target.name.value,
    };
    Meteor.call("createGtmMonitor", syncid, obj, toStage, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  }
});
