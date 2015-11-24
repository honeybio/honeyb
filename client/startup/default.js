// Run this when the meteor app is started
Meteor.startup(function () {
  // This assigns a file upload drop zone to some DOM node
  Softwareimages.resumable.assignDrop($("#filedrop"));
  Softwareimages.resumable.assignBrowse($("#upload"));
  // When a file is added via drag and drop
  Softwareimages.resumable.on('fileAdded', function (file) {
    Session.set('imageUpload', 0);
    // Create a new file in the file collection to upload
    Softwareimages.insert({
      _id: file.uniqueIdentifier,  // This is the ID resumable will use
      filename: file.fileName,
      contentType: file.file.type
      },
      function (err, _id) {  // Callback to .insert
        if (err) { return console.error("File creation failed!", err); }
        // Once the file exists on the server, start uploading
        Softwareimages.resumable.upload();
      }
    );
  });
  Softwareimages.resumable.on('fileProgress', function(file) {
    Session.set('imageUpload', this.progress());
  });

  Deps.autorun(function () {
    // Sending userId prevents a race condition
    Meteor.subscribe('myData', Meteor.userId());
    // $.cookie() assumes use of "jquery-cookie" Atmosphere package.
    // You can use any other cookie package you may prefer...
    // $.cookie('X-Auth-Token', Accounts._storedLoginToken());
  });
});
