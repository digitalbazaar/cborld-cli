/*!
 * Copyright (c) 2020-2023 Digital Bazaar, Inc. All rights reserved.
 */

import * as cborld from '@digitalbazaar/cborld';
import {promises as fs} from 'node:fs';
import {hideBin} from 'yargs/helpers';
import https from 'node:https';
import os from 'node:os';
import path from 'node:path';
import url from 'node:url';
import yargs from 'yargs';

export async function main() {
  const cli = yargs(hideBin(process.argv))
    .usage('Usage: $0 <command>')
    .option('verbose', {
      describe: 'Provide verbose logging',
      alias: 'v',
      boolean: true
    })
    .option('diagnose', {
      describe: 'Provide diagnostic output',
      alias: 'd',
      boolean: true
    })
    .alias('h', 'help')
    .help('help', 'Show help for cborld command.')
    .command('encode [options] <file>', 'Encode a JSON-LD file to CBOR-LD',
      yargs => {
        yargs
          .option('context', {
            describe: 'List of context URLs to compress.',
            alias: 'c',
            type: 'array',
            default: []
          })
          //.option('transform', {
          //  describe: 'List of custom <term>:<transform>s to apply. ' +
          //    'Transforms: ' + cborld.getTermCodecs().join(', '),
          //  alias: 't',
          //  type: 'array',
          //  default: []
          //})
          .option('output', {
            describe: 'Write output to filename or stdout.',
            alias: 'o',
            type: 'string',
            default: 'out.cborld'
          })
          .positional('file', {
            describe: 'The JSON-LD file to encode.',
            type: 'string',
            default: '-'
          })
          .example([
            ['$0 encode example.jsonld',
              'Encode example.jsonld to out.cborld'],
            ['$0 encode example.jsonld -v -d',
              'Encode example.jsonld showing diagnostic output'],
            ['$0 encode example.jsonld -v -d -t proofValue:base64Pad ' +
              '-c https://example.com/example/v1',
            'Encode with custom term transform and context']
          ]);
      }, encodeCommand)
    .alias('e', 'encode')
    .command('decode [options] <file>', 'Decode a CBOR-LD file to JSON-LD',
      yargs => {
        yargs
          .option('context', {
            describe: 'List of context URLs to expand.',
            alias: 'c',
            type: 'array',
            default: []
          })
          //.option('transform', {
          //  describe: 'List of custom <term>:<transform>s to apply. ' +
          //    'Transforms: ' + cborld.getTermCodecs().join(', '),
          //  alias: 't',
          //  type: 'array',
          //  default: []
          //})
          .option('output', {
            describe: 'Write output to filename or stdout.',
            alias: 'o',
            type: 'string',
            default: 'out.jsonld'
          })
          .positional('file', {
            describe: 'The CBOR-LD file to decode.',
            type: 'string',
            default: '-'
          })
          .example([
            ['$0 decode example.cborld',
              'Decode example.cborld to out.jsonld'],
            ['$0 encode example.cborld -v -d',
              'Decode example.jsonld showing diagnostic output'],
            ['$0 encode example.cborld -v -d -t proofValue:base64Pad ' +
              '-c https://example.com/example/v1',
            'Decode with custom term transform and context']
          ]);
      }, decodeCommand)
    .alias('d', 'decode')
    .example([
      ['$0 encode example.jsonld',
        'Encode example.jsonld to out.cborld'],
      ['$0 encode example.jsonld -v -d',
        'Encode example.jsonld showing diagnostic output']
    ])
    .demandCommand(1, 'Please specify a command.');
  cli.argv;
}

// Yargs command to encode a given JSON-LD document to CBOR-LD
async function encodeCommand(args) {
  try {
    const jsonldBytes = await fs.readFile(args.file);
    const jsonldDocument = JSON.parse(jsonldBytes);
    const {appContextMap, appTermMap} = _getAppMaps(args);

    // encode to CBOR-LD
    const cborldBytes = await cborld.encode({
      jsonldDocument,
      documentLoader,
      appContextMap,
      appTermMap,
      diagnose: (args.diagnose) ? console.log : undefined
    });
    await fs.writeFile(args.output, cborldBytes);

    if(args.verbose) {
      const ratio = 100 - (cborldBytes.length / jsonldBytes.length) * 100;
      console.log(`${jsonldBytes.length} JSON-LD input bytes, ` +
        `${cborldBytes.length} CBOR-LD output bytes, ` +
        `${ratio.toFixed(0)}% smaller.`);
    }

    console.log(`Wrote CBOR-LD output to '${args.output}'.`);
  } catch(e) {
    console.error(e.stack);
    process.exit(1);
  }
}

function _getAppMaps(args) {
  const appMaps = {};
  // build the application context map
  if(args.context) {
    appMaps.appContextMap = new Map();
    // set the application-specific CBOR-LD encoded context URL values
    // starting at 0x8000, which defines the start of application-specific
    // context URL value space
    args.context.forEach(
      (element, i) => appMaps.appContextMap.set(element, 0x8000 + i));
  }

  // FIXME: no longer supported
  // build the application term transforms map
  if(args.transform) {
    appMaps.appTermMap = new Map();
    args.transform.forEach(element => {
      const [term, transform] = element.split(':');
      appMaps.appTermMap.set(term, transform);
    });
  }

  return appMaps;
}

// Yars command to decode given CBOR-LD bytes to a JSON-LD document
async function decodeCommand(args) {
  try {
    const cborldBytes = await fs.readFile(args.file);
    const {appContextMap} = _getAppMaps(args);

    // encode to CBOR-LD
    const jsonldDocument = await cborld.decode({
      cborldBytes,
      documentLoader,
      appContextMap,
      diagnose: (args.diagnose) ? console.log : undefined
    });
    const jsonldBytes = JSON.stringify(jsonldDocument, null, 2);
    await fs.writeFile(args.output, jsonldBytes);

    if(args.verbose) {
      const ratio = ((jsonldBytes.length / cborldBytes.length) * 100) - 100;
      console.log(`${cborldBytes.length} CBOR-LD input bytes, ` +
        `${jsonldBytes.length} JSON-LD output bytes, ` +
        `${ratio.toFixed(0)}% larger.`);
    }

    console.log(`Wrote JSON-LD output to '${args.output}'.`);
  } catch(e) {
    console.error(e.stack);
    process.exit(1);
  }
}

// default caching document loader for JSON-LD Context files
async function _get({docUrl, file}) {
  const options = {
    headers: {
      accept: 'application/ld+json, application/json'
    }
  };

  await new Promise((resolve, reject) => {
    https.get(docUrl, options, res => {
      if(res.statusCode === 301 || res.statusCode === 302) {
        return _get({docUrl: res.headers.location, file});
      }
      res.pipe(file);
      res.on('end', resolve);
      res.on('error', reject);
    });
  });
}

// default caching, redirect following document loader
async function documentLoader(docUrl) {
  const cacheFile = path.join(
    os.tmpdir(), 'jsonld-context' + url.parse(docUrl)
      .pathname.replace(/\//g, '-').replace(/\.jsonld$/, '') + '.jsonld');
  try {
    await fs.access(cacheFile, fs.constants.F_OK | fs.constants.R_OK);
  } catch(e) {
    const file = fs.createWriteStream(cacheFile);
    await _get({docUrl, file});
  }

  return {
    contextUrl: null,
    documentUrl: docUrl,
    document: await fs.readFile(cacheFile, 'utf8')
  };
}
