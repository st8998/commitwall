var router = require('koa-router')

var redis = require('redis').createClient()

redis.select(1)

// create router
var api = new router()

api.get('/-/demo/:stream/:group', function *() {
  var stream = this.params.stream
  var group = this.params.group

  var message = JSON.stringify({
    text: 'useless text that should wrap and be really long really long really long really long really long really long really long really long really long really long',
    source: 'demo',
    group: group,
    author: {
      email: 'ilia@flamefork.ru',
      name: 'Ilia Ablamonov'
    },
    timestamp: new Date(),
    url: 'http://www.google.com/?query=joppa'
  })

  redis.lpush('messages:' + stream, message, function(err, rep) {
    redis.publish('messages:' + stream, message)
    redis.ltrim('messages:' + stream, 0, 999)
  })

  this.body = 'demo message sent to "' + stream + '" stream'
})

module.exports = api.middleware()