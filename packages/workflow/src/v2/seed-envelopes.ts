import { generateEnvelope } from './envelope-generator';
import { compileEffective } from './merge-compiler';
import { COMPILER_VERSION } from './types';

import type { EntityContract } from 'afenda-canon';

/**
 * Seed data for a single entity type's default workflow definitions.
 *
 * Produces two rows for `workflow_definitions`:
 * 1. Envelope (definition_kind='envelope', is_default=true, status='published')
 * 2. Compiled effective (definition_kind='effective', is_default=true, status='published')
 *
 * The effective is compiled from the bare envelope with no body patches.
 */
export interface SeedDefinitionPair {
  entityType: string;
  envelope: {
    nodesJson: unknown;
    edgesJson: unknown;
    slotsJson: unknown;
  };
  effective: {
    nodesJson: unknown;
    edgesJson: unknown;
    compiledJson: unknown;
    compiledHash: string;
    compilerVersion: string;
  };
}

/**
 * Generate seed definition pairs for a list of entity contracts.
 *
 * Each contract produces an envelope + compiled effective pair.
 * The effective is compiled from the bare envelope (no org patches).
 */
export function generateSeedDefinitions(contracts: EntityContract[]): SeedDefinitionPair[] {
  const results: SeedDefinitionPair[] = [];

  for (const contract of contracts) {
    const envelope = generateEnvelope(contract, 1);

    // Compile effective from bare envelope (no body patches)
    const compileResult = compileEffective(
      envelope.nodes,
      envelope.edges,
      envelope.slots,
      {}, // No body patches for default
      1,  // envelope version
    );

    if (!compileResult.ok) {
      throw new Error(
        `Failed to compile default envelope for ${contract.entityType}: ${compileResult.errors.join('; ')}`,
      );
    }

    results.push({
      entityType: contract.entityType,
      envelope: {
        nodesJson: envelope.nodes,
        edgesJson: envelope.edges,
        slotsJson: envelope.slots,
      },
      effective: {
        nodesJson: envelope.nodes,
        edgesJson: envelope.edges,
        compiledJson: compileResult.compiled,
        compiledHash: compileResult.compiled.hash,
        compilerVersion: COMPILER_VERSION,
      },
    });
  }

  return results;
}

/**
 * Generate SQL INSERT statements for seeding default workflow definitions.
 *
 * Uses ON CONFLICT DO NOTHING so the seed is idempotent — safe to run
 * multiple times without duplicating rows.
 *
 * Requires the unique index: (org_id, entity_type, version).
 * Since these are system-level defaults, org_id comes from auth.require_org_id().
 */
export function generateSeedSql(pairs: SeedDefinitionPair[]): string[] {
  const statements: string[] = [];

  for (const pair of pairs) {
    const entityType = escapeSql(pair.entityType);

    // 1. Envelope row
    statements.push(`
INSERT INTO workflow_definitions (
  entity_type, name, version, status, is_default, definition_kind,
  nodes_json, edges_json, slots_json,
  body_patches_json, base_ref, compiled_json, compiled_hash, compiler_version
) VALUES (
  '${entityType}',
  '${entityType} Default Envelope',
  1,
  'published',
  true,
  'envelope',
  '${escapeSql(JSON.stringify(pair.envelope.nodesJson))}'::jsonb,
  '${escapeSql(JSON.stringify(pair.envelope.edgesJson))}'::jsonb,
  '${escapeSql(JSON.stringify(pair.envelope.slotsJson))}'::jsonb,
  NULL, NULL, NULL, NULL, NULL
)
ON CONFLICT (org_id, entity_type, version) DO NOTHING;`.trim());

    // 2. Effective row (version 1, same entity type)
    // Uses version 1001 to avoid conflict with envelope version 1
    statements.push(`
INSERT INTO workflow_definitions (
  entity_type, name, version, status, is_default, definition_kind,
  nodes_json, edges_json, slots_json,
  body_patches_json, base_ref, compiled_json, compiled_hash, compiler_version
) VALUES (
  '${entityType}',
  '${entityType} Default Effective',
  1001,
  'published',
  true,
  'effective',
  '${escapeSql(JSON.stringify(pair.effective.nodesJson))}'::jsonb,
  '${escapeSql(JSON.stringify(pair.effective.edgesJson))}'::jsonb,
  NULL,
  NULL, NULL,
  '${escapeSql(JSON.stringify(pair.effective.compiledJson))}'::jsonb,
  '${escapeSql(pair.effective.compiledHash)}',
  '${escapeSql(pair.effective.compilerVersion)}'
)
ON CONFLICT (org_id, entity_type, version) DO NOTHING;`.trim());
  }

  return statements;
}

function escapeSql(value: string): string {
  return value.replace(/'/g, "''");
}
