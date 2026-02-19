/**
 * Entity Contract Registry - Built and Validated
 *
 * Immutable registry built from SSOT at module load time.
 * Validated once, frozen deeply, exported as const.
 *
 * Used by audit and compliance services to track entity lifecycle and permissions.
 */

import { buildEntityContractRegistry } from './entity-contract-registry';
import { ENTITY_CONTRACTS } from './entity-contracts.data';

/**
 * Built and validated entity contract registry.
 * Frozen at module load time.
 */
const buildResult = buildEntityContractRegistry(ENTITY_CONTRACTS, { strict: true });

/**
 * Immutable entity contract registry (SSOT).
 * 
 * @example
 * ```ts
 * import { ENTITY_CONTRACT_REGISTRY, getContract } from 'afenda-canon';
 * 
 * const contract = getContract(ENTITY_CONTRACT_REGISTRY, 'companies');
 * ```
 */
export const ENTITY_CONTRACT_REGISTRY = buildResult.registry;

/**
 * Validation report from registry build.
 * Use this for health checks or diagnostics.
 * 
 * @example
 * ```ts
 * // In app layer (not in canon)
 * import { ENTITY_CONTRACT_VALIDATION_REPORT } from 'afenda-canon';
 * import { logger } from './logger';
 * 
 * if (!ENTITY_CONTRACT_VALIDATION_REPORT.valid) {
 *   logger.warn({ issues: ENTITY_CONTRACT_VALIDATION_REPORT.issues }, 'Registry validation issues');
 * }
 * ```
 */
export const ENTITY_CONTRACT_VALIDATION_REPORT = buildResult.report;

/**
 * Build events from registry construction.
 * Use this for observability (log in app layer).
 * 
 * @example
 * ```ts
 * // In app layer (not in canon)
 * import { ENTITY_CONTRACT_BUILD_EVENTS } from 'afenda-canon';
 * import { logger } from './logger';
 * 
 * for (const event of ENTITY_CONTRACT_BUILD_EVENTS) {
 *   if (event.type === 'registered') {
 *     logger.info({ entityType: event.entityType }, 'Entity contract registered');
 *   }
 * }
 * ```
 */
export const ENTITY_CONTRACT_BUILD_EVENTS = buildResult.events;
