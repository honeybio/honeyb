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

Template.displayDiagnostics.onCreated(function() {
   this.critical = new ReactiveVar(true);
   this.high = new ReactiveVar(true);
   this.medium = new ReactiveVar(true);
   this.low = new ReactiveVar(true);
});

Template.displayDiagnostics.events({
  'change #critical': function (event, instance) {
    if (instance.critical.get()) {
      instance.critical.set(false);
    } else {
      instance.critical.set(true);
    }
  },
  'change #high': function (event, instance) {
    if (instance.high.get()) {
      instance.high.set(false);
    } else {
      instance.high.set(true);
    }
  },
  'change #medium': function (event, instance) {
    if (instance.medium.get()) {
      instance.medium.set(false);
    } else {
      instance.medium.set(true);
    }
  },
  'change #low': function (event, instance) {
    if (instance.low.get()) {
      instance.low.set(false);
    } else {
      instance.low.set(true);
    }
  }
});

Template.displayDiagnostics.helpers({
  getCrit: function () {
    return Template.instance().critical.get();
  },
  getHigh: function () {
    return Template.instance().high.get();
  },
  getMed: function () {
    return Template.instance().medium.get();
  },
  getLow: function () {
    return Template.instance().low.get();
  },
  getDiagnostics: function (diagnostics) {
    if (diagnostics === undefined | diagnostics === null) {
      return null;
    } else {
      var sortedDiags = [];
      if (Template.instance().critical.get()) {
        for (var i = 0; i < diagnostics.length; i++) {

          if (diagnostics[i].run_data.h_importance == 'CRITICAL') {
            sortedDiags.push(diagnostics[i])
          }
        }
      }
      if (Template.instance().high.get()) {
        for (var i = 0; i < diagnostics.length; i++) {
          if (diagnostics[i].run_data.h_importance == 'HIGH') {
            sortedDiags.push(diagnostics[i])
          }
        }
      }
      if (Template.instance().medium.get()) {
        for (var i = 0; i < diagnostics.length; i++) {
          if (diagnostics[i].run_data.h_importance == 'MEDIUM') {
            sortedDiags.push(diagnostics[i])
          }
        }
      }
      if (Template.instance().low.get()) {
        for (var i = 0; i < diagnostics.length; i++) {
          if (diagnostics[i].run_data.h_importance == 'LOW') {
            sortedDiags.push(diagnostics[i])
          }
        }
      }
      return sortedDiags;
    }
  }
});