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

- [yaml based configuration](#configuration)
- [Watch mappings for auto reload](#watching-changes-on-mappings)
- [Powerful request matching](#request-matching-system)
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

## Configuration

moxx requires two directories, `mappings` and `files` to run, if they don't exist, it will create them.
Those directories should be available under the `dir` option (default to `.`).

The `mappings` directory contains yaml files which define the mapping between incoming requests parameters (method, url, query, headers…)
and responses, the `files` directory contains files to be used as response body.

The `mappings` files are loaded in memory whereas the `files` are loaded when required and not cached,
it means if you modify a mapping file, the change you make won't be available immediately,
if you want this you should consider using the [watch option](#watching-changes-on-mappings).
If you change the content of a file or add one in the `files` directory, it will be available without restart or requiring the watch option.

### Mapping file

The typical structure of a mapping file is:

```yaml
get_users: # must be unique among all mappings
  request: # rules for matching
    method: GET
    url:    /users
  response: # response to send on match
    status: 200
    body:   hello world
```

Please, see [request matching](#request-matching-system) for further details on `request` configuration.
 
The `response` configuration accepts several keys:

```yaml
get_users:
  # ...
  response:
    status: 200
    headers:
      Content-Type: application/json
    # you cannont use both body and bodyFile  
    body:     hello world
    bodyFile: hello-world.txt
```

## Watching changes on mappings

```sh
moxx --watch
```

## Request matching system

moxx provides a powerful request matching.

- [matching method](#matching-http-method)
- [mathing url](#matching-url)
- [scoring](#scoring)

### Matching http method

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

### Matching url

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

### Scoring

moxx implements a scoring system to match requests, each rule you define increment the score of a mapping,
in the end the response whose request has the highest score will be sent.
 
```yaml
# this entry will be eligible but will always have a score of 0 because no rule is defined
default:
  request:  {}
  response:
    status: 200
    body:   moxx

# this entry will have a score of 1 if the incoming request is a GET request    
get_method:
  request:
    method: GET
  response:
    status: 200
    body:   moxx GET request
    
# this entry will have a score of 2 if the incoming request is a GET request and the url is /users
get_users:
  request:
    method: GET
    url:    /users
  response:
    status: 200
    body:   moxx GET users request
```

given this mapping:

* `HEAD /` will use `default` response (score: 0)
* `GET /` will use `get_method` response (score: 1)
* `GET /users` will use `get_get_users` response (score: 2)

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


