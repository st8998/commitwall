$(function() {

  var client = new Faye.Client('/-/faye');

  var jade = require('jade');
  var messageTemplate = jade.compile($('#brickTemplate').text());

  function updateWallWidth() {
    var $wall = $('.Wall');
    var $lastBrick = $wall.find('.Brick:last');

    console.log($lastBrick.position().left);

    $('.WallWrapper').css({ width: $lastBrick.position().left - $lastBrick.height() });
  }

  client.subscribe(Globals.stream, function(message) {

    $('.Wall').prepend(messageTemplate.call(this, {brick: message}));
    updateWallWidth();
  });

  updateWallWidth();

});
