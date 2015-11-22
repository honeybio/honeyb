Template.asmPolicies.helpers({
  asmPoliciesIndex: () => AsmPoliciesIndex
})


Template.asmPolicies.events({
  'submit #asm-policies': function (event, template) {
    event.preventDefault();
    var checkedList = [];
    $('#asm-policies :input[type=checkbox]:checked').each(function(index){
      checkedList.push($(this)[0].id);
    });
    if (checkedList.length === undefined) {
      return;
    }
    for (var i = 0; i < checkedList.length; i++) {
      Meteor.call('exportAsmPolicy', checkedList[i]);
    }
  },
});

Template.asmPoliciesExported.helpers({
  getPolicyExports: function () {
    return Asmpolicyfile.find();
  },
  round: function (size) {
    return (size/1048576).toFixed(2) + ' MB';
  }
});
