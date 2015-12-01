Template.gtmDatacenters.helpers({
  allDCs: function () {
    var result = Gtmdatacenters.find();
    return result;
  }
});

Template.gtmServers.helpers({
  allServers: function () {
    var result = Gtmservers.find();
    return result;
  }
});

Template.gtmSyncgroups.helpers({
  getSyncGroups: function () {
    var result = Gtmsyncgroups.find();
    return result;
  }
});

Template.gtmSyncgroupDetails.helpers({
  getDeviceName: function (device_id) {
    var result = Devices.findOne({_id: device_id});
    return result.self.name;
  }
});

Template.gtmVservers.helpers({
  allVservers: function () {
    var result = Gtmvservers.find();
    return result;
  },
  getName: function (onDevice) {
    var result = Gtmservers.findOne({_id: onDevice}, {name: 1});
    return result.name;
  }
});

Template.gtmWideips.helpers({
  allWips: function () {
    var result = Wideips.find();
    return result;
  }
});

Template.gtmPools.helpers({
  allPools: function () {
    var gpools = Widepools.find();
    return gpools;
  }
});

Template.gtmPoolsCreate.helpers({
  getSyncList: function () {
    var result = Gtmsyncgroups.find({});
    return result;
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

Template.gtmWideipsCreate.helpers({
  getSyncList: function () {
    var result = Gtmsyncgroups.find({});
    return result;
  },
  getPoolList: function () {
    var sync_id = Session.get("syncgroup");
    var result = Widepools.find({inSyncGroup: sync_id});
    return result;
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
    var result = Gtmvservers.find({inSyncGroup: syncGroup});
    return result;
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
