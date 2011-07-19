
var redis = require('redis'),
    client = redis.createClient();

var jade = require('jade');

var _ = require('underscore');

function attach(app) {

  client.on('error', function(err) {
    console.log("Redis Error:" + err);
  });

  app.post('/:streamName/github', function(req, res, next) {

    var pushMessage = JSON.parse(req.param('payload'));
    var commits = pushMessage.commits;

    req.body.messages = _.map(commits, function(commit) {
      var weight = Math.log(commit.added.length + commit.removed.length + commit.modified.length)/Math.E;
      weight = weight > 1 ? 1 : weight;

      return {
        text: commit.message,
        source: 'github',
        group: pushMessage.repository.name,
        author: commit.author,
        timestamp: commit.timestamp,
        weight: weight,
        url: commit.url,
        extras: {
          added: commit.added,
          removed: commit.removed,
          modified: commit.modified
        }
      };
    });
    next();
  });

  app.post(/^\/(\w+)\/?.*/, function(req, res) {

    var streamName = req.params[0];

    var messages = req.param('messages', [req.param('message')]);
    console.log(messages);

    _.each(messages, function(message) {
      client.lpush('messages:' + streamName, JSON.stringify(message), function(err, rep) {
        client.publish('messages:' + streamName, JSON.stringify(message));
      });
      client.ltrim('messages:' + streamName, 0, 999);
    });

    res.send(messages.length + ' messages was pushed to ' + streamName);
  });

  app.get('/:streamName.:format?', function(req, res) {
    var from = req.param('from', 0),
        to = req.param('to', 50),
        streamName = req.param('streamName');

    client.lrange('messages:' + streamName, from, to, function(err, jsonMessages) {
      var messages = jsonMessages.map(function(message) {return JSON.parse(message)});
      if (req.param('format') == 'json' || req.is('json')) {
        res.send(messages);
      } else {
        res.render('wall', {messages: messages, title: streamName, globals: {stream: '/messages/' + streamName}});
      }
    });

  });
}

exports.attach = attach;
