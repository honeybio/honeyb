Meteor.methods({
  getDatacenterStats: function (device_id) {
    this.unblock();
    var stats = Meteor.call("bigipRestGetv2", device_id, "https://localhost/mgmt/tm/gtm/datacenter/stats");
    for (var entry in stats.entries) {
      var datacenterStatObject = { onDevice: device_id, objType: "datacenter", object: entry };
      datacenterStatObject.availabilityState = stats.entries[entry].nestedStats.entries['status.availabilityState'].description;
      datacenterStatObject.enabledState = stats.entries[entry].nestedStats.entries['status.enabledState'].description;
      datacenterStatObject.objFullPath = stats.entries[entry].nestedStats.entries.dcName.description;
      datacenterStatObject.bpsOut = stats.entries[entry].nestedStats.entries['metrics.bitsPerSecOut'].value;
      datacenterStatObject.bpsIn = stats.entries[entry].nestedStats.entries['metrics.bitsPerSecIn'].value;
      datacenterStatObject.connections = stats.entries[entry].nestedStats.entries['metrics.connections'].value;
      datacenterStatObject.packetsOut = stats.entries[entry].nestedStats.entries['metrics.pktsPerSecIn'].value;
      datacenterStatObject.packetsIn = stats.entries[entry].nestedStats.entries['metrics.pktsPerSecOut'].value;
      // Statistics.insert(datacenterStatObject);
      var imgName = Meteor.call("getStatusImage", datacenterStatObject.availabilityState, datacenterStatObject.enabledState);
      var tmpPath = entry.replace(/\/stats/, "\\?ver");
      var dcObject = tmpPath.replace(/\//g, "\\/");
      Gtmdatacenters.update({ onDevice: device_id, selfLink: { $regex:dcObject }}, { $set: {statusImg: imgName, stats: datacenterStatObject} });
      // Virtuals.update()
    }
  },
  getGtmserverStats: function (device_id) {
    this.unblock();
    var stats = Meteor.call("bigipRestGetv2", device_id, "https://localhost/mgmt/tm/gtm/server/stats");
    du = stats.entries['https://localhost/mgmt/tm/gtm/server/~Common~apm.bigipdemo.com/stats'];
    for (var entry in stats.entries) {
      var gtmserverStatObject = { onDevice: device_id, objType: "datacenter", object: entry };
      gtmserverStatObject.availabilityState = stats.entries[entry].nestedStats.entries['status.availabilityState'].description;
      gtmserverStatObject.enabledState = stats.entries[entry].nestedStats.entries['status.enabledState'].description;
      gtmserverStatObject.objFullPath = stats.entries[entry].nestedStats.entries.tmName.description;
      gtmserverStatObject.bpsOut = stats.entries[entry].nestedStats.entries['metrics.bitsPerSecOut'].value;
      gtmserverStatObject.bpsIn = stats.entries[entry].nestedStats.entries['metrics.bitsPerSecIn'].value;
      gtmserverStatObject.connections = stats.entries[entry].nestedStats.entries['metrics.connections'].value;
      gtmserverStatObject.packetsOut = stats.entries[entry].nestedStats.entries['metrics.pktsPerSecIn'].value;
      gtmserverStatObject.packetsIn = stats.entries[entry].nestedStats.entries['metrics.pktsPerSecOut'].value;
      // Statistics.insert(gtmserverStatObject);
      var imgName = Meteor.call("getStatusImage", gtmserverStatObject.availabilityState, gtmserverStatObject.enabledState);
      var tmpPath = entry.replace(/\/stats/, "\\?ver");
      var serverObject = tmpPath.replace(/\//g, "\\/");
      Gtmservers.update({ onDevice: device_id, selfLink: { $regex:serverObject }}, { $set: {statusImg: imgName, stats: gtmserverStatObject} });
      // Virtuals.update()
    }
  },
  getGtmvserverStats: function (device_id, url) {
    this.unblock();
    var stats = Meteor.call("bigipRestGetv2", device_id, url);
    for (var entry in stats.entries) {
      var gtmserverStatObject = { onDevice: device_id, objType: "datacenter", object: entry };
      gtmserverStatObject.availabilityState = stats.entries[entry].nestedStats.entries['status.availabilityState'].description;
      gtmserverStatObject.enabledState = stats.entries[entry].nestedStats.entries['status.enabledState'].description;
      gtmserverStatObject.objFullPath = stats.entries[entry].nestedStats.entries.vsName.description;
      gtmserverStatObject.bpsOut = stats.entries[entry].nestedStats.entries['metrics.bitsPerSecOut'].value;
      gtmserverStatObject.bpsIn = stats.entries[entry].nestedStats.entries['metrics.bitsPerSecIn'].value;
      gtmserverStatObject.connections = stats.entries[entry].nestedStats.entries['metrics.connections'].value;
      gtmserverStatObject.packetsOut = stats.entries[entry].nestedStats.entries['metrics.pktsPerSecIn'].value;
      gtmserverStatObject.packetsIn = stats.entries[entry].nestedStats.entries['metrics.pktsPerSecOut'].value;
      // Statistics.insert(gtmserverStatObject);
      var imgName = Meteor.call("getStatusImage", gtmserverStatObject.availabilityState, gtmserverStatObject.enabledState);
      var tmpPath = entry.replace(/\/stats$/, "");
      var serverObject = tmpPath.replace(/\//g, "\\/");
      Gtmvservers.update({ selfLink: { $regex:serverObject }}, { $set: {statusImg: imgName, stats: gtmserverStatObject} });
      // Virtuals.update()
    }
  },
  updateGtmStatsServer: function () {
    this.unblock();
    var bigip_devices = Devices.find();
    bigip_devices.forEach(function (eachDevice) {
      if (eachDevice.provision_level.gtm != "none"){
        Meteor.call("getDatacenterStats", eachDevice._id);
        Meteor.call("getGtmserverStats", eachDevice._id);
      }
    });
  },
  updateGtmVserverStats: function () {
    this.unblock();
    var vServers = Gtmvservers.find();
    vServers.forEach(function (eachVserver) {
      var tmpUrl = eachVserver.selfLink;
      var url = tmpUrl.replace(/\?ver.*/, "");
      Meteor.call("getGtmvserverStats", eachVserver.stats.onDevice, url);
    });
    return "updated";
  }
});
