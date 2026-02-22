import type { EntityContract } from 'afenda-canon';

/**
 * Entity registry — maps entityType → EntityContract.
 * SSOT for what each entity supports in the action model.
 * Server-only: never import from client modules.
 */

const registry = new Map<string, EntityContract>();

export function registerEntity(contract: EntityContract): void {
  registry.set(contract.entityType, contract);
}

export function getEntityContract(entityType: string): EntityContract {
  const contract = registry.get(entityType);
  if (!contract) {
    throw new Error(`No EntityContract registered for "${entityType}"`);
  }
  return contract;
}

export function hasEntityContract(entityType: string): boolean {
  return registry.has(entityType);
}
