Template.ltmRules.helpers({
  allRules: function () {
    return Rules.find();
  }
});

Template.ltmRules.onRendered(function() {
  $('.footable').footable();
});

Template.ltmRulesCreate.rendered = function(){
  var editor = CodeMirror.fromTextArea(document.getElementById("irule-code"), {
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
  var editor = CodeMirror.fromTextArea(document.getElementById("irule-code"), {
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
