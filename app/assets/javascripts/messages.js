$(function() {
//    var client = new Faye.Client('/-/faye');
//
//    var jade = require('jade');
//    var messageTemplate = jade.compile($('#brickTemplate').text());
//
//    function calculateGroupImpacts() {
//        var groups = {},
//            total = 0;
//        $('.Brick').each(function () {
//            var g = $(this).attr('data-group');
//            if (!groups[g]) groups[g] = 0;
//            groups[g]++;
//            total++;
//        }).each(function () {
//            var g = $(this).attr('data-group');
//            $('.Impact', this).html('<span>%</span>'+ Math.round(groups[g] / total * 100));
//        });
//    }
//
//    function insertAvatar(el) {
//        $('.Avatar', el).append($.gravatar($('.Avatar', el).attr('data-email'), {size: 200, image: 'retro', rating: 'r'}));
//    }
//
//    client.subscribe(Globals.stream, function(message) {
//        var el = $(messageTemplate.call(this, {brick: message}));
//        insertAvatar(el);
//        $(".Timestamp", el).timeago();
//        el.prependTo('.Wall').css({
//            left: '-400px'
//        }).animate({
//            left: 0
//        });
//        calculateGroupImpacts();
//    });
//
//    $('.Brick').each(function () {
//        insertAvatar(this);
//    });
//
//    $(".Timestamp").timeago();
//    calculateGroupImpacts();
//
//    $(".BrickContainer").live('click', function () {
//        $(this).toggleClass('Pinned');
//    });
//
//    var nextFlip;
//    function flipper() {
//        if ($(".Pinned").length) {
//            $(".Pinned").removeClass('Pinned');
//            nextFlip = setTimeout(flipper, 1000);
//        } else {
//            var bricks = $(".BrickContainer:lt(24)");
//            $(bricks[Math.round(Math.random() * bricks.length)]).toggleClass('Pinned');
//            nextFlip = setTimeout(flipper, 5000);
//        }
//    }
//
//    function resetTimer() {
//        clearTimeout(nextFlip);
//        nextFlip = setTimeout(flipper, 30000);
//    }
//
//    $('body').bind('click', resetTimer).bind('mousemove', resetTimer);
//    resetTimer();
});
