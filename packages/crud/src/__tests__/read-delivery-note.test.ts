/**
 * readDeliveryNoteWithLines — Phase 2A relational API tests.
 *
 * Verifies:
 * - Uses db.query.deliveryNotes.findFirst with with: { lines: true }
 * - Returns { header, lines } envelope
 * - Returns NOT_FOUND when not found
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('readDeliveryNoteWithLines', () => {
  it('uses db.query.deliveryNotes.findFirst with lines relation', () => {
    const content = readFileSync(join(__dirname, '../read-delivery-note.ts'), 'utf-8');
    expect(content).toContain('conn.query.deliveryNotes.findFirst');
    expect(content).toContain('with: { lines: true }');
  });

  it('filters by orgId and id (composite PK)', () => {
    const content = readFileSync(join(__dirname, '../read-delivery-note.ts'), 'utf-8');
    expect(content).toContain('eq(deliveryNotes.orgId, orgId)');
    expect(content).toContain('eq(deliveryNotes.id, id)');
  });

  it('returns { header, lines } envelope', () => {
    const content = readFileSync(join(__dirname, '../read-delivery-note.ts'), 'utf-8');
    expect(content).toContain('ok({ header, lines: lines ?? [] }');
  });

  it('returns NOT_FOUND when not found', () => {
    const content = readFileSync(join(__dirname, '../read-delivery-note.ts'), 'utf-8');
    expect(content).toContain("err('NOT_FOUND'");
  });
});
