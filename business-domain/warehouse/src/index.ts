/**
 * @afenda-warehouse
 * 
 * Enterprise warehouse management system (WMS) operations.
 */

// Picking operations
export {
  generateWave,
  createPickList,
  confirmPick,
  type WaveGeneration,
  type PickList,
  type PickConfirmation,
} from './services/picking-operations.js';

// Packing operations
export {
  assignPackStation,
  packOrder,
  type PackStationAssignment,
  type PackingResult,
} from './services/packing-operations.js';

// Cycle counting
export {
  generateCycleCount,
  recordCountResults,
  type CycleCountTask,
  type CountResults,
} from './services/cycle-counting.js';

// Slotting optimization
export {
  analyzeSlotting,
  optimizeBinAssignments,
  type SlottingAnalysis,
  type BinOptimization,
} from './services/slotting-optimization.js';

// Warehouse analytics
export {
  calculateProductivity,
  analyzeAccuracy,
  type ProductivityMetrics,
  type AccuracyMetrics,
} from './services/warehouse-analytics.js';
