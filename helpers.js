var fs = require('fs');
var _ = require('underscore');
_.mixin(require('underscore.string'));

function attach(app, assetManager) {

  var templatesCache = {};

  app.helpers({

    template: function(name) {
      if (!templatesCache[name]) {
        templatesCache[name] = fs.readFileSync(__dirname + '/views/' + name + '.jade');
      }

      return '<script type="text/jade-template" id="' + name + 'Template">' + templatesCache[name] + '</script>'
    },

    javascriptInclude: function(name) {
      return '<script type="text/javascript" src="/assets/' + assetManager.cacheTimestamps[name] + '/' + name + '.js"></script>';
    },

    _: _

  });

}

exports.attach = attach;