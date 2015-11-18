Archives = new FS.Collection("db_archives", {
  stores: [new FS.Store.FileSystem("archives")]
});
Certfiles = new FS.Collection("db_certfiles", {
  stores: [new FS.Store.FileSystem("certfiles")]
});
if (Meteor.isServer) {
  Archives.allow({
    'insert': function () {
      // add custom authentication code here
      return true;
    },
    'download': function() {
      return true;
    }
  });
  Certfiles.allow({
    'insert': function () {
      // add custom authentication code here
      return true;
    }
  });
}

Devices = new Mongo.Collection("db_devices");
Certificates = new Mongo.Collection("db_certificates");
Virtuals = new Mongo.Collection("db_virtuals");
Rules = new Mongo.Collection("db_rules");
Pools = new Mongo.Collection("db_pools");
Nodes = new Mongo.Collection("db_nodes");
Monitors = new Mongo.Collection("db_monitors");
Asmpolicies = new Mongo.Collection("db_asmpolicies");
Gtmsyncgroups = new Mongo.Collection("db_gtmsyncgroup");
Gtmdatacenters = new Mongo.Collection("db_gtmdatacenters");
Gtmservers = new Mongo.Collection("db_gtmservers");
Gtmvservers = new Mongo.Collection("db_gtmvservers");
Gtmlinks = new Mongo.Collection("db_gtmlinks");
Gtmmonitors = new Mongo.Collection("db_gtmmonitors");
Wideips = new Mongo.Collection("db_wideips");
Widepools = new Mongo.Collection("db_wpools");
Idatagroups = new Mongo.Collection("db_idatagroups");
Edatagroups = new Mongo.Collection("db_edatagroups");
Profiles = new Mongo.Collection("db_ltmprofiles");
Persistence = new Mongo.Collection("db_ltmpersistence");
Statistics = new Mongo.Collection("db_statistics");
Changes = new Mongo.Collection("db_changes");
Changeset = new Mongo.Collection("db_changeset");
Settings = new Mongo.Collection("db_settings");
Containers = new Mongo.Collection("db_containers");
Permissions = new Mongo.Collection("db_permissions");
Ihealth = new Mongo.Collection("db_ihealth");
Jobs = new Mongo.Collection("db_jobs");
Tmpfiles = new FS.Collection("db_tempfiles", {
  stores: [new FS.Store.FileSystem("tempfiles")]
});


/*
clean the db, copy/paste to meteor mongo shell
  db.db_devices.drop()
  db.db_certificates.drop()
  db.db_virtuals.drop()
  db.db_rules.drop()
  db.db_pools.drop()
  db.db_monitors.drop()
  db.db_gtmsyncgroup.drop()
  db.db_gtmdatacenters.drop()
  db.db_gtmservers.drop()
  db.db_gtmvservers.drop()
  db.db_gtmlinks.drop()
  db.db_gtmmonitors.drop()
  db.db_wideips.drop()
  db.db_wpools.drop()
  db.db_idatagroups.drop()
  db.db_edatagroups.drop()
  db.db_ltmprofiles.drop()
  db.db_ltmpersistence.drop()
  db.db_statistics.drop()
  db.db_nodes.drop()
  db.db_changes.drop()
  db.db_changeset.drop()
  db.db_tempfiles.drop()
  db.db_archives.drop()
  db.db_certfiles.drop()
  db.db_statistics.drop()
  db.db_jobs.drop()
  db.db_ihealth.drop()
  db.fs.chunks
  db.fs.files
  show collections
*/

VirtualsIndex = new EasySearch.Index({
  collection: Virtuals,
  fields: ['name', 'destination'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

DevicesIndex = new EasySearch.Index({
  collection: Devices,
  fields: ['self.name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

CertificatesIndex = new EasySearch.Index({
  collection: Certificates,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

RulesIndex = new EasySearch.Index({
  collection: Rules,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

PoolsIndex = new EasySearch.Index({
  collection: Pools,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

NodesIndex = new EasySearch.Index({
  collection: Nodes,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

MonitorsIndex = new EasySearch.Index({
  collection: Monitors,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

GtmsyncgroupsIndex = new EasySearch.Index({
  collection: Gtmsyncgroups,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

GtmdatacentersIndex = new EasySearch.Index({
  collection: Gtmdatacenters,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

GtmserversIndex = new EasySearch.Index({
  collection: Gtmservers,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

GtmvserversIndex = new EasySearch.Index({
  collection: Gtmvservers,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

GtmlinksIndex = new EasySearch.Index({
  collection: Gtmlinks,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

GtmmonitorsIndex = new EasySearch.Index({
  collection: Gtmmonitors,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

WideipsIndex = new EasySearch.Index({
  collection: Wideips,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

WidepoolsIndex = new EasySearch.Index({
  collection: Widepools,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

IdatagroupsIndex = new EasySearch.Index({
  collection: Idatagroups,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

EdatagroupsIndex = new EasySearch.Index({
  collection: Edatagroups,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

ProfilesIndex = new EasySearch.Index({
  collection: Profiles,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

PersistenceIndex = new EasySearch.Index({
  collection: Persistence,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

StatisticsIndex = new EasySearch.Index({
  collection: Statistics,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

ChangesIndex = new EasySearch.Index({
  collection: Changes,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

ChangesetIndex = new EasySearch.Index({
  collection: Changeset,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

SettingsIndex = new EasySearch.Index({
  collection: Settings,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

IhealthIndex = new EasySearch.Index({
  collection: Ihealth,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

JobsIndex = new EasySearch.Index({
  collection: Jobs,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

AsmPoliciesIndex = new EasySearch.Index({
  collection: Asmpolicies,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});
