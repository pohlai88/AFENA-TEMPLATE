/**
 * @afenda/consolidation
 *
 * Multi-level consolidation, intercompany elimination, and group reporting.
 */

export {
    buildConsolidationHierarchy, type ConsolidationHierarchy, type ConsolidationNode
} from './services/consolidation-hierarchy.js';

export {
    generateEliminationEntries,
    type EliminationEntry,
    type EliminationType
} from './services/elimination-engine.js';

export {
    calculateNCI,
    type NCICalculation
} from './services/nci-calculator.js';

export {
    applyEquityMethod,
    type EquityMethodAdjustment
} from './services/equity-method.js';

export {
    translateCurrency,
    type CurrencyTranslation,
    type TranslationMethod
} from './services/currency-translator.js';

export {
    runConsolidation,
    type ConsolidationResult
} from './services/consolidation-workbench.js';

