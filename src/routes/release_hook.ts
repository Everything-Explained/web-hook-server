import { colors, indent, replyForbidden } from "../utils";
import { createHmac }                     from "crypto";
import { FastifyInstance }                from "fastify";
import { HookInfo }                       from "../typings/hookinfo";
import config                             from '../config.json';
import { exec }                           from "child_process";
import { resolve as pathResolve }         from 'path';



const c = colors;


export async function releaseHook(fastify: FastifyInstance) {
  fastify.post<{ Body: HookInfo }>('/release', async (req, reply) => {
    const signature = req.raw.headers[config.gitSigHeader] as string;
    if (!signature) return replyForbidden(reply);
    if (isValidSignature(signature, JSON.stringify(req.body))) {
      const gitPullLog = await pullRelease();
      const formattedPullLog = indent(4)(gitPullLog.split('\n')).join('\n');
      logCommitInfo(formattedPullLog, req.body);
      return 'Ok';
    }
    return replyForbidden(reply);
  });
}

function isValidSignature(sig: string, body: string) {
  const sigHash = sig.split('=')[1];
  const hmac    = createHmac('sha256', config.secret);
  return hmac.update(body).digest('hex') == sigHash;
}

function pullRelease() {
  const url        = `https://${config.gitCredentials}@${config.gitReleaseURL}`;
  const releaseDir = pathResolve(process.cwd(), '../_production/web_release/web_client');
  const cmd        = `git -C ${releaseDir} pull ${url}`;
  return new Promise<string>((rs, rj) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) return rj(err);
      // git logs to stderr even when successful
      rs(`${stderr}\n${stdout}`);
    });
  });
}

function logCommitInfo(cmdLog: string, hookinfo: HookInfo) {
  const date      = new Date().toLocaleString();
  const names     = hookinfo.head_commit.modified;
  const commitMsg = hookinfo.head_commit.message;
  const header    = `\n\n${c.bg(`${commitMsg} >>> `)}${c.y(date)}`;
  console.log(header);
  console.log(c.dw(cmdLog));
  names.forEach(n => console.log(`    ${n}`));
  console.log(`${c.bg('-')}`.repeat(header.length - 21)); // subtract color char offset
  console.log(''); // Spacer
}








