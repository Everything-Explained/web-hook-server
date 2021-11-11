#!/usr/bin/env node

import fastify from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';
import config from './config.json';
import { releaseHook } from './routes/release_hook';
import { colors, log, logErr } from './utils';
import { resolve as pathResolve } from 'path';



const server = fastify({
  http2: true,
  https: {
    allowHTTP1: true,
    key: readFileSync(join(__dirname, 'ssl', 'public.key')),
    cert: readFileSync(join(__dirname, 'ssl', 'private.cert'))
  }
});


server.register(releaseHook);


server.listen(config.port, '0.0.0.0', (err, address) => {
  if (err) {
    logErr(err);
    process.exit(1);
  }
  const c = colors;
  const workingDir = process.cwd();
  const productionDir = pathResolve(workingDir, '../_production/web_release/web_client');
  log('\n\n');
  log(`${c.bb('WORK Dir:')}\n${c.dw(process.cwd())}\n`);
  log(`${c.bb('PROD Dir:')}\n${c.dw(productionDir)}\n`);
  log(`\n\n${c.bw('Server Listening')} ${c.dw('at')} ${c.g(address)}\n\n\n`);
});









