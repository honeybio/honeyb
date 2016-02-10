Package.describe({
  name: 'bespintech:meteor-x509-tool',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A package that creates and gets attributes of x509 certificates',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  'pem' : '1.8.1',
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('x509-parser.js');
  api.export('certificateParser', 'server');
  api.addFiles('certificate-parser.js', 'server');
  api.addFiles('certificate-generator.js', 'server');

});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('bespintech:meteor-x509-tool');
  api.addFiles('x509-parser-tests.js');
});
