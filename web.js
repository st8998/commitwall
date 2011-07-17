
var redis = require('redis'),
    client = redis.createClient();

var $ = require('underscore');

function attach(app) {

  client.on('error', function(err) {
    console.log("Redis Error:" + err);
  });

  app.post('/:streamName/github', function(req, res, next) {
    req.body.messages = $.map(req.param('payload').commits, function(commit) {
      return {text: commit.message};
    });
    next();
  });

  app.post(/^\/(\w+)\/?.*/, function(req, res) {

    var streamName = req.params[0];

    var messages = req.param('messages', [req.param('message')]);
    console.log(messages);

    $.each(messages, function(message) {
      client.lpush('messages:' + streamName, JSON.stringify(message), function(err, rep) {
        client.publish('messages:' + streamName, JSON.stringify(message));
      });
      client.ltrim('messages:' + streamName, 0, 999);
    });

    res.send(messages.length + ' messages was pushed to ' + streamName);
  });

  app.get('/:streamName.:format?', function(req, res) {
    var from = req.param('from', 0),
        to = req.param('to', 10),
        streamName = req.param('streamName');

    client.lrange('messages:' + streamName, from, to, function(err, jsonMessages) {
      var messages = jsonMessages.map(function(message) {return JSON.parse(message)});
      if (req.param('format') == 'json' || req.is('json')) {
        res.send(messages);
      } else {
        res.render('messages', {messages: messages, title: streamName, globals: {stream: '/messages/' + streamName}});
      }
    });

  });
}

exports.attach = attach;
