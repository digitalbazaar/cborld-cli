# JavaScript CBOR-LD Command Line Interface

> A JavaScript CBOR-LD Process for Web browsers and Node.js apps.

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [API](#api)
- [CLI](#cli)
- [Contribute](#contribute)
- [Commercial Support](#commercial-support)
- [License](#license)

## Background

This module provides a Node.js CBOR-LD CLI.

## Quickstart

To quickly see `cborld-cli` in action, run the following commands:

```
git clone https://github.com/digitalbazaar/cborld-cli.git
cd cborld-cli
npm i
mkdir -p tmp
./cborld-cli encode --verbose --diagnose ./examples/note.jsonld -o ./tmp/note.cborld
./cborld-cli decode --verbose --diagnose ./tmp/note.cborld -o ./tmp/note.jsonld
npx json-diff ./examples/note.jsonld ./tmp/note.jsonld
# there should be no difference in the round trip conversion
```

Or run directly with `npx`:
```
mkdir -p tmp
npx @digitalbazaar/cborld encode --verbose --diagnose ./examples/note.jsonld -o ./tmp/note.cborld
# ... continue as above
```

## Usage

A command line interface tool called `cborld` is provided to encode and decode
CBOR-LD.

`cborld` can be run installed globally, run directly, or run via `npx`:

### Global Install

```
npm install -g @digitalbazaar/cborld-cli
cborld [OPTIONS]
```

### Development

```
git clone https://github.com/digitalbazaar/cborld-cli.git
cd cborld-
npm install
./cborld-cli [OPTIONS]
```

### NPX

```
npx @digitalbazaar/cborld-cli [OPTIONS]
```

### Help

The options follow the API. See help for more information:

```
npx @digitalbazaar/cborld-cli --help
```

## Examples

```
mkdir -p tmp

# basic conversion of file, with verbose and diagnostic output
cborld encode --verbose --diagnose ./examples/note.jsonld -o ./tmp/note.cborld
# creates `./tmp/note.cborld`

# decode file
cborld decode --verbose --diagnose ./tmp/note.cborld -o ./tmp/note.jsonld
# creates `./tmp/note.jsonld`

# output to hex string
cborld encode ./examples/note.jsonld -o - | xxd -p -c 0 - > ./tmp/note.hex

# decode hex string
xxd -r -p -c 0 ./tmp/note.hex | cborld decode -v -d - -o ./tmp/note2.jsonld
# creates `./tmp/note2.jsonld`
```

## Contribute

Please follow the existing code style.

PRs accepted.

If editing the README, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[New BSD-3-Clause](LICENSE) © Digital Bazaar
