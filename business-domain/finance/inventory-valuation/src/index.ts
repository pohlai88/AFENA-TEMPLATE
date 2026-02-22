/**
 * Inventory Valuation — IAS 2
 *
 * @see FIN-INV-VAL-01 — Inventory valuation events post to GL and reconcile
 *
 * Calculators: computeInventoryCost, testNrv
 * Commands:    buildInventoryCostingIntent, buildNrvAdjustIntent
 * Queries:     getInventoryValuation, listByItem, listByPeriod
 * Service:     valueInventory, adjustNrv
 */

export { getInventoryValuation, listByItem, listByPeriod } from './queries/inventory-query';
export type { InventoryValuationReadModel } from './queries/inventory-query';

export { computeInventoryCost, testNrv } from './calculators/inventory-calc';
export type { InventoryCostResult, NrvTestResult } from './calculators/inventory-calc';

export { computeWeightedAvgCost } from './calculators/weighted-avg-cost';
export type { WeightedAvgCostInput, WeightedAvgCostResult } from './calculators/weighted-avg-cost';

export { computeFifoCosting } from './calculators/fifo-costing';
export type { FifoCostingInput, FifoCostingResult, FifoLayer } from './calculators/fifo-costing';

export { computeInventoryWriteDown } from './calculators/inventory-write-down';
export type { InventoryWriteDownInput, InventoryWriteDownResult } from './calculators/inventory-write-down';

export { computeInventoryDisclosure } from './calculators/inventory-disclosure';
export type { InventoryCategory, InventoryDisclosureInput, InventoryDisclosureResult } from './calculators/inventory-disclosure';

export { buildInventoryCostingIntent, buildNrvAdjustIntent } from './commands/inventory-intent';

export { adjustNrv, postValuationBatchToGl, valueInventory } from './services/inventory-service';
