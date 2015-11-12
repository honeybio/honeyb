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
    try {
      var qkviewList = HTTP.get(listQkviewUrl, { headers: myHeaders });
      return qkviewList.content;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  ihealthGetDetails: function () {

    var qk_list = Meteor.call('ihealthGetList');
    var myJson = JSON.parse(qk_list);
    var fs = Npm.require('fs');
    for (j = 0; j < myJson.id.length; j++) {
      // Get qkview data for each id
      var settings = Settings.findOne();
      var args = [settings.ihealthUser, settings.ihealthPass, myJson.id[j]];
      var shellCommand = "get_qkview_data.sh";
      var output = Meteor.call("runShellCmd", shellCommand, args);
      var meta_file = "/tmp/" + myJson.id[j] + ".meta.json";
      var meta_data = fs.readFileSync(meta_file, 'utf8');
      var diag_file = "/tmp/" + myJson.id[j] + ".diag.json";
      var diag_data = fs.readFileSync(diag_file, 'utf8');


      var meta_json = JSON.parse(meta_data);
      var diag_json = JSON.parse(diag_data);

      meta_json.sha1 = diag_json.sha1;
      meta_json.version = diag_json.version;
      meta_json.diagnostics = diag_json.diagnostics;
      meta_json.system_information = diag_json.system_information;

      meta_json.group = 'default-group';
      Ihealth.insert(meta_json);

      // Read data
      // db.insert
    }
  }
});
