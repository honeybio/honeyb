Template.virtualSearchBox.helpers({
  virtualsIndex: () => VirtualsIndex,
  logme: function (object) {
    console.log(object);
  }
});

Template.devicesSearchBox.helpers({
  devicesIndex: () => DevicesIndex
});

Template.certificatesSearchBox.helpers({
  certificatesIndex: () => CertificatesIndex
});

Template.rulesSearchBox.helpers({
  rulesIndex: () => RulesIndex
});

Template.poolsSearchBox.helpers({
  poolsIndex: () => PoolsIndex
});

Template.nodesSearchBox.helpers({
  nodesIndex: () => NodesIndex
});

Template.monitorsSearchBox.helpers({
  monitorsIndex: () => MonitorsIndex
});

Template.gtmsyncgroupsSearchBox.helpers({
  gtmsyncgroupsIndex: () => GtmsyncgroupsIndex
});

Template.gtmdatacentersSearchBox.helpers({
  gtmdatacentersIndex: () => GtmdatacentersIndex
});

Template.gtmserversSearchBox.helpers({
  gtmserversIndex: () => GtmserversIndex
});

Template.gtmvserversSearchBox.helpers({
  gtmvserversIndex: () => GtmvserversIndex
});

Template.gtmlinksSearchBox.helpers({
  gtmlinksIndex: () => GtmlinksIndex
});

Template.gtmmonitorsSearchBox.helpers({
  gtmmonitorsIndex: () => GtmmonitorsIndex
});

Template.wideipsSearchBox.helpers({
  wideipsIndex: () => WideipsIndex
});

Template.widepoolsSearchBox.helpers({
  widepoolsIndex: () => WidepoolsIndex
});

Template.idatagroupsSearchBox.helpers({
  idatagroupsIndex: () => IdatagroupsIndex
});

Template.edatagroupsSearchBox.helpers({
  edatagroupsIndex: () => EdatagroupsIndex
});

Template.profilesSearchBox.helpers({
  profilesIndex: () => ProfilesIndex
});

Template.persistenceSearchBox.helpers({
  persistenceIndex: () => PersistenceIndex
});

Template.statisticsSearchBox.helpers({
  statisticsIndex: () => StatisticsIndex
});

Template.changesSearchBox.helpers({
  changesIndex: () => ChangesIndex
});

Template.changesetSearchBox.helpers({
  changesetIndex: () => ChangesetIndex
});

Template.settingsSearchBox.helpers({
  settingsIndex: () => SettingsIndex
});

Template.ihealthSearchBox.helpers({
  ihealthIndex: () => IhealthIndex
});

Template.jobsSearchBox.helpers({
  jobsIndex: () => JobsIndex
});

Template.asmPoliciesSearchBox.helpers({
  asmPoliciesIndex: () => AsmPoliciesIndex
})
