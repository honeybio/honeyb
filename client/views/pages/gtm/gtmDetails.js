Template.gtmServerDetails.helpers({
  getVservers: function (serverId) {
    return Gtmvservers.find({serverId: serverId});
  }
});

Template.gtmServerDetails.onRendered(function() {
  $('.footable').footable();
});

Template.gtmPoolsDetails.onRendered(function() {
  $('.footable-members').footable();
});

Template.gtmSyncgroupDetails.helpers({
  getDeviceName: function (device_id) {
    var result = Devices.findOne({_id: device_id});
    return result.self.name;
  }
});

Template.availableGtmMembers.helpers({
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

Template.gtmServerDetails.events({
  'click #Add': function (event, template) {
  },
  'click #Enable': function (event, template) {
    event.preventDefault();
    var stage = false;
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      console.log($(this)[0]);
      Meteor.call("enableGtmVserver", $(this)[0].name, stage, function (err, res) {
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
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      Meteor.call("disableGtmVserver", $(this)[0].name, stage, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  },
  'click #Delete': function (event, template) {
    event.preventDefault();
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      Meteor.call("deleteGtmVserver", $(this)[0].id, 0, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success(res.message, res.subject);
        }
      });
    });
  }
});
