'use strict'

var dockerBuild = require('dockerode-build')
var steed = require('steed')
var chalk = require('chalk')

function build (sys, out, cb) {
  steed.mapSeries(
    new State(sys, cb, out),
    sys.containerDefinitions,
    buildImage,
    done)
}

function done (err, defs) {
  this.sys.containerDefinitions = defs
  this.cb(err, this.sys)
}

function State (sys, cb, out) {
  this.sys = sys
  this.cb = cb
  this.out = out
}

function buildImage (def, cb) {
  if (!def.specific.path) {
    return cb(null, def)
  }
  var out = this.out
  out.write(chalk.green('--> Building', def.id, '\n'))

  var stream = dockerBuild(def.specific.path)
  stream.pipe(out, { end: false })

  stream.on('error', cb)

  stream.on('complete', function (id) {
    def.specific.imageId = id
    cb(null, def)
  })
}

module.exports = build
