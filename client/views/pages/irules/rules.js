Template.ltmRules.helpers({
  allRules: function () {
    return Rules.find();
  }
});

Template.ltmRules.onRendered(function() {
  $('.footable').footable();
});

Template.ltmRulesCreate.rendered = function(){
  var editor = CodeMirror.fromTextArea(document.getElementById("iruleCode"), {
    matchBrackets: true,
    lineNumbers: true,
    indentUnit: 2,
    indentAuto: true,
    viewportMargin: 35,
    foldGutter: {
      rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)
    },
    gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    theme : "bespin",
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      Tab: function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      }
    },
    mode: "irule",
    lint: true,
  });
};

Template.ruleDetails.rendered = function(){
  var editor = CodeMirror.fromTextArea(document.getElementById("iruleCode"), {
    matchBrackets: true,
    lineNumbers: true,
    indentUnit: 2,
    indentAuto: true,
    viewportMargin: 35,
    foldGutter: {
      rangeFinder: new CodeMirror.fold.combine(CodeMirror.fold.brace, CodeMirror.fold.comment)
    },
    gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    theme : "bespin",
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      Tab: function(cm) {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      }
    },
    mode: "irule",
    lint: true,
  });
  //console.log(this.data);
  editor.doc.setValue(this.data.apiAnonymous);
};

Template.ltmRulesCreate.events({
  'change #device': function (event) {
    var newValue = device.options[device.selectedIndex].value;
    Session.set("onDevice", newValue);
  },
  "submit #rule-form": function (event, template) {
    event.preventDefault();
    //console.log(event.target.monitor);

    var deviceId = event.target.device.options[device.selectedIndex].value;
    var iruleData = event.target.iruleCode.value;
    Meteor.call("createLtmRule", deviceId, ruleName, iruleData, function (err, res) {
      if (err) {
        toastr.error(err.details, err.reason)
      } else {
        toastr.success(res.message, res.subject);
      }
    });
  },
});
