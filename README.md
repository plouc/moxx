# moxx

[![License][license-image]][license-url]
[![Travis CI][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

moxx is a tool easily to mock your external APIs.
No more failed tests because of fragile dependencies.

[![NPM](https://nodei.co/npm/moxx.png?downloads=false&downloadRank=false)](https://nodei.co/npm/moxx/)

## Features

- yaml based configuration
- Watch mappings for auto reload
- Powerful request matching
- Record API calls for mock generation

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
| `-v, --version`         |         | Output the version number
| `-p, --port <port>`     | 5000    | The port number for the server to listen on
| `-d, --dir <directory>` | .       | The root config/mapping/files directory
| `-w --watch`            | false   | Watch for changes
| `-j, --journal`         | false   | Save incoming request with no match
| `-x, --proxy <proxy>`   |         | Act as a proxy
| `--no-color`            | false   | Disable color

[license-image]: https://img.shields.io/github/license/plouc/moxx.svg?style=flat-square
[license-url]: https://github.com/plouc/moxx/blob/master/LICENSE.md
[npm-image]: https://img.shields.io/npm/v/moxx.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/moxx
[travis-image]: https://img.shields.io/travis/plouc/moxx.svg?style=flat-square
[travis-url]: https://travis-ci.org/plouc/moxx

