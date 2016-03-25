Meteor.methods({
  insertMasterCert: function (pem) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var mod = Meteor.call('sslWrapperMod', pem);
    if (mod === '') {
      throw new Meteor.error(500, 'Bad Certificate', 'The input was not a certificate or not a supported encoding');
    } else {
      var exists = Pkifiles.findOne({type: 'certificate', modulus: mod});
      if (exists === undefined) {
        var cn = Meteor.call('sslWrapperCn', pem);
        if (cn.match(/localhost.localdomain/) || cn.match(/support.f5.com/)) {
          //pass
        } else {
          var expires = Meteor.call('sslWrapperExpires', pem);
          var expDate = new Date(expires);
          var epochExpDate = expDate.valueOf()
          var certObj = {
            type: 'certificate',
            commonName: cn,
            modulus: mod,
            expirationDate: expires,
            epochExpirationDate: epochExpDate,
            pem: pem
          }
          Pkifiles.insert(certObj);
          var ret = { message: "Inserted Certificate " + cn, subject: "Success" };
          return ret;
        }
      }
    }
  },
  insertMasterKey: function (pem) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var mod = Meteor.call('keyWrapperMod', pem);
    if (mod === '') {
      throw new Meteor.error(500, 'Bad Key', 'The input was not a key or not a supported encoding');
    } else {
      var exists = Pkifiles.findOne({type: 'key', modulus: mod});
      if (exists === undefined) {
        var keyObj = {
          type: 'key',
          modulus: mod,
          pem: pem
        }
        Pkifiles.insert(keyObj);
        var ret = { message: "Inserted Key ", subject: "Success" };
        return ret;
      }
    }
  },
  syncAllPki: function () {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var bigip_devices = Devices.find({restEnabled: true});
    bigip_devices.forEach(function (eachDevice) {
      Meteor.call("getAllPki", eachDevice._id);
    });
    bigip_devices.forEach(function (eachDevice) {
      Meteor.call("pushAllPki", eachDevice._id);
    });
  },
  pullAllPki: function () {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var bigip_devices = Devices.find({restEnabled: true});
    bigip_devices.forEach(function (eachDevice) {
      Meteor.call("getAllPki", eachDevice._id);
    });
  },
  pushAllPki: function () {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var bigip_devices = Devices.find({restEnabled: true});
    bigip_devices.forEach(function (eachDevice) {
      Meteor.call("putAllPki", eachDevice._id);
    });
  },
  getAllPki: function (deviceId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Meteor.call("getPkiCerts", deviceId);
    Meteor.call("getPkiKeys", deviceId);
  },
  putAllPki: function (deviceId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    Meteor.call("putPkiKeys", deviceId);
    Meteor.call("putPkiCerts", deviceId);
  },
  getPkiCerts: function (deviceId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var device = Devices.findOne({_id: deviceId});
    var bigip = { iControl: 'rest', ip: device.mgmtAddress, user: device.mgmtUser, pass: device.mgmtPass };
    var cert_list = BigipClient.list.sys.crypto.cert(bigip);
    // var cert_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/sys/crypto/cert");
    if (cert_list.length !== undefined) {
      for (var i = 0; i < cert_list.length; i++) {
        var certObject = {
          onDevice: device_id,
          ssltype: "certificate",
          id: cert_list[i].fullPath.replace(/\.crt/, '')
        };
        if (certObject.id === undefined || certObject.id.match(/ca-bundle/)) {
          // pass
        } else {
          certObject.pem = BigipClient.download.certificate(bigip, { name: certObject.id });
          Meteor.call('insertMasterCert', certObject.pem);
        }
      }
    }
  },
  getPkiKeys: function (deviceId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var device = Devices.findOne({_id: deviceId});
    var bigip = { iControl: 'rest', ip: device.mgmtAddress, user: device.mgmtUser, pass: device.mgmtPass };
    var key_list = BigipClient.list.sys.crypto.key(bigip);
    //var key_list = mdrBigipRestGetItems(device_id, "https://localhost/mgmt/tm/sys/crypto/key");
    if (key_list.length !== undefined) {
      for (var i = 0; i < key_list.length; i++) {
        var keyObject = {
          onDevice: device_id,
          ssltype: "key"
        };
        if (keyObject.fullPath !== undefined) {
          keyObject.pem = BigipClient.download.key(bigip, { name: keyObject.fullPath });
          Meteor.call('insertMasterKey', keyObject.pem);
        }
      }
    }
  },
  putPkiCerts: function (deviceId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var device = Devices.findOne({_id: deviceId});
    var bigip = { iControl: 'rest', ip: device.mgmtAddress, user: device.mgmtUser, pass: device.mgmtPass };
    var certList = Pkifiles.find({type: 'certificate'});
    var curCertList = BigipClient.list.sys.crypto.cert(bigip);
    var certNames = '';
    if (curCertList.length !== undefined) {
      for (var i = 0; i < curCertList.length; i++) {
        certNames = certNames + curCertList[i].fullPath;
      }
    }
    certList.forEach(function (cert) {
      var certObj = { name: cert.commonName.replace(/ /g, '_') + '_' + cert.epochExpirationDate, overwrite: 1, pem: cert.pem };
      var re = new RegExp(certObj.name);
      if (certNames.match(/re/)) {
        // don't upload, its already there
      } else {
        BigipClient.upload.certificate(bigip, certObj);
      }
    });
  },
  putPkiKeys: function (deviceId) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    var device = Devices.findOne({_id: deviceId});
    var bigip = { iControl: 'rest', ip: device.mgmtAddress, user: device.mgmtUser, pass: device.mgmtPass };
    var keyList = Pkifiles.find({type: 'key'});
    var curCertList = BigipClient.list.sys.crypto.cert(bigip);
    var certNames;
    if (curCertList.length !== undefined) {
      for (var i = 0; i < curCertList.length; i++) {
        certNames = certNames + curCertList[i].fullPath;
      }
    }
    keyList.forEach(function (key) {
      var matchCert = Pkifiles.findOne({type: 'certificate', modulus: key.modulus});
      if (matchCert === undefined) {
        // Do not upload stranded keys
      } else {
        var keyObj = { name: matchCert.commonName.replace(/ /g, '_') + '_' + matchCert.epochExpirationDate, overwrite: 1, pem: key.pem };
        var re = new RegExp(keyObj.name);
        if (certNames.match(/re/)) {
          console.log('Already There Key...')
        } else {
          console.log(keyObj.name);
          BigipClient.upload.key(bigip, keyObj);
        }
      }
    });
  }
});
