'use strict'

var test = require('tap').test
var xeno = require('xenotype')()
var path = require('path')
var addCommits = require('../lib/addCommits')

var yml = path.join(__dirname, '..', 'fixture', 'fuge', 'compose-dev.yml')

// output of
// git log -n 1 --format=%H fixture/
var lastSha = '48ed274cc32020b3837c8e59c10033480376208c'

test('adds all the commit to the sys', function (t) {
  xeno.compile(yml, function (err, sys) {
    if (err) { throw err }

    addCommits(sys, function (err, actual) {
      t.error(err)

      t.same(actual, sys, 'sys instance is returned as is')
      sys.containerDefinitions.forEach(function (def) {
        if (def.specific.path) {
          t.equal(def.specific.commit, lastSha, 'commit matches for ' + def.name)
        }
      })

      t.end()
    })
  })
})
