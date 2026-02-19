import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * G-CRUD-05 — Stable Error Code Enforcement Gate
 *
 * Ensures all error returns use canonical ErrorCode enum from afenda-canon.
 * Prevents unstable error codes that break client error handling.
 *
 * Why this matters:
 *   - Clients need deterministic error codes for retry logic
 *   - Frontend needs stable codes for user-friendly error messages
 *   - Monitoring needs stable codes for alerting rules
 *   - API contracts must not break with raw string changes
 *
 * Banned patterns:
 *   - throw new Error('SOME_CODE: message')  ❌
 *   - return { code: 'SOME_CODE' }           ❌
 *   - err('SOME_CODE', ...)                  ❌
 *
 * Allowed patterns:
 *   - ErrorCode.FORBIDDEN                    ✅
 *   - KernelErrorCode enum values            ✅
 *   - Imported from afenda-canon             ✅
 */

const CRUD_SRC = resolve(__dirname, '../../packages/crud/src');

/**
 * Canonical error codes from KernelErrorCode enum (afenda-canon).
 * These are the ONLY allowed error code strings.
 */
const ALLOWED_ERROR_CODES = [
  'FORBIDDEN',
  'RATE_LIMITED',
  'JOB_QUOTA_EXCEEDED',
  'VALIDATION_FAILED',
  'LIFECYCLE_DENIED',
  'EDIT_WINDOW_EXPIRED',
  'EXPECTED_VERSION_MISMATCH',
  'UNIQUE_CONSTRAINT',
  'FK_CONSTRAINT',
  'IDEMPOTENCY_KEY_REUSE_CONFLICT',
  'OUTBOX_WRITE_FAILED',
  'CLOSED_FISCAL_PERIOD',
  'POSTED_DOCUMENT_IMMUTABLE',
  'INTERNAL',
  'CONFLICT_RETRY', // Optional transient error code
  'POLICY_DENIED', // Policy engine rejection
  'NOT_FOUND', // Entity not found in read operations
] as const;

/**
 * Patterns that indicate error code usage.
 * We scan for these and validate the code string.
 */
const ERROR_CODE_PATTERNS = [
  // return rejected({ code: 'XXX', ... })
  /code:\s*['"]([A-Z_]+)['"]/g,
  // throw new Error('XXX: message')
  /new\s+Error\s*\(\s*['"]([A-Z_]+):/g,
  // err('XXX', ...)
  /\berr\s*\(\s*['"]([A-Z_]+)['"]/g,
  // { errorCode: 'XXX' }
  /errorCode:\s*['"]([A-Z_]+)['"]/g,
] as const;

describe('G-CRUD-05: all errors use stable ErrorCode enum', () => {
  /** Recursively collect all .ts files excluding tests and node_modules. */
  function collectTsFiles(dir: string): string[] {
    if (!existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        if (entry !== 'node_modules' && entry !== 'dist' && entry !== '__tests__') {
          results.push(...collectTsFiles(full));
        }
      } else if (
        entry.endsWith('.ts') &&
        !entry.endsWith('.test.ts') &&
        !entry.endsWith('.spec.ts')
      ) {
        results.push(full);
      }
    }
    return results;
  }

  test('packages/crud/src/ directory exists', () => {
    expect(existsSync(CRUD_SRC)).toBe(true);
  });

  test('all error codes in source files match canonical ErrorCode enum', () => {
    const files = collectTsFiles(CRUD_SRC);
    const violations: Array<{ file: string; line: number; code: string; context: string }> = [];

    for (const filePath of files) {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]!;

        // Skip comments
        if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
          continue;
        }

        // Check each pattern
        for (const pattern of ERROR_CODE_PATTERNS) {
          const regex = new RegExp(pattern.source, pattern.flags);
          let match: RegExpExecArray | null;

          while ((match = regex.exec(line)) !== null) {
            const code = match[1];
            if (code && !ALLOWED_ERROR_CODES.includes(code as any)) {
              violations.push({
                file: filePath.replace(CRUD_SRC, 'src'),
                line: i + 1,
                code,
                context: line.trim().slice(0, 80),
              });
            }
          }
        }
      }
    }

    if (violations.length > 0) {
      const report = violations
        .map(
          (v) =>
            `  ${v.file}:${v.line}\n` +
            `    Code: "${v.code}" (not in KernelErrorCode enum)\n` +
            `    Context: ${v.context}`,
        )
        .join('\n\n');

      throw new Error(
        `G-CRUD-05: ${violations.length} unstable error code(s) found:\n\n${report}\n\n` +
        `All error codes must be from the canonical KernelErrorCode enum.\n` +
        `Allowed codes: ${ALLOWED_ERROR_CODES.join(', ')}\n\n` +
        `To fix:\n` +
        `  1. Import ErrorCode from 'afenda-canon'\n` +
        `  2. Use ErrorCode.${violations[0]?.code || 'FORBIDDEN'} instead of string literal\n` +
        `  3. Or add the code to KernelErrorCode enum if it's a new canonical error`,
      );
    }

    expect(violations).toEqual([]);
  });

  test('error code enum is imported from afenda-canon (not redefined)', () => {
    // Verify that CRUD doesn't redefine error codes locally
    const errorsFile = join(CRUD_SRC, 'errors.ts');

    if (!existsSync(errorsFile)) {
      // errors.ts doesn't exist yet — acceptable
      return;
    }

    const content = readFileSync(errorsFile, 'utf-8');

    // Should import from canon, not define locally
    expect(content).toContain('afenda-canon');

    // Should NOT have local enum definition
    expect(content).not.toMatch(/export\s+(enum|type)\s+ErrorCode\s*=/);
  });

  test('allowed error codes list is complete and documented', () => {
    // This test documents the canonical error code list
    // Update ALLOWED_ERROR_CODES when adding new codes to Canon
    expect(ALLOWED_ERROR_CODES.length).toBeGreaterThan(0);
    expect(ALLOWED_ERROR_CODES).toContain('FORBIDDEN');
    expect(ALLOWED_ERROR_CODES).toContain('VALIDATION_FAILED');
    expect(ALLOWED_ERROR_CODES).toContain('INTERNAL');
  });
});
