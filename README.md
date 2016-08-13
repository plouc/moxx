# moxx

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