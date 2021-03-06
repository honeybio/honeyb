var OnBeforeActions;

OnBeforeActions = {
  loginRequired: function(pause) {
    if (!Meteor.userId()) {
      if (Meteor.loggingIn) {
        this.render('login');
        this.layout('blankLayout');
        return;
      } else {
        this.render('login');
        this.layout('blankLayout');
        return;
      }
    }
    else {
      this.next();
    }
  }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    except: ['/login']
});

Router.configure({
    layoutTemplate: 'mainLayout',
    notFoundTemplate: 'notFound',
    loadingTemplate: 'loading'
});


Router.route('/', function () {
  this.render('Home', {
    name: 'home',
    template: 'home',
    waitOn: function () {
      return Meteor.userId();
    },
    data: function () {
      return Settings.findOne({type: 'system'});
    }
  });
});

Router.route('/settings/gettingstarted', {
  data: function () {
    return Settings.findOne({type: 'system'});
  }
});

Router.route('/settings/honeyb', {
  data: function () {
    return Settings.findOne({type: 'system'});
  }
});

Router.route('/software/upgrade');

Router.route('/software/hotfixes', {
  data: function () {
    return Images.find({type: 'hotfix'});
  }
});

Router.route('/software/images', {
  data: function () {
    return Images.find({type: 'base'});
  }
});

// Dashboards
Router.route('/dashboards/appview', function () {
  this.render('dashboardsAppview', {
    name: 'AppView',
    template: 'dashboardsAppview'
  });
});
Router.route('/applications/create');
Router.route('/dashboards/map');
Router.route('/dashboards/adcthroughput');
Router.route('/dashboards/device/health');
Router.route('/dashboards/ihealth');
Router.route('/dashboards/ihealth/test/:_id', {
  template: 'dashboardsIhealthTest',
  data: function(){
    var currentIhealth = this.params._id;
    return Ihealth.findOne({ _id: currentIhealth});
  }
});
Router.route('/dashboards/ihealth/:_id', {
  template: 'dashboardsIhealthDetails',
  data: function(){
    var currentIhealth = this.params._id;
    return Ihealth.findOne({ _id: currentIhealth});
  }
});

Router.route('/settings/user');
Router.route('/settings/user/:_id', {
  template: 'settingsUserDetails',
  data: function(){
    var currentUser = this.params._id;
    return Meteor.users.findOne({ _id: currentUser});
  }
});
Router.route('/settings/group');

Router.route('/logout', {
  data: function() {
    var logout = Meteor.logout();
  }
});

Router.route('/jobs');
Router.route('/jobs/:_id', {
  template: 'jobsDetails',
  data: function(){
    var currentJob = this.params._id;
    return Jobs.findOne({ _id: currentJob});
  }
});

// SSL Certs & Keys
Router.route('/ssl');
Router.route('/ssl/certs');
Router.route('/ssl/certs/:_id', {
  template: 'certDetails',
  data: function(){
    var currentCert = this.params._id;
    return Certificates.findOne({ _id: currentCert});
  }
});
Router.route('/ssl/master/certs');
Router.route('/ssl/master/certs/import');
Router.route('/ssl/master/keys/import');
Router.route('/ssl/keys');
Router.route('/ssl/keys/:_id', {
  template: 'keyDetails',
  data: function(){
    var currentKey = this.params._id;
    return Certificates.findOne({ _id: currentKey});
  }
});
Router.route('/ssl/master/keys');
Router.route('/ssl/csrs');
Router.route('/ssl/csrs/:_id', {
  template: 'csrDetails',
  data: function(){
    var currentCsr = this.params._id;
    return Certificates.findOne({ _id: currentCsr});
  }
});
Router.route('/ssl/profiles');
Router.route('/ssl/profiles/create');
Router.route('/ssl/profiles/:_id', {
  template: 'sslprofileDetails',
  data: function(){
    var currentProfile = this.params._id;
    return Profiles.findOne({ _id: currentProfile});
  }
});

Router.route('/settings/roles');
Router.route('/settings/roles/:_id', {
  template: 'settingsRolesDetails',
  data: function(){
    var currentRole = this.params._id;
    return Permissions.findOne({ onRole: currentRole});
  }
});

Router.route('/settings/containers');
Router.route('/settings/permissions');

// Support pages
Router.route('/support/genius');
Router.route('/support/rma');
Router.route('/support/troubleshooting');

// General
Router.route('/archives');
Router.route('/support');
Router.route('/about');
Router.route('/login', function () {
    this.render('login');
    this.layout('blankLayout')
});


// Change routes
Router.route('/changes/committed');
Router.route('/changes/scheduled');
Router.route('/changes/approved');
Router.route('/changes/canceled');
Router.route('/changes/:_id', {
  template: 'changeDetails',
  data: function (){
    var currentChange = this.params._id;
    return Changes.findOne({ _id: currentChange});
  }
});
Router.route('/changeset');
Router.route('/changeset/:_id', {
  template: 'changesetDetails',
  data: function (){
    var currentChangeset = this.params._id;
    return Changeset.findOne({ _id: currentChangeset});
  }
});

// VCMP Routes
Router.route('/vcmp/hosts');
Router.route('/vcmp/guests');
Router.route('/vcmp/guests/create');
Router.route('/vcmp/guests/migrate');
Router.route('/vcmp/guests/:_id', {
  template: 'vcmpGuestDetails',
  data: function(){
    var currentGuest = this.params._id;
    return Vcmpguests.findOne({ _id: currentGuest});
  }
});

Router.route('/vcmp/disks');
Router.route('/vcmp/disks/:_id', {
  template: 'vcmpDiskDetails',
  data: function(){
    var currentDisk = this.params._id;
    return Vcmpdisks.findOne({ _id: currentDisk});
  }
});

// Device Routes
Router.route('/devices/archives');
Router.route('/devices/qkviews');

Router.route('/devices');
Router.route('/devices/:_id', {
  template: 'deviceDetails',
  data: function(){
    var currentDevice = this.params._id;
    return Devices.findOne({ _id: currentDevice});
  }
});



// GTM Routes
Router.route('/gtm/syncgroups');
Router.route('/gtm/syncgroups/:_id', {
  template: 'gtmSyncgroupDetails',
  data: function(){
    var currentSyncgroup = this.params._id;
    return Gtmsyncgroups.findOne({ _id: currentSyncgroup});
  }
});
Router.route('/gtm/datacenters');
Router.route('/gtm/datacenters/:_id', {
  template: 'gtmDatacenterDetails',
  data: function(){
    var currentDatacenter = this.params._id;
    return Gtmdatacenters.findOne({ _id: currentDatacenter});
  }
});
Router.route('/gtm/wideips');
Router.route('/gtm/wideips/create');
Router.route('/gtm/wideips/:_id', {
  template: 'gtmWideipDetails',
  data: function(){
    var currentWideip = this.params._id;
    return Wideips.findOne({ _id: currentWideip});
  }
});
Router.route('/gtm/links');
Router.route('/gtm/links/:_id', {
  template: 'gtmLinkDetails',
  data: function(){
    var currentLink = this.params._id;
    return Gtmlinks.findOne({ _id: currentLink});
  }
});
Router.route('/gtm/servers');
Router.route('/gtm/servers/create');
Router.route('/gtm/servers/:_id', {
  template: 'gtmServerDetails',
  data: function(){
    var currentServer = this.params._id;
    return Gtmservers.findOne({ _id: currentServer});
  }
});
Router.route('/gtm/vservers');
Router.route('/gtm/vservers/create');
Router.route('/gtm/vservers/:_id', {
  template: 'gtmVserverDetails',
  data: function(){
    var currentVserver = this.params._id;
    return Gtmvservers.findOne({ _id: currentVserver});
  }
});
Router.route('/gtm/pools');
Router.route('/gtm/pools/create');
Router.route('/gtm/pools/:_id', {
  template: 'gtmPoolsDetails',
  data: function(){
    var currentPool = this.params._id;
    return Widepools.findOne({ _id: currentPool});
  }
});
Router.route('/gtm/monitors');
Router.route('/gtm/monitors/create');
Router.route('/gtm/monitors/:_id', {
  template: 'gtmMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Gtmmonitors.findOne({ _id: currentMonitor});
  }
});
// ASM Routes
Router.route('/asm/policies');
Router.route('/asm/policies/exported');
Router.route('/asm/policies/create');
Router.route('/asm/policies/:_id', {
  template: 'asmPoliciesDetails',
  data: function(){
    var currentPolicy = this.params._id;
    return Asmpolicies.findOne({ _id: currentPolicy});
  }
});

// LTM Routes
Router.route('/ltm/virtuals');
Router.route('/ltm/virtuals/create');
Router.route('/ltm/virtuals/:_id', {
  template: 'virtualDetails',
  data: function(){
    var currentVirtual = this.params._id;
    return Virtuals.findOne({ _id: currentVirtual});
  }
});
Router.route('/ltm/rules');
Router.route('/ltm/rules/create');
Router.route('/ltm/rules/:_id', {
  template: 'ruleDetails',
  data: function(){
    var currentRule = this.params._id;
    return Rules.findOne({ _id: currentRule});
  }
});
Router.route('/ltm/pools');
Router.route('/ltm/pools/create');
Router.route('/ltm/pools/:_id', {
  template: 'poolDetails',
  data: function(){
    var currentPool = this.params._id;
    return Pools.findOne({ _id: currentPool});
  }
});
Router.route('/ltm/profiles');
Router.route('/ltm/profiles/:_id', {
  template: 'profilesDetails',
  data: function(){
    var currentProfile = this.params._id;
    return Profiles.findOne({ _id: currentProfile});
  }
});
Router.route('/ltm/persistence/cookie');
Router.route('/ltm/persistence/source');
Router.route('/ltm/persistence/universal');
Router.route('/ltm/persistence/msrdp');
Router.route('/ltm/persistence/ssl');
Router.route('/ltm/persistence');
Router.route('/ltm/persistence/:_id', {
  template: 'persistenceDetails',
  data: function(){
    var currentPersistence = this.params._id;
    return Persistence.findOne({ _id: currentPersistence});
  }
});
Router.route('/ltm/datagroups');
Router.route('/ltm/datagroups/create');
Router.route('/ltm/datagroups/:_id', {
  template: 'datagroupDetails',
  data: function(){
    var currentGroup = this.params._id;
    return Datagroups.findOne({ _id: currentGroup});
  }
});
Router.route('/ltm/monitors');
Router.route('/ltm/monitors/create');

Router.route('/ltm/monitors/diameter');
Router.route('/ltm/monitors/diameter/create');
Router.route('/ltm/monitors/diameter/:_id', {
  template: 'diameterMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/dns');
Router.route('/ltm/monitors/dns/:_id', {
  template: 'dnsMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/external');
Router.route('/ltm/monitors/external/:_id', {
  template: 'externalMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/firepass');
Router.route('/ltm/monitors/firepass/:_id', {
  template: 'firepassMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/ftp');
Router.route('/ltm/monitors/ftp/:_id', {
  template: 'ftpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/gateway-icmp');
Router.route('/ltm/monitors/gateway-icmp/:_id', {
  template: 'gatewayicmpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/http');
Router.route('/ltm/monitors/http/:_id', {
  template: 'httpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/https');
Router.route('/ltm/monitors/https/:_id', {
  template: 'httpsMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/icmp');
Router.route('/ltm/monitors/icmp/:_id', {
  template: 'icmpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/imap');
Router.route('/ltm/monitors/imap/:_id', {
  template: 'imapMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/inband');
Router.route('/ltm/monitors/inband/:_id', {
  template: 'inbandMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/ldap');
Router.route('/ltm/monitors/ldap/:_id', {
  template: 'ldapMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/module-score');
Router.route('/ltm/monitors/module-score/:_id', {
  template: 'modulescoreMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/mssql');
Router.route('/ltm/monitors/mssql/:_id', {
  template: 'mssqlMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/mysql');
Router.route('/ltm/monitors/mysql/:_id', {
  template: 'mysqlMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/nntp');
Router.route('/ltm/monitors/nntp/:_id', {
  template: 'nntpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/none');
Router.route('/ltm/monitors/none/:_id', {
  template: 'noneMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/oracle');
Router.route('/ltm/monitors/oracle/:_id', {
  template: 'oracleMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/pop3');
Router.route('/ltm/monitors/pop3/:_id', {
  template: 'pop3MonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/postgresql');
Router.route('/ltm/monitors/postgresql/:_id', {
  template: 'postgresqlMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/radius');
Router.route('/ltm/monitors/radius/:_id', {
  template: 'radiusMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/radius-accounting');
Router.route('/ltm/monitors/radius-accounting/:_id', {
  template: 'radiusaccountingMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/real-server');
Router.route('/ltm/monitors/real-server/:_id', {
  template: 'realserverMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/rpc');
Router.route('/ltm/monitors/rpc/:_id', {
  template: 'rpcMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/sasp');
Router.route('/ltm/monitors/sasp/:_id', {
  template: 'saspMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/scripted');
Router.route('/ltm/monitors/scripted/:_id', {
  template: 'scriptedMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/sip');
Router.route('/ltm/monitors/sip/:_id', {
  template: 'sipMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/smb');
Router.route('/ltm/monitors/smb/:_id', {
  template: 'smbMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/smtp');
Router.route('/ltm/monitors/smtp/:_id', {
  template: 'smtpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/snmp-dca');
Router.route('/ltm/monitors/snmp-dca/:_id', {
  template: 'snmpdcaMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/snmp-dca-base');
Router.route('/ltm/monitors/snmp-dca-base/:_id', {
  template: 'snmpdcabaseMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/soap');
Router.route('/ltm/monitors/soap/:_id', {
  template: 'soapMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/tcp');
Router.route('/ltm/monitors/tcp/:_id', {
  template: 'tcpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/tcp-echo');
Router.route('/ltm/monitors/tcp-echo/:_id', {
  template: 'tcpechoMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/tcp-half-open');
Router.route('/ltm/monitors/tcp-half-open/:_id', {
  template: 'tcphalfopenMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/udp');
Router.route('/ltm/monitors/udp/:_id', {
  template: 'udpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/virtual-location');
Router.route('/ltm/monitors/virtual-location/:_id', {
  template: 'virtuallocationMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/wap');
Router.route('/ltm/monitors/wap/:_id', {
  template: 'wapMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/wmi');
Router.route('/ltm/monitors/wmi/:_id', {
  template: 'wmiMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});


//
// Other pages routes
//
Router.route('/notFound', function () {
    this.render('notFound');
    this.layout('blankLayout');
});

// Default route
// You can use direct this.render('template')
// We use Router.go method because dashboardsAppview is our nested view in menu
// Router.route('/', function () {
//     Router.go('dashboardsAppview');
// });
