var redis = require('redis'),
    client = redis.createClient();

var $ = require('underscore');

function attach(app) {

  app.get('/-/demo/:streamName/:groupName', function(req, res) {

    var streamName = req.param('streamName');
    var groupName = req.param('groupName');

    var message = JSON.stringify({
      text: 'useless text that should wrap and be really long',
      source: 'demo',
      group: groupName,
      author: {
        email: 'ilia@flamefork.ru',
        name: 'Ilia Ablamonov'
      },
      weight: Math.random(),
      timestamp: new Date(),
      url: 'http://www.google.com/?query=joppa'
    });

    client.lpush('messages:' + streamName, message, function(err, rep) {
      client.publish('messages:' + streamName, message);
    });
    client.ltrim('messages:' + streamName, 0, 999);

    res.send('demo message sent');

  });
}

exports.attach = attach;
