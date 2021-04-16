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

To quickly see cborld in action, run the following commands:

```
git clone https://github.com/digitalbazaar/cborld-cli.git
cd cborld
npm i
./cborld encode --verbose --diagnose examples/note.jsonld
./cborld decode --verbose --diagnose out.cborld
```

Or run directly with `npx`:
```
npx @digitalbazaar/cborld encode --verbose --diagnose examples/note.jsonld
```
## Install

### NPM

```
npm install @digitalbazaar/cborld-cli
```

### Git

To install locally (for development):

```
git clone https://github.com/digitalbazaar/cborld-cli.git
cd cborld
npm install
```

## CLI

A command line interface tool called `cborld` is provided to encode and decode
CBOR-LD.

`cborld` can be run installed, run directly, or run via `npx`:

```
npm install -g cborld-cli
cborld [OPTIONS]
```
```
./cborld [OPTIONS]
```
```
npx @digitalbazaar/cborld-cli [OPTIONS]
```

The options follow the API. See help for more information:

```
npx @digitalbazaar/cborld-cli --help
```

Examples:

```
TBD
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
