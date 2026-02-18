import pc from 'picocolors';

/**
 * Minimal ANSI stripper (covers common color codes).
 * Keeps us CJS-safe without external deps.
 */
 
function stripAnsi(input: string): string {
  // Strip ANSI escape sequences (ESC [ ... m) — control char required for ANSI stripping
  // eslint-disable-next-line no-control-regex -- intentional: matches ANSI CSI sequences
  return input.replace(/\x1b\[[0-9;]*m/g, '');
}

const isCI = !!process.env.CI;
const isVerbose = !!process.env.afenda_VERBOSE;
const isJsonOutput = process.argv.includes('--json');

function formatForOutput(msg: string): string {
  if (isJsonOutput || isCI) {
    return stripAnsi(msg);
  }
  return msg;
}

export const log = {
  info(msg: string): void {
    console.log(formatForOutput(msg));
  },

  success(msg: string): void {
    console.log(formatForOutput(pc.green(`✅ ${msg}`)));
  },

  warn(msg: string): void {
    console.warn(formatForOutput(pc.yellow(`⚠️  ${msg}`)));
  },

  error(msg: string): void {
    console.error(formatForOutput(pc.red(`❌ ${msg}`)));
  },

  debug(msg: string): void {
    if (isVerbose) {
      console.log(formatForOutput(pc.dim(`[debug] ${msg}`)));
    }
  },

  dim(msg: string): void {
    console.log(formatForOutput(pc.dim(msg)));
  },

  bold(msg: string): void {
    console.log(formatForOutput(pc.bold(msg)));
  },

  /**
   * Emit canonical JSON (for `--json` mode).
   * Always prints valid JSON with newline.
   */
  json(obj: unknown): void {
    console.log(JSON.stringify(obj));
  },

  /** Print a boxed report */
  box(lines: string[]): void {
    if (lines.length === 0) {
      console.log(formatForOutput('┌──┐\n└──┘'));
      return;
    }

    const maxLen = Math.max(...lines.map((l) => stripAnsi(l).length));
    const border = '─'.repeat(maxLen + 2);
    console.log(formatForOutput(`┌${border}┐`));
    for (const line of lines) {
      const stripped = stripAnsi(line);
      const pad = ' '.repeat(maxLen - stripped.length);
      console.log(formatForOutput(`│ ${line}${pad} │`));
    }
    console.log(formatForOutput(`└${border}┘`));
  },
};

export { isCI, isVerbose, isJsonOutput };
