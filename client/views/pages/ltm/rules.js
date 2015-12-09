Template.ltmRules.helpers({
  allRules: function () {
    return Rules.find();
  }
});

Template.ltmRules.onRendered(function() {
  $('.footable').footable();
});

Template.ltmRulesCreate.helpers({
  editorOptions: function() {
    return {
      lineNumbers: true,
      matchBrackets: true,
      lineNumbers: true,
      indentUnit: 2,
      scrollPastEnd: true,
      indentAuto: true,
      extraKeys: {"Ctrl-Space": "autocomplete"},
      mode: "text/x-irule",
      value: "# Created by Honeyb.io iRule Builder\n\n\n\n"
    }
  },
  defaultValue: function () {
    return '###### Created with honeyb.io iRule Builder ####\n\n\n\n\n'
  }
});

Template.ruleDetails.helpers({
  editorOptions: function() {
    return {
      lineNumbers: true,
      matchBrackets: true,
      lineNumbers: true,
      indentUnit: 2,
      scrollPastEnd: true,
      indentAuto: true,
      extraKeys: {"Ctrl-Space": "autocomplete"},
      mode: "text/x-irule"
    }
  }
});
