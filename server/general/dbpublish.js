Meteor.publish("db_virtualaddresses", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Virtualaddresses.find();
  }
});
Meteor.publish("db_settings", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Settings.find();
  }
});
Meteor.publish("db_containers", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Containers.find();
  }
});
Meteor.publish("db_permissions", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Permissions.find();
  }
});
Meteor.publish(null, function() {
  if (this.userId == null) {
    return [];
  }
  else {
    return Meteor.roles.find({});
  }
});
Meteor.publish("db_jobs", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Jobs.find();
  }
});
Meteor.publish("db_changes", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Changes.find();
  }
});
Meteor.publish("db_changeset", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Changeset.find();
  }
});
Meteor.publish("db_devices", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Devices.find({}, {mgmtPass: 0});
  }
});
Meteor.publish("db_certificates", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Certificates.find();
  }
});
Meteor.publish("db_virtuals", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Virtuals.find();
  }
});
Meteor.publish("db_rules", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Rules.find();
  }
});
Meteor.publish("db_pools", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Pools.find();
  }
});
Meteor.publish("db_monitors", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Monitors.find();
  }
});
Meteor.publish("db_gtmsyncgroup", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Gtmsyncgroups.find();
  }
});
Meteor.publish("db_gtmdatacenters", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Gtmdatacenters.find();
  }
});
Meteor.publish("db_gtmservers", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Gtmservers.find();
  }
});
Meteor.publish("db_gtmvservers", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Gtmvservers.find();
  }
});
Meteor.publish("db_gtmlinks", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Gtmlinks.find();
  }
});
Meteor.publish("db_gtmmonitors", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Gtmmonitors.find();
  }
});
Meteor.publish("db_wideips", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Wideips.find();
  }
});
Meteor.publish("db_wpools", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Widepools.find();
  }
});
Meteor.publish("db_idatagroups", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Idatagroups.find();
  }
});
Meteor.publish("db_edatagroups", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Edatagroups.find();
  }
});
Meteor.publish("db_ltmprofiles", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Profiles.find();
  }
});
Meteor.publish("db_ltmpersistence", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Persistence.find();
  }
});
Meteor.publish("db_statistics", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Statistics.find();
  }
});
Meteor.publish("db_ihealth", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Ihealth.find();
  }
});
Meteor.publish("roles", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Rolelist.find();
  }
});
Meteor.publish("db_asmpolicies", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Asmpolicies.find();
  }
});
Meteor.publish("db_archives", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Archives.find();
  }
});


// Publish all users to admins
Meteor.publish("users", function () {
  if (Roles.userIsInRole(this.userId, ['admin'], 'default-group')) {
    return Meteor.users.find();
  } else {
    // Declare that no data is being published. If you leave this line
    // out, Meteor will never consider the subscription ready because
    // it thinks you're using the added/changed/removed interface where
    // you have to explicitly call this.ready().
    return [];
  }
});
