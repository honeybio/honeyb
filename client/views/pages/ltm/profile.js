Template.ltmProfileTcpCreate.helpers({
  getDeviceList: function () {
    var result = Devices.find({});
    return result;
  }
});
Template.ltmProfileTcpCreate.events({
  "submit #profForm": function (event, template) {
    event.preventDefault();
    var device_id = event.target.device.value;
    var profObj = {
      kind: "tm:ltm:profile:tcp:tcpstate",
      name: event.target.prof_name.value,
      abc: null,
      ackOnPush: null,
      closeWaitTimeout: null,
      cmetricsCache: null,
      congestionControl: null,
      defaultsFrom: "/Common/tcp",
      deferredAccept: null,
      delayWindowControl: null,
      delayedAcks: null,
      dsack: null,
      earlyRetransmit: null,
      ecn: null,
      finWaitTimeout: null,
      hardwareSynCookie: null,
      idleTimeout: null,
      initCwnd: null,
      initRwnd: null,
      ipTosToClient: null,
      keepAliveInterval: null,
      limitedTransmit: null,
      linkQosToClient: null,
      maxRetrans: null,
      maxSegmentSize: null,
      md5Signature: null,
      minimumRto: 0,
      mptcp: null,
      mptcpCsum: null,
      mptcpCsumVerify: null,
      mptcpDebug: null,
      mptcpFallback: null,
      mptcpFastjoin: null,
      mptcpIdleTimeout: null,
      mptcpJoinMax: null,
      mptcpMakeafterbreak: null,
      mptcpNojoindssack: null,
      mptcpRtomax: null,
      mptcpRxmitmin: null,
      mptcpSubflowmax: null,
      mptcpTimeout: null,
      nagle: null,
      pktLossIgnoreBurst: null,
      pktLossIgnoreRate: null,
      proxyBufferHigh: null,
      proxyBufferLow: null,
      proxyMss: null,
      proxyOptions: null,
      ratePace: null,
      receiveWindowSize: null,
      resetOnTimeout: null,
      selectiveAcks: null,
      selectiveNack: null,
      sendBufferSize: null,
      slowStart: null,
      synCookieWhitelist: null,
      synMaxRetrans: null,
      synRtoBase: null,
      tailLossProbe: null,
      timeWaitRecycle: null,
      timeWaitTimeout: null,
      timestamps: null,
      verifiedAccept: null,
      zeroWindowTimeout: null
    };
    Meteor.call("addTcpProfileCommand", device_id, profObj, stage, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  }
});
