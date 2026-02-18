# @afenda-configurator

<!-- afenda:badges -->
![D - Manufacturing & Quality](https://img.shields.io/badge/D-Manufacturing+%26+Quality-6554C0?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--configurator-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-D%20·%20of%2010-lightgrey?style=flat-square)


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
