Package.describe({
  name: 'meteor-change-control',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'A package to manage change authorization',
  // URL to the Git repository containing the source code for this package.
  git: 'git://git@10.1.10.38:honeyb-devs/meteor-change-control',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.addFiles('meteor-change-control.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('meteor-change-control');
  api.addFiles('meteor-change-control-tests.js');
});
