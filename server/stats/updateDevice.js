Meteor.methods({
  getDiskStats: function (device_id) {
    this.unblock();
    var diskStats = Meteor.call("bigipRestGetItems", device_id, "https://localhost/mgmt/tm/cloud/sys/disk-info");
    Devices.update({_id: device_id}, { $set: { diskSpace: diskStats } });
  }
});
