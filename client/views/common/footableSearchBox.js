// objects="getObjects" actions="getActions" link="getLink"
Template.footableSearchBox.helpers({
  getFooData: function () {
    var parentTemplate = Template.instance().view.parentView.name.replace(/Template\./, '');
    if (parentTemplate === null) {
      return null;
    } else {
      var searchElements = {
        ltmVirtuals: {
          link: { url:'/ltm/virtuals/create', name: 'Create' },
          actions: ['Enable', 'Disable', 'Delete'],
          objects: 'Virtuals'
        },
        ltmPools: {
          link: { url: '/ltm/pools/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'Pools'
        },
        asmPolicies: {
          link: { url: '/asm/policy/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'WAF Policies'
        },
        changesCommitted: {
          link: { url: null, name: null },
          actions: [],
          objects: 'Changes'
        },
        sslCerts: {
          link: { url: '/ssl/certs/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'SSL Certifcates'
        },
        sslKeys: {
          link: { url: '/ssl/keys/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'SSL Keys'
        },
        sslProfiles: {
          link: { url: '/ssl/profiles/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'SSL Profiles'
        },
        devices: {
          link: { url: '/devices/', name: 'Add' },
          actions: ['Delete'],
          objects: 'Devices'
        },
        devicesArchives: {
          link: { url: null, name: null },
          actions: ['Delete'],
          objects: 'Device Archives'
        },
        gtmWideips: {
          link: { url: '/gtm/wideips/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'GSLB Wide IPs'
        },
        gtmSyncgroups: {
          link: { url: null, name: null },
          actions: [],
          objects: 'GSLB Syncgroups'
        },
        gtmDatacenters: {
          link: { url: null, name: null },
          actions: ['Delete', 'Disable'],
          objects: 'GSLB Datacenters'
        },
        gtmLinks: {
          link: { url: null, name: null },
          actions: ['Delete', 'Disable'],
          objects: 'GSLB Links'
        },
        gtmServers: {
          link: { url: '/gtm/servers/create', name: 'Create' },
          actions: ['Delete', 'Disable'],
          objects: 'GSLB Servers'
        },
        gtmVservers: {
          link: { url: '/gtm/vservers/create', name: 'Create' },
          actions: ['Delete', 'Disable'],
          objects: 'GSLB Virtual Servers'
        },
        gtmPools: {
          link: { url: '/gtm/pools/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'GSLB Pools'
        },
        gtmMonitors: {
          link: { url: '/gtm/monitors/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'GSLB Monitors'
        },
        dashboardsIhealth: {
          link: { url: null, name: null },
          actions: ['Delete'],
          objects: 'iHealth Uploads'
        },
        ltmMonitors: {
          link: { url: '/ltm/monitors/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'Monitors '
        },
        ltmProfiles: {
          link: { url: '/ltm/profiles/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'Profiles'
        },
        ltmRules: {
          link: { url: '/ltm/rules/create', name: 'Create' },
          actions: ['Delete'],
          objects: 'iRules'
        },
        softwareImages: {
          link: { url: null, name: null },
          actions: ['Delete'],
          objects: 'Software Images'
        },
        softwareHotfixes: {
          link: { url: null, name: null },
          actions: ['Delete'],
          objects: 'BIG-IP Hotfixes'
        },
        poolDetails: {
          link: { url: null, name: null },
          actions: ['Enable', 'Disable', 'Force', 'Delete'],
          objects: 'Pool Members'
        }
      }
      if (searchElements[parentTemplate] !== undefined) {
        return searchElements[parentTemplate];
      } else {
        return { link: { url: null, name: null }, actions: [], objects: null };
      }
    }
  }
});
