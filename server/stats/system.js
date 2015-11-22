Meteor.methods({
  getDiskStats: function (device_id) {
    this.unblock();
    var diskStats = Meteor.call("bigipRestGetItems", device_id, "https://localhost/mgmt/tm/cloud/sys/disk-info");
    Devices.update({_id: device_id}, { $set: { diskSpace: diskStats } });
  },
  updateAllDeviceStats() {
    this.unblock();
    bigip_devices = Devices.find();
    bigip_devices.forEach(function (eachDevice) {
      Meteor.call("updateDeviceStats", eachDevice._id);
    });
  },
  updateDeviceStats(device_id) {
    var today = new Date();
    var minute = today.getHours() * 60 + today.getMinutes();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var cpuStat = Meteor.call("getCpuStats", device_id);
    var stat = Statistics.findOne({timestamp_day: today, device: device_id, type: 'cpu'})
    if (stat === undefined) {
      var statObj = {};
      statObj[minute] = cpuStat;
      stat = Statistics.insert({timestamp_day: today, device: device_id, type: 'cpu', values: statObj});
    } else {
       var logMe = Statistics.update({_id: stat._id}, { $set: { [`values.${minute}`]: cpuStat }});
    }
    var interfaceStat = Meteor.call("getInterfaceStats", device_id);
    var stat = Statistics.findOne({timestamp_day: today, device: device_id, type: 'interface'})
    if (stat === undefined) {
      var statObj = {};
      statObj[minute] = interfaceStat;
      stat = Statistics.insert({timestamp_day: today, device: device_id, type: 'interface', values: statObj});
    } else {
      Statistics.update({_id: stat._id}, { $set: { [`values.${minute}`]: interfaceStat }});
    }
  },
  getCpuStats: function (device_id) {
    this.unblock();
    var cpuStatObject = { };
    var cpuStats = Meteor.call("bigipRestGetv2", device_id, "https://localhost/mgmt/tm/sys/cpu/stats");
    for (var chassis in cpuStats.entries) {
      for (var blade in cpuStats.entries[chassis].nestedStats.entries) {
        if (blade == 'hostId') {
          // pass
        } else {
          for (var cpu in cpuStats.entries[chassis].nestedStats.entries[blade].nestedStats.entries) {
            for (var entries in cpuStats.entries[chassis].nestedStats.entries[blade].nestedStats.entries[cpu].nestedStats) {
              var cpuId = cpuStats.entries[chassis].nestedStats.entries[blade].nestedStats.entries[cpu].nestedStats.entries.cpuId.value;
              cpuStatObject[cpuId] = {
                fiveMinAvgIdle: cpuStats.entries[chassis].nestedStats.entries[blade].nestedStats.entries[cpu].nestedStats.entries.fiveMinAvgIdle.value,
                fiveMinAvgIowait: cpuStats.entries[chassis].nestedStats.entries[blade].nestedStats.entries[cpu].nestedStats.entries.fiveMinAvgIowait.value,
                fiveMinAvgIrq: cpuStats.entries[chassis].nestedStats.entries[blade].nestedStats.entries[cpu].nestedStats.entries.fiveMinAvgIrq.value,
                fiveMinAvgSoftirq: cpuStats.entries[chassis].nestedStats.entries[blade].nestedStats.entries[cpu].nestedStats.entries.fiveMinAvgSoftirq.value,
                fiveMinAvgStolen: cpuStats.entries[chassis].nestedStats.entries[blade].nestedStats.entries[cpu].nestedStats.entries.fiveMinAvgStolen.value,
                fiveMinAvgSystem: cpuStats.entries[chassis].nestedStats.entries[blade].nestedStats.entries[cpu].nestedStats.entries.fiveMinAvgSystem.value,
                fiveMinAvgUser: cpuStats.entries[chassis].nestedStats.entries[blade].nestedStats.entries[cpu].nestedStats.entries.fiveMinAvgUser.value
              }
            }
          }
        }
      }
    }
    return cpuStatObject;
  },
  getInterfaceStats: function (device_id) {
    this.unblock();
    var interfaceStatObject = { };
    var interfaceStats = Meteor.call("bigipRestGetv2", device_id, "https://localhost/mgmt/tm/net/interface/stats");
    for (var interfaces in interfaceStats.entries) {
      for (var stats in interfaceStats.entries[interfaces].nestedStats.entries) {
        var myInt = interfaceStats.entries[interfaces].nestedStats.entries.tmName.description;
        var myInterface = myInt.replace(/\./, "-dot-");
        interfaceStatObject[myInterface] = {
          status: interfaceStats.entries[interfaces].nestedStats.entries.status.description,
          bitsIn: interfaceStats.entries[interfaces].nestedStats.entries["counters.bitsIn"].value,
          bitsOut: interfaceStats.entries[interfaces].nestedStats.entries["counters.bitsOut"].value,
          dropsAll: interfaceStats.entries[interfaces].nestedStats.entries["counters.dropsAll"].value,
          errorsAll: interfaceStats.entries[interfaces].nestedStats.entries["counters.errorsAll"].value,
          pktsIn: interfaceStats.entries[interfaces].nestedStats.entries["counters.pktsIn"].value,
          pktsOut: interfaceStats.entries[interfaces].nestedStats.entries["counters.pktsOut"].value,
        }
      }
    }
    return interfaceStatObject;
  }
});