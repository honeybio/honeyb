Template.gtmDatacenters.onRendered(function() {
  $('.footable').footable();
});

Template.gtmSyncgroups.onRendered(function() {
  $('.footable').footable();
});

Template.gtmDatacenters.helpers({
  allDatacenters: function () {
    return Gtmdatacenters.find();
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

Template.gtmServers.onRendered(function() {
  $('.footable').footable();
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

Template.gtmSyncgroupDetails.helpers({
  getDeviceName: function (device_id) {
    var result = Devices.findOne({_id: device_id});
    return result.self.name;
  }
});

Template.gtmVservers.onRendered(function() {
  $('.footable').footable();
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

Template.gtmWideips.onRendered(function() {
  $('.footable').footable();
});

Template.gtmLinks.onRendered(function() {
  $('.footable').footable();
});

Template.gtmPools.onRendered(function() {
  $('.footable').footable();
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

Template.gtmMonitors.onRendered(function() {
  $('.footable').footable();
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

Template.gtmWideipsCreate.helpers({
  getSyncList: function () {
    return Gtmsyncgroups.find({});
  },
  getPoolList: function () {
    var sync_id = Session.get("syncgroup");
    return Widepools.find({inSyncGroup: sync_id});
  }
});

Template.gtmWideipsCreate.events({
  'change #syncgroup': function (event) {
    var newValue = syncgroup.options[syncgroup.selectedIndex].value;
    Session.set("syncgroup", newValue);
  },
  "submit #wipForm": function (event, template) {
    event.preventDefault();
    // console.log(event.target.monitor);
    var syncid = event.target.syncgroup.options[syncgroup.selectedIndex].value;
    var toStage = event.target.stage.value;
    var wipObject = {
      name: event.target.wip_name.value,
      type: event.target.wip_type.value,
      defaultPool: event.
      target.wpool.value
    };
    if (event.target.wip_type.value === "a") {
      console.log('calling a method');
      Meteor.call("createGtmAWideip", syncid, wipObject, toStage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    }
    else if (event.target.wip_type.value === "aaaa") {
      Meteor.call("createGtmAAAAPool", syncid, wipObject, toStage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    }
  }
});

Template.gtmPoolsDetails.helpers({
  getVirtualsServers: function (syncGroup) {
    return Gtmvservers.find({inSyncGroup: syncGroup});
  }
});

Template.gtmPoolsDetails.events({
  'submit #addGmembers': function (event, template) {
    event.preventDefault();
    var pool_id = event.target.gtmPool.value;
    var virtual = event.target.gtmVirtual.value;
    var toStage = event.target.stage.value;
    var syncid = event.target.syncid.value;
    var gMemberObj = {
      onPool: pool_id,
      name: virtual
    };
    Meteor.call("addGmember", syncid, gMemberObj, toStage, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  },
  'submit #members': function (event, template) {
    event.preventDefault();
    var pool_id = event.target.gtmPool.value;
    var toStage = event.target.stage.value;
    var syncid = event.target.syncid.value;
    var gMemberObj = {
      onPool: pool_id
    };
    var checkedList = [];
    $('input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].name);
    });
    for (var i = 0; i < checkedList.length; i++) {
      Meteor.call("deleteGmember", syncid, gMemberObj, checkedList[i], event.target.stage.value, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    }
  }
});
