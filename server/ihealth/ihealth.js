Meteor.methods({
  ihealthAuthCookie: function (user, password) {
    var post_data = { user_id: user, user_secret: password };
    var authUrl = "https://api.f5.com/auth/pub/sso/login/ihealth-api";
    try {
      var response = HTTP.post(authUrl, {data: post_data});
      return response.headers['set-cookie'];
    } catch (e) {
      if (e.response.statusCode == '401') {
        return 401;
      } else {
        console.log(e);
        return false;
      }
    }
  },
  ihealthGetList: function () {
    var listQkviewUrl = "https://ihealth-api.f5.com/qkview-analyzer/api/qkviews";
    var settings = Settings.findOne({type: "system"});
    if (settings.ihealthUser === undefined || settings.ihealthPass === undefined ) {
      return 400;
    } else {
      var cookies = Meteor.call('ihealthAuthCookie', settings.ihealthUser, settings.ihealthPass);
      if (cookies == 401) {
        return 401;
      } else if (cookies == false) {
        return 500;
      } else {
        var cHeader = cookies[0].replace(/;.*/, "");
        for (i = 1; i < cookies.length; i++) {
          cHeader = cHeader + ';' + cookies[i].replace(/;.*/, "");
        }
        var myHeaders = { Accept: "application/vnd.f5.ihealth.api+json", Cookie: cHeader }
        //console.log(myHeaders);
        try {
          var qkviewList = HTTP.get(listQkviewUrl, { headers: myHeaders });
          return qkviewList.content;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
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
      return qkviewDel.content;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  ihealthUpdateData: function () {
    var qk_list = Meteor.call('ihealthGetList');
    if (qk_list == 400) {
      throw new Meteor.Error(400, 'Error 400', 'iHealth user or password not configured');
      return;
    }
    if (qk_list == 401) {
      throw new Meteor.Error(401, 'Error 401', 'Unauthorized iHealth user or password');
      return;
    } else if (qk_list == 500) {
      throw new Meteor.Error(500, 'Error 500', 'Unknown Error');
      return;
    } else {
      var myJson;
      try {
        myJson = JSON.parse(qk_list);
      } catch (e) {
        console.log(e);
        return;
      }
      var fs = Npm.require('fs');
      if (myJson.id === undefined) {
        throw new Meteor.Error(500, 'Error 500', 'Unknown Error');
      }
      for (j = 0; j < myJson.id.length; j++) {
        // Get qkview data for each id
        var settings = Settings.findOne({type: 'system'});
        var args = [settings.ihealthUser, settings.ihealthPass, myJson.id[j]];
        var shellCommand = "get_qkview_data.sh";
        var output = Meteor.call("runShellCmd", shellCommand, args);
        var meta_file = "/tmp/" + myJson.id[j] + ".meta.json";
        var meta_data = fs.readFileSync(meta_file, 'utf8');
        var diag_file = "/tmp/" + myJson.id[j] + ".diag.json";
        var diag_data = fs.readFileSync(diag_file, 'utf8');
        var meta_json;
        try {
            meta_json = JSON.parse(meta_data);
        } catch (e) {
            throw new Meteor.Error(500, 'Error 500', 'Unknown Error');
            console.log(e);
            meta_json = null;
        }
        var diag_json;
        try {
          diag_json = JSON.parse(diag_data);
        } catch (e) {
            throw new Meteor.Error(500, 'Error 500', 'Unknown Error');
            console.log(e);
            var diag_json = null;
        }
        if (meta_json !== null || diag_json !== null) {
          meta_json.qkviewId = myJson.id[j];
          // meta_json.sha1 = diag_json.sha1;
          meta_json.version = diag_json.version;
          meta_json.diagnostics = diag_json.diagnostics;
          meta_json.system_information = diag_json.system_information;

          meta_json.group = 'default-group';
          meta_json.hidden = false;
          var qkId = Ihealth.findOne({qkviewId: myJson.id[j]});
          if (qkId === undefined) {
            Ihealth.insert(meta_json);
          } else {
            Ihealth.remove({_id: qkId._id});
            Ihealth.insert(meta_json);
          }
        }
        else {
          throw new Meteor.Error(500, 'Error 500', 'Unknown Error');
        }
      }
    }
    return 'Success!';
  }
});
