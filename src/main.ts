#!/usr/bin/env node

import fastify from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';
import config from './config.json';
import { releaseHook } from './routes/release_hook';
import { log, logErr } from './utils';



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
  log(`Server listening at ${address}`);
});









