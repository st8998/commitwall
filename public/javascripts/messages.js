$(function() {

  var client = new Faye.Client('/faye');

  var jade = require('jade');
  var messageTemplate = jade.compile($('#messageTemplate').text());

  client.subscribe(Globals.stream, function(message) {

    $('body').prepend(messageTemplate.call(this, {message: message}));

  });

});
