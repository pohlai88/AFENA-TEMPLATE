/**
 * @afenda/fx-management
 *
 * Foreign exchange rate management, revaluation, hedge accounting, and CTA tracking.
 */

export {
    lookupRate, upsertFxRate, type FxRate, type RateSource, type RateType
} from './services/fx-rate-manager.js';

export {
    revaluateMonetaryAssets, type MonetaryAssetType, type RevaluationResult
} from './services/fx-revaluation.js';

export {
    calculateRealizedGainLoss,
    type RealizedGLResult
} from './services/fx-realized-gl.js';

export {
    testHedgeEffectiveness, trackHedgeRelationship, type HedgeRelationship,
    type HedgeType
} from './services/hedge-accounting.js';

export {
    calculateCTA,
    rollForwardCTA,
    type CTACalculation
} from './services/cta-calculator.js';

export {
    generateMultiCurrencyReport,
    triangulateRate,
    type MultiCurrencyReport
} from './services/multi-currency-reporting.js';

