#! /usr/bin/env node

'use strict'

var minimist = require('minimist')
var xeno = require('xenotype')()
var fsAccess = require('fs-access')
var path = require('path')
var remove = require('./lib/remove')
var addCommits = require('./lib/addCommits')
var build = require('./lib/build')
var labels = require('./lib/labels')
var push = require('./lib/push')
var genStockContainers = require('./lib/genStockContainers')
var steed = require('steed')()
var chalk = require('chalk')
var fs = require('fs')

function oast (sys, out, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  var steps = [
    function (cb) {
      cb(null, sys)
    },
    xeno.compile,
    addCommits,
    genStockContainers,
    labels.addAll,
    function (sys, cb) {
      build(sys, out, cb)
    },
    labels.rmAll,
    remove,
    function (sys, cb) {
      if (!opts.repo) {
        cb(null, sys)
      } else {
        push(sys, opts.repo, out, cb)
      }
    }
  ]

  steed.waterfall(steps, cb)
}

module.exports = oast

function start () {
  var args = minimist(process.argv.slice(2), {
    alias: {
      'output': 'o',
      'repo': 'r',
      'help': 'h'
    }
  })

  if (args.help || !args._[0]) {
    console.error(fs.readFileSync(path.join(__dirname, 'help.txt'), 'utf8'))
    process.exit(1)
  }

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

  oast(yml, process.stderr, args, function (err, sys) {
    if (err) {
      console.error(chalk.red(err.message))
      process.exit(1)
    }

    console.error(chalk.green('Build completed correctly'))

    var stringified = JSON.stringify(sys, null, 2)
    if (args.output) {
      var output = path.resolve(args.output)
      fs.writeFile(output, stringified + '\n', function (err) {
        if (err) {
          console.error(chalk.red(err.message))
          process.exit(1)
        }
        console.error(chalk.green('System description written to', output))
      })
    } else {
      console.log(stringified)
    }
  })
}

if (require.main === module) {
  start()
}
