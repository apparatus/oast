'use strict'

var dockerBuild = require('dockerode-build')
var steed = require('steed')
var path = require('path')
var chalk = require('chalk')

function build (sys, cb) {
  steed.mapSeries(
    new State(sys, cb),
    sys.containerDefinitions,
    buildImage,
    done)
}

function done (err, defs) {
  this.sys.containerDefinitions = defs
  this.cb(err, this.sys)
}

function State (sys, cb) {
  this.sys = sys
  this.cb = cb
}

function buildImage (def, cb) {
  if (!def.specific.path) {
    cb(null, def)
    return
  }
  console.log(chalk.green('--> Building ' + def.id))
  var dockerFile = path.join(def.specific.path, 'Dockerfile')

  var stream = dockerBuild(dockerFile)
  stream.pipe(process.stdout, { end: false })

  stream.on('error', cb)

  stream.on('complete', function (id) {
    def.specific.imageId = id
    cb(null, def)
  })
}

module.exports = build
