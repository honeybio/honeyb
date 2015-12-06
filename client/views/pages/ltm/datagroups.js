Template.ltmIdatagroups.onRendered(function() {
  $('.footable').footable();
});

Template.ltmPools.helpers({
  allDatagroups: function () {
    return Idatagroups.find();
  }
});
