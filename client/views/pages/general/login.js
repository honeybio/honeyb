var ERRORS_KEY = 'signinErrors';

Template.login.onCreated(function() {
  Session.set(ERRORS_KEY, {});
});

Meteor.loginWithLdap = function(username, password, callback) {
  Accounts.callLoginMethod({
    methodArguments: [{
      username: username,
      pass: password,
      ldap: true
    }],
    validateResult: function(result) {},
    userCallback: callback
  });
};

Template.login.events({
  'submit #form-signin': function (event) {
    event.preventDefault();
    var user = event.target.username.value;
    var pass = event.target.password.value;
    Meteor.call("getAuthType", function (err, res) {
      if (err) {
        console.log(err);
      } else if (res == 'local' || user == 'admin') {
        Meteor.loginWithPassword(user, pass, function(err,result) {
          if (!err) {
            Router.go('/')
          } else {
            if (err) {
              return Session.set(ERRORS_KEY, {'none': err.reason});
            }
          }
        });
      } else if (res == 'ad') {
        Meteor.loginWithLdap(user, pass, function(err, result) {
          if (!err) {
            Meteor.call("updateRoles");
            Router.go('/')
          } else {
            if (err) {
              return Session.set(ERRORS_KEY, {'none': err.reason});
            }
          }
        });
      }
    });
  }
});

Template.login.helpers({
  errorMessages: function() {
    return _.values(Session.get(ERRORS_KEY));
  }
})

Template.settingsUser.events({
  'submit .form-signin': function (event, template) {
    event.preventDefault();
    var user = event.target.username.value;
    var pass = event.target.password.value;
    Meteor.call("createNewUser", user, pass);
  },
  'submit #myProfile': function (event) {
    event.preventDefault();
    var advanced = event.target.profileAdvanced.value;
    if (advanced == "1") {
      advanced = true;
    }
    else {
      advanced = false;
    }

    Meteor.users.update({_id: Meteor.userId()}, {$set: { profile: { advanced : advanced }}});
  }
});
Template.settingsUser.helpers({
  getUsers: function () {
    var result = Meteor.users.find();
    return result;
  }
});

Template.settingsHoneyb.helpers({
  msecToSec: function (msec) {
    if (msec === undefined) {
      return 0;
    }
    return msec/1000;
  },
  getAuthSettings: function () {
    return Settings.findOne({type: 'authentication'});
  },
  adAuthSelected: function () {
    if (Session.get('auth_type') == 'activedirectory') {
      return true;
    } else { return false; }
  },
});

Template.settingsHoneyb.events({
  'submit .scheduler': function (event) {
    event.preventDefault();
    Meteor.call("updateSchedule", event.target.archives.value, event.target.qkviews.value);
  },
  'submit #system-settings': function (event) {
    event.preventDefault();
    var hname = event.target.honeyName.value;
    var ihealthUser = event.target.ihealthUser.value;
    var ihealthPass = event.target.ihealthPass.value;
    var ihealthFreq = event.target.ihealthFreq.value;
    Meteor.call("updateSystemSettings", hname, ihealthUser, ihealthPass, ihealthFreq);
  },
  'submit #interval-settings': function (event) {
    event.preventDefault();
    var dcInt = event.target.updateGtmDc.value;
    var serInt = event.target.updateGtmServer.value;
    var vserInt = event.target.updateGtmVserver.value;
    var virtInt = event.target.updateLtmVirtual.value;
    var poolInt = event.target.updateLtmPool.value;
    var memInt = event.target.updateLtmPoolMember.value;
    Meteor.call("updateIntervalSettings", dcInt, serInt, vserInt, virtInt, poolInt, memInt);
  },
  'submit #ssh-settings': function (event) {
    event.preventDefault();
    var keyName = 'id_rsa';
    Meteor.call("generateSshKey", keyName);
  },
  'submit #change-settings': function (event) {
    event.preventDefault();
    Meteor.call("updateChangeSettings", event.target.changeControl.checked);
  },
  'submit #authentication-form': function (e, t) {
    event.preventDefault();
    if (Session.get('auth_type') == 'activedirectory') {
      var authObj = {
        debug: event.target.debug.value,
        ldapDomain: event.target.ldapDomain.value,
        ldapBaseDn: event.target.ldapBaseDn.value,
        ldapUrl: event.target.ldapUrl.value,
        ldapBindCn: event.target.ldapBindCn.value,
        ldapBindPassword: event.target.ldapBindPassword.value,
        defaultAdminGroup: event.target.defaultAdminGroup.value,
        defaultOperatorGroup: event.target.defaultOperatorGroup.value,
        defaultGuestGroup: event.target.defaultGuestGroup.value,
        ldapGroupMembership: [
          event.target.defaultAdminGroup.value,
          event.target.defaultOperatorGroup.value,
          event.target.defaultGuestGroup.value
        ]
       };
       Meteor.call("setAdAuth", authObj);
    }
  },
  'change #authenticationType': function(event, target) {
    Session.set('auth_type', authenticationType.options[authenticationType.selectedIndex].value);
  }
});

Template.settingsRoles.helpers({
  getRoles: function () {
    var result = Roles.getAllRoles();
    // var result = Meteor.call("listAllRoles");
    return result;
  }
});

Template.settingsRolesDetails.helpers({
  getAllPermissions: function () {
    var result = Meteor.call("listPermissions", function(error, result){
      if(error){
        console.log(error.reason);
        return;
      }
      return result;
    });
  },
  getRolePermissions: function () {
    //
  }
});

Template.settingsRolesDetails.onCreated(function(){
  // this.permDict = new ReactiveDict();
  // this.permDict.set( 'showExtraFields', false );
  var permList = Meteor.call("listPermissions");
  var perms = new ReactiveVar(false);
  perms.set(permList);
});

//Template.settingsRolesDetails.onRendered(function(){
//  dragula([document.querySelector('#permissionDrop'), document.querySelector('#right')]);
//});


Template.settingsRoles.events({
  'submit .roleForm': function (event, template) {
    event.preventDefault();
    var roleName = event.target.roleName.value;
    Meteor.call("createRole", roleName);
  }
});
