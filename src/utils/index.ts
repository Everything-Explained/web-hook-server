import chalk from 'chalk';
import { FastifyReply } from "fastify";


type IndentReturn<T extends string|string[]> = T extends string ? string : string[];



export const colors = {
  r: chalk.red,
  br: chalk.redBright,
  y: chalk.yellow,
  by: chalk.yellowBright,
  g: chalk.green,
  bg: chalk.greenBright,
  w: chalk.white,
  bw: chalk.whiteBright,
  dw: chalk.grey,
};

export function replyForbidden(reply: FastifyReply) {
  reply.code(403);
  return new Error('Forbidden');
}

export function indent(num: number) {
  return <T extends string|string[]>(str: T): IndentReturn<T> => {
    if (typeof str == 'string')
      return ' '.repeat(num) + str as IndentReturn<T>
    ;
    return str.map(indent(num)) as unknown as IndentReturn<T>;
  };
}

