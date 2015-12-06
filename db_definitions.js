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
Idatagroups = new Mongo.Collection("db_idatagroups");
Edatagroups = new Mongo.Collection("db_edatagroups");
Persistence = new Mongo.Collection("db_ltmpersistence");

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
