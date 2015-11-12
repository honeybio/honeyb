Meteor.methods({
  restGet: function (ip, user, pass, url) {
    this.unblock();
    var requrl = "https://" + ip + "/mgmt/tm" + url;
    var authString = user + ":" + pass;
    try {
      var result = HTTP.get(requrl, {auth: authString}).data;
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  datacenterUpdate: function() {
  },
  bigipRestGetv2: function (onDevice, lurl) {
    var device = Devices.findOne({_id: onDevice});
    var ip = device.mgmtAddress;
    var user = device.mgmtUser;
    var pass = device.mgmtPass;
    var url = lurl.replace(/localhost/, ip);
    var authString = user + ":" + pass;
    try {
      var response = HTTP.get(url, {auth: authString}).data;
      return response;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  bigipRestPost: function (onDevice, lurl, postData) {
    var device = Devices.findOne({_id: onDevice});
    var ip = device.mgmtAddress;
    var user = device.mgmtUser;
    var pass = device.mgmtPass;
    var url = lurl.replace(/localhost/, ip);
    var authString = user + ":" + pass;
    try {
      var response = HTTP.post(url, {auth: authString, data: postData});
      return response;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  bigipRestPut: function (onDevice, lurl, putData) {
    var device = Devices.findOne({_id: onDevice});
    var ip = device.mgmtAddress;
    var user = device.mgmtUser;
    var pass = device.mgmtPass;
    var url = lurl.replace(/localhost/, ip);
    var authString = user + ":" + pass;
    try {
      var response = HTTP.put(url, {auth: authString, data: putData});
      return response;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  bigipRestDelete: function (onDevice, lurl) {
    var device = Devices.findOne({_id: onDevice});
    var ip = device.mgmtAddress;
    var user = device.mgmtUser;
    var pass = device.mgmtPass;
    var url = lurl.replace(/localhost/, ip);
    var authString = user + ":" + pass;
    try {
      var response = HTTP.del(url, {auth: authString});
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  bigipRestGet: function (ip, user, pass, url) {
    // console.log("deprecated rest get bigipRestGet");
    this.unblock();
    var requrl = "https://" + ip + "/mgmt/tm" + url;
    var authString = user + ":" + pass;
    try {
      var result = HTTP.get(requrl, {auth: authString}).data.items;
      if (typeof result !== 'undefined') {
        return result;
      }
      else {
        return [];
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  bigipRestGetItems: function (onDevice, lurl) {
    this.unblock();
    var device = Devices.findOne({_id: onDevice});
    var ip = device.mgmtAddress;
    var user = device.mgmtUser;
    var pass = device.mgmtPass;
    var url = lurl.replace(/localhost/, ip);
    var authString = user + ":" + pass;
    try {
      var result = HTTP.get(url, {auth: authString}).data.items;
      if (typeof result !== 'undefined') {
        return result;
      }
      else {
        return [];
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  }
});
