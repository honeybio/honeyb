Template.sslCerts.onRendered(function() {
  $('.footable').footable();
});

Template.sslKeys.onRendered(function() {
  $('.footable').footable();
});

Template.sslProfiles.onRendered(function() {
  $('.footable').footable();
});

Template.sslCerts.helpers({
  allCerts: function () {
    var result = Certificates.find({ssltype: "certificate"});
    return result;
  },
  isCert: function (type) {
    if (type == 'certificate') {
      return true;
    } else {
      return false;
    }
  },
  expiresIn: function () {
    // Calculate the expiration
  },
  getExpirationStatus: function (date) {
    var now = new Date();
    if (date - now.getTime() < 0) {
      return { title: "Expired",  src: "status_diamond_red.png" };
    } else if (date - now.getTime() < 2419200) {
      return { title: "Expires less than 4 weeks", src: "status_circle_yellow.png" };
    } else {
      return { title: "Expires more than 28 days from now", src: "status_circle_green.png" };
    }
  },
  getMs: function (date) {
    console.log(date);
  }
});

Template.sslKeys.helpers({
  allKeys: function () {
    var result = Certificates.find({ssltype: "key"});
    return result;
  },
  expiresIn: function () {
    // Calculate the expiration
  }
});

Template.keyDetails.events({
  "submit form": function (event) {
    event.preventDefault();
    // Get value from form element
    var keyid = event.target.keyid.value;
    var onDevice = event.target.onDevice.value;
    Meteor.call("getKeyPem", onDevice, keyid);
    // console.log(results);
  }
});

Template.sslProfiles.helpers({
  allClientsslProfiles: function () {
    var result = Profiles.find({profType: "client-ssl"});
    return result;
  }
});

Template.sslprofileDetails.helpers({
  getCertSubject: function (device_id, path) {
    var result = Certificates.findOne({onDevice: device_id, fullPath: path, });
    return result.commonName;
  }
});
