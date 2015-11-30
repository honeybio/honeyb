Template.gettingStartedWizard.events({
  'click #intro': function (e, t) {
    $('#ssh-settings').hide();
    $('#ihealth-settings').hide();
    $('#authentication-settings').hide();
    $('#archive-settings').hide();
    $('#add-device').hide();
    $('#introduction').show();
  },
  'click #ssh': function (e, t) {
    $('#introduction').hide();
    $('#ihealth-settings').hide();
    $('#authentication-settings').hide();
    $('#archive-settings').hide();
    $('#add-device').hide();
    $('#ssh-settings').show();
  },
  'click #ihealth': function (e, t) {
    $('#introduction').hide();
    $('#ssh-settings').hide();
    $('#authentication-settings').hide();
    $('#archive-settings').hide();
    $('#add-device').hide();
    $('#ihealth-settings').show();
  },
  'click #authentication': function (e, t) {
    $('#introduction').hide();
    $('#ihealth-settings').hide();
    $('#archive-settings').hide();
    $('#add-device').hide();
    $('#ssh-settings').hide();
    $('#authentication-settings').show();
  },
  'click #archive': function (e, t) {
    $('#introduction').hide();
    $('#ihealth-settings').hide();
    $('#authentication-settings').hide();
    $('#add-device').hide();
    $('#ssh-settings').hide();
    $('#archive-settings').show();
  },
  'click #add-devices': function (e, t) {
    $('#introduction').hide();
    $('#ihealth-settings').hide();
    $('#authentication-settings').hide();
    $('#archive-settings').hide();
    $('#ssh-settings').hide();
    $('#add-device').show();
  },
  'click #generate-ssh-key': function (e, t) {
    event.preventDefault();
    var keyName = 'id_rsa';
    Meteor.call("generateSshKey", keyName);
  },
  'submit #settings-wizard-form': function (e, t) {
    event.preventDefault();
  },
  'change #authenticationType': function(event, target) {
    Session.set('auth_type', authenticationType.options[authenticationType.selectedIndex].value);
  }
});

Template.gettingStartedWizard.helpers({
  adAuthSelected: function () {
    if (Session.get('auth_type') == 'activedirectory') {
      return true;
    } else { return false; }
  },
  getAuthSettings: function () {
    return Settings.findOne({type: 'authentication'});
  }
});

Template.jobList.helpers({
  latestJobs: function () {
    var jobs = Jobs.find();
    return jobs;
  }
});

Template.home.helpers({
  getDevices: function () {
    var oneDevice = Devices.findOne();
    if (oneDevice === undefined) {
      return false;
    }
    else {
      return true;
    }
  }
});
Template.homeChart.rendered = function(){
  // Options, data for doughnut chart
  var doughnutData = [
    {
      value: 300,
      color: "#a3e1d4",
      highlight: "#1ab394",
      label: "App"
    },
    {
      value: 50,
      color: "#dedede",
      highlight: "#1ab394",
      label: "Software"
    },
    {
      value: 100,
      color: "#A4CEE8",
      highlight: "#A4CEE8",
      label: "Laptop"
    }
  ];

  var doughnutOptions = {
    segmentShowStroke: true,
    segmentStrokeColor: "#fff",
    segmentStrokeWidth: 2,
    percentageInnerCutout: 45, // This is 0 for Pie charts
    animationSteps: 100,
    animationEasing: "easeOutBounce",
    animateRotate: true,
    animateScale: false
  };

  var ctx = document.getElementById("doughnutChart").getContext("2d");
  var DoughnutChart = new Chart(ctx).Doughnut(doughnutData, doughnutOptions);


  // Options/data for polar chart
  var polarData = [
    {
      value: 300,
      color: "#a3e1d4",
      highlight: "#1ab394",
      label: "App"
    },
    {
      value: 140,
      color: "#dedede",
      highlight: "#1ab394",
      label: "Software"
    },
    {
      value: 200,
      color: "#A4CEE8",
      highlight: "#A4CEE8",
      label: "Laptop"
    }
  ];

  var polarOptions = {
    scaleShowLabelBackdrop: true,
    scaleBackdropColor: "rgba(255,255,255,0.75)",
    scaleBeginAtZero: true,
    scaleBackdropPaddingY: 1,
    scaleBackdropPaddingX: 1,
    scaleShowLine: true,
    segmentShowStroke: true,
    segmentStrokeColor: "#fff",
    segmentStrokeWidth: 2,
    animationSteps: 100,
    animationEasing: "easeOutBounce",
    animateRotate: true,
    animateScale: false
  };
  var ctx = document.getElementById("polarChart").getContext("2d");
  var Polarchart = new Chart(ctx).PolarArea(polarData, polarOptions);

};
