Template.ltmIdatagroups.onRendered(function() {
  $('.footable').footable();
});

Template.ltmIdatagroups.helpers({
  allDatagroups: function () {
    return Idatagroups.find();
  }
});
