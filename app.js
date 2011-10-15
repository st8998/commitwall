/**
 * Module dependencies.
 */

var express = require('express')
    , redis = require('redis')
    , redisClient = redis.createClient()
    , RedisStore = require('connect-redis')(express);

var app = module.exports = express.createServer();



redisClient.on('error', function(err) {
  console.log("Redis Error:" + err);
});

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "jkhdsf9sdb32423ijsdfg89435gdasgjk8", store: new RedisStore }));
  require('./auth').attach(app)(redisClient);
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('./assets').assetsMiddleware);
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});

app.configure('development', function() {
  require('./demo').attach(app);
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

require('./helpers').attach(app);
require('./web').attach(app)(redisClient);
require('./notifier').attach(app);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);