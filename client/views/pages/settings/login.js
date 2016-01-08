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
            Router.go('/');
            Meteor.call("updateRoles", function (err, res) {
              if (err) {
                console.log(err)
              } else {
                console.log('no err');
              }
            });
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
  'submit #form-create-user': function (event, template) {
    event.preventDefault();
    var user = event.target.username.value;
    var pass = event.target.password.value;
    Meteor.call("createNewUser", user, pass, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
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
    toastr.success('Updated profile!', 'Success!');
  },
  'click .userLink': function (event) {
    console.log(event.target.id);
  }
});

Template.settingsUser.helpers({
  getUsers: function () {
    return Meteor.users.find();
  }
});

Template.settingsUser.onRendered(function() {
  $('.footable').footable();
});

Template.settingsUserDetails.helpers({
  listRoles: function (roles) {
    var roleArray = [];
    for (var attr in roles) {
      roleArray.push({group: attr, role: roles[attr]});
    }
    return roleArray;
  }
});

Template.settingsGroup.onRendered(function() {
  $('.footable').footable();
});

Template.settingsGroup.helpers({
  getGroups: function () {
    return Roles.getAllRoles();
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
    Meteor.call("updateSchedule", event.target.archives.value, event.target.qkviews.value, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success('Saved!', 'Success!');
      }
    });
  },
  'submit #system-settings': function (event) {
    event.preventDefault();
    var hname = event.target.honeyName.value;
    var ihealthUser = event.target.ihealthUser.value;
    var ihealthPass = event.target.ihealthPass.value;
    var ihealthFreq = event.target.ihealthFreq.value;
    Meteor.call("updateSystemSettings", hname, ihealthUser, ihealthPass, ihealthFreq, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success('Saved!', 'Success!');
      }
    });
  },
  'submit #interval-settings': function (event) {
    event.preventDefault();
    var dcInt = event.target.updateGtmDc.value;
    var serInt = event.target.updateGtmServer.value;
    var vserInt = event.target.updateGtmVserver.value;
    var virtInt = event.target.updateLtmVirtual.value;
    var poolInt = event.target.updateLtmPool.value;
    var memInt = event.target.updateLtmPoolMember.value;
    Meteor.call("updateIntervalSettings", dcInt, serInt, vserInt, virtInt, poolInt, memInt, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success('Saved!', 'Success!');
      }
    });
  },
  'submit #ssh-settings': function (event) {
    event.preventDefault();
    var keyName = 'id_rsa';
    Meteor.call("generateSshKey", keyName, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success('Saved!', 'Success!');
      }
    });
  },
  'submit #change-settings': function (event) {
    event.preventDefault();
    Meteor.call("updateChangeSettings", event.target.changeControl.checked, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success('Saved!', 'Success!');
      }
    });
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
       Meteor.call("setAdAuth", authObj, function (err, res) {
         if (err) {
           toastr.error(err.details, err.reason)
         } else {
           toastr.success('Saved!', 'Success!');
         }
       });
    } else {
      Meteor.call("setLocalAuth", authObj, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason)
        } else {
          toastr.success('Saved!', 'Success!');
        }
      });
    }
  },
  'change #authenticationType': function(event, target) {
    Session.set('auth_type', authenticationType.options[authenticationType.selectedIndex].value);
  },
  'click .ibox-title': function (event) {
      var element = $(event.target);
      var ibox = element.closest('div.ibox');
      var button = element.closest("i");
      var content = ibox.find('div.ibox-content');
      content.slideToggle(200);
      button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
      ibox.toggleClass('').toggleClass('border-bottom');
      setTimeout(function () {
          ibox.resize();
          ibox.find('[id^=map-]').resize();
      }, 50);
  },
});

Template.settingsRoles.helpers({
  getRoles: function () {
    var result = Roles.getAllRoles();
    // var result = Meteor.call("listAllRoles");
    return result;
  }
});

Template.settingsRoles.events({
  'click #Delete': function (event, template) {
    event.preventDefault();
  },
  'submit #form-create-role': function (event, target) {
    event.preventDefault();
    var name = event.target.roleName.value;
    Meteor.call("createRole", name, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  }
});

Template.settingsRolesDetails.helpers({
  unassigned: function (role) {
    var myPerms = Permissions.findOne({onRole: role});
    if (myPerms !== undefined) {
      Meteor.call("permList", function(err, res) {
        for (var i = 0; i < myPerms.permissionList.length; i++) {
          var match = res.indexOf(myPerms.permissionList[i].permission);
          if (match > -1) {
            res.splice(match, 1);
          }
        }
        Session.set('perms', res);
      });
    }
    return Session.get('perms');
  },
  assigned: function (role) {
    var myPerms = Permissions.findOne({onRole: role});
    if (myPerms !== undefined) {
      return myPerms.permissionList;
    } else {
      return [];
    }
  }
});

Template.settingsRolesDetails.events({
  'click #to-the-left': function (event, template) {
    event.preventDefault();
    var multi = $('#available-list').val();
    $('#available-list option:selected').remove();
    $.each(multi, function (index, value) {
      $('#assigned-list').append('<option value="' + value + '">' + value + '</option>');
    });
  },
  'click #to-the-right': function (event, template) {
    event.preventDefault();
    var multi = $('#assigned-list').val();
    $('#assigned-list option:selected').remove();
    $.each(multi, function (index, value) {
      $('#available-list').append('<option value="' + value + '">' + value + '</option>');
    });
  },
  'submit #update-permissions': function (e, t) {
    event.preventDefault();
    var allAssigned = $("#assigned-list option").map(function(){ return this.value }).get()
    Meteor.call('updatePermission', event.target.role.value, allAssigned, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success('Saved!', 'Success!');
      }
    });
  }
});

Template.settingsRoles.events({
  'submit .roleForm': function (event, template) {
    event.preventDefault();
    var roleName = event.target.roleName.value;
    Meteor.call("createRole", roleName, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success('Saved!', 'Success!');
      }
    });
  }
});
