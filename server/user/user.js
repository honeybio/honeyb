Meteor.methods({
  createNewUser: function (user, pass) {
    var user_id = Accounts.createUser({username: user, password: pass});
    var profile = { advanced: 0 };
    Roles.addUsersToRoles(user_id, ['admin'], 'default-group');
    Meteor.users.update({ _id: user_id }, { $set:{ profile : profile }});
    return user_id;
  },
  createRole: function (roleName) {
    if (Meteor.call('isHoneybAdmin')) {
      var roleId = Roles.createRole(roleName);
      var rolePermList = { onRole: roleName, permissionList: []};
      Permissions.insert(rolePermList);
      return roleId;
    } else {
      throw new Meteor.Error(401, "Not authorized to create roles");
    }
  },
  createContainer: function (containerName) {
    if (Meteor.call('isHoneybAdmin')) {
      var exists = Containers.findOne({name: containerName});
      if (exists !== undefined) {
        throw new Meteor.Error(403, "Container already exists!");
      } else {
        var containerId = Container.insert({name: roleName});
        return containerId;
      }
    } else {
      throw new Meteor.Error(401, "Not authorized to create containers!");
    }
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
