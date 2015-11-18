Template.gtmPMembers.helpers({
  getDest: function (fullPath) {
    var result = Gtmvservers.findOne({serverFullPath: fullPath});
    return result.destination.replace(/:.*/, "");
  },
  ltmVips: function (fullPath) {
    var vip = Gtmvservers.findOne({serverFullPath: fullPath});
    var ipAddr = vip.destination.replace(/:.*/, "");
    var search = ipAddr.replace(/\./g, "\\.")
    // console.log(search);
    var result = Virtuals.find({destination: {$regex:search}});
    // console.log(result);
    return result;
  }
});

Template.vipList.helpers({
  getPool: function (onDeviceId, poolName) {
    var result = Pools.findOne({onDevice: onDeviceId, fullPath: poolName});
    return result;
  }
});

Template.dashboardsAppview.helpers({
  allApplications: function () {
    var result = Wideips.find();
    return result;
    // var appview = Gtmdatacenters.find();
    // for (var i = 0; i < appview.length; i++) {
      // Find servers
    //   var servers = Gtmservers.find();
    //  for (var j = 0; j < servers.length; j++) {
        // Find LTM Virtuals
    //  }
    // }
    /*
    var result = Virtuals.find({}, {name: 1, destination: 1, pool: 1}).fetch();
    for(var i = 0; i < result.length; i++) {
      if (typeof result[i].pool !== 'undefined') {
        // db.db_pools.findOne({fullPath: "/Common/pool_anniknows_80"},{})
        var tmpPool = Pools.findOne({fullPath: result[i].pool}, {});
        if (typeof tmpPool !== 'undefined') {
          // console.log(tmpPool.name);
          result[i].poolName = tmpPool.name;
          result[i].pool_id = tmpPool._id;
        } else {
          result[i].poolName = "none";
          result[i].pool_id = "null";
        }
      } else {
        result[i].poolName = "none";
        result[i].pool_id = "null";
      }
      //tmpPool = Pools.findOne({fullPath: tmp[i].pool});
      //tmp[i].poolName = tmpPool.name;
      //tmp[i].pool_id = tmpPool._id;
    };
    //var tmpPool = Pools.find({fullPath: tmp.pool}, {name: 1, fullPath: 1});
    //console.log("Pool name: " + tmp.name);
    return result; */
  }
});

var gtmDcInterval;
var gtmVserverInterval;

Template.dashboardsAdcthroughput.onRendered(function() {
  // console.log("setting interval");
  // console.log(Meteor);
  // console.log(this.view.template.helpers);

  gtmDcInterval = Meteor.setInterval(function(){
    Meteor.call("updateGtmStatsServer");
  }, 7654);
  gtmVserverInterval = Meteor.setInterval(function(){
    Meteor.call("updateGtmVserverStats");
  }, 25432);
  ltmStatsInterval = Meteor.setInterval(function() {
    Meteor.call("updateLtmStats");
  }, 124321);
  poolMemberStatsInterval = Meteor.setInterval(function() {
    Meteor.call("updateAllPoolMemberStats");
  }, 67654);
  // updateStats();
  // Meteor.call("  updateStats");
  //Meteor.call("updateGtmVserverStats");
});

Template.dashboardsAdcthroughput.onDestroyed(function() {
  console.log('left page');
});

Meteor.methods({
  updateGtmStatsClient: function () {
    Meteor.call("updateGtmStatsServer");
  }
});
Template.dashboardsAdcthroughput.rendered = function(){
  var adcLabels = [];
  var adcData = [];
  // for (i = 0; i < this.data.diskSpace.length; i++) {
  //  diskLabels[i] = this.data.diskspace[i].partition;
  // }
  var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

  var ctx = $("#adcChart").get(0).getContext("2d");
  var adcChart = new Chart(ctx);
  new Chart(ctx).Line(data);
};


Template.dashboardsAdcthroughput.helpers({
  getSyncgroups: function () {
    var result = Gtmsyncgroups.find();
    return result;
  }
});

Template.syncGroupList.helpers({
  getDatacenters: function (syncGroup) {
    var result = Gtmdatacenters.find({inSyncGroup: syncGroup});
    return result;
  }
});

Template.datacenterList.helpers({
  getServers: function (datacenter) {
    var result = Gtmservers.find({datacenter: datacenter});
    return result;
  }
});

Template.serverList.helpers({
  getVservers: function (server) {
    var result = Gtmvservers.find({serverId: server});
    return result;
  }
});

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
