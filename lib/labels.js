'use strict'

var fs = require('fs')
var path = require('path')
var steed = require('steed')()
var labelRegexp = /^LABEL oast.commit.*$/

function add (def, cb) {
  if (!def.specific.path) {
    return cb()
  }

  rm(def, function (err) {
    if (err) {
      return cb(err)
    }

    var dockerFile = path.join(def.specific.path, 'Dockerfile')
    fs.readFile(dockerFile, function (err, data) {
      if (err) {
        return cb(err)
      }

      var toSave = data.toString()
      toSave += '\nLABEL oast.commit=' + def.specific.commit

      fs.writeFile(dockerFile, toSave, cb)
    })
  })
}

function rm (def, cb) {
  if (!def.specific.path) {
    return cb()
  }

  var dockerFile = path.join(def.specific.path, 'Dockerfile')
  fs.readFile(dockerFile, function (err, data) {
    if (err) {
      return cb(err)
    }

    var toSave = data
      .toString('utf8')
      .split('\n')
      .filter(isCommitLabel)
      .join('\n')

    fs.writeFile(dockerFile, toSave, cb)
  })
}

function isCommitLabel (line) {
  return !line.match(labelRegexp)
}

function addAll (sys, cb) {
  steed.map(new State(sys, cb), sys.containerDefinitions, add, done)
}

function rmAll (sys, cb) {
  steed.map(new State(sys, cb), sys.containerDefinitions, rm, done)
}

function State (sys, cb) {
  this.sys = sys
  this.cb = cb
}

function done (err) {
  this.cb(err, this.sys)
}

module.exports.add = add
module.exports.rm = rm
module.exports.addAll = addAll
module.exports.rmAll = rmAll

