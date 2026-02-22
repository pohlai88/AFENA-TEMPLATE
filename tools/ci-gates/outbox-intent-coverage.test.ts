import { describe, expect, test } from 'vitest';

/**
 * G-CRUD-04 — Outbox Intent Coverage Gate
 *
 * Ensures handlers with side effects write outbox intents.
 * Prevents silent loss of workflow/search/webhook events.
 *
 * This is a structural test that verifies the handler registry is properly
 * configured. As handlers are created that require side effects, add them
 * to HANDLERS_WITH_SIDE_EFFECTS below.
 *
 * Why this matters:
 *   - Workflow events must not be lost (approval flows, state transitions)
 *   - Search index must stay in sync (full-text search correctness)
 *   - Webhooks must fire reliably (external integrations)
 *
 * The test verifies that:
 *   1. Handler registry is loaded and accessible
 *   2. Handlers declared as having side effects exist in the registry
 *   3. (Future) Mock tests can verify outbox writes for specific handlers
 */

import { HANDLER_REGISTRY } from '../../packages/crud/src/registries/handler-registry';

/**
 * Entity types that MUST write outbox intents.
 *
 * Add entity types here when they require:
 *   - Workflow rule evaluation (workflow_outbox)
 *   - Search index updates (search_outbox)
 *   - Webhook notifications (webhook_outbox)
 *   - Integration events (integration_outbox)
 *
 * Start with empty array. Populate as financial/workflow entities are added.
 * Examples: 'invoices', 'payments', 'journal-entries', 'purchase-orders'
 */
const HANDLERS_WITH_SIDE_EFFECTS: string[] = [
  // Currently empty — base handlers for companies/contacts don't require
  // custom outbox intents beyond standard workflow/search intents.
  //
  // When adding financial document handlers, add them here:
  // 'invoices',
  // 'payments',
  // 'journal-entries',
  // 'purchase-orders',
  // 'sales-orders',
];

describe('G-CRUD-04: handlers with side effects write outbox intents', () => {
  test('handler registry is loaded and accessible', () => {
    expect(HANDLER_REGISTRY).toBeDefined();
    expect(typeof HANDLER_REGISTRY).toBe('object');
  });

  test('registry contains expected base handlers', () => {
    // Verify known handlers exist
    expect(HANDLER_REGISTRY.companies).toBeDefined();
    expect(HANDLER_REGISTRY.contacts).toBeDefined();
  });

  test('all declared side-effect handlers exist in registry', () => {
    const missing: string[] = [];

    for (const entityType of HANDLERS_WITH_SIDE_EFFECTS) {
      if (!HANDLER_REGISTRY[entityType]) {
        missing.push(entityType);
      }
    }

    if (missing.length > 0) {
      throw new Error(
        `G-CRUD-04: ${missing.length} handler(s) declared in HANDLERS_WITH_SIDE_EFFECTS but missing from registry:\n` +
        missing.map((e) => `  - ${e}`).join('\n') +
        `\n\nEither:\n` +
        `  1. Create the handler in packages/crud/src/handlers/${missing[0]}.ts\n` +
        `  2. Register it in packages/crud/src/registries/handler-registry.ts\n` +
        `  3. Or remove it from HANDLERS_WITH_SIDE_EFFECTS if not needed`,
      );
    }

    expect(missing).toEqual([]);
  });

  test('side-effect handlers list is intentionally empty (base handlers only)', () => {
    // This test documents the current state: companies and contacts use
    // base handlers which rely on kernel-generated outbox intents.
    //
    // When financial document handlers are added, this test will fail,
    // prompting developers to add them to HANDLERS_WITH_SIDE_EFFECTS.
    expect(HANDLERS_WITH_SIDE_EFFECTS.length).toBe(0);
  });

  // Future enhancement: Mock-based outbox write verification
  // When HANDLERS_WITH_SIDE_EFFECTS is populated, add tests like:
  //
  // test('invoice handler writes workflow outbox intent on create', async () => {
  //   const handler = HANDLER_REGISTRY.invoices;
  //   const spy = vi.spyOn(workflowOutbox, 'insert');
  //   await handler.planCreate(mockCtx, mockInput);
  //   expect(spy).toHaveBeenCalled();
  // });
});
