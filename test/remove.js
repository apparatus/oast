'use strict'

var test = require('tap').test
var xeno = require('xenotype')()
var path = require('path')
var remove = require('../lib/remove')

var yml = path.join(__dirname, '..', 'fixture', 'fuge', 'compose-dev.yml')
xeno.compile(yml, function (err, sys) {
  if (err) { throw err }

  test('remove the paths', function (t) {
    var removed = remove(sys)
    t.notOk(removed.path, 'no path on root')
    removed.containerDefinitions.forEach(function (def) {
      t.notOk(removed.path, 'no path on def ' + def.name)
    })
    t.end()
  })

  test('remove the topology', function (t) {
    var removed = remove(sys)
    t.notOk(removed.topology, 'no topology on root')
    t.end()
  })

  test('works with a callback', function (t) {
    remove(sys, function (err, removed) {
      t.error(err)
      t.notOk(removed.path, 'no path on root')
      removed.containerDefinitions.forEach(function (def) {
        t.notOk(removed.path, 'no path on def ' + def.name)
      })
      t.end()
    })
  })

  test('removes the root', function (t) {
    var removed = remove(sys)
    removed.containerDefinitions.forEach(function (def) {
      if (def.id === 'root') {
        t.fail('no root')
      }
    })
    t.end()
  })

  test('removes the proxy', function (t) {
    var removed = remove(sys)
    removed.containerDefinitions.forEach(function (def) {
      if (def.id === '__proxy') {
        t.fail('no proxy')
      }
    })
    t.end()
  })

  test('contains only docker containers', function (t) {
    var removed = remove(sys)
    removed.containerDefinitions.forEach(function (def) {
      t.equal(def.type, 'docker')
    })
    t.end()
  })
})

