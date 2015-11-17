var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function(pause) {
      if (!Meteor.userId()) {
        this.render('login');
        this.layout('blankLayout');
        return;
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
    notFoundTemplate: 'notFound'
});


Router.route('/', function () {
  this.render('Home', {
    name: 'home',
    template: 'home'
  });
});

Router.route('/settings/gettingstarted');

// Dashboards
Router.route('/dashboards/appview', function () {
  this.render('dashboardsAppview', {
    name: 'AppView',
    template: 'dashboardsAppview'
  });
});
Router.route('/applications/create');
Router.route('/dashboards/adcthroughput');
Router.route('/dashboards/ihealth');
Router.route('/dashboards/ihealth/:_id', {
  template: 'dashboardsIhealthDetails',
  data: function(){
    var currentIhealth = this.params._id;
    return Ihealth.findOne({ _id: currentIhealth});
  }
});

Router.route('/myprofile', {
  data: function () {
    return Settings.findOne({type: 'system'});
  }
});

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
Router.route('/ssl/keys');
Router.route('/ssl/keys/:_id', {
  template: 'keyDetails',
  data: function(){
    var currentKey = this.params._id;
    return Certificates.findOne({ _id: currentKey});
  }
});
Router.route('/ssl/csrs');
Router.route('/ssl/csrs/:_id', {
  template: 'csrDetails',
  data: function(){
    var currentCsr = this.params._id;
    return Certificates.findOne({ _id: currentCsr});
  }
});
Router.route('/ssl/profiles');
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
    return Meteor.roles.findOne({ _id: currentRole});
  }
});
Router.route('/settings/containers');
Router.route('/settings/permissions');

// General
Router.route('/archives');
Router.route('/support');
Router.route('/about');
Router.route('/login', function () {
    this.render('login');
    this.layout('blankLayout')
});


// Change routes
Router.route('/changes');
Router.route('/changes/pushed');
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

// Device Routes
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
Router.route('/gtm/servers/:_id', {
  template: 'gtmServerDetails',
  data: function(){
    var currentServer = this.params._id;
    return Gtmservers.findOne({ _id: currentServer});
  }
});
Router.route('/gtm/vservers');
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
Router.route('/ltm/profiles/unsupported_profile');
Router.route('/ltm/profiles/clientssl');
Router.route('/ltm/profiles/http');
Router.route('/ltm/profiles/tcp');
Router.route('/ltm/profiles/oneconnect');
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
Router.route('/ltm/idatagroups');
Router.route('/ltm/idatagroups/:_id', {
  template: 'idatagroupDetails',
  data: function(){
    var currentGroup = this.params._id;
    return Idatagroups.findOne({ _id: currentGroup});
  }
});
Router.route('/ltm/monitors');

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
Router.route('/ltm/monitors/dns/create');
Router.route('/ltm/monitors/dns/:_id', {
  template: 'dnsMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/external');
Router.route('/ltm/monitors/external/create');
Router.route('/ltm/monitors/external/:_id', {
  template: 'externalMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/firepass');
Router.route('/ltm/monitors/firepass/create');
Router.route('/ltm/monitors/firepass/:_id', {
  template: 'firepassMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/ftp');
Router.route('/ltm/monitors/ftp/create');
Router.route('/ltm/monitors/ftp/:_id', {
  template: 'ftpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/gateway-icmp');
Router.route('/ltm/monitors/gateway-icmp/create');
Router.route('/ltm/monitors/gateway-icmp/:_id', {
  template: 'gatewayicmpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/http');
Router.route('/ltm/monitors/http/create');
Router.route('/ltm/monitors/http/:_id', {
  template: 'httpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/https');
Router.route('/ltm/monitors/https/create');
Router.route('/ltm/monitors/https/:_id', {
  template: 'httpsMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/icmp');
Router.route('/ltm/monitors/icmp/create');
Router.route('/ltm/monitors/icmp/:_id', {
  template: 'icmpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/imap');
Router.route('/ltm/monitors/imap/create');
Router.route('/ltm/monitors/imap/:_id', {
  template: 'imapMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/inband');
Router.route('/ltm/monitors/inband/create');
Router.route('/ltm/monitors/inband/:_id', {
  template: 'inbandMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/ldap');
Router.route('/ltm/monitors/ldap/create');
Router.route('/ltm/monitors/ldap/:_id', {
  template: 'ldapMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/module-score');
Router.route('/ltm/monitors/module-score/create');
Router.route('/ltm/monitors/module-score/:_id', {
  template: 'modulescoreMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/mssql');
Router.route('/ltm/monitors/mssql/create');
Router.route('/ltm/monitors/mssql/:_id', {
  template: 'mssqlMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/mysql');
Router.route('/ltm/monitors/mysql/create');
Router.route('/ltm/monitors/mysql/:_id', {
  template: 'mysqlMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/nntp');
Router.route('/ltm/monitors/nntp/create');
Router.route('/ltm/monitors/nntp/:_id', {
  template: 'nntpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/none');
Router.route('/ltm/monitors/none/create');
Router.route('/ltm/monitors/none/:_id', {
  template: 'noneMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/oracle');
Router.route('/ltm/monitors/oracle/create');
Router.route('/ltm/monitors/oracle/:_id', {
  template: 'oracleMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/pop3');
Router.route('/ltm/monitors/pop3/create');
Router.route('/ltm/monitors/pop3/:_id', {
  template: 'pop3MonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/postgresql');
Router.route('/ltm/monitors/postgresql/create');
Router.route('/ltm/monitors/postgresql/:_id', {
  template: 'postgresqlMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/radius');
Router.route('/ltm/monitors/radius/create');
Router.route('/ltm/monitors/radius/:_id', {
  template: 'radiusMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/radius-accounting');
Router.route('/ltm/monitors/radius-accounting/create');
Router.route('/ltm/monitors/radius-accounting/:_id', {
  template: 'radiusaccountingMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/real-server');
Router.route('/ltm/monitors/real-server/create');
Router.route('/ltm/monitors/real-server/:_id', {
  template: 'realserverMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/rpc');
Router.route('/ltm/monitors/rpc/create');
Router.route('/ltm/monitors/rpc/:_id', {
  template: 'rpcMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/sasp');
Router.route('/ltm/monitors/sasp/create');
Router.route('/ltm/monitors/sasp/:_id', {
  template: 'saspMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/scripted');
Router.route('/ltm/monitors/scripted/create');
Router.route('/ltm/monitors/scripted/:_id', {
  template: 'scriptedMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/sip');
Router.route('/ltm/monitors/sip/create');
Router.route('/ltm/monitors/sip/:_id', {
  template: 'sipMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/smb');
Router.route('/ltm/monitors/smb/create');
Router.route('/ltm/monitors/smb/:_id', {
  template: 'smbMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/smtp');
Router.route('/ltm/monitors/smtp/create');
Router.route('/ltm/monitors/smtp/:_id', {
  template: 'smtpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/snmp-dca');
Router.route('/ltm/monitors/snmp-dca/create');
Router.route('/ltm/monitors/snmp-dca/:_id', {
  template: 'snmpdcaMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/snmp-dca-base');
Router.route('/ltm/monitors/snmp-dca-base/create');
Router.route('/ltm/monitors/snmp-dca-base/:_id', {
  template: 'snmpdcabaseMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/soap');
Router.route('/ltm/monitors/soap/create');
Router.route('/ltm/monitors/soap/:_id', {
  template: 'soapMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/tcp');
Router.route('/ltm/monitors/tcp/create');
Router.route('/ltm/monitors/tcp/:_id', {
  template: 'tcpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/tcp-echo');
Router.route('/ltm/monitors/tcp-echo/create');
Router.route('/ltm/monitors/tcp-echo/:_id', {
  template: 'tcpechoMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/tcp-half-open');
Router.route('/ltm/monitors/tcp-half-open/create');
Router.route('/ltm/monitors/tcp-half-open/:_id', {
  template: 'tcphalfopenMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/udp');
Router.route('/ltm/monitors/udp/create');
Router.route('/ltm/monitors/udp/:_id', {
  template: 'udpMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/virtual-location');
Router.route('/ltm/monitors/virtual-location/create');
Router.route('/ltm/monitors/virtual-location/:_id', {
  template: 'virtuallocationMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/wap');
Router.route('/ltm/monitors/wap/create');
Router.route('/ltm/monitors/wap/:_id', {
  template: 'wapMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});
Router.route('/ltm/monitors/wmi');
Router.route('/ltm/monitors/wmi/create');
Router.route('/ltm/monitors/wmi/:_id', {
  template: 'wmiMonitorDetails',
  data: function(){
    var currentMonitor = this.params._id;
    return Monitors.findOne({ _id: currentMonitor});
  }
});



//
// Dashboards routes
//

Router.route('/dashboard1', function () {
    this.render('dashboard1');
});
Router.route('/dashboard2', function () {
    this.render('dashboard2');
});
Router.route('/dashboard3', function () {
    this.render('dashboard3');
});
Router.route('/dashboard4', function () {
    this.render('dashboard4');
    this.layout('layout2');
});
Router.route('/dashboard4l', function () {
    this.render('dashboard4l');
});
Router.route('/dashboard5', function () {
    this.render('dashboard5');
});


//
// Layouts route
//

Router.route('/layouts', function () {
    this.render('layouts');
});

//
// Graphs routes
//

Router.route('/graphFlot', function () {
    this.render('graphFlot');
});

Router.route('/graphRickshaw', function () {
    this.render('graphRickshaw');
});

Router.route('/graphChartJs', function () {
    this.render('graphChartJs');
});

Router.route('/graphChartist', function () {
    this.render('graphChartist');
});

Router.route('/graphPeity', function () {
    this.render('graphPeity');
});

Router.route('/graphSparkline', function () {
    this.render('graphSparkline');
});

//
// Mailbox
//

Router.route('/mailbox', function () {
    this.render('mailbox');
});

Router.route('/emailView', function () {
    this.render('emailView');
});

Router.route('/emailCompose', function () {
    this.render('emailCompose');
});

Router.route('/emailTemplates', function () {
    this.render('emailTemplates');
});

//
// Widgets
//

Router.route('/widgets', function () {
    this.render('widgets');
});

//
// Metrics
//

Router.route('/metrics', function () {
    this.render('metrics');
});

//
// Forms
//

Router.route('/formBasic', function () {
    this.render('formBasic');
});

Router.route('/formAdvanced', function () {
    this.render('formAdvanced');
});

Router.route('/formWizard', function () {
    this.render('formWizard');
});

Router.route('/formUpload', function () {
    this.render('formUpload');
});

Router.route('/textEditor', function () {
    this.render('textEditor');
});

//
// App Views
//

Router.route('/contacts', function () {
    this.render('contacts');
});

Router.route('/profile', function () {
    this.render('profile');
});

Router.route('/profile2', function () {
    this.render('profile2');
});

Router.route('/contacts2', function () {
    this.render('contacts2');
});

Router.route('/projects', function () {
    this.render('projects');
});

Router.route('/projectDetail', function () {
    this.render('projectDetail');
});

Router.route('/teamsBoard', function () {
    this.render('teamsBoard');
});

Router.route('/socialFeed', function () {
    this.render('socialFeed');
});

Router.route('/clients', function () {
    this.render('clients');
});

Router.route('/fullHeight', function () {
    this.render('fullHeight');
});

Router.route('/offCanvas', function () {
    this.render('offCanvas');
});

Router.route('/voteList', function () {
    this.render('voteList');
});

Router.route('/fileManager', function () {
    this.render('fileManager');
});

Router.route('/calendar', function () {
    this.render('calendar');
});

Router.route('/issueTracker', function () {
    this.render('issueTracker');
});

Router.route('/blog', function () {
    this.render('blog');
});

Router.route('/article', function () {
    this.render('article');
});

Router.route('/faq', function () {
    this.render('faq');
});

Router.route('/timelineOne', function () {
    this.render('timelineOne');
});

Router.route('/pinBoard', function () {
    this.render('pinBoard');
});

//
// Other pages
//

Router.route('/searchResult', function () {
    this.render('searchResult');
});

Router.route('/lockScreen', function () {
    this.render('lockScreen');
    this.layout('blankLayout')
});

Router.route('/invoice', function () {
    this.render('invoice');
});

Router.route('/invoicePrint', function () {
    this.render('invoicePrint');
    this.layout('blankLayout')
});

Router.route('/loginTwo', function () {
    this.render('loginTwo');
    this.layout('blankLayout')
});

Router.route('/forgotPassword', function () {
    this.render('forgotPassword');
    this.layout('blankLayout')
});

Router.route('/register', function () {
    this.render('register');
    this.layout('blankLayout')
});

Router.route('/errorOne', function () {
    this.render('errorOne');
    this.layout('blankLayout')
});

Router.route('/errorTwo', function () {
    this.render('errorTwo');
    this.layout('blankLayout')
});

Router.route('/emptyPage', function () {
    this.render('emptyPage');
});

//
// Miscellaneous
//

Router.route('/toastrNotification', function () {
    this.render('toastrNotification');
});

Router.route('/nestableList', function () {
    this.render('nestableList');
});

Router.route('/agileBoard', function () {
    this.render('agileBoard');
});

Router.route('/timelineTwo', function () {
    this.render('timelineTwo');
});

Router.route('/diff', function () {
    this.render('diff');
});

Router.route('/sweetAlert', function () {
    this.render('sweetAlert');
});

Router.route('/idleTimer', function () {
    this.render('idleTimer');
});

Router.route('/spinners', function () {
    this.render('spinners');
});

Router.route('/liveFavicon', function () {
    this.render('liveFavicon');
});

Router.route('/googleMaps', function () {
    this.render('googleMaps');
});

Router.route('/codeEditor', function () {
    this.render('codeEditor');
});

Router.route('/modalWindow', function () {
    this.render('modalWindow');
});

Router.route('/forumView', function () {
    this.render('forumView');
});

Router.route('/forumDetail', function () {
    this.render('forumDetail');
});

Router.route('/validation', function () {
    this.render('validation');
});

Router.route('/treeView', function () {
    this.render('treeView');
});

Router.route('/chatView', function () {
    this.render('chatView');
});

Router.route('/masonry', function () {
    this.render('masonry');
});

//
// UI Elements
//

Router.route('/typography', function () {
    this.render('typography');
});

Router.route('/icons', function () {
    this.render('icons');
});

Router.route('/draggablePanels', function () {
    this.render('draggablePanels');
});

Router.route('/buttons', function () {
    this.render('buttons');
});

Router.route('/video', function () {
    this.render('video');
});

Router.route('/tabsPanels', function () {
    this.render('tabsPanels');
});

Router.route('/tabs', function () {
    this.render('tabs');
});

Router.route('/notifications', function () {
    this.render('notifications');
});

Router.route('/badgesLabels', function () {
    this.render('badgesLabels');
});

//
// Grid Options
//

Router.route('/gridOptions', function () {
    this.render('gridOptions');
});

//
// Tables
//

Router.route('/tableStatic', function () {
    this.render('tableStatic');
});

Router.route('/dataTables', function () {
    this.render('dataTables');
});

Router.route('/fooTables', function () {
    this.render('fooTables');
});

//
// E-commerce
//

Router.route('/productsGrid', function () {
    this.render('productsGrid');
});

Router.route('/productsList', function () {
    this.render('productsList');
});

Router.route('/productEdit', function () {
    this.render('productEdit');
});

Router.route('/orders', function () {
    this.render('orders');
});

Router.route('/productDetail', function () {
    this.render('productDetail');
});

Router.route('/payments', function () {
    this.render('payments');
});

//
// Gallery
//

Router.route('/gallery', function () {
    this.render('gallery');
});

Router.route('/carusela', function () {
    this.render('carusela');
});

Router.route('/slick', function () {
    this.render('slick');
});


//
// CSS Animations
//

Router.route('/cssAnimations', function () {
    this.render('cssAnimations');
});

//
// Landing page
//

Router.route('/landing', function () {
    this.render('landing');
    this.layout('blankLayout')
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
// We use Router.go method because dashboard1 is our nested view in menu
// Router.route('/', function () {
//     Router.go('dashboard1');
// });
