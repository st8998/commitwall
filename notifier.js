
var faye = require('faye')
  , redis = require('redis').createClient()

exports.attach = function(app) {
  console.log('NOTIFICATION SERVER ATTACHED')

  var bayeux = new faye.NodeAdapter({mount: '/-/faye', timeout: 45})
  var bayeuxClient = bayeux.getClient()
  bayeux.attach(app)

  redis.on('pmessage', function(pattern, channel, message) {
    bayeuxClient.publish('/' + channel.replace(':', '/'), JSON.parse(message))
  })

  redis.psubscribe('messages:*')
}