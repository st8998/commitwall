
var faye = require('faye');
var redis = require('redis');

function attach(app) {

  console.log('notifier active');

  var bayeux = new faye.NodeAdapter({mount: '/-/faye', timeout: 45});
  var bayeuxClient = bayeux.getClient();
  bayeux.attach(app);

  var redisClient = redis.createClient();
  redisClient.on('pmessage', function(pattern, channel, message) {
    bayeuxClient.publish('/' + channel.replace(':', '/'), JSON.parse(message))
  });

  redisClient.psubscribe('messages:*');
}

exports.attach = attach;