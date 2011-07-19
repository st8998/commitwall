var redis = require('redis'),
    client = redis.createClient();

var $ = require('underscore');

function attach(app) {

  app.get('/-/demo/:streamName', function(req, res) {

    var streamName = req.param('streamName');

    var message = JSON.stringify({
      text: 'useless text',
      source: 'demo',
      group: 'demo',
      author: {
        email: 'some@some.com',
        name: 'Some Somich'
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
