Template.supportGenius.events({
  'submit #create-form': function (event, template) {
    event.preventDefault();
    var mySettings = Settings.findOne({type: 'system'});
    Email.send({
      from: 'honeyb@company.com',
      to: mySettings.helpEmail,
      subject: '[Honeyb] - ' + event.target.requestType.value + ' Help Requested',
      html: '<p>' + event.target.name.value + '</p>' +
            '<p>' + event.target.email.value + '</p>' +
            '<p>' + event.target.longDescription.value + '</p>',
    });
  }
});
