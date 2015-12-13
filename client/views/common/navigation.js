Template.navigation.rendered = function(){
  // Initialize metisMenu
  $('#side-menu').metisMenu();
  var settings = Settings.findOne({type: 'navigation'});
  if (settings != undefined) {
    if (settings.showWaf) { $('#waf').show() }
    else { $('#waf').hide() }
    if (settings.showVcmp) { $('#vcmp').show() }
    else { $('#vcmp').hide() }
    if (settings.showSoftware) { $('#software').show() }
    else { $('#software').hide() }
    if (settings.showSupport) { $('#support').show() }
    else { $('#support').hide() }
    if (settings.showSettings) { $('#settings').show() }
    else { $('#settings').hide() }
    if (settings.showCert) { $('#ssl').show() }
    else { $('#ssl').hide() }
    if (settings.showWaf) { $('#asm').show() }
    else { $('#asm').hide() }
    if (settings.showChange) { $('#changes').show() }
    else { $('#changes').hide() }
    if (settings.showGSLB) { $('#gtm').show() }
    else { $('#gtm').hide() }
    if (settings.showLB) { $('#ltm').show() }
    else { $('#ltm').hide() }
    if (settings.showDevice) { $('#devices').show() }
    else { $('#devices').hide() }
    if (settings.showIhealth) { $('#ihealth').show() }
    else { $('#ihealth').hide() }
    if (settings.showDashboards) { $('#dashboards').show() }
    else { $('#dashboards').hide() }
  }
};

//Template.navWrapper.helpers({
//  noRender: function(){
//    return Session.get("noRender");
//  }
//});

// Used only on OffCanvas layout
Template.navigation.events({
  'click .close-canvas-menu' : function(){
    $('body').toggleClass("mini-navbar");
  }
});

Template.navigation.helpers({
  sidebar: function () {
    return Settings.findOne({type: 'navigation'});
  },
  getMenuItems: function () {
    // Get user settings also
    var settings = Settings.findOne({type: 'navigation'});

    var items = {
      dashboards: false,
      ihealth: false,
      devices: false,
      changes: false,
      certs: false,
      loadBalancer: false,
      gslb: false,
      waf: false,
      software: false,
      support: false,
      settings: false
    }

    if (settings !== undefined) {
      items.dashboards = settings.showDashboards;
      items.ihealth = settings.showIhealth;
      items.devices = settings.showDevice;
      items.changes = settings.showChange;
      items.certs = settings.showCert;
      items.loadBalancer = settings.showLB;
      items.gslb = settings.showGSLB;
      items.waf = settings.showWaf;
      items.software = settings.showSoftware;
      items.support = settings.showSupport;
      items.settings = settings.showSettings;
    }

    return items;
  }
});
