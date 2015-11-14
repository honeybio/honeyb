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
    var timeObj = { text: 1, number: event.target.atTime.value, unit: event.target.unit.value};
    var jobName = device_id + "_once_qkview";
    // if (event.target.atTime.value == 'none') {
    //  timeObj = { text: 0, min: event.target.minute.value, hr: event.target.hour.value, day: event.target.dayOfMonth.value,
    //              month: event.target.month.value, year: event.target.year.value };
    //}
    //else {
      // timeObj = { text: 1...};
    //}
    console.log('starting qkview');
    Meteor.call("createQkviewCommand", device_id);
    // Meteor.call("createAndScheduleQkview", device_id, timeObj);
    // Meteor.call("taskOnce", device_id, jobName, "createQkview", timeObj, description);
    //Meteor.call("createQkview", device_id);
    // console.log(results);
  },
  'submit .archiveForm': function (event) {
    event.preventDefault();
    var device_id = event.target.device_id.value;
    var timeObj = { min: event.target.minute.value, hr: event.target.hour.value, day: event.target.dayOfWeek.value,
      freq: event.target.frequency.value };
    var description = "An archive job";
    var jobName = device_id + "_" + timeObj.freq + "_" + "archive";
    // taskScheduler: function(device_id, jobName, command, schedule, desc, recur) {
    Meteor.call("taskScheduler", device_id, jobName, "schedArch", timeObj, description);
  }
});

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
      mgmtpass: event.target.mgmtpass.value
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
      Meteor.call("discoverAllDevice", device.mgmtip, device.mgmtuser, device.mgmtpass, res);
    });
  },
  "click #form button[id=close]": function (event) {
    Session.set('status', "Ready to Discover");
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
