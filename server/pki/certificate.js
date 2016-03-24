Meteor.methods({
  insertMasterCert: function (pem) {
    var mod = Meteor.call('sslWrapperMod', pem);
    if (mod === '') {
      throw new Meteor.error(500, 'Bad Certificate', 'The input was not a certificate or not a supported encoding');
    } else {
      var exists = Pkifiles.findOne({type: 'certificate', modulus: mod});
      if (exists === undefined) {
        var cn = Meteor.call('sslWrapperCn', pem);
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
  },
  insertMasterKey: function (pem) {
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
  }
});
