'use strict'

var removeField = require('remove-field')
var toRemove = ['path', 'topology']

function remove (def, cb) {
  var result = removeField(toRemove, def)

  result.containerDefinitions = result.containerDefinitions
    .filter(removeDef, 'root')
    .filter(removeDef, '__proxy')
    .map(toDocker)

  if (cb) {
    cb(null, result)
  }

  return result
}

function removeDef (def) {
  return def.id !== this
}

function toDocker (def) {
  def.type = 'docker'
  return def
}

module.exports = remove
