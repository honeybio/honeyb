Template.applicationsCreate.events({
  "click #appForm button[class=addMore]": function (event) {
    event.preventDefault();
    var inputs = Session.get('inputs');
    var uniqid = Math.floor(Math.random() * 100000);
    inputs.push({uniqid: uniqid});
    Session.set('inputs', inputs);
  },
  "click #appForm button[class=remove-input]": function (event) {
    event.preventDefault();
    var inputs = Session.get('inputs');
    var i = inputs.indexOf(this.uniqid);
    inputs.splice(i, 1);
    console.log(inputs);
    Session.set('inputs', inputs);
    // inputs.pop({uniqid: uniqid});
  },
  "submit #appForm": function (event) {
    event.preventDefault();
    var members = Session.get('inputs');
    var app_name = event.target.applicationName.value;
    var app_type = event.target.appType.value;

  }
});


Template.applicationsCreate.onCreated( function() {
  Session.set('inputs', []);
});

Template.applicationsCreate.helpers({
  inputs: function () {
    return Session.get('inputs');
  }
});
