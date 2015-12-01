Meteor.methods({
  getDiskStats: function (device_id) {
    this.unblock();
    var diskStats = Meteor.call("bigipRestGetItems", device_id, "https://localhost/mgmt/tm/cloud/sys/disk-info");
    Devices.update({_id: device_id}, { $set: { diskSpace: diskStats } });
  },
  updateAllDeviceStats() {
    this.unblock();
    bigip_devices = Devices.find({restEnabled: true});
    bigip_devices.forEach(function (eachDevice) {
      Meteor.call("updateDeviceStats", eachDevice._id);
    });
  },
  setCurrentCpu(cpuStat, device_id) {
    var curStats = {
      fiveMinAvgIdle: 0,
      fiveMinAvgIowait: 0,
      fiveMinAvgIrq: 0,
      fiveMinAvgSoftirq: 0,
      fiveMinAvgStolen: 0,
      fiveMinAvgSystem: 0,
      fiveMinAvgUser: 0
    };
    var count = 0;
    for (var cpu in cpuStat) {
      curStats.fiveMinAvgIdle    += cpuStat[cpu].fiveMinAvgIdle;
      curStats.fiveMinAvgIowait  += cpuStat[cpu].fiveMinAvgIowait;
      curStats.fiveMinAvgIrq     += cpuStat[cpu].fiveMinAvgIrq;
      curStats.fiveMinAvgSoftirq += cpuStat[cpu].fiveMinAvgSoftirq;
      curStats.fiveMinAvgStolen  += cpuStat[cpu].fiveMinAvgStolen;
      curStats.fiveMinAvgSystem  += cpuStat[cpu].fiveMinAvgSystem;
      curStats.fiveMinAvgUser    += cpuStat[cpu].fiveMinAvgUser;
      count++;
    }
    curStats.fiveMinAvgIdle    /= count;
    curStats.fiveMinAvgIowait  /= count;
    curStats.fiveMinAvgIrq     /= count;
    curStats.fiveMinAvgSoftirq /= count;
    curStats.fiveMinAvgStolen  /= count;
    curStats.fiveMinAvgSystem  /= count;
    curStats.fiveMinAvgUser    /= count;

    Devices.update({_id: device_id}, {$set: {cpuUsage: curStats}});
  },

  getBps(lastStat, curStat) {
    var bpsObj = { };
    for (var object in curStat) {
      if (lastStat === undefined) {
        return null;
      } else {
        bpsObj[object] = { };
        bpsObj[object].bpsIn = Math.round((curStat[object].bitsIn - lastStat[object].bitsIn) / 300);
        bpsObj[object].bpsOut = Math.round((curStat[object].bitsOut - lastStat[object].bitsOut) / 300);
        bpsObj[object].ppsIn = Math.round((curStat[object].pktsIn - lastStat[object].pktsIn) / 300);
        bpsObj[object].ppsOut = Math.round((curStat[object].pktsOut - lastStat[object].pktsOut) / 300);
      }
    }
    return bpsObj;
  },
  updateDeviceStats(device_id) {
    var today = new Date();
    var minute = today.getHours() * 60 + today.getMinutes();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var cpuStat = Meteor.call("getCpuStats", device_id);
    Meteor.call("setCurrentCpu", cpuStat, device_id);

    var stat = Statistics.findOne({timestamp_day: today, device: device_id, type: 'cpu'})
    if (stat === undefined) {
      var statObj = {};
      statObj[minute] = cpuStat;
      stat = Statistics.insert({timestamp_day: today, device: device_id, type: 'cpu', values: statObj});
    } else {
       var logMe = Statistics.update({_id: stat._id}, { $set: { [`values.${minute}`]: cpuStat }});
    }
    var last = Math.floor(minute /5) * 5 - 5;
    var my = "values." + last.toString();
    var interfaceStat = Meteor.call("getInterfaceStats", device_id);
    var stat = Statistics.findOne({timestamp_day: today, device: device_id, type: 'interface'}, {fields: {[`${my}`]: 1}});
    if (stat === undefined) {
      var statObj = {};
      statObj[minute] = interfaceStat;
      stat = Statistics.insert({timestamp_day: today, device: device_id, type: 'interface', values: statObj});
    } else {
      if (stat === undefined) {
        Statistics.update({_id: stat._id}, { $set: { [`values.${minute}`]: interfaceStat }});
      } else {
        var bps = Meteor.call("getBps", stat.values[last], interfaceStat);
        interfaceStat.throughput = bps;
        Statistics.update({_id: stat._id}, { $set: { [`values.${minute}`]: interfaceStat }});
      }
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
