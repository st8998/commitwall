var client = null
    , everyauth = require('everyauth');

function redisUserId(id) {
  return "commitwalluser:" + id;
}


var User = exports.User = function(id) {
  var user = this;
  user.id = id;
};

User.prototype.save = function() {
  client.set(redisUserId(this.id), JSON.stringify(this));
};

User.prototype.update = function(data) {
  for (var key in data) {
    if (!data.hasOwnProperty(key) || key == 'id') continue;
    this[key] = data[key];
  }

  return this;
};

everyauth.everymodule.findUserById(function(userId, callback) {
  client.get(redisUserId(userId), function(err, res) {
    callback(err, res ? new User(userId).update(res) : res);
  });
});


everyauth.facebook
    .appId('212291862171094')
    .appSecret('20c3661431c11313b50ff1172764fee4')
    .findOrCreateUser(function(session, accessToken, accessTokExtra, fbUserMetadata) {
      var userId = fbUserMetadata.email;
      var user = new User(userId).update(fbUserMetadata);

      client.set(redisUserId(userId), JSON.stringify(user));

      return user;
    })
    .redirectPath('/cloudcastle')
    .scope('email,user_status');


function attach(app) {
  app.use(everyauth.middleware());
  everyauth.helpExpress(app);

  return function(redisClient) {
    client = redisClient;
  };
}

exports.attach = attach;