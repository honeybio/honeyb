if (Meteor.settings.kadira) {
  var kadiraApi = {
    appId: Meteor.settings.kadira.appId,
    appSecret: Meteor.settings.kadira.appSecret
  }
  Kadira.connect(kadiraApi.appId, kadiraApi.appSecret);
}

Meteor.methods({
  updateKadira: function (kadira) {
    // check if admin
    Settings.update(
      {type: 'kadira'},
      {$set: {
        kadira: true,
        kadiraSettings: {
          appId: kadira.appId,
          appSecret: kadira.appSecret
        }
      }
    });
    Meteor.settings.kadira = { };
    Meteor.settings.kadira.appId = kadira.ldapDomain;
    Meteor.settings.kadira.appSecret = kadira.ldapDomain;
  }
});
