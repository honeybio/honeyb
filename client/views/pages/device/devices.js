Template.devicesArchives.helpers({
  getArchives: function () {
    return Archives.find();
  },
  round: function (size) {
    return (size/1048576).toFixed(2) + ' MB';
  }
});

Template.deviceList.events({
  'click button': function () {
    bootbox.dialog({
      message: "Version: " + this.self.version + " Build: " + this.self.build + "<br>Hostname: " + this.self.name
      + "<br>Open in Browser: <a href=https:///>https://" + this.self.mgmtAddress + "/</a>",
      title: this.self.name,
      buttons: {
        success: {
          label: "OK",
          className: "btn-success",
        },
        danger: {
          label: "Cancel",
          className: "btn-danger",
        },
      }
    });
  }
});

Template.devicesArchives.events({
  'click #archiveAll': function () {
    event.preventDefault();
    Meteor.call("archiveAllTask");
  }
});

Template.devices.helpers({
  deviceGeneral: function () {
    return Devices.find({}, {fields: {mgmtAddress: 1, self: 1}});
  }
});

Template.deviceDetails.rendered=function() {
    $('#my-datepicker').datepicker();
}

Template.deviceDetails.events({
  'submit .qkviewForm': function (event) {
    event.preventDefault();
    // Get value from form element
    var description = "A QKview job";
    var device_id = event.target.device_id.value;
    // var caseNumber = event.target.caseNumber.value;
    // var timeObj = { text: 1, number: event.target.atTime.value, unit: event.target.unit.value};
    var jobName = device_id + "_once_qkview";
    console.log('starting qkview');
    Meteor.call("createQkviewCommand", device_id);
  },
  'submit .archiveForm': function (event) {
    event.preventDefault();
    var device_id = event.target.device_id.value;
    var description = "An archive job";
    var jobName = device_id + "_" + "archive";
    Meteor.call("createUCSCommand", device_id);
  },
  'submit #stats-form': function (event) {
    event.preventDefault();
    var device_id = event.target.device_id.value;
    Meteor.call("updateStatClick", device_id);
  }
});

Template.deviceNetworkChart.rendered = function() {
  var self = this;
  self.autorun(function () {
    self.subscribe("db_statistics", function(){
      Tracker.autorun(function(){
        var myLabel = [];
        var mgmtDataIn = [];
        var mgmtDataOut = [];
        var oneDotOneIn = [];
        var oneDotOneOut = [];
        var today = new Date();
        var curMin = Math.floor((today.getHours() * 60 + today.getMinutes()) / 5) * 5;
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        var stats = Statistics.findOne({device: self.data._id, timestamp_day: today, type: 'interface'});
        for (var i = 0; i < 36; i++) {
          // var labelDate = new Date((now.getHours() * 60 + now.getMinutes()) - ((36 - i) * 5) );
          // var minutes = Math.floor((now.getHours() * 60 + now.getMinutes()) / 5) * 5 - ((36 - i) * 5);
          var minutes = curMin - ((36 - i) * 5);
          if (stats.values[minutes] !== undefined) {
            if (stats.values[minutes].throughput === undefined || stats.values[minutes].throughput === null) {
              today.setHours(0);
              today.setMinutes(0);
              today.setMinutes(minutes);
              tFormat = today.getHours() + ":" + (today.getMinutes()<10?'0':'') + today.getMinutes();
              myLabel.push(tFormat);
              mgmtDataIn.push('0');
              mgmtDataOut.push('0');
              oneDotOneIn.push('0');
              oneDotOneOut.push('0');
            } else {
              today.setHours(0);
              today.setMinutes(0);
              today.setMinutes(minutes);
              tFormat = today.getHours() + ":" + (today.getMinutes()<10?'0':'') + today.getMinutes();
              myLabel.push(tFormat);
              mgmtDataIn.push(stats.values[minutes].throughput.mgmt.bpsIn);
              mgmtDataOut.push(stats.values[minutes].throughput.mgmt.bpsOut);
              oneDotOneIn.push(stats.values[minutes].throughput['1-dot-1'].bpsIn);
              oneDotOneOut.push(stats.values[minutes].throughput['1-dot-1'].bpsOut);
            }
          }
        }
        // chart data
        var lineData = {
          labels: myLabel,
          datasets: [
            {
              label: "1.1 Port Bits Per Second In",
              fillColor: "rgba(220,220,220,0.5)",
              strokeColor: "rgba(220,220,220,1)",
              pointColor: "rgba(220,220,220,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: oneDotOneIn
            },
            {
              label: "1.1 Port Bits per Second Out",
              fillColor: "rgba(26,179,148,0.5)",
              strokeColor: "rgba(26,179,148,0.7)",
              pointColor: "rgba(26,179,148,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(26,179,148,1)",
              data: oneDotOneOut
            }
          ]
        };

        var lineOptions = {
            scaleShowGridLines: true,
            scaleShowLabels: true,
            scaleGridLineColor: "rgba(0,0,0,.05)",
            scaleGridLineWidth: 1,
            bezierCurve: true,
            bezierCurveTension: 0.4,
            pointDot: true,
            pointDotRadius: 4,
            pointDotStrokeWidth: 1,
            pointHitDetectionRadius: 20,
            datasetStroke: true,
            datasetStrokeWidth: 2,
            datasetFill: true,
            responsive: true,
        };
        var ctx = document.getElementById("lineChart").getContext("2d");
        var myNewChart = new Chart(ctx).Line(lineData, lineOptions);
      });
    });
  });
}

Template.deviceDetails.rendered = function() {
  var donutData = [
    {
      value: this.data.cpuUsage.fiveMinAvgIdle,
      color: "#a3e1d4",
      highlight: "#1ab394",
      label: "Idle"
    },
    {
      value: this.data.cpuUsage.fiveMinAvgIowait,
      color: "#dedede",
      highlight: "#1ab394",
      label: "Disk Wait Time"
    },
    {
      value: this.data.cpuUsage.fiveMinAvgSystem,
      color: "#b5b8cf",
      highlight: "#1ab394",
      label: "System Processes"
    },
    {
      value: this.data.cpuUsage.fiveMinAvgUser,
      color: "#b5b8cf",
      highlight: "#1ab394",
      label: "User Processes"
    }
  ];
  var donutOptions = {
    segmentShowStroke: true,
    segmentStrokeColor: "#fff",
    segmentStrokeWidth: 2,
    percentageInnerCutout: 45, // This is 0 for Pie charts
    animationSteps: 100,
    animationEasing: "easeOutBounce",
    animateRotate: true,
    animateScale: false,
    responsive: true,
  };
  var ctx = document.getElementById("donutChart").getContext("2d");
  var myNewChart = new Chart(ctx).Doughnut(donutData, donutOptions);
};

Template.deviceDetails.helpers({
  getJobs: function (device_id) {
    var results = Jobs.find({onDevice: device_id});
    return results;
  }
});

Template.jobStatus.helpers({
  getJob: function (jobId) {
    var job = Jobs.findOne({_id: jobId});
    return job;
  }
})

Template.discoverSingle.onCreated( function() {
  this.discoverJob = new ReactiveVar();
  this.discoverJob.set(null);
});

Template.discoverSingle.helpers({
  getJobId: function () {
    return Template.instance().discoverJob.get();
  }
});

Template.discoverSingle.events({
  "submit form": function (event, template) {
    event.preventDefault();
    // Get value from form element
    var device = {
      mgmtip: event.target.mgmtip.value,
      mgmtuser: event.target.mgmtuser.value,
      mgmtpass: event.target.mgmtpass.value,
      sshuser: event.target.sshuser.value,
      sshpass: event.target.sshpass.value
    };
    var job = {
      name: 'discoverDevice',
      status: 'ready',
      progress: 0
    };
    Meteor.call("newJob", job, function(err, res) {
      // console.log(res);
      this.unblock;
      template.discoverJob.set(res);
      Meteor.call("discoverAllDevice", device, res);
    });
  },
  "click #close": function (event, template) {
    template.find("form").reset();
  }
});

Template.diskUsage.rendered = function(diskSpace){
  var diskLabels = [];
  var diskData = [];
  for (i = 0; i < this.data.length; i++) {
    diskLabels[i] = this.data[i].partition;
    var diskUsage = Math.round(((this.data[i].totalBlocks - this.data[i].freeBlocks) / this.data[i].totalBlocks) * 100);
    diskData[i] = diskUsage;
  }
  // for (i = 0; i < this.data.diskSpace.length; i++) {
  //  diskLabels[i] = this.data.diskspace[i].partition;
  // }
  var data = {
    labels: diskLabels,
    datasets: [
        {
            label: "Disk Usage",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: diskData
        }
    ]
  };

  var ctx = $("#diskChart").get(0).getContext("2d");
  var diskChart = new Chart(ctx);
  new Chart(ctx).Bar(data);
};


Template.diskUsage.helpers({
  calcDisk: function (partition) {
    return Session.get("status");
  }
});

Template.d3vis.created = function () {
  // Defer to make sure we manipulate DOM
  _.defer(function () {
    // Use this as a global variable
    window.d3vis = {}
    Deps.autorun(function () {

      // On first run, set up the visualiation
      if (Deps.currentComputation.firstRun) {
        window.d3vis.margin = {top: 15, right: 5, bottom: 5, left: 5},
          window.d3vis.width = 600 - window.d3vis.margin.left - window.d3vis.margin.right,
          window.d3vis.height = 120 - window.d3vis.margin.top - window.d3vis.margin.bottom;

          window.d3vis.x = d3.scale.ordinal()
              .rangeRoundBands([0, window.d3vis.width], .1);

          window.d3vis.y = d3.scale.linear()
              .range([window.d3vis.height-2, 0]);

          window.d3vis.color = d3.scale.category10();

          window.d3vis.svg = d3.select('#d3vis')
              .attr("width", window.d3vis.width + window.d3vis.margin.left + window.d3vis.margin.right)
              .attr("height", window.d3vis.height + window.d3vis.margin.top + window.d3vis.margin.bottom)
            .append("g")
              .attr("class", "wrapper")
              .attr("transform", "translate(" + window.d3vis.margin.left + "," + window.d3vis.margin.top + ")");
        }
    });
  });
}
