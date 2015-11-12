Template.ltmRules.helpers({
  allRules: function () {
    var result = Rules.find({}, {name: 1});
    return result;
  }
});

Template.ltmIdatagroups.helpers({
  allIdatagroups: function () {
    var result = Idatagroups.find({}, {name: 1});
    return result;
  }
});
