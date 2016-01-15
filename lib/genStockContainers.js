'use strict'

var tmp = require('tmp')
var fs = require('fs')
var p = require('path')
var steed = require('steed')()

function genStockContainers (sys, cb) {
  var toGen = sys.containerDefinitions.filter(hasImage)
  steed.map(new State(sys, cb), toGen, generate, done)
}

function State (sys, cb) {
  this.sys = sys
  this.cb = cb
}

function done (err) {
  this.cb(err, this.sys)
}

function hasImage (def) {
  return def.specific && def.specific.execute && def.specific.execute.image
}

function generate (def, cb) {
  tmp.dir(function (err, dir) {
    if (err) {
      return cb(err)
    }

    var dockerFile = 'FROM ' + def.specific.execute.image + '\n'

    def.specific.path = dir

    fs.writeFile(p.join(dir, 'Dockerfile'), dockerFile, cb)
  })
}

module.exports = genStockContainers
