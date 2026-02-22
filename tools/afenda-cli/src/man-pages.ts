/**
 * Man page generation — emit troff-format man page from Commander help.
 * Usage: afenda man-pages [--output <path>]
 */

import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

import type { Command } from 'commander';

function escapeRoff(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/^\./gm, '\\&.');
}

function section(name: string, body: string): string {
  return `.SH ${name}\n${body}\n`;
}

export function generateManPage(program: Command, outPath?: string): string {
  const name = program.name();
  const version = program.version();
  const description = program.description() ?? 'afenda monorepo CLI';
  const date = new Date().toISOString().slice(0, 10);

  const lines: string[] = [];
  lines.push(`.TH ${name.toUpperCase()} 1 "${date}" "${version}" "User Commands"`);
  lines.push('.SH NAME');
  lines.push(`${name} \\- ${escapeRoff(description)}`);
  lines.push('');
  lines.push('.SH SYNOPSIS');
  lines.push(`.B ${name}`);
  lines.push('[\\fIoptions\\fR] \\fIcommand\\fR [\\fIargs\\fR]');
  lines.push('');
  lines.push('.SH DESCRIPTION');
  lines.push(`.PP\n${escapeRoff(description)}.`);
  lines.push('');

  const cmds = program.commands.filter((c) => !c.parent || c.parent === program);
  if (cmds.length > 0) {
    lines.push(section('COMMANDS', cmds.map((c) => {
      const desc = c.description()?.replace(/\n/g, ' ') ?? '';
      return `.TP\n.B ${name} ${c.name()}\n${escapeRoff(desc)}`;
    }).join('\n')));
  }

  const opts = program.options;
  if (opts.length > 0) {
    const optLines = opts.map((o) => {
      const flags = o.flags.replace(',', ', ');
      const desc = o.description ?? '';
      return `.TP\n.BR ${escapeRoff(flags)}\n${escapeRoff(desc)}`;
    }).join('\n');
    lines.push(section('OPTIONS', optLines));
  }

  lines.push('.SH "SEE ALSO"');
  lines.push('.B afenda --help');
  lines.push('');

  const content = lines.join('\n');

  if (outPath) {
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, content, 'utf-8');
  }

  return content;
}
