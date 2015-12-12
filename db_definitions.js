if (Meteor.isServer) {
  Archives.allow({
    insert: function(){
      return true;
    },
    update: function(){
      return true;
    },
    remove: function(){
      return true;
    },
    download: function(){
      return true;
    }
  });
  Asmpolicyfile.allow({
    insert: function(){
      return true;
    },
    update: function(){
      return true;
    },
    remove: function(){
      return true;
    },
    download: function(){
      return true;
    }
  });
  Pkifiles.allow({
    insert: function(){
      return true;
    },
    update: function(){
      return true;
    },
    remove: function(){
      return true;
    },
    download: function(){
      return true;
    }
  });
  Images.allow({
    insert: function(){
      return true;
    },
    update: function(){
      return true;
    },
    remove: function(){
      return true;
    },
    download: function(){
      return true;
    }
  });
}

Virtualaddresses = new Mongo.Collection("db_virtualaddresses");
Devices = new Mongo.Collection("db_devices");
Certificates = new Mongo.Collection("db_certificates");
Virtuals = new Mongo.Collection("db_virtuals");
Rules = new Mongo.Collection("db_rules");
Pools = new Mongo.Collection("db_pools");
Nodes = new Mongo.Collection("db_nodes");
Monitors = new Mongo.Collection("db_monitors");
Datagroups = new Mongo.Collection("db_datagroups");
Persistence = new Mongo.Collection("db_ltmpersistence");

Vcmpguests = new Mongo.Collection("db_vcmpguests");
Vcmpdisks = new Mongo.Collection("db_vcmpdisks");

Asmpolicies = new Mongo.Collection("db_asmpolicies");

Gtmsyncgroups = new Mongo.Collection("db_gtmsyncgroup");
Gtmdatacenters = new Mongo.Collection("db_gtmdatacenters");
Gtmservers = new Mongo.Collection("db_gtmservers");
Gtmvservers = new Mongo.Collection("db_gtmvservers");
Gtmlinks = new Mongo.Collection("db_gtmlinks");
Gtmmonitors = new Mongo.Collection("db_gtmmonitors");
Wideips = new Mongo.Collection("db_wideips");
Widepools = new Mongo.Collection("db_wpools");

Profiles = new Mongo.Collection("db_ltmprofiles");

Objectstatus = new Mongo.Collection("db_objectstatus");
Statistics = new Mongo.Collection("db_statistics");
Changes = new Mongo.Collection("db_changes");
Changeset = new Mongo.Collection("db_changeset");
Settings = new Mongo.Collection("db_settings");
Containers = new Mongo.Collection("db_containers");
Permissions = new Mongo.Collection("db_permissions");
Ihealth = new Mongo.Collection("db_ihealth");
Jobs = new Mongo.Collection("db_jobs");

if (Meteor.isClient) {
  Tracker.autorun(function(){
    var settings = Settings.findOne({type: 'navigation'});
    if (settings != undefined) {
      if (settings.showWaf) { $('#waf').show() }
      else { $('#waf').hide() }
      if (settings.showSoftware) { $('#software').show() }
      else { $('#software').hide() }
    	if (settings.showSupport) { $('#support').show() }
      else { $('#support').hide() }
    	if (settings.showSettings) { $('#settings').show() }
      else { $('#settings').hide() }
    	if (settings.showCert) { $('#ssl').show() }
      else { $('#ssl').hide() }
    	if (settings.showWaf) { $('#asm').show() }
      else { $('#asm').hide() }
    	if (settings.showChange) { $('#changes').show() }
      else { $('#changes').hide() }
    	if (settings.showGSLB) { $('#gtm').show() }
      else { $('#gtm').hide() }
    	if (settings.showLB) { $('#ltm').show() }
      else { $('#ltm').hide() }
    	if (settings.showDevice) { $('#devices').show() }
      else { $('#devices').hide() }
    	if (settings.showIhealth) { $('#ihealth').show() }
      else { $('#ihealth').hide() }
    	if (settings.showDashboards) { $('#dashboards').show() }
      else { $('#dashboards').hide() }
    }
  });
}
