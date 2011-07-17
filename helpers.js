var fs = require('fs');

function attach(app) {

  var templatesCache = {};

  app.helpers({

    template: function(name) {
      if (!templatesCache[name]) {
        templatesCache[name] = fs.readFileSync(__dirname + '/views/' + name + '.jade');
      }

      return '<script type="text/jade-template" id="' + name + 'Template">' + templatesCache[name] + '</script>'
    }

  });

}

exports.attach = attach;