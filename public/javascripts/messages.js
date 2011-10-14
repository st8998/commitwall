$(function() {
    var client = new Faye.Client('/-/faye');

    var jade = require('jade');
    var messageTemplate = jade.compile($('#brickTemplate').text());

    function insertAvatar(el) {
        var email = $('.Avatar', el).attr('data-email');
        $('.Avatar', el).append($.gravatar(email, {size: 66, image: 'retro', rating: 'r'}));
    }

    client.subscribe(Globals.stream, function(message) {
        var el = $(messageTemplate.call(this, {brick: message}));
        insertAvatar(el);
        $(".Timestamp", el).timeago();
        el.prependTo('.Wall').css({
            left: '-400px'
        }).animate({
            left: 0
        });
    });
    
    $('.Brick').each(function () {
        insertAvatar(this);
    });

    $(".Timestamp").timeago();
});
