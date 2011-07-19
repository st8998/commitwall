/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();

// Configuration

var assetManager = require('connect-assetmanager');
var less = require('less');

var assetMiddleware = assetManager({
  'lib': {
    'route': /\/assets\/[0-9]+\/lib.js/,
    'path': __dirname + '/public/javascripts/lib/',
    'dataType': 'javascript',
    'files': ['jquery.min.js', 'jade.min.js', 'faye.min.js']
  },
  'client': {
    'route': /\/assets\/[0-9]+\/client.js/,
    'path': __dirname + '/public/javascripts/',
    'dataType': 'javascript',
    'files': ['messages.js']
  },
  'css': {
    'route': /\/stylesheets\/style\.css/,
    'path': __dirname + '/public/stylesheets/',
    'dataType': 'css',
    'files': ['*'],
    'preManipulate': {
      '^': [
        function(file, path, index, isLast, callback) {
          if (path.match(/\.less$/).length) {
            less.render(file, function(e, css) {
              callback(css);
            });
          } else {
            callback(file);
          }
        }
      ]
    }
  }
});

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(assetMiddleware);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  
  require('./demo').attach(app);
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

require('./helpers').attach(app, assetMiddleware);
require('./web').attach(app);
require('./notifier').attach(app);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);