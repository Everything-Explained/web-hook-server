#!/usr/bin/env node



import fastify from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';


const server = fastify({
  http2: true,
  https: {
    key: readFileSync(join(__dirname, 'ssl', 'public.key')),
    cert: readFileSync(join(__dirname, 'ssl', 'private.cert'))
  }
});


server.get('/ping', async (req, rep) => {
  return 'pong';
});


server.listen(3003, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});







