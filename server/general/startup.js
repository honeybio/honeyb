Meteor.startup(function () {
  // code to run on server at startup
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  // load future from fibers
  // var Future = Npm.require("fibers/future");
  var Future = Meteor.npmRequire('fibers/future');
  // var exec = Npm.require("child_process").exec;
  var exec = Meteor.npmRequire('child_process').exec;
  var request = Meteor.npmRequire('request');
  var fs = Meteor.npmRequire('fs');

  // Set admin/honeyb password
  if (Meteor.users.findOne({username: 'admin'})) {
    // Admin account exists
  } else {
    // First run or restart to reset admin user/password

    // Create default roles
    // Roles.createRole('admin');
    //Roles.createRole('guest');
    //Roles.createRole('noc');
    //Roles.createRole('waf');
    //Roles.createRole('vpn');
    // "services" : { "password" : { "bcrypt" : "$2a$10$9Y3gUzXG.KmuWxmsqLeBeeNjpboC1iP8VE0KnDs3m1vlcbgQ7jpQi" } }, "username" : "admin", "roles" : { "default-group" : [ "admin" ]
    var adminRole = Roles.createRole('admin');
    var adminPermList = { onRole: 'admin', permissionList: []};
    for(var action in ChangeFunction) {
      for (var mod in ChangeFunction[action]) {
        for (var obj in ChangeFunction[action][mod]) {
          adminPermList.permissionList.push({ permission: action + '.' + mod + '.' + obj });
        }
      }
    }
    var adminPermId = Permissions.insert(adminPermList);
    // Roles.update({_id: adminRole}, {$Set: { permisions: ['read.ltm.virtual']}});
    var guestRole = Roles.createRole('guest');
    var guestPermList = { onRole: 'guest', permissionList: []};
    for (var gmod in ChangeFunction['read']) {
      for (var gobj in ChangeFunction['read'][gmod]) {
        guestPermList.permissionList.push({ permission: 'read.' + gmod + '.' + gobj });
      }
    }
    var guestPermId = Permissions.insert(guestPermList);
    var opRoles = [ 'read', 'enable', 'disable', 'force'];
    var operatorRole = Roles.createRole('operator');
    var operatorPermList = {
      onRole: "operator",
      permissionList: []
    };
    for (var myAction in opRoles) {
      for (var omod in ChangeFunction[myAction]) {
        for (var oobj in ChangeFunction[myAction][omod]) {
          operatorPermList.permissionList.push({ permission: myAction + '.' + omod + '.' + oobj});
        }
      }
    }
    var opPermId = Permissions.insert(operatorPermList);
    var adminId = Accounts.createUser({
      username: 'admin',
      password: 'honeyb'
    });
    var guestId = Accounts.createUser({
      username: 'guest',
      password: 'honeyb'
    });
    var operatorId = Accounts.createUser({
      username: 'operator',
      password: 'honeyb'
    });
    Roles.addUsersToRoles(adminId, ['admin'], 'default-group');
    Roles.addUsersToRoles(guestId, ['guest'], 'default-group');
    Roles.addUsersToRoles(operatorId, ['operator'], 'default-group');
    // Roles.update({id: adminID}, { $set: { permissions: [ { all: 1 } ] }});
  }
  if (Settings.findOne({type: 'system'})) {
    // Basic settings exist
  } else {
    Settings.insert({
      name: 'honeyb.io',
      type: 'system',
      firstRun: true,
      interval: {
        updateGtmDc: 10000,
        updateGtmServer: 30000,
        updateGtmVserver: 60000,
        updateLtmVirtual: 45000,
        updateLtmPool: 40000,
        updateLtmPoolMember: 90000,
        archiveSchedule: 'nightly',
        qkviewSchedule: 'weekly'
      }
    });
    //var pubKey = Meteor.call('generateSshKey', 'honeyb');
    //console.log(pubKey);
    Settings.insert({name: 'navigation', type: 'navigation', showWaf: true, showChange: true,
      showGSLB: true, showLB: true, showDevice: true, showIhealth: true, showDashboards: true });
      Settings.insert({
        name: 'authentication',
        type: 'authentication',
        ldap: false,
        adAuthentication : {
          debug: true,
          ldapDomain: 'ad.bespintech.com',
          ldapBaseDn: 'DC=ad,DC=bespintech,DC=com',
          ldapUrl: 'ldap://10.100.21.51:389',
          ldapBindCn: 'CN=service account,CN=Managed Service Accounts,DC=ad,DC=bespintech,DC=com',
          ldapBindPassword: 'whatthefuck!23',
          defaultAdminGroup: 'CN=F5Admin,CN=Users,DC=ad,DC=bespintech,DC=com',
          defaultOperatorGroup: 'CN=F5Operator,CN=Users,DC=ad,DC=bespintech,DC=com',
          defaultGuestGroup: 'CN=F5Guest,CN=Users,DC=ad,DC=bespintech,DC=com'
        },
        ldapAuthPublishFields: ['displayName'],
        ldapGroupMembership: [
          'CN=F5Admin,CN=Users,DC=ad,DC=bespintech,DC=com',
          'CN=F5Operator,CN=Users,DC=ad,DC=bespintech,DC=com',
          'CN=F5Guest,CN=Users,DC=ad,DC=bespintech,DC=com'
        ],
        timeout: true,
        staleSessionInactivityTimeout: 1800000,
        staleSessionHeartbeatInterval: 180000,
        staleSessionPurgeInterval: 60000,
        staleSessionActivityEvents: 'mousemove click keydown'
      });
  }
  var mySettings = Settings.findOne({type: 'authentication'});
  if (mySettings !== undefined) {
    if (mySettings.ldap) {
      _.defaults(Meteor.settings, {
        ldap: {
          debug: true,
          domain: mySettings.adAuthentication.ldapDomain,
          baseDn: mySettings.adAuthentication.ldapBaseDn,
          url: mySettings.adAuthentication.ldapUrl,
          bindCn: mySettings.adAuthentication.ldapBindCn,
          bindPassword: mySettings.adAuthentication.ldapBindPassword,
          autopublishFields: mySettings.ldapAuthPublishFields,
          groupMembership: mySettings.ldapGroupMembership
        }
      });
    }
    // console.log(Meteor.settings.ldap);
    if (mySettings.timeout) {
      _.defaults(Meteor.settings, {
        public: {
          staleSessionInactivityTimeout: mySettings.staleSessionInactivityTimeout,
          staleSessionHeartbeatInterval: mySettings.staleSessionHeartbeatInterval,
          staleSessionPurgeInterval: mySettings.staleSessionPurgeInterval,
          staleSessionActivityEvents: mySettings.staleSessionActivityEvents
        }
      });
    }
    var geoDBFile = Npm.require('fs').realpathSync(process.cwd()) + "/assets/app/" + "GeoLite2-City.mmdb";
    _.defaults(Meteor.settings, {
      $set: {
        IPGeocoder: {
          databaseUrl: geoDBFile
        }
      }
    });
  }

  // Start the cron process for recurring jobs
  //SyncedCron.start();

  // Start archive task
  SyncedCron.add({
    name: 'backup_all_devices',
    schedule: function(parser) {
    // parser is a later.parse object
      return parser.recur().on('02:00:00').time();
    },
    job: function() {
      var output = Meteor.call('archiveAllTask');
      return output;
    }
  });
  // Start Devices stats task

  SyncedCron.add({
    name: 'get_device_stats',
    schedule: function(parser) {
    // parser is a later.parse object
      return parser.recur().every(5).minute();
    },
    job: function() {
      var output = Meteor.call('updateAllDeviceStats');
      return output;
    }
  });

  // Start Geo database
  var geoDBFile = Npm.require('fs').realpathSync(process.cwd()) + "/assets/app/" + "GeoLite2-City.mmdb";
  IPGeocoder.load(geoDBFile);

  // Sessions are lost, so kill login resume tokens to avoid null userids
  Meteor.users.update({}, {$set: { 'services.resume.loginTokens': []}}, {multi: true});
});
