/**
 * @see FIN-FX-REV-01 — FX revaluation runs are reproducible with rate snapshots
 */

export { computeGainLoss, convertAmount } from './calculators/fx-convert';
export type { FxConversionResult } from './calculators/fx-convert';

export { buildFxRevalueIntent } from './commands/fx-revalue-intent';
export type { FxRevalueInput } from './commands/fx-revalue-intent';

export type { FxRateReadModel } from './queries/fx-rate-query';

export { convertDocumentAmount, getFxRate, revalueFxBalance } from './services/fx-service';
export type { FxConvertDocResult } from './services/fx-service';

export { determineFunctionalCurrency } from './calculators/functional-currency';
export type { CurrencyIndicator, FunctionalCurrencyResult } from './calculators/functional-currency';

export { auditRateSources } from './calculators/rate-source-audit';
export type { FxRateEntry, RateAuditResult, RateAuditSummary } from './calculators/rate-source-audit';

export { computeTriangulation } from './calculators/fx-triangulation';
export type { TriangulationInput, TriangulationResult } from './calculators/fx-triangulation';

export { computeForwardContractFairValue } from './calculators/forward-contract';
export type { ForwardContractInput, ForwardContractResult } from './calculators/forward-contract';

export { validateDocumentCurrencies } from './calculators/document-currency-validator';
export type { CurrencyLine, DocumentCurrencyValidationResult } from './calculators/document-currency-validator';

