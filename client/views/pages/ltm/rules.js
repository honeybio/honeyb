Template.ltmRules.helpers({
  allRules: function () {
    return Rules.find();
  }
});

Template.ltmRules.onRendered(function() {
  $('.footable').footable();
});
