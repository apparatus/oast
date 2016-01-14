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
  -h, --help                    this message
```

### Example

(from the root of this repository)

```
oast -o out.sys fixture/fuge/compose-dev.yml
```

It writes the system definition into `out.sys`

## API

__oast__ can be used as a module as well.

### oast(yml, stream, cb(err, sys))

Build the given `yml` file, and prints all output to `stream`.
If `stream` is a TTY (e.g. stdout or stderr), docker's progress bars
will be showed.

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
        "imageId": "2d76b9cf495552ce86251182df05db83305f07f084a146bb47981f9154e84a78"
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
        "imageId": "0e3c13c2c2d9beb540dc09aa9abe5ebffa781d7f94e91d97723a08d188ed6cd4"
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
        "imageId": "0b081fe361bd98a583ac0e76e954a4662b77340ac1aed17708c19f731b77ec3d"
      },
      "type": "docker",
      "id": "service2",
      "name": "service2"
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
