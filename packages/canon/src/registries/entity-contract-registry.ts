/**
 * Entity Contract Registry - Pure Metadata
 * 
 * Build-once, immutable registry with validation.
 * No runtime mutation, no I/O, no side effects.
 */

import type { EntityType } from '../types/entity';
import type { EntityContract } from '../types/entity-contract';
import type { ActionKind } from '../types/action-spec';
import { entityContractSchema } from './validation/entity-contract.schema';
import { validateLifecycleGraph, type ValidationIssue } from './validation/lifecycle-graph';
import { deepFreeze } from './utils/deep-freeze';
import { EntityContractRegistryError } from './errors';

/** Immutable registry map */
export type EntityContractMap = ReadonlyMap<EntityType, Readonly<EntityContract>>;

/** Validation report (pure data) */
export interface ValidationReport {
  valid: boolean;
  issues: ValidationIssue[];
  stats: {
    total: number;
    withLifecycle: number;
    withSoftDelete: number;
    totalTransitions: number;
  };
}

/** Registry build event (pure data, no side effects) */
export type RegistryEvent =
  | { type: 'registered'; entityType: EntityType }
  | { type: 'validation_issue'; issue: ValidationIssue };

/** Registry build result */
export interface RegistryBuildResult {
  registry: EntityContractMap;
  report: ValidationReport;
  events: RegistryEvent[];
}

/** Build options */
export interface BuildOptions {
  /** Throw on validation failures (default: true) */
  strict?: boolean;
  /** Skip semantic validation (default: false) */
  skipSemanticValidation?: boolean;
}

/**
 * Build entity contract registry from SSOT list.
 * Validates + deep-freezes + returns immutable map.
 * 
 * @param contracts - SSOT list of entity contracts
 * @param opts - Build options
 * @returns Immutable registry + validation report + events
 */
export function buildEntityContractRegistry(
  contracts: readonly EntityContract[],
  opts: BuildOptions = {}
): RegistryBuildResult {
  const { strict = true, skipSemanticValidation = false } = opts;
  
  const issues: ValidationIssue[] = [];
  const events: RegistryEvent[] = [];
  const map = new Map<EntityType, Readonly<EntityContract>>();
  
  for (const contract of contracts) {
    // 1. Structural validation (Zod schema)
    const schemaResult = entityContractSchema.safeParse(contract);
    if (!schemaResult.success) {
      issues.push({
        severity: 'fail',
        code: 'SCHEMA_INVALID',
        entityType: contract.entityType,
        message: `Schema validation failed: ${schemaResult.error.message}`,
      });
      continue;
    }
    
    // 2. Duplicate check
    if (map.has(contract.entityType as EntityType)) {
      issues.push({
        severity: 'fail',
        code: 'DUPLICATE_ENTITY_TYPE',
        entityType: contract.entityType,
        message: `Duplicate entityType: ${contract.entityType}`,
      });
      continue;
    }
    
    // 3. Semantic validation (lifecycle graph)
    if (!skipSemanticValidation && contract.hasLifecycle) {
      const graphIssues = validateLifecycleGraph(contract);
      issues.push(...graphIssues);
    }
    
    // 4. Deep freeze and store
    const frozen = deepFreeze(contract);
    map.set(contract.entityType as EntityType, frozen);
    
    events.push({ type: 'registered', entityType: contract.entityType as EntityType });
  }
  
  // Add validation issues as events
  for (const issue of issues) {
    events.push({ type: 'validation_issue', issue });
  }
  
  // Check if we should throw
  const failures = issues.filter(i => i.severity === 'fail');
  if (strict && failures.length > 0) {
    throw new EntityContractRegistryError(
      `Registry build failed with ${failures.length} error(s)`,
      { issues: failures }
    );
  }
  
  // Build stats
  const stats = {
    total: map.size,
    withLifecycle: Array.from(map.values()).filter(c => c.hasLifecycle).length,
    withSoftDelete: Array.from(map.values()).filter(c => c.hasSoftDelete).length,
    totalTransitions: Array.from(map.values()).reduce((sum, c) => sum + c.transitions.length, 0),
  };
  
  return {
    registry: map,
    report: { valid: failures.length === 0, issues, stats },
    events,
  };
}

// ============================================================================
// Pure Query Helpers (tree-shakeable)
// ============================================================================

/** Get contract by entity type */
export function getContract(
  registry: EntityContractMap,
  entityType: EntityType
): EntityContract | undefined {
  return registry.get(entityType);
}

/** List all contracts */
export function listContracts(registry: EntityContractMap): EntityContract[] {
  return Array.from(registry.values());
}

/** Find contracts by predicate */
export function findContracts(
  registry: EntityContractMap,
  predicate: (contract: EntityContract) => boolean
): EntityContract[] {
  return Array.from(registry.values()).filter(predicate);
}

/** Find contract by label (case-insensitive) */
export function findByLabel(
  registry: EntityContractMap,
  label: string
): EntityContract | undefined {
  const lower = label.toLowerCase();
  return Array.from(registry.values()).find(
    c => c.label.toLowerCase() === lower || c.labelPlural.toLowerCase() === lower
  );
}

/** Find contracts that support a specific verb */
export function findByVerb(
  registry: EntityContractMap,
  verb: ActionKind
): EntityContract[] {
  return findContracts(registry, c =>
    c.primaryVerbs.includes(verb) || c.secondaryVerbs.includes(verb)
  );
}

/** Find contracts with lifecycle */
export function findWithLifecycle(registry: EntityContractMap): EntityContract[] {
  return findContracts(registry, c => c.hasLifecycle);
}

/** Find contracts with soft delete */
export function findWithSoftDelete(registry: EntityContractMap): EntityContract[] {
  return findContracts(registry, c => c.hasSoftDelete);
}

/** Check if entity type is registered */
export function hasContract(
  registry: EntityContractMap,
  entityType: EntityType
): boolean {
  return registry.has(entityType);
}

/** Get registry size */
export function getSize(registry: EntityContractMap): number {
  return registry.size;
}
