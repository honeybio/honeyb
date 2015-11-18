Template.dashboardsIhealth.onCreated(function() {
   this.buttonStateDisabled = new ReactiveVar(false);
   this.buttonName = new ReactiveVar('Refresh iHealth');
});

Template.dashboardsIhealth.events({
  'click .ihealth': function (event, instance) {
    event.preventDefault();
    instance.buttonName.set('Refreshing...');
    instance.buttonStateDisabled.set(true);
    setTimeout(function() {
      instance.buttonStateDisabled.set(false);
      instance.buttonName.set('Refresh iHealth');
      }, 20000);
    toastr.success('Updating iHealth in the background','Data will automatically update!')
    Meteor.call("ihealthUpdateData");
  }
});

Template.dashboardsIhealth.helpers({
  getIhealth: function () {
    var result = Ihealth.find({ hidden: false });
    return result;
  },
  buttonStateDisabled: function() {
    return Template.instance().buttonStateDisabled.get();
  },
  getButtonName: function () {
    return Template.instance().buttonName.get();
  }
});
