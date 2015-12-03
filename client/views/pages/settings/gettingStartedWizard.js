Template.gettingStartedWizard.events({
  'click #intro': function (e, t) {
    $('#ssh-settings').hide();
    $('#ihealth-settings').hide();
    $('#authentication-settings').hide();
    $('#archive-settings').hide();
    $('#add-device').hide();
    $('#introduction').show();
  },
  'click #ssh': function (e, t) {
    $('#introduction').hide();
    $('#ihealth-settings').hide();
    $('#authentication-settings').hide();
    $('#archive-settings').hide();
    $('#add-device').hide();
    $('#ssh-settings').show();
  },
  'click #ihealth': function (e, t) {
    $('#introduction').hide();
    $('#ssh-settings').hide();
    $('#authentication-settings').hide();
    $('#archive-settings').hide();
    $('#add-device').hide();
    $('#ihealth-settings').show();
  },
  'click #authentication': function (e, t) {
    $('#introduction').hide();
    $('#ihealth-settings').hide();
    $('#archive-settings').hide();
    $('#add-device').hide();
    $('#ssh-settings').hide();
    $('#authentication-settings').show();
  },
  'click #archive': function (e, t) {
    $('#introduction').hide();
    $('#ihealth-settings').hide();
    $('#authentication-settings').hide();
    $('#add-device').hide();
    $('#ssh-settings').hide();
    $('#archive-settings').show();
  },
  'click #add-devices': function (e, t) {
    $('#introduction').hide();
    $('#ihealth-settings').hide();
    $('#authentication-settings').hide();
    $('#archive-settings').hide();
    $('#ssh-settings').hide();
    $('#add-device').show();
  },
  'click #generate-ssh-key': function (e, t) {
    event.preventDefault();
    var keyName = 'id_rsa';
    Meteor.call("generateSshKey", keyName);
  },
  'submit #settings-wizard-form': function (e, t) {
    event.preventDefault();
  },
  'change #authenticationType': function(event, target) {
    Session.set('auth_type', authenticationType.options[authenticationType.selectedIndex].value);
  },
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
    }
  },
});

Template.gettingStartedWizard.helpers({
  adAuthSelected: function () {
    if (Session.get('auth_type') == 'activedirectory') {
      return true;
    } else { return false; }
  },
  getAuthSettings: function () {
    return Settings.findOne({type: 'authentication'});
  }
});
