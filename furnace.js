#! /usr/bin/env node

'use strict'

var minimist = require('minimist')
var xeno = require('xenotype')()
var fsAccess = require('fs-access')
var path = require('path')
var fastfall = require('fastfall')
var remove = require('./lib/remove')

var steps = [
  xeno.compile,
  remove
]

var furnace = fastfall(steps)

module.exports = furnace

function start () {
  var args = minimist(process.argv.slice(2))
  var yml = path.resolve(args._[0])

  if (!yml) {
    console.log('yml file not specified')
    process.exit(1)
  }

  try {
    fsAccess.sync(yml)
  } catch (err) {
    console.log(err.message)
    process.exit(1)
  }

  furnace(yml, function (err, sys) {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }

    console.log(sys)
    console.log('build completed correctly')
  })
}

if (require.main === module) {
  start()
}
