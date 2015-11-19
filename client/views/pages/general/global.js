Template.registerHelper('deviceList', () => {
  let devices = Devices.find();
  if (devices) {
    return devices;
  }
});
Template.registerHelper('myProps', function() {
  var attrList = [];
  for (var attr in this) {
    switch (attr) {
      case "_id":
        break;
      case "onDevice":
        break;
      case "generation":
        break;
      case "selfLink":
        break;
      case "kind":
        break;
      default:
        attrList.push(attr);
    }
  }
  //console.log(attrList);
  return attrList;
});
Template.registerHelper('getThis', function(attr) {
  var tmpVar = Template.parentData(1);
  return tmpVar[attr];
});
Template.registerHelper('getSyncGroup', function(sync_id) {
  var device = Gtmsyncgroups.findOne({_id: sync_id});
  return synchronizationGroupName;
});
Template.registerHelper('getOnDevice', function(device_id) {
  var device = Devices.findOne({_id: device_id});
  return device.self.name;
});
Template.registerHelper('isOnActive', function(device_id) {
  var device = Devices.findOne({_id: device_id});
  if (device.self.failoverState == 'active') {
    return true;
  }
});
