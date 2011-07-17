$(function() {

  var client = new Faye.Client('http://localhost:3000/faye');

  client.subscribe(Globals.stream, function(message) {

    $('body').prepend('<p>' + message.text + '</p>');

  });


});