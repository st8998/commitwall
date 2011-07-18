/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

var assetManager = require('connect-assetmanager');

var assetMiddleware = assetManager({
  'js_lib': {
    'route': /\/javascripts\/lib.js/,
    'path': __dirname + '/public/javascripts/lib/',
    'dataType': 'javascript',
    'files': ['jquery.min.js', 'jade.min.js', 'faye.min.js']
  },
  'js_client': {
    'route': /\/javascripts\/client.js/,
    'path': __dirname + '/public/javascripts/',
    'dataType': 'javascript',
    'files': ['messages.js']
  },
  'css': {
    'route': /\/stylesheets\/style\.css/,
    'path': __dirname + '/public/stylesheets/',
    'dataType': 'css',
    'files': ['style.css']
  }
});

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(assetMiddleware);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

require('./helpers').attach(app);
require('./web').attach(app);
require('./notifier').attach(app);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);