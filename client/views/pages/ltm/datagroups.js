Template.ltmDatagroups.onRendered(function() {
  $('.footable').footable();
});

Template.ltmDatagroups.helpers({
  allDatagroups: function () {
    return Datagroups.find();
  }
});
