// objects="getObjects" actions="getActions" link="getLink"
Template.footableSearchBox.helpers({
  getFooData: function () {
    var parentTemplate = Template.instance().view.parentView.name.replace(/Template\./, '');
    if (parentTemplate === null) {
      return null;
    } else {
      var searchElements = {
        ltmVirtuals: {
          link: [{ url:'/ltm/virtuals/create', name: 'Create' }],
          actions: ['Enable', 'Disable', 'Delete'],
          objects: 'Virtuals'
        },
        ltmPools: {
          link: [{ url: '/ltm/pools/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'Pools'
        },
        ltmDatagroups: {
          link: [{ url: '/ltm/datagroups/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'Datagroups'
        },
        asmPolicies: {
          link: [],
          actions: ['Delete', 'Export'],
          objects: 'WAF Policies'
        },
        changesCommitted: {
          link: [],
          actions: [],
          objects: 'Changes'
        },
        sslCerts: {
          link: [{ url: '/ssl/certs/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'SSL Certifcates'
        },
        sslKeys: {
          link: [{ url: '/ssl/keys/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'SSL Keys'
        },
        sslProfiles: {
          link: [{ url: '/ssl/profiles/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'SSL Profiles'
        },
        devices: {
          actions: ['Add', 'Delete', 'Refresh', 'Archive'],
          objects: 'Devices'
        },
        devicesArchives: {
          link: [],
          actions: ['Pin', 'Unpin', 'Delete'],
          objects: 'Device Archives'
        },
        gtmWideips: {
          link: [{ url: '/gtm/wideips/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'GSLB Wide IPs'
        },
        gtmSyncgroups: {
          link: [],
          actions: ['Refresh'],
          objects: 'GSLB Syncgroups'
        },
        gtmDatacenters: {
          link: [],
          actions: ['Enable', 'Disable', 'Delete'],
          objects: 'GSLB Datacenters'
        },
        gtmLinks: {
          link: [],
          actions: ['Enable', 'Disable', 'Delete'],
          objects: 'GSLB Links'
        },
        gtmServers: {
          link: [{ url: '/gtm/servers/create', name: 'Create' }],
          actions: ['Enable', 'Disable', 'Delete'],
          objects: 'GSLB Servers'
        },
        gtmServerDetails: {
          link: [],
          actions: ['Add', 'Enable', 'Disable', 'Delete'],
          objects: 'GSLB Virtual Servers'
        },
        gtmPools: {
          link: [{ url: '/gtm/pools/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'GSLB Pools'
        },
        gtmMonitors: {
          link: [{ url: '/gtm/monitors/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'GSLB Monitors'
        },
        dashboardsIhealth: {
          link: [],
          actions: ['Delete', 'Update'],
          objects: 'iHealth Uploads'
        },
        ltmMonitors: {
          link: [{ url: '/ltm/monitors/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'Monitors '
        },
        ltmProfiles: {
          link: [{ url: '/ltm/profiles/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'Profiles'
        },
        ltmRules: {
          link: [{ url: '/ltm/rules/create', name: 'Create' }],
          actions: ['Delete'],
          objects: 'iRules'
        },
        settingsUser: {
          link: [],
          actions: ['Delete'],
          objects: ''
        },
        settingsRoles: {
          link: [],
          actions: ['Delete'],
          objects: ''
        },
        softwareImages: {
          link: [],
          actions: ['Delete'],
          objects: 'Software Images'
        },
        softwareHotfixes: {
          link: [],
          actions: ['Delete'],
          objects: 'BIG-IP Hotfixes'
        },
        poolDetails: {
          link: [],
          actions: ['Enable', 'Disable', 'Force', 'Delete'],
          objects: 'Pool Members'
        },
        vcmpHosts: {
          link: [],
          actions: [],
          objects: 'VCMP Hosts'
        },
        vcmpGuests: {
          link: [ { url: '/vcmp/guests/create', name: 'Create' },
                  { url: '/vcmp/guests/migrate', name: 'Migrate'}
                ],
          actions: ['Start', 'Reboot', 'Shutdown', 'Power-off', 'Delete'],
          objects: 'VCMP Hosts'
        },
        vcmpDisks: {
          link: [],
          actions: ['Add', 'Delete', 'Copy'],
          objects: 'VCMP Disks'}
      }
      if (searchElements[parentTemplate] !== undefined) {
        return searchElements[parentTemplate];
      } else {
        return { link: [], actions: [], objects: null };
      }
    }
  }
});
