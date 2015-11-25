Archives = new FS.Collection("fs_archives", {
  stores: [new FS.Store.GridFS("archives")]
});

Pkifiles = new FS.Collection("fs_pkifiles", {
  stores: [new FS.Store.GridFS("pkifiles")]
});

Asmpolicyfile = new FS.Collection("fs_asmpolicyfile", {
  stores: [new FS.Store.GridFS("asmpolicy")]
});

Softwareimages = new FS.Collection("fs_softwareimages", {
  stores: [new FS.Store.FileSystem("softwareimages")]
});

/*
Softwareimages = new FileCollection('fc_softwareimages',
  { resumable: true,   // Enable built-in resumable.js upload support
    chunkSize: 20*1024*1024 - 1024,
    http: [
      { method: 'get',
        path: '/:md5',  // this will be at route "/gridfs/myFiles/:md5"
        lookup: function (params, query) {  // uses express style url params
          return { md5: params.md5 };       // a query mapping url to myFiles
        }
      }
    ]
  }
);
*/

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
  Asmpolicyfile.allow({
    'insert': function () {
      // add custom authentication code here
      return true;
    },
    'download': function() {
      return true;
    }
  });
  Pkifiles.allow({
    'insert': function () {
      // add custom authentication code here
      return true;
    },
    'download': function() {
      return true;
    }
  });
  Softwareimages.allow({
    'insert': function () {
      // add custom authentication code here
      return true;
    },
    'download': function() {
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
Tmpfiles = new FS.Collection("db_tempfiles", {
  stores: [new FS.Store.FileSystem("tempfiles")]
});

VirtualsIndex = new EasySearch.Index({
  collection: Virtuals,
  fields: ['name', 'destination'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});

DevicesIndex = new EasySearch.Index({
  collection: Devices,
  fields: ['self.name', 'mgmtAddress', 'self.failoverState'],
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
  fields: ['name', 'membersReference'],
  // Fix this to search subfield array
  selectorPerField: function (field, searchString) {
    if ('membersReference' === field) {
      return {
        membersReference: {
          items: {
            $elemMatch: {
              name: { '$regex' : '.*' + searchString + '.*', '$options' : 'i' }
            }
          }
        }
      };
    }
    // use the default otherwise
    return this.defaultConfiguration().selectorPerField(field, searchString);
  },
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
  fields: ['synchronizationGroupName'],
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
  fields: ['change.description'],
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

VirtualAddressIndex = new EasySearch.Index({
  collection: Virtualaddresses,
  fields: ['name'],
  engine: new EasySearch.Minimongo(),
  defaultSearchOptions: { limit: 50 }
});
