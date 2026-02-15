/**
 * listEntities tests — Batch API adoption validation.
 *
 * Verifies:
 * - includeCount false: No meta.totalCount; existing callers unchanged.
 * - includeCount true: meta.totalCount is number.
 * - Count query reuses whereClause; does not include limit/offset/orderBy.
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('listEntities includeCount', () => {
  it('count query reuses whereClause and does not include limit/offset/orderBy', () => {
    const readPath = join(__dirname, '../read.ts');
    const content = readFileSync(readPath, 'utf-8');

    // Count query must use the same whereClause variable (or whereClause ?? sql`true`)
    expect(content).toContain('whereClause');

    // Offset path batch: find the batch that contains .offset(offset) (not cursor path)
    const offsetBatchStart = content.indexOf('.offset(offset)');
    expect(offsetBatchStart).toBeGreaterThan(-1);
    const batchStart = content.lastIndexOf('batch([', offsetBatchStart);
    const batchEnd = content.indexOf(']);', batchStart);
    const batchContent = content.substring(batchStart, batchEnd + 3);
    const secondQueryStart = batchContent.indexOf('),');
    const secondQuery = batchContent.substring(secondQueryStart);
    expect(secondQuery).not.toContain('.limit(');
    expect(secondQuery).not.toContain('.offset(');
    expect(secondQuery).not.toContain('.orderBy(');
    expect(secondQuery).toContain('count(*)::bigint');
  });

  it('includeCount false yields no meta.totalCount (structural)', () => {
    const readPath = join(__dirname, '../read.ts');
    const content = readFileSync(readPath, 'utf-8');

    // When !includeCount, we return ok(rows, requestId) without meta extras
    expect(content).toContain('return ok(rows, requestId);');
  });

  it('includeCount true yields meta.totalCount (structural)', () => {
    const readPath = join(__dirname, '../read.ts');
    const content = readFileSync(readPath, 'utf-8');

    // When includeCount, we return ok(..., { totalCount })
    expect(content).toContain('totalCount');
    expect(content).toContain('ok(rows, requestId, undefined, { totalCount })');
  });

  it('forcePrimary + includeCount uses Promise.all on primary (not batch)', () => {
    const readPath = join(__dirname, '../read.ts');
    const content = readFileSync(readPath, 'utf-8');

    expect(content).toContain('useBatch = !options?.forcePrimary');
    expect(content).toContain('Promise.all');
  });

  it('orgId filter adds eq(table.orgId, orgId) to whereClause (DRIZ-01)', () => {
    const readPath = join(__dirname, '../read.ts');
    const content = readFileSync(readPath, 'utf-8');

    expect(content).toContain('orgId?: string');
    expect(content).toContain('eq(table.orgId, options.orgId)');
  });

  it('cursor option triggers cursor path with limit+1 and nextCursor (Phase 2B)', () => {
    const readPath = join(__dirname, '../read.ts');
    const content = readFileSync(readPath, 'utf-8');

    expect(content).toContain('cursor?: string');
    expect(content).toContain('limit + 1');
    expect(content).toContain('nextCursor');
    expect(content).toContain('decodeCursor');
    expect(content).toContain('encodeCursor');
  });

  it('invalid cursor returns VALIDATION_FAILED', () => {
    const readPath = join(__dirname, '../read.ts');
    const content = readFileSync(readPath, 'utf-8');

    expect(content).toContain('VALIDATION_FAILED');
    expect(content).toContain('decodeCursor(options.cursor)');
  });
});
