$(function() {

  var client = new Faye.Client('/-/faye');

  var jade = require('jade');
  var messageTemplate = jade.compile($('#brickTemplate').text());

  client.subscribe(Globals.stream, function(message) {

    $('.Wall').prepend(messageTemplate.call(this, {brick: message}));

  });

});
