Meteor.methods({
  addTask: function (text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  newJob: function (job) {
    return Jobs.insert(job);
  },
  deleteTask: function (taskId) {
    Tasks.remove(taskId);
  },
  setChecked: function (taskId, setChecked) {
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },
  taskOnce: function(changeSetId, timeObj) {
    var runDate = Meteor.call("setDate", timeObj);
    var changeSet = Changeset.findOne({_id: changeSetId});
    var taskName = changeSet.name + " task " + runDate.toString();
    var cront = SyncedCron.add({
      name: taskName,
      schedule: function(parser) {
        // parser is a later.parse object
        // return parser.recur().on(jobSchedule.min).minute().on(jobSchedule.hr).hour().on(jobSchedule.day).dayOfWeek();
        return parser.recur().on(runDate).fullDate();
      },
      job: function() {
        var output = Meteor.call("pushChangeset", changeSetId);
        return output;
      }
    });
    Jobs.insert({name: taskName, changeSetId: changeSetId, onDate: runDate});
  }
});
