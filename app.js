var koa = require('koa')
  , router = require('koa-router')
  , mount = require('koa-mount')
  , logger = require('koa-logger')
  , jade = require('koa-jade')
  , serve = require('koa-static')
  , body = require('koa-parse-json')
  , app = koa()

var _ = require('lodash-node')

var redis = require('redis').createClient()
var coRedis = require('co-redis')(redis)

// I think it's not a problem to call this function without a callback
// change redis database
redis.select(1)

// parse request body
app.use(body())

// basic logger
app.use(logger())

app.use(serve('public'))

// configure view layer
app.use(jade.middleware({
  viewPath: __dirname + '/views',
  debug: true,
  locals: {
    title: 'Commitwall 2.0'
  }
}))

// create router
var api = new router()

api.post(/^\/(\w+)\/?.*/, function *() {
  var stream = this.params[0],
    key = 'messages:'+stream

  if (this.is('json') && this.messages) {
    _.each(this.messages, function(message) {
      var json = JSON.stringify(message)

      redis.lpush(key, json, function() { // add message to queue
        redis.publish(key, json)          // notify about new message
        redis.ltrim(key, 0, 999)          // trim queue to 1000 messages
      })
    })

    this.body = this.messages.length + ' messages was pushed to ' + stream
  }
})

api.get('/:stream', function *() {
  var messages = yield coRedis.lrange('messages:' + this.params.stream, 0, 100)
  messages = _.map(messages, JSON.parse)

  switch (this.accepts('json', 'html')) {
    case 'html':
      yield this.render('wall', {messages: messages, stream: this.params.stream}, false)
      break
    case 'json':
      this.body = messages
      break
    default: this.throw(406, 'json or html only')
  }
})

app.use(mount('/', require('./demo')))

app.use(mount('/', require('./github')))
app.use(mount('/', api.middleware()))


// create node server
var http = require('http').createServer(app.callback())

// add faye based notification server
require('./notifier').attach(http)

http.listen(3000)
