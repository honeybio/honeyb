Meteor.methods({
  addTcpHalfOpenMonitor: function(device_id, monObj, stage) {
    /**
    * Method that creates a tcp half open monitor
    *
    * @method adTcpHalfOpenMonitor
    * @param {string} The id of the device this is going to add on
    * @param {string} The name of the new monitor
    * @param {string} The destination
    * @param {string} The interval of the monitor
    * @param {string} The manual resume value
    * @param {string} The time until up
    * @param {string} The timeout
    * @param {string} The transparent value
    * @param {string} the UpInterval value
    * @param {string} 1 if sbeing staged, 0 if pushed immediately
    * @return {boolean} returns true if success
    */
    var device = Devices.findOne({_id: device_id});
    var methodName = {
      action: "create",
      module: "ltm",
      object: "monitor"
    };
    var argList = {
      device_id: device_id,
      type: "tcp-half-open"
    };
    for (var attrname in monObj) {
      argList[attrname] = monObj[attrname];
    }
    var theChange = { description: "Add Monitor " + monObj.name + " on device: " + device.self.name,
      theMethod: methodName,
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    if (result === 401) {
      throw new Meteor.Error(401, 'Error 401', 'Unauthorized');
    } else {
      return 200;
    }
  },
  addHttpMonitor: function(device_id, monObj, stage) {
    /**
    * Method that creates a tcp half open monitor
    *
    * @method adTcpHalfOpenMonitor
    * @param {string} The id of the device this is going to add on
    * @param {string} The name of the new monitor
    * @param {string} The destination
    * @param {string} The interval of the monitor
    * @param {string} The manual resume value
    * @param {string} The time until up
    * @param {string} The timeout
    * @param {string} The transparent value
    * @param {string} the UpInterval value
    * @param {string} 1 if sbeing staged, 0 if pushed immediately
    * @return {boolean} returns true if success
    */
    var device = Devices.findOne({_id: device_id});
    var argList = { device_id: device_id, type: "http" };
    for (var attrname in monObj) {
      argList[attrname] = monObj[attrname];
    }
    var theChange = { description: "Add Monitor " + monObj.name + " on device: " + device.self.name,
      theMethod: {
        action: "create",
        module: "ltm",
        object: "monitor"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    return result;
  },
  addHttpsMonitor: function(device_id, monObj, stage) {
    /**
    * Method that creates a tcp half open monitor
    *
    * @method adTcpHalfOpenMonitor
    * @param {string} The id of the device this is going to add on
    * @param {string} The name of the new monitor
    * @param {string} The destination
    * @param {string} The interval of the monitor
    * @param {string} The manual resume value
    * @param {string} The time until up
    * @param {string} The timeout
    * @param {string} The transparent value
    * @param {string} the UpInterval value
    * @param {string} 1 if sbeing staged, 0 if pushed immediately
    * @return {boolean} returns true if success
    */
    var device = Devices.findOne({_id: device_id});
    var argList = {
      device_id: device_id,
      type: "https"
    };
    for (var attrname in monObj) {
      argList[attrname] = monObj[attrname];
    }
    var theChange = { description: "Add Monitor " + name + " on device: " + device.self.name,
      theMethod: {
        action: "create",
        module: "ltm",
        object: "monitor"
      },
      argList: argList
    };
    var change_id = Meteor.call('createStagedChange', theChange);
    if (stage == "1") {
      return;
    }
    var result = Meteor.call('pushChange', change_id);
    return result;
  }
});
