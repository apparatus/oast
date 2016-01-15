# oast
[![Gitter][gitter-badge]][gitter-url][![Build Status][travis-badge]][travis-url]

Build a container-based system for production, a companion for [fuge][fuge]. Based on Docker.

If you're using this module, and need help, you can:

- Post a [github issue][],
- Ask on the [Gitter][gitter-url].

## Install

```
npm i oast -g
```

## Usage

From `oast --help`:

```
usage: oast [opts] compose.yml

available options:
  -o [FILE], --output [FILE]    write the system to the given file
  -r [REPO], --repo [REPO]      base URL for the registry repository to
                                push images to
  -h, --help                    this message
```

### Example

(from the root of this repository)

```
oast -o out.sys fixture/fuge/compose-dev.yml --repo localhost:5000/fixture
```

It writes the system definition into `out.sys`, and pushes those images
to a [local registry](https://docs.docker.com/registry/).

### Labels

It adds an [image label][docker-labels] to each built image, in the
form of:

```
LABEL oast.commit=48ed274cc32020b3837c8e59c10033480376208c
LABEL oast.id=service1
```

## API

__oast__ can be used as a module as well.

### oast(yml, stream[, opts], cb(err, sys))

Build the given `yml` file, and prints all output to `stream`.
If `stream` is a TTY (e.g. stdout or stderr), docker's progress bars
will be showed.

Available options (in `opts`):

* `repo`: the Docker repository we will push images to

Example `sys` passed to `cb`:

```js
{
  "name": "xeno",
  "id": "123456",
  "containerDefinitions": [
    {
      "specific": {
        "type": "process",
        "proxyPort": [
          "auto"
        ],
        "servicePort": [
          "auto"
        ],
        "buildScript": "cd api && npm install; ",
        "execute": {
          "exec": "node api/index.js",
          "environment": [],
          "process": "node api/index.js"
        },
        "commit": "48ed274cc32020b3837c8e59c10033480376208c",
        "imageId": "d012827054a00e50e8ae1f722ee6630cb51f6ccaf8cff6d2a2c14dea39d5e2a6",
        "repo": "localhost:5000/fixture/frontend"
      },
      "type": "docker",
      "id": "frontend",
      "name": "frontend"
    },
    {
      "specific": {
        "type": "process",
        "proxyPort": [
          "auto"
        ],
        "servicePort": [
          "auto"
        ],
        "buildScript": "npm install; ",
        "execute": {
          "exec": "node service.js",
          "environment": [],
          "process": "node service.js"
        },
        "commit": "48ed274cc32020b3837c8e59c10033480376208c",
        "imageId": "fa41e378a4d1da9442c8cd0fc53fa1c0e554d025437099a7a5e851bf572decb4",
        "repo": "localhost:5000/fixture/service1"
      },
      "type": "docker",
      "id": "service1",
      "name": "service1"
    },
    {
      "specific": {
        "type": "process",
        "proxyPort": [
          "auto"
        ],
        "servicePort": [
          "auto"
        ],
        "buildScript": "npm install; ",
        "execute": {
          "exec": "node service.js",
          "environment": [],
          "process": "node service.js"
        },
        "commit": "48ed274cc32020b3837c8e59c10033480376208c",
        "imageId": "fa9e20c7fc9f074d58ce92a9b41718992fdbd26c2c74c6f55fdbac8078450df5",
        "repo": "localhost:5000/fixture/service2"
      },
      "type": "docker",
      "id": "service2",
      "name": "service2"
    },
    {
      "specific": {
        "type": "docker",
        "proxyPort": [
          6379
        ],
        "servicePort": [
          6379
        ],
        "buildScript": "echo NO BUILD SCRIPT!",
        "execute": {
          "image": "redis",
          "exec": "docker run  -p 6379:6379 -e 6379=6379 redis",
          "environment": [],
          "process": "docker run  -p 6379:6379 -e 6379=6379 redis"
        },
        "imageId": "a1676b87554949959bf8b4f2b4e9a6ec0c5a8631815cbd6fde70aa4a4fabb209",
        "repo": "localhost:5000/fixture/redis"
      },
      "type": "docker",
      "id": "redis",
      "name": "redis"
    }
  ]
}
```

## Contributing
The [apparatus team][] encourage open participation. If you feel you can help in any way, be it with
documentation, examples, extra testing, or new features please get in touch.

## License
Copyright the apparatus team 2016, Licensed under [MIT][].

[apparatus team]: https://github.com/apparatus
[travis-badge]: https://travis-ci.org/apparatus/oast.svg
[travis-url]: https://travis-ci.org/apparatus/oast
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/apparatus
[github issue]: https://github.com/apparatus/oast/issues/new
[MIT]: ./LICENSE
[docker-labels]: https://docs.docker.com/engine/userguide/labels-custom-metadata/
[fuge]: http://fuge.io
