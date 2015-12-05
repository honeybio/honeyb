
Template.dashboardsDeviceHealth.helpers({
  getDevices: function () {
    return Devices.find();
  },
  getUsage: function (idle) {
    return 100 - idle;
  },
  getColor: function (idle) {
    if (idle > 75) {
      return "navy-bg";
    } else if (idle > 60) {
      return "lazur-bg";
    } else if (idle > 50) {
      return "yellow-bg"
    } else {
      return "red-bg"
    }
  },
  getIhealth: function (hostname) {
    var ihealthReport = Ihealth.findOne({'system_information.hostname': hostname});
    if (ihealthReport === undefined) {
      return;
    } else {
      return ihealthReport.diagnostics.hit_count;
    }
  },
  getiHealthColor: function (hostname) {
    var ihealthReport = Ihealth.findOne({'system_information.hostname': hostname});
    if (ihealthReport.diagnostics.hit_count < 10) {
      return "navy-bg";
    } else if (ihealthReport.diagnostics.hit_count < 30) {
      return "lazur-bg";
    } else if (ihealthReport.diagnostics.hit_count < 45) {
      return "yellow-bg"
    } else {
      return "red-bg"
    }
  },
  logme: function (object) {
    console.log(object);
  }
});

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
/*
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
  */
  // updateStats();
  // Meteor.call("  updateStats");
  //Meteor.call("updateGtmVserverStats");
});

Template.dashboardsAdcthroughput.onDestroyed(function() {
  // console.log('left page');
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

Template.dashboardsMap.helpers({
  getDevices: function () {
    return Devices.find();
  }
});


var mapInterval;


Template.eachMap.onDestroyed(function(){
  console.log('on destroyed dashboards.js line 220');
  console.log(mapInterval);
  Meteor.clearInterval(mapInterval);
});

Template.eachMap.onRendered(function(){
  var mapMarkers = [];
  var thisMap;
  var deviceId = this.data._id;
  Meteor.call("getMarkers", deviceId, function (err, res) {
    if (err) {
      console.log(err);
    } else if (res) {
      $('#world-map-' + res.device).vectorMap({
          map: 'world_mill_en',
          backgroundColor: "transparent",
          regionStyle: {
              initial: {
                  fill: '#e4e4e4',
                  "fill-opacity": 1,
                  stroke: 'none',
                  "stroke-width": 0,
                  "stroke-opacity": 0
              }
          },
          series: {
              regions: [{
                  scale: ["#1ab394", "#22d6b1"],
                  normalizeFunction: 'polynomial'
              }]
          },
          markerStyle: {
            initial: {
              fill: '#F8E23B',
              stroke: '#383f47'
            }
          },
          markers: res.data,
      });
    }
  });
  mapInterval = Meteor.setInterval(function() {
    Meteor.call("getMarkers", deviceId, function (err, res) {
      if (err) {
        console.log(err);
      } else if (res) {
        console.log(res.data);
        $('#world-map-' + res.device).vectorMap('get', 'mapObject').addMarkers(res.data);
      }
    });
  }, 15000);
  console.log(mapInterval);
  console.log('on created dashboards.js line 272');
});
