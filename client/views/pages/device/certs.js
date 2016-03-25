Template.sslCerts.onRendered(function() {
  $('.footable').footable();
});

Template.sslMasterCerts.onRendered(function() {
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
    var timeLeft = date - now.getTime();
    if (date - now.getTime() < 0) {
      return { title: "Expired",  src: "status_diamond_red.png" };
    } else if (date - now.getTime() < 2419200000) {
      return { title: "Expires less than 28 days from now", src: "status_circle_yellow.png" };
    } else {
      return { title: "Expires more than 28 days from now", src: "status_circle_green.png" };
    }
  }
});

Template.sslMasterCerts.helpers({
  allCerts: function () {
    return Pkifiles.find({type: "certificate"});
  },
  getExpirationStatus: function (date) {
    var now = new Date();
    var timeLeft = date - now.getTime();
    if (date - now.getTime() < 0) {
      return { title: "Expired",  src: "status_diamond_red.png" };
    } else if (date - now.getTime() < 2419200000) {
      return { title: "Expires less than 28 days from now", src: "status_circle_yellow.png" };
    } else {
      return { title: "Expires more than 28 days from now", src: "status_circle_green.png" };
    }
  },
  hasKey: function (mod) {
    var match = Pkifiles.findOne({type: 'key', modulus: mod});
    if (match === undefined) {
      return 'False';
    } else {
      return 'True';
    }
  }
});

Template.sslMasterCerts.events({
  'click #Delete': function (event, template) {
    event.preventDefault();
  },
  'click #Sync': function (event, template) {
    event.preventDefault();
    Meteor.call('syncAllPki', function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  },
  'click #Pull': function (event, template) {
    event.preventDefault();
    Meteor.call('pullAllPki', function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  },
  'click #Push': function (event, template) {
    event.preventDefault();
    Meteor.call('pushAllPki', function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  },
});

Template.sslKeys.helpers({
  allKeys: function () {
    return Certificates.find({ssltype: "key"});
  },
  expiresIn: function () {
    // Calculate the expiration
  }
});
Template.sslMasterCertsImport.events({
  'submit form': function (event) {
    event.preventDefault();
    var pem = event.target.certPem.value;
    Meteor.call('insertMasterCert', pem, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  }
});

Template.sslMasterKeysImport.events({
  'submit form': function (event) {
    event.preventDefault();
    var pem = event.target.pem.value;
    Meteor.call('insertMasterKey', pem, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
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
