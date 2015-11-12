Template.login.events({
  'submit #form-signin': function (event) {
    event.preventDefault();
    var user = event.target.username.value;
    var pass = event.target.password.value;
    Meteor.loginWithPassword(user, pass, function(err,result) {
      if (!err) {
        Router.go('/devices')
      } else {
        console.log(err.reason)
      }
    });
  }
});

Template.myprofile.events({
  'submit .form-signin': function (event, template) {
    event.preventDefault();
    var user = event.target.username.value;
    var pass = event.target.password.value;
    Meteor.call("createNewUser", user, pass);
  },
  'submit .myProfile': function (event) {
    event.preventDefault();
    var advanced = event.target.profileAdvanced.value;
    if (advanced == "1") {
      advanced = true;
    }
    else {
      advanced = false;
    }
    Meteor.users.update({_id: Meteor.userId()}, {$set: { profile: { advanced : advanced }}});
  },

  'submit .honeySettings': function (event) {
    event.preventDefault();
    var hname = event.target.honeyName.value;
    var dcInt = event.target.updateGtmDc.value;
    var serInt = event.target.updateGtmServer.value;
    var vserInt = event.target.updateGtmVserver.value;
    var virtInt = event.target.updateLtmVirtual.value;
    var poolInt = event.target.updateLtmPool.value;
    var memInt = event.target.updateLtmPoolMember.value;
    var ihealthUser = event.target.ihealthUser.value;
    var ihealthPass = event.target.ihealthPass.value;
    Meteor.call("updateSettings", hname, dcInt, serInt, vserInt, virtInt, poolInt, memInt, ihealthUser, ihealthPass);
  }
});
Template.myprofile.helpers({
  getUsers: function () {
    var result = Meteor.users.find();
    return result;
  },
  getSettings: function () {
    var result = Meteor.settings.findOne();
    return result;
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
