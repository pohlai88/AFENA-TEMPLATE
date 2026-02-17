# @afenda-configurator

Enterprise product configurator and CPQ.

## Services

### product-configuration.ts

- `configureProduct` - Configure custom product
- `validateConfiguration` - Validate product configuration

### pricing-rules.ts

- `applyPricingRules` - Apply pricing rules
- `calculateDiscount` - Calculate configuration discount

### bom-generation.ts

- `generateBOM` - Generate bill of materials
- `estimateCost` - Estimate configuration cost

### validation.ts

- `validateCompatibility` - Validate component compatibility
- `checkConstraints` - Check configuration constraints

### configurator-analytics.ts

- `analyzeConfigurations` - Analyze configuration patterns
- `recommendOptions` - Recommend configuration options

Layer 2 (Domain Services), pure functions, no logging, Zod validation.
