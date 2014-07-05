var router = require('koa-router')

var _ = require('lodash-node')

// create router
var api = new router()

api.post('/:stream/github', function *(next) {
  var message = this.request.body,
    stream = this.params.stream,
    commits = message.commits

  console.log(message)

  this.messages = _.map(commits, function(commit) {
    return {
      text: commit.message,
      source: 'github',
      group: message.repository.name,
      author: commit.author,
      timestamp: commit.timestamp,
      url: commit.url
    }
  })

  yield next
})

module.exports = api.middleware()