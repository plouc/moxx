# moxx

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Travis CI][travis-image]][travis-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependencies][gemnasium-image]][gemnasium-url]

moxx is a tool easily to mock your external APIs.
No more failed tests because of fragile dependencies.

[![NPM](https://nodei.co/npm/moxx.png?downloads=false&downloadRank=false)](https://nodei.co/npm/moxx/)

## Features

- yaml based configuration
- [Watch mappings for auto reload](#watching-changes-on-mappings)
- [Powerful request matching](#request-matching)
- [Proxying](#proxying)
- [Record API calls for mock generation](#recording)

## Requirements

- Node.js 6+
- npm 3+

## Installation

```sh
npm i -g moxx
 ```

## Usage

```
moxx
```

### Options

| Option                  | Default | Description |
|:----------------------- |:-------:|:----------- |
| `-h, --help`            |         | Output usage information
| `-V, --version`         |         | Output the version number
| `-p, --port <port>`     | 5000    | The port number for the server to listen on
| `-d, --dir <directory>` | .       | The root config/mapping/files directory
| `-w --watch`            | false   | Watch for changes
| `-r, --record`          | false   | Records proxy requests/responses
| `-x, --proxy <proxy>`   |         | Act as a proxy
| `--no-color`            | false   | Disable color
| `-l, --loglevel`        | info    | Sets logger log level

## Watching changes on mappings

```sh
moxx --watch
```

## Request matching system

moxx provides a powerful request matching.

## Matching http method

```yaml
# match GET method
method_get:
  request:
    method: GET
    
# match all methods
method_any:
  request:
    method: '*'
```

## Matching url

Internally, moxx uses [minimatch](https://github.com/isaacs/minimatch).

```yaml
# match /users
users:
  request:
    url: /users

# match /users/2
user_2:
  request:
    url: /users/*
    
# match /users/2/profile
user_2_profile:
  request:
    url: /users/**    
```

## Proxying

```
moxx --proxy https://api.github.com
```

## Recording

```
moxx --proxy https://api.github.com --record
```

[license-image]: https://img.shields.io/github/license/plouc/moxx.svg?style=flat-square
[license-url]: https://github.com/plouc/moxx/blob/master/LICENSE.md
[npm-image]: https://img.shields.io/npm/v/moxx.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/moxx
[travis-image]: https://img.shields.io/travis/plouc/moxx.svg?style=flat-square
[travis-url]: https://travis-ci.org/plouc/moxx
[coverage-image]: https://img.shields.io/coveralls/plouc/moxx.svg?style=flat-square
[coverage-url]: https://coveralls.io/github/plouc/moxx
[gemnasium-image]: https://img.shields.io/gemnasium/plouc/moxx.svg?style=flat-square
[gemnasium-url]: https://gemnasium.com/plouc/moxx


