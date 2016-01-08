Meteor.methods({
  createNewUser: function (user, pass) {
    var user_id = Accounts.createUser({username: user, password: pass});
    var profile = { advanced: 0 };
    Roles.addUsersToRoles(user_id, ['admin'], 'default-group');
    Meteor.users.update({ _id: user_id }, { $set:{ profile : profile }});
    return user_id;
  },
  createRole: function (roleName) {
    var roleId = Roles.createRole(roleName);
    var rolePermList = { onRole: roleName, permissionList: []};
    Permissions.insert(rolePermList);
    return roleId;
  },
  permList: function () {
    var perms = [];
    for (var action in ChangeFunction) {
      for (var mod in ChangeFunction[action]) {
        for (var obj in ChangeFunction[action][mod]) {
          perms.push(action + "." + mod + "." + obj);
        }
      }
    }
    return perms;
  },
  listPermissions: function () {
    var permList = [];
    for(var action in ChangeFunction) {
      for (var mod in ChangeFunction[action]) {
        for (var obj in ChangeFunction[action][mod]) {
          permList.push({ permission: action + "." + mod + "." + obj });
        }
      }
    }
    return permList;
  },
  listAllRoles: function () {
    var result = Roles.getAllRoles();
    return result;
  },
  listContainers: function () {
    var result = Containers.find();
    return result
  }
});
