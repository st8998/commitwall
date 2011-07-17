$(function() {

  var client = new Faye.Client('/faye');

  client.subscribe(Globals.stream, function(message) {

    $('body').prepend('<p>' + message.text + '</p>');

  });


});