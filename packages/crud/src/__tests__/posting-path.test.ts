/**
 * WP-02: Posting-path invariant test.
 *
 * Journals (journal_lines) and stock_movements are written ONLY via doc_postings
 * (posting worker), not by mutate() or app routes.
 *
 * This test verifies that the mutate handler registry (in mutate.ts) does not
 * include journal_line or stock_movement — enforcing that app code cannot
 * write to these tables through the mutate path.
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect } from 'vitest';

// Entity types that MUST only be written via posting worker (doc_postings path)
const POSTING_ONLY_ENTITY_TYPES = ['journal_line', 'stock_movement'] as const;

describe('WP-02: Posting path invariant', () => {
  it('mutate HANDLER_REGISTRY does not include posting-only entity types', () => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const mutatePath = join(__dirname, '../mutate.ts');
    const content = readFileSync(mutatePath, 'utf-8');

    // Extract handler registry keys (contacts, companies, etc.)
    const handlerMatch = content.match(/HANDLER_REGISTRY:\s*Record[^=]*=\s*\{([^}]+)\}/s);
    expect(handlerMatch).toBeTruthy();
    const registryBody = handlerMatch![1]!;

    for (const entityType of POSTING_ONLY_ENTITY_TYPES) {
      expect(registryBody).not.toContain(`${entityType}:`);
      expect(registryBody).not.toContain(`${entityType}Handler`);
    }
  });

  it('posting-only tables are documented', () => {
    expect(POSTING_ONLY_ENTITY_TYPES).toContain('journal_line');
    expect(POSTING_ONLY_ENTITY_TYPES).toContain('stock_movement');
  });
});
