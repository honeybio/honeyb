Template.sslCerts.helpers({
  certificatesIndex: () => CertificatesIndex,
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
  }
});

Template.sslKeys.helpers({
  certificatesIndex: () => CertificatesIndex,
  allKeys: function () {
    var result = Certificates.find({ssltype: "key"});
    return result;
  },
  isKey: function (type) {
    if (type == 'key') {
      return true;
    } else {
      return false;
    }
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
    console.log(result);
    return result;
  }
});

Template.sslprofileDetails.helpers({
  getCertSubject: function (device_id, path) {
    var result = Certificates.findOne({onDevice: device_id, fullPath: path, });
    return result.commonName;
  }
});
