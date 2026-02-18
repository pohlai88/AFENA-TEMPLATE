export { calculateTax } from './services/tax-calculator.js';
export type { CalculateTaxInput, TaxCalculationResult } from './services/tax-calculator.js';

export { calculateWithholding } from './services/withholding-calculator.js';
export type { CalculateWithholdingInput, WithholdingResult } from './services/withholding-calculator.js';

export { validateExemption } from './services/exemption-validator.js';
export type { ExemptionValidationResult, ValidateExemptionInput } from './services/exemption-validator.js';

export { checkNexus } from './services/nexus-tracker.js';
export type { CheckNexusInput, NexusResult } from './services/nexus-tracker.js';

export { getTaxRate } from './services/rate-manager.js';
export type { GetTaxRateInput, TaxRateResult } from './services/rate-manager.js';

export { generateTaxReturn } from './services/return-generator.js';
export type { GenerateTaxReturnInput, TaxReturnData } from './services/return-generator.js';

