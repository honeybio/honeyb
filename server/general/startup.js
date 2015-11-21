Meteor.startup(function () {
  // code to run on server at startup
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  // load future from fibers
  // var Future = Npm.require("fibers/future");
  var Future = Meteor.npmRequire("fibers/future");
  // var exec = Npm.require("child_process").exec;
  var exec = Meteor.npmRequire("child_process").exec;
  var request = Meteor.npmRequire('request');
  var fs = Meteor.npmRequire('fs');

  // Set admin/honeyb password
  if ( Meteor.users.findOne({username: "admin"})) {
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
    var adminRole = Roles.createRole("admin");
    var adminPermList = { onRole: "admin", permissionList: []};
    for(var action in ChangeFunction) {
      for (var mod in ChangeFunction[action]) {
        for (var obj in ChangeFunction[action][mod]) {
          adminPermList.permissionList.push({ permission: action + "." + mod + "." + obj });
        }
      }
    }
    var adminPermId = Permissions.insert(adminPermList);
    // Roles.update({_id: adminRole}, {$Set: { permisions: ['read.ltm.virtual']}});
    var guestRole = Roles.createRole("guest");
    var guestPermList = { onRole: "guest", permissionList: []};
    for (var gmod in ChangeFunction['read']) {
      for (var gobj in ChangeFunction['read'][gmod]) {
        guestPermList.permissionList.push({ permission: "read." + gmod + "." + gobj });
      }
    }
    var opRoles = [ 'read', 'enable', 'disable', 'force'];
    var operatorRole = Roles.createRole("operator");
    var operatorPermList = { onRole: "operator", permissionList: []};
    for (var myAction in opRoles) {
      for (var omod in ChangeFunction[myAction]) {
        for (var oobj in ChangeFunction[myAction][omod]) {
          operatorPermList.permissionList.push({ permission: myAction + "." + omod + "." + oobj});
        }
      }
    }
    var guestPermId = Permissions.insert(guestPermList);
    var adminId = Accounts.createUser({username: "admin", password: "honeyb"});
    var guestId = Accounts.createUser({username: "guest", password: "honeyb"});
    Roles.addUsersToRoles(adminId, ['admin'], 'default-group');
    Roles.addUsersToRoles(guestId, ['guest'], 'default-group');
    // Roles.update({id: adminID}, { $set: { permissions: [ { all: 1 } ] }});
  }
  if (Settings.findOne()) {
    // Basic settings exist
  } else {
    Settings.insert({name: "honeyB", type: "system", interval: { updateGtmDc: 10000, updateGtmServer: 30000,
    updateGtmVserver: 60000, updateLtmVirtual: 45000, updateLtmPool: 40000,
    updateLtmPoolMember: 90000, archiveSchedule: "nightly", qkviewSchedule: "weekly" }});
    //var pubKey = Meteor.call('generateSshKey', 'honeyb');
    //console.log(pubKey);
    Settings.insert({name: "navigation", type: "navigation", showWaf: true, showChange: true,
      showGSLB: true, showLB: true, showDevice: true, showIhealth: true, showDashboards: true });
  }
  // Start the cron process for recurring jobs
  SyncedCron.start();

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
});
