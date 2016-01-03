Template.troubleshootingWizard.events({
  'click #intro': function (e, t) {
    $('#create-qkview').hide();
    $('#open-ticket').hide();
    $('#rma-template').hide();
    $('#introduction').show();
  },
  'click #qkview': function (e, t) {
    $('#open-ticket').hide();
    $('#rma-template').hide();
    $('#introduction').hide();
    $('#create-qkview').show();
  },
  'click #ticket': function (e, t) {
    $('#create-qkview').hide();
    $('#rma-template').hide();
    $('#introduction').hide();
    $('#open-ticket').show();
  },
  'click #rma': function (e, t) {
    $('#create-qkview').hide();
    $('#open-ticket').hide();
    $('#introduction').hide();
    $('#rma-template').show();
  },
});
