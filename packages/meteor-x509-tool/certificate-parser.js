var parse = Npm.require('pem');


var certificateParser = function (certificate) {
  parse.readCertificateInfo(certificate, function (err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log (res);
    }
  })
}
