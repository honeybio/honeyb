Template.uploadForm.rendered = function() {
  Softwareimages.resumable.assignDrop($("#filedrop"));
  Softwareimages.resumable.assignBrowse($("#upload"));
};

Template.uploadForm.onCreated( function() {
  this.progress = new ReactiveVar();
  this.progress.set(null);
});

Template.uploadForm.events({
  'click #filedrop': function(e, t) {
    event.preventDefault();
    $("#upload").click();
  }
});

Template.uploadForm.helpers({
  getProgress: function () {
    // return (Session.get('imageUpload') * 100).toFixed(2);
    var progress = Session.get('imageUpload');
    var rounded = (progress * 100).toFixed(0);
    if (Session.get('imageUpload') === 1) {
      return null;
    } else if (Session.get('imageUpload') === undefined) {
      return null;
    } else {
        return rounded;
    }
  }
})
Template.softwareImages.helpers({
  getImages: function () {
    return Softwareimages.find();
  },
  allFiles: function () {
    return Softwareimages.find();
  },
  round: function (size) {
    return (size/1048576).toFixed(2) + ' MB';
  },
  getVersion: function (md5sum) {
    if (md5sum === '89ebf4e55306f4c6e449f77c7aea562b') {
      return 'F5 Verified: BIGIP-12.0.0.0.0.606.iso';
    } else if (md5sum === '5a4fda25c0c40bd7c132b001a17e055b') {
      return 'F5 Verified: BIGIP-11.6.0.0.0.401.iso';
    } else {
      return 'Unknown';
    }
  }
});

Template.softwareHotfixes.helpers({
  getHotfixes: function () {
    return Softwareimages.find();
  },
  allFiles: function () {
    return Softwareimages.find();
  },
  round: function (size) {
    return (size/1048576).toFixed(2) + ' MB';
  },
  getVersion: function (md5sum) {
    if (md5sum === '8f5b4b2ff9f65845620897f65077f854') {
      return 'F5 Verified: Hotfix-BIGIP-11.6.0.5.0.429-HF5.iso';
    } else if (md5sum === '9ec4112ac204a747ea4e58469b21dca2') {
      return 'F5 Verified: Hotfix-BIGIP-11.5.2.1.0.169-HF1.iso';
    } else {
      return 'Unknown';
    }
  }
});
