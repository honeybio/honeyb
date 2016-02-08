Template.sslDetails.helpers({
  getCerts: function (deviceId) {
    return Certificates.find({onDevice: deviceId, ssltype: 'certificate'});
  },
  getKeys: function (deviceId) {
    return Certificates.find({onDevice: deviceId, ssltype: 'key'});
  },
  getCertCn: function () {
    if (Template.instance().pickedCert.get()) {
      var cert = Certificates.findOne({_id: Template.instance().pickedCert.get()});
      return cert.commonName;
    } else {
      return null;
    }
  },
  getCertExpiration: function () {
    if (Template.instance().pickedCert.get()) {
      var cert = Certificates.findOne({_id: Template.instance().pickedCert.get()});
      return cert.apiRawValues.expiration;
    } else {
      return null;
    }
  }
});

Template.sslDetails.onCreated(function() {
  this.pickedCert = new ReactiveVar();
  this.pickedCert.set(null);
});

Template.sslDetails.events({
  'change #certificate': function (event, template) {
    template.pickedCert.set(certificate.options[certificate.selectedIndex].value);
  }
});

Template.sslProfilesCreate.helpers({
  getCerts: function (deviceId) {
    if (Template.instance().pickedDevice.get()) {
      return Certificates.find({onDevice: Template.instance().pickedDevice.get(), ssltype: 'certificate'});
    } else {
      return null;
    }
  },
  getKeys: function (deviceId) {
    if (Template.instance().pickedDevice.get()) {
      return Certificates.find({onDevice: Template.instance().pickedDevice.get(), ssltype: 'key'});
    } else {
      return null;
    }
  },
  getCertCn: function () {
    if (Template.instance().pickedCert.get()) {
      var cert = Certificates.findOne({_id: Template.instance().pickedCert.get()});
      return cert.commonName;
    } else {
      return null;
    }
  },
  getCertExpiration: function () {
    if (Template.instance().pickedCert.get()) {
      var cert = Certificates.findOne({_id: Template.instance().pickedCert.get()});
      return cert.apiRawValues.expiration;
    } else {
      return null;
    }
  }
});

Template.sslProfilesCreate.onCreated(function() {
  this.pickedCert = new ReactiveVar();
  this.pickedCert.set(null);
  this.pickedDevice = new ReactiveVar();
  this.pickedDevice.set(null);
});

Template.sslProfilesCreate.events({
  'change #certificate': function (event, template) {
    template.pickedCert.set(certificate.options[certificate.selectedIndex].value);
  },
  'change #device': function (event, template) {
    template.pickedDevice.set(device.options[device.selectedIndex].value);
  },
});

Template.profilesDetails.helpers({
  isSupported: function (profType) {
    if (profType == 'tcp'
     || profType == 'client-ssl'
     || profType == 'http'
    ) {
      return true;
    }
  },
  isTcp: function (profType) {
    if (profType == 'tcp') {
      return true;
    }
  },
  isHttp: function (profType) {
    if (profType == 'http') {
      return true;
    }
  },
  isSsl: function (profType) {
    if (profType == 'client-ssl') {
      return true;
    }
  }
});

Template.ltmProfiles.helpers({
  allProfiles: function () {
    var result = Profiles.find();
    return result;
  }
});

Template.ltmProfiles.onRendered(function() {
  $('.footable').footable();
});


Template.ltmProfilesClientssl.helpers({
  allclientssl: function () {
    var result = Profiles.find({profType: "client-ssl"});
    return result;
  }
});

Template.ltmProfilesHttp.helpers({
  allHttp: function () {
    var result = Profiles.find({profType: "http"});
    return result;
  }
});

Template.ltmProfilesTcp.helpers({
  allTcp: function () {
    var result = Profiles.find({profType: "tcp"});
    return result;
  }
});

Template.ltmProfilesOneconnect.helpers({
  allOneconnect: function () {
    var result = Profiles.find({profType: "one-connect"});
    return result;
  }
});

Template.ltmPersistenceCookie.helpers({
  allCookie: function () {
    var result = Persistence.find({profType: "cookie"});
    return result;
  }
});

Template.ltmPersistenceUniversal.helpers({
  allUniversal: function () {
    var result = Persistence.find({profType: "universal"});
    return result;
  }
});
