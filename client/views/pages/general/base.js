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


  // Options/data for flot chart
  var data1 = [
    [0,4],[1,8],[2,5],[3,10],[4,4],[5,16],[6,5],[7,11],[8,6],[9,11],[10,30],[11,10],[12,13],[13,4],[14,3],[15,3],[16,6]
  ];
  var data2 = [
    [0,1],[1,0],[2,2],[3,0],[4,1],[5,3],[6,1],[7,5],[8,2],[9,3],[10,2],[11,1],[12,0],[13,2],[14,8],[15,0],[16,0]
  ];

  $("#flot-dashboard-chart").length && $.plot($("#flot-dashboard-chart"), [
      data1, data2
    ],
    {
      series: {
        lines: {
          show: false,
          fill: true
        },
        splines: {
          show: true,
          tension: 0.4,
          lineWidth: 1,
          fill: 0.4
        },
        points: {
          radius: 0,
          show: true
        },
        shadowSize: 2
      },
      grid: {
        hoverable: true,
        clickable: true,
        tickColor: "#d5d5d5",
        borderWidth: 1,
        color: '#d5d5d5'
      },
      colors: ["#1ab394", "#1C84C6"],
      xaxis:{
      },
      yaxis: {
        ticks: 4
      },
      tooltip: false
    }
  );

  // Options and data for sparkline charts
  $("#sparkline8").sparkline([5, 6, 7, 2, 0, 4, 2, 4, 5, 7, 2, 4, 12, 14, 4, 2, 14, 12, 7], {
    type: 'bar',
    barWidth: 8,
    height: '150px',
    barColor: '#1ab394',
    negBarColor: '#c6c6c6'}
  );

  $(".bar_dashboard").peity("bar", {
    fill: ["#1ab394", "#d7d7d7"],
    width:100
  });

  var updatingChart = $(".updating-chart").peity("line", { fill: '#1ab394',stroke:'#169c81', width: 64 })

  setInterval(function() {
    var random = Math.round(Math.random() * 10)
    var values = updatingChart.text().split(",")
    values.shift()
    values.push(random)

    updatingChart
      .text(values.join(","))
      .change()
  }, 1000);
};
