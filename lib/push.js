'use strict'

var Dockerode = require('dockerode')
var steed = require('steed')()
var through = require('through2')
var chalk = require('chalk')
var multiline = require('multiline-update')

function push (sys, repo, out, cb) {
  var docker = new Dockerode()
  steed.mapSeries(new State(docker, repo, out, sys, cb),
                  sys.containerDefinitions,
                  pushImage,
                  done)
}

function State (docker, repo, out, sys, cb) {
  this.docker = docker
  this.repo = repo
  this.sys = sys
  this.cb = cb
  this.out = out
}

function pushImage (def, cb) {
  var docker = this.docker
  var repo = this.repo
  var out = this.out
  if (!repo.match(/.*\/$/)) {
    repo += '/'
  }
  repo += def.id
  var image = docker.getImage(def.specific.imageId)

  out.write(chalk.green('--> Pushing', repo, '\n'))

  image.tag({
    repo: repo,
    tag: 'latest',
    force: true
  }, function (err) {
    if (err) {
      return cb(err)
    }

    image = docker.getImage(repo)
    image.push({}, function (err, stream) {
      if (err) {
        return cb(err)
      }
      def.specific.repo = repo
      var multi = multiline(out)
      stream.pipe(through.obj(function (chunk, enc, cb) {
        var data = JSON.parse(chunk)
        if (data.id) {
          multi.update(data.id, data.status)
        } else {
          out.write(data.status)
          out.write('\n')
        }
        cb()
      }, function (done) {
        done()
        cb()
      }))
    })
  })
}

function done (err) {
  this.cb(err, this.sys)
}

module.exports = push
