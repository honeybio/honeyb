Meteor.methods({
  ihealthAuthCookie: function (user, password) {
    // {"user_id": "j.smith@example.com", "user_secret": "Secret!P@ssw@rd"}
    var post_data = { user_id: user, user_secret: password };
    var authUrl = "https://api.f5.com/auth/pub/sso/login/ihealth-api";
    try {
      var response = HTTP.post(authUrl, {data: post_data});
      return response.headers['set-cookie'];
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  ihealthGetList: function () {
    // var listQkviewUrl = "https://ihealth-api.f5.com/qkview-analyzer/api/qkviews.json";
    var listQkviewUrl = "https://ihealth-api.f5.com/qkview-analyzer/api/qkviews";
    var settings = Settings.findOne({type: "system"});
    var cookies = Meteor.call('ihealthAuthCookie', settings.ihealthUser, settings.ihealthPass);
    var cHeader = cookies[0].replace(/;.*/, "");
    for (i = 1; i < cookies.length; i++) {
      cHeader = cHeader + ';' + cookies[i].replace(/;.*/, "");
    }
    var myHeaders = { Accept: "application/vnd.f5.ihealth.api+json", Cookie: cHeader }
    //console.log(myHeaders);
    try {
      var qkviewList = HTTP.get(listQkviewUrl, { headers: myHeaders });
      console.log(qkviewList.content);
      return qkviewList.content;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  ihealthDeleteQkview: function (qkviewId) {
    // var listQkviewUrl = "https://ihealth-api.f5.com/qkview-analyzer/api/qkviews.json";
    var qkviewUrl = "https://ihealth-api.f5.com/qkview-analyzer/api/qkviews/" + qkviewId;
    var settings = Settings.findOne({type: "system"});
    var cookies = Meteor.call('ihealthAuthCookie', settings.ihealthUser, settings.ihealthPass);
    var cHeader = cookies[0].replace(/;.*/, "");
    for (i = 1; i < cookies.length; i++) {
      cHeader = cHeader + ';' + cookies[i].replace(/;.*/, "");
    }
    var myHeaders = { Accept: "application/vnd.f5.ihealth.api+json", Cookie: cHeader }
    //console.log(myHeaders);
    try {
      var qkviewDel = HTTP.del(qkviewUrl, { headers: myHeaders });
      console.log(qkviewDel.content);
      return qkviewDel.content;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  ihealthUpdateData: function () {
    //console.log('ihealthUpdateData function running');
    // hide old qkviews:
    // Ihealth.find({hidden: false}).forEach(function(doc){
    //   Ihealth.update({_id: doc._id}, {$set: { hidden: true}});
    // });
    var qk_list = Meteor.call('ihealthGetList');
    //console.log(qk_list);
    var myJson = JSON.parse(qk_list);
    var fs = Npm.require('fs');
    for (j = 0; j < myJson.id.length; j++) {
      // Get qkview data for each id
      console.log(myJson.id[j]);
      var settings = Settings.findOne();
      var args = [settings.ihealthUser, settings.ihealthPass, myJson.id[j]];
      var shellCommand = "get_qkview_data.sh";
      var output = Meteor.call("runShellCmd", shellCommand, args);
      var meta_file = "/tmp/" + myJson.id[j] + ".meta.json";
      var meta_data = fs.readFileSync(meta_file, 'utf8');
      var diag_file = "/tmp/" + myJson.id[j] + ".diag.json";
      var diag_data = fs.readFileSync(diag_file, 'utf8');
      console.log('this far...');
      var meta_json;
      try {
          meta_json = JSON.parse(meta_data);
      } catch (e) {
          // invalid json input, set to null
          console.log(e);
          meta_json = null;
      }
      var diag_json;
      try {
        diag_json = JSON.parse(diag_data);
      } catch (e) {
          // invalid json input, set to null
          console.log(e);
          var diag_json = null;
      }
      if (meta_json !== null || diag_json !== null) {
        meta_json.sha1 = diag_json.sha1;
        meta_json.version = diag_json.version;
        meta_json.diagnostics = diag_json.diagnostics;
        meta_json.system_information = diag_json.system_information;

        meta_json.group = 'default-group';
        meta_json.hidden = false;
        Ihealth.insert(meta_json);
        console.log('deleting good qkview');
        Meteor.call('ihealthDeleteQkview', myJson.id[j]);
      }
      else {
        console.log('deleting corrupt qkview');
        Meteor.call('ihealthDeleteQkview', myJson.id[j]);
        // var args = [settings.ihealthUser, settings.ihealthPass, myJson.id[j]];
        // var delCmd = "del_qkview.sh";
        // var output = Meteor.call("runShellCmd", shellCommand, args);
        // Delete the qkview
      }
    }
  }
});
