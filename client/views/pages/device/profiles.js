Template.ltmProfiles.helpers({
  allProfiles: function () {
    var result = Profiles.find({}, {name: 1});
    return result;
  }
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
