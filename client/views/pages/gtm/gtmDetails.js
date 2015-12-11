Template.gtmServerDetails.helpers({
  getVservers: function (serverId) {
    return Gtmvservers.find({serverId: serverId});
  }
});

Template.gtmServerDetails.onRendered(function() {
  $('.footable').footable();
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
