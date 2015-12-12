Meteor.publish("db_settings", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    // if Admin user, publish
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
    return Changes.find({}, {fields: {'change.argList': 0}});
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

// Device Level stuff
Meteor.publish("db_devices", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    // if read access, publish

    return Devices.find({}, {fields: { mgmtPass: false, sshPass: false }});
  }
});
Meteor.publish("db_certificates", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.device.certificate');
    return Certificates.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_ltmprofiles", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.ltm.profile');
    return Profiles.find({group: { $in: readObjects }});
  }
});

// LTM Level Stuff
Meteor.publish("db_virtuals", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.ltm.virtual');
    return Virtuals.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_rules", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.ltm.irule');
    return Rules.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_pools", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.ltm.pool');
    return Pools.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_monitors", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.ltm.monitor');
    return Monitors.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_virtualaddresses", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.ltm.node');
    return Virtualaddresses.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_datagroups", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.ltm.datagroup');
    return Datagroups.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_ltmpersistence", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.ltm.persistence');
    return Persistence.find({group: { $in: readObjects }});
  }
});

// GTM Level Stuff
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
    var readObjects = Meteor.call("getReadGroups", 'read.gtm.datacenter');
    return Gtmdatacenters.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_gtmservers", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.gtm.server');
    return Gtmservers.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_gtmvservers", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.gtm.vserver');
    return Gtmvservers.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_gtmlinks", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.gtm.link');
    return Gtmlinks.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_gtmmonitors", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.gtm.monitor');
    return Gtmmonitors.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_wideips", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.gtm.wideip');
    return Wideips.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_wpools", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.gtm.pool');
    return Widepools.find({group: { $in: readObjects }});
  }
});

// VCMP Stuff
Meteor.publish("db_vcmpguests", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.vcmp.guest');
    return Vcmpguests.find({group: { $in: readObjects }});
  }
});
Meteor.publish("db_vcmpdisks", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.vcmp.virtual_disk');
    return Vcmpdisks.find({group: { $in: readObjects }});
  }
});

// General Statistics Stuff
Meteor.publish("db_objectstatus", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Objectstatus.find();
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

// iHealth exported info
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

// ASM level stuff
Meteor.publish("db_asmpolicies", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    var readObjects = Meteor.call("getReadGroups", 'read.asm.policy');
    return Asmpolicies.find({group: { $in: readObjects }});
  }
});

// FS (CollectionFS) stuff
Meteor.publish("fs_archives", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Archives.find();
  }
});
Meteor.publish("fs_asmpolicyfile", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Asmpolicyfile.find();
  }
});
Meteor.publish("fs_pkifiles", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Pkifiles.find();
  }
});

// Filecollection Stuff
Meteor.publish("images", function () {
  if (this.userId == null) {
    return [];
  }
  else {
    return Images.find();
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
