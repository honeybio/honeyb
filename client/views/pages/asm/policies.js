Template.asmPolicies.helpers({
  allPolicies: function () {
    return Asmpolicies.find();
  }
});

Template.asmPolicies.onRendered(function() {
  $('.footable').footable();
});

Template.asmPoliciesExported.onRendered(function() {
  $('.footable').footable();
});

Template.asmPolicies.events({
  'click #Export': function (event, template) {
    event.preventDefault();
    toastr.success('Policies take from 30 second to 10 minutes to export. Check the Exported Policies tab to download.', 'Policies Exporting in Background')
    $('#table-form :input[type=checkbox]:checked').each(function(index){
      Meteor.call('exportAsmPolicy', $(this)[0].id, function (err, res) {
        if (err) {
          toastr.error(err.details, err.reason);
        } else if (res) {
          toastr.success(res.message, res.subject);
        }
      });
    });
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
