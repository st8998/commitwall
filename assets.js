
var assetManager = require('connect-assetmanager');
var less = require('less');

console.log('ASSETS');

exports.assetsMiddleware = assetManager({
  'lib': {
    'route': /\/assets\/[0-9]+\/lib\.js/,
    'path': __dirname + '/public/javascripts/lib/',
    'dataType': 'javascript',
    'files': ['jquery.min.js', 'jade.min.js', 'faye.min.js', 'underscore.min.js', 'underscore.string.min.js']
  },
  'client': {
    'route': /\/assets\/[0-9]+\/client\.js/,
    'path': __dirname + '/public/javascripts/',
    'dataType': 'javascript',
    'files': ['messages.js']
  },
  'css': {
    'route': /\/assets\/[0-9]+\/css\.css/,
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