'use strict'

var steed = require('steed')()
var exec = require('child_process').exec

function addCommits (sys, cb) {
  steed.map(new State(sys, cb), sys.containerDefinitions, fetchSha, done)
}

function fetchSha (def, cb) {
  if (!def.specific || !def.specific.path) {
    cb(null, def)
    return
  }

  var path = def.specific.path

  exec('git log -n 1 --format=%H ' + path, {}, function (err, stdio) {
    if (!err) {
      def.specific.commit = stdio.toString().trim()
    }

    cb(err, def)
  })
}

function State (sys, cb) {
  this.sys = sys
  this.cb = cb
}

function done (err, defs) {
  if (err) {
    return this.cb(err)
  }

  this.sys.containerDefinitions = defs
  this.cb(null, this.sys)
}

module.exports = addCommits
