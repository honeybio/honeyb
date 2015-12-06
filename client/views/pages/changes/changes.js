Template.changes.helpers({
  allChanges: function () {
    var tmp = Changes.find({pushed: false, canceled: false, scheduled: false, approved: false });
    return tmp;
  },
  createdChanges: function () {
    var tmp = Changes.find({pushed: false, canceled: false, scheduled: false });
    return tmp;
  },
  dropdownChangeset: function () {
    return Session.get('changesetSelected');
  },
  changesetList: function () {
    return Changeset.find();
  }
});

Template.changes.events({
  'submit .changeForm': function (event) {
    event.preventDefault();
    var action = event.target.changeAction.value;
    // var changeSetID = event.target.changeSetId.value;
    var checkedList = [];
    $('input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].name);
    });
    for (var i = 0; i < checkedList.length; i++) {
      if (action == "cancel") {
        Meteor.call("cancelChange", checkedList[i]);
      }
      else if (action == "push") {
        Meteor.call("pushChange", checkedList[i]);
      }
      else if (action == "addtoset") {
        Meteor.call("addToSet", checkedList[i], changeSetID)
      }
    }
  },
  'change .changeAction': function (event) {
    var newValue = changeAction.options[changeAction.selectedIndex].value;
    if (newValue == 'addtoset') {
      Session.set('changesetSelected', 1);
    } else {
      Session.set('changesetSelected', 0);
    }
  }
});

Template.changes.onCreated( function() {
  Session.set('changesetSelected', 0);
});


Template.changesCommitted.helpers({
  allChanges: function () {
    return Changes.find();
  }
});

Template.changesCommitted.onRendered(function() {
  $('.footable').footable();
});


/*
Template.changesScheduled.helpers({
  scheduledChanges: function () {
    var result = Changes.find({scheduled: true});
    return result;
  }
});

Template.changesApproved.helpers({
  approvedChanges: function () {
    var result = Changes.find({approved: true});
    return result;
  }
});
*/

Template.changesCommitted.events({
  'submit .changeForm': function (event) {
    event.preventDefault();
    var action = event.target.changeAction.value;
    var checkedList = [];
    $('input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].name);
    });
    for (var i = 0; i < checkedList.length; i++) {
      if (action == "backout") {
        Meteor.call("backoutChange",checkedList[i])
      }
    }
  }
});
/*
Template.changesCanceled.events({
  'submit .changeForm': function (event) {
    event.preventDefault();
    var action = event.target.changeAction.value;
    var checkedList = [];
    $('input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].name);
    });
    for (var i = 0; i < checkedList.length; i++) {
      if (action == "uncancel") {
        Meteor.call("uncancelChange", checkedList[i]);
      }
    }
  }
});

Template.changesScheduled.events({
  'submit .changeForm': function (event) {
    event.preventDefault();
    var action = event.target.changeAction.value;
    var checkedList = [];
    $('input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].name);
    });
    for (var i = 0; i < checkedList.length; i++) {
      if (action == "cancel") {
        Meteor.call("cancelChange", checkedList[i]);
      }
      else if (action == "push") {
        Meteor.call("pushChange", checkedList[i]);
      }
      else if (action == "schedule") {
        Meteor.call("scheduleChange", checkedList[i])
      }
      else if (action == "approve") {
        Meteor.call("approveChange", checkedList[i])
      }
      else if (action == "unapprove") {
        Meteor.call("unapproveChange",checkedList[i])
      }
    }
  }
});

Template.changesApproved.events({
  'submit .changeForm': function (event) {
    event.preventDefault();
    var action = event.target.changeAction.value;
    var checkedList = [];
    $('input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].name);
    });
    for (var i = 0; i < checkedList.length; i++) {
      if (action == "cancel") {
        Meteor.call("cancelChange", checkedList[i]);
      }
      else if (action == "push") {
        Meteor.call("pushChange", checkedList[i]);
      }
      else if (action == "schedule") {
        Meteor.call("scheduleChange", checkedList[i])
      }
      else if (action == "approve") {
        Meteor.call("approveChange", checkedList[i])
      }
      else if (action == "unapprove") {
        Meteor.call("unapproveChange",checkedList[i])
      }
    }
  }
});

Template.changeset.helpers({
  changesetList: function () {
    var result = Changeset.find();
    return result;
  }
});

Template.changeset.events({
  'submit .changesetForm': function (event) {
    event.preventDefault();
    Meteor.call("createChangeset");
  }
});

Template.changesetDetails.events({
  'submit .changeUpdate': function (event) {
    event.preventDefault();
    var changeset_id = event.target.changeset_id.value;
    if (event.target.name.value !== '') {
      Meteor.call("updateChangesetName", changeset_id, event.target.name.value);
    }
    if (event.target.description.value !== '') {
      Meteor.call("updateChangesetDescription", changeset_id, event.target.description.value)
    }
  }
});

Template.changesetDetails.helpers({
  changesetDetails: function (id) {
    return Changes.findOne({_id: id});
  }
});

*/
