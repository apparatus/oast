'use strict'

var test = require('tap').test
var xeno = require('xenotype')()
var path = require('path')
var addCommits = require('../lib/addCommits')

var yml = path.join(__dirname, '..', 'fixture', 'fuge', 'compose-dev.yml')

// output of
// git log -n 1 --format=%H fixture/
var lastSha = '9f15f8e0eba1e2548baa34aa2048d0b1461d31b7'

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
