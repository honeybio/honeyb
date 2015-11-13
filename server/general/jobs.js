Meteor.methods({
  newJob: function (job) {
    return Jobs.insert(job);
  }
});
