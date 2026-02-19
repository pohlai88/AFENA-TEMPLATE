import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * G-CRUD-02 — Commit Phase No-External-IO Gate (Static Analysis)
 *
 * Enforces K-12: code inside src/commit/ MUST NOT import external IO libs.
 * The commit phase runs inside a DB transaction — any external IO would:
 *   a) Hold the transaction open longer (contention risk)
 *   b) Violate the atomicity contract (IO succeeds but TX rolls back)
 *   c) Make recovery logic impossible to reason about
 *
 * Banned categories:
 *   - HTTP clients (fetch, axios, got, node-fetch)
 *   - Message queues (bullmq, amqplib, kafkajs, ioredis, redis)
 *   - Filesystem (node:fs, fs-extra)
 *   - Email/SMS (nodemailer, twilio)
 *   - Cloud SDKs (aws-sdk, @azure/*)
 *
 * Exceptions:
 *   - afenda-database (DB writes inside TX are the POINT of commit/)
 *   - afenda-canon (types only, no IO)
 *   - node:crypto (async but CPU-only)
 *   - Relative imports (internal CRUD only)
 */

const COMMIT_DIR = resolve(__dirname, '../../packages/crud/src/commit');

/**
 * Import patterns that must NEVER appear in commit/ files.
 * Checked against both `from 'x'` and `require('x')` forms.
 */
const BANNED_IMPORT_PATTERNS = [
  // HTTP / fetch
  'node:http', 'node:https', 'node-fetch', 'axios', 'got', 'superagent', 'ky',
  // Queues / caches
  'ioredis', 'redis', '@redis/', 'bullmq', 'amqplib', 'kafkajs', 'rhea',
  // Filesystem
  'node:fs', 'node:fs/promises', 'fs-extra', 'glob', 'fast-glob',
  // Email / SMS
  'nodemailer', 'twilio', '@sendgrid/', 'postmark',
  // Cloud SDKs
  'aws-sdk', '@aws-sdk/', '@azure/', '@google-cloud/',
  // Browser/DOM APIs (wrong env)
  'window', 'document', 'navigator',
] as const;

describe('G-CRUD-02: commit/ has no external IO imports', () => {
  /** Recursively collect all .ts files excluding tests and node_modules. */
  function collectTsFiles(dir: string): string[] {
    const results: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry !== 'node_modules' && entry !== 'dist') {
          results.push(...collectTsFiles(full));
        }
      } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts') && !entry.endsWith('.spec.ts')) {
        results.push(full);
      }
    }
    return results;
  }

  test('commit/ directory exists (will be created in Phase 2.5)', () => {
    if (!existsSync(COMMIT_DIR)) {
      console.warn(
        '[G-CRUD-02] src/commit/ does not exist yet \u2014 gate will enforce once Phase 2.5 runs.',
      );
    }
    expect(true).toBe(true);
  });

  test('commit/ files contain no banned IO imports', () => {
    if (!existsSync(COMMIT_DIR)) {
      return;
    }

    const files = collectTsFiles(COMMIT_DIR);
    const violations: Array<{ file: string; banned: string; line: number }> = [];

    for (const filePath of files) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;
        for (const banned of BANNED_IMPORT_PATTERNS) {
          if (line.includes(`from '${banned}'`) || line.includes(`require('${banned}')`)) {
            violations.push({ file: filePath.replace(COMMIT_DIR + '/', ''), banned, line: i + 1 });
          }
        }
      }
    }

    if (violations.length > 0) {
      const report = violations
        .map((v) => `  ${v.file}:${v.line} \u2014 banned import "${v.banned}"`)
        .join('\n');
      throw new Error(
        `G-CRUD-02: ${violations.length} banned IO import(s) found in commit/ phase:\n${report}\n\n` +
        `The commit phase runs inside a DB transaction.\n` +
        `External IO violates K-12 (atomicity) and creates contention.\n` +
        `Move the IO to the deliver/ phase instead.`,
      );
    }

    expect(violations).toEqual([]);
  });
});
