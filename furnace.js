#! /usr/bin/env node

'use strict'

var minimist = require('minimist')
var xeno = require('xenotype')()
var fsAccess = require('fs-access')
var path = require('path')
var fastfall = require('fastfall')
var remove = require('./lib/remove')
var addCommits = require('./lib/addCommits')

var steps = [
  xeno.compile,
  addCommits,
  remove
]

var furnace = fastfall(steps)

module.exports = furnace

function start () {
  var args = minimist(process.argv.slice(2))
  var yml = path.resolve(args._[0])

  if (!yml) {
    console.error('yml file not specified')
    process.exit(1)
  }

  try {
    fsAccess.sync(yml)
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }

  furnace(yml, function (err, sys) {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }

    console.error('build completed correctly')
    console.log(JSON.stringify(sys, null, 2))
  })
}

if (require.main === module) {
  start()
}
