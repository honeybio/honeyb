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
    return Certificates.find({ssltype: "certificate"});
  },
  isCert: function (type) {
    if (type == 'certificate') {
      return true;
    } else {
      return false;
    }
  },
  getExpirationStatus: function (date) {
    var now = new Date();
    if (date - now.getTime() < 0) {
      return { title: "Expired",  src: "status_diamond_red.png" };
    } else if (date - now.getTime() < 2419200) {
      return { title: "Expires less than 28 days from now", src: "status_circle_yellow.png" };
    } else {
      return { title: "Expires more than 28 days from now", src: "status_circle_green.png" };
    }
  }
});

Template.sslKeys.helpers({
  allKeys: function () {
    return Certificates.find({ssltype: "key"});
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
    return Profiles.find({profType: "client-ssl"});
  }
});

Template.sslprofileDetails.helpers({
  getCertSubject: function (device_id, path) {
    return Certificates.findOne({onDevice: device_id, fullPath: path});
  }
});
