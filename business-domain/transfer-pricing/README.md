# Transfer Pricing (afenda-transfer-pricing)

**Transfer pricing for intercompany transactions with OECD BEPS compliance, arm's length pricing methods, country-by-country reporting, and advance pricing agreements.**

---

## Purpose

This package implements **transfer pricing** to ensure intercompany transactions comply with tax regulations:

1. **Arm's length pricing**: Ensure related-party transactions priced as if between unrelated parties
2. **OECD BEPS**: Base Erosion and Profit Shifting (Actions 8-10, 13)
3. **Country-by-country reporting (CbC)**: Report profits/taxes by jurisdiction (€750M+ revenue threshold)
4. **Transfer pricing documentation**: Master file, local file, CbC report
5. **Advance pricing agreements (APAs)**: Pre-negotiate pricing with tax authorities
6. **Economic analysis**: Comparability analysis, functional analysis, benchmarking

Critical for:
- **Multinationals**: Required for cross-border transactions between related entities
- **Tax compliance**: Avoid penalties for mispriced intercompany transfers
- **Audit defense**: Contemporaneous documentation required
- **Tax optimization**: Legally minimize global effective tax rate

---

## When to Use

- **Intercompany sales**: Goods/services sold between related entities
- **Royalties**: IP licensing fees between parent/subsidiary
- **Management fees**: Shared services charges
- **Intercompany loans**: Interest rates on intra-group financing
- **Cost allocations**: Allocation of central costs
- **Tax audits**: Provide documentation to defend pricing

---

## Key Concepts

### Arm's Length Principle

Related-party transactions must be priced as if between unrelated parties (OECD Guidelines Article 1).

**Example**:
- US Parent sells widgets to Mexico Subsidiary for $100
- Independent distributors pay $80-90 for similar widgets
- Tax authority challenges $100 price as inflated
- Penalty: Adjust to $85 (median) + interest + penalties

### Transfer Pricing Methods (OECD)

**Traditional Transaction Methods**:
1. **CUP (Comparable Uncontrolled Price)**: Use price of identical transaction with unrelated party
   - Example: Parent sells to subsidiary at same price as to independent customers
2. **Resale Price Method**: Distributor resale price - gross margin
   - Example: Subsidiary resells for $100, independent distributors earn 20% margin → transfer price = $80
3. **Cost Plus**: Cost + markup %
   - Example: Manufacturing cost $70, independent manufacturers earn 15% markup → transfer price = $80.50

**Transactional Profit Methods**:
4. **TNMM (Transactional Net Margin Method)**: Compare profit margin to independent companies
   - Example: Subsidiary earns 8% net margin, independent distributors earn 6-10% → OK
5. **Profit Split**: Allocate combined profits based on value creation
   - Example: Parent R&D (60% value) + Subsidiary manufacturing (40% value) → split profits 60/40

### Country-by-Country Reporting (CbC)

OECD BEPS Action 13 requires multinationals (€750M+ revenue) to report:
- Revenue by country
- Pre-tax profit by country
- Income tax paid by country
- Employees by country
- Tangible assets by country

**Due date**: 12 months after fiscal year end  
**Penalty**: $25,000 per report (US)

**Purpose**: Tax authorities identify profit shifting (e.g., high profits in low-tax jurisdictions)

### Transfer Pricing Documentation

**3-tier structure** (OECD BEPS Action 13):

1. **Master File**: Group-wide overview
   - Organizational structure
   - Business description
   - Intangibles (IP ownership, licensing)
   - Intercompany financing
   - Financial/tax positions

2. **Local File**: Country-specific detail
   - Local entity transactions
   - Comparability analysis
   - Functional analysis (functions, assets, risks)
   - Transfer pricing method selected
   - Financial information

3. **CbC Report**: High-level data by jurisdiction (see above)

**Timing**: Contemporaneous (prepared before tax return filing)  
**Penalty**: $10,000-50,000 per entity (varies by country)

### BEPS (Base Erosion and Profit Shifting)

OECD initiative to prevent tax avoidance through transfer pricing.

**Common schemes**:
- High royalty payments to IP holding companies in low-tax jurisdictions
- Inflated intercompany interest on loans (debt shifting)
- Management fees with no real services rendered
- Manufacturing in high-tax countries with minimal profit margins

**BEPS Actions 8-10**: Align transfer pricing outcomes with value creation
- IP transferred to low-tax jurisdiction must include compensation for development functions
- Cannot claim profit without substance (people, functions, assets)

---

## Services

### `arm-length-pricer.ts`

Calculates arm's length price using OECD methods:

**Example**:
```typescript
const price = await calculateArmLengthPrice({
    orgId: 'org_123',
    method: 'RESALE_MINUS',
    transaction: {
        type: 'goods',
        description: 'Widgets',
        volume: 10000
    },
    resalePrice: 100,
    grossMargin: 0.25 // Independent distributors earn 25%
});
// → { armLengthPrice: 75, range: { min: 70, max: 80 }, method: 'Resale Price Method' }
```

### `comparability-analyzer.ts`

Performs comparability analysis to identify unrelated party transactions:

**Example**:
```typescript
const comparables = await findComparables({
    orgId: 'org_123',
    transaction: {
        type: 'distribution',
        industry: 'electronics',
        geography: 'US',
        functions: ['marketing', 'sales', 'warehousing'],
        risks: ['inventory_risk', 'credit_risk']
    }
});
// → { comparables: [{ company: 'TechDistCo', margin: 0.08, reliability: 0.9 }], interquartileRange: { min: 0.06, max: 0.10 } }
```

### `cbc-reporter.ts`

Generates country-by-country reports for OECD:

**Example**:
```typescript
const cbcReport = await generateCbCReport({
    orgId: 'org_123',
    fiscalYear: 2024,
    consolidatedRevenue: 1000000000 // $1B
});
// → { jurisdictions: [{ country: 'US', revenue: 600000000, profit: 50000000, tax: 10500000, employees: 1000 }], totalTax: 25000000 }
```

### `documentation-generator.ts`

Generates transfer pricing documentation (master file, local file):

**Example**:
```typescript
const documentation = await generateTPDocumentation({
    orgId: 'org_123',
    entityId: 'legal_entity_mexico',
    fiscalYear: 2024,
    reportType: 'LOCAL_FILE'
});
// → { pdf: Buffer, sections: ['functional_analysis', 'comparability_analysis', 'economic_analysis', 'conclusion'] }
```

### `apa-manager.ts`

Manages advance pricing agreements with tax authorities:

**Example**:
```typescript
const apa = await createAPA({
    orgId: 'org_123',
    taxAuthority: 'IRS',
    coveredTransactions: ['royalty_payments'],
    proposedMethod: 'CUP',
    termYears: 5
});
// → { apaId: 'apa_456', status: 'pending', expirationDate: '2029-12-31' }
```

### `economic-analyzer.ts`

Performs economic analysis for transfer pricing defense:

**Example**:
```typescript
const analysis = await performEconomicAnalysis({
    orgId: 'org_123',
    transactions: [{ type: 'intercompany_sale', amount: 5000000 }],
    method: 'TNMM',
    pliIndicator: 'operating_margin'
});
// → { conclusion: 'arm_length', testResult: { actualMargin: 0.08, comparableRange: { min: 0.06, max: 0.10 }, withinRange: true } }
```

---

## Architecture

### Layer
**Layer 2: Domain Service**

### Dependencies
- `afenda-canon` - Standard types
- `afenda-database` - Transfer pricing policies, comparables database, APA records
- `afenda-logger` - Audit logging
- `drizzle-orm` - Database queries
- `zod` - Input validation

### Integration
- **Intercompany**: Pricing for intercompany sales, services, royalties
- **Accounting**: Post transfer pricing adjustments to GL
- **Tax compliance**: Integration with tax returns
- **Legal entity management**: Identify related parties
- **Document management**: Store TP documentation PDFs

### Compliance Mappings
- **OECD BEPS**: Actions 8-10 (value creation), Action 13 (documentation)
- **IRS Section 482**: US transfer pricing regulations
- **EU Transfer Pricing Directive**: European TP rules
- **OECD Guidelines**: Transfer Pricing Guidelines for Multinational Enterprises
- **UN Practical Manual**: Transfer pricing for developing countries

---

## Why This Wins Deals

### Multinational Requirement
**"We have 20 legal entities across 10 countries - how do we price intercompany transactions?"**

Any company with cross-border related-party transactions needs transfer pricing:
- US Parent sells to Mexico Subsidiary
- Mexico Subsidiary pays royalty to Ireland IP holding company
- Singapore shared services charges management fees

Without TP compliance:
- Tax audit adjustments (reassess taxable income)
- Penalties (20-40% of tax shortfall)
- Double taxation (profit taxed in 2 countries)

**Market size**: All multinationals (Fortune 500, mid-market with international subsidiaries)

### Documentation Deadlines
**"We got audited and didn't have contemporaneous TP documentation - $200k penalty."**

Tax authorities require documentation **before** filing tax return:
- IRS penalty: $10,000 per entity per year
- Mexico penalty: 3-5% of transaction value
- Germany penalty: €5,000-€1M

Manual documentation process:
- 40-80 hours per legal entity per year
- External consultants charge $30k-100k per entity
- Risk of non-compliance

**Automated documentation** = 90% time savings + compliance guarantee

### CbC Reporting Complexity
**"We spent $50k on consultants to prepare our CbC report."**

CbC reporting requirements (€750M+ revenue):
- Collect data from 20+ ERP systems
- Aggregate by jurisdiction
- File in 60+ countries (each with local format)
- Penalties for late filing: $25k-50k per country

Automated CbC = **$45k annual savings** + faster close

### Tax Optimization
**"We could save $5M in taxes by restructuring our IP ownership."**

Transfer pricing isn't just compliance - it's **tax strategy**:
- Locate IP in low-tax jurisdictions (Ireland 12.5%, Singapore 5-10%)
- Shift profits through royalties, cost allocations
- Leverage APAs for certainty

Requires economic analysis to justify arm's length pricing.

Example:
- US Parent (21% tax) transfers IP to Ireland (12.5% tax)
- Ireland charges royalties to high-tax subsidiaries
- Group effective tax rate: 25% → 18% = **$7M annual savings** on $100M profit

---

## Usage Example

```typescript
import {
    calculateArmLengthPrice,
    findComparables,
    generateCbCReport,
    generateTPDocumentation,
    performEconomicAnalysis
} from 'afenda-transfer-pricing';

// Step 1: Calculate arm's length price for intercompany sale
const armLengthPrice = await calculateArmLengthPrice({
    orgId: 'org_123',
    method: 'COST_PLUS',
    cost: 70,
    comparableCostPlus: 0.15 // 15% markup
});
console.log(`Arm's length price: $${armLengthPrice.armLengthPrice}`);

// Step 2: Find comparables for benchmarking
const comparables = await findComparables({
    orgId: 'org_123',
    transaction: {
        type: 'distribution',
        industry: 'technology',
        geography: 'Europe',
        functions: ['sales', 'marketing'],
        risks: ['inventory_risk']
    }
});
console.log(`Comparable companies: ${comparables.comparables.length}`);
console.log(`Interquartile range: ${comparables.interquartileRange.min} - ${comparables.interquartileRange.max}`);

// Step 3: Perform economic analysis
const analysis = await performEconomicAnalysis({
    orgId: 'org_123',
    transactions: [{ type: 'intercompany_sale', amount: 10000000 }],
    method: 'TNMM',
    pliIndicator: 'operating_margin'
});
console.log(`Arm's length conclusion: ${analysis.conclusion}`);

// Step 4: Generate CbC report
const cbcReport = await generateCbCReport({
    orgId: 'org_123',
    fiscalYear: 2024,
    consolidatedRevenue: 800000000 // Above €750M threshold
});
console.log(`CbC jurisdictions: ${cbcReport.jurisdictions.length}`);

// Step 5: Generate local file documentation
const documentation = await generateTPDocumentation({
    orgId: 'org_123',
    entityId: 'legal_entity_mexico',
    fiscalYear: 2024,
    reportType: 'LOCAL_FILE'
});
console.log(`Documentation generated: ${documentation.sections.length} sections`);
```

---

## Future Enhancements

- **AI-powered comparables**: Machine learning to identify best comparable companies
- **Real-time pricing**: Dynamic transfer prices based on market conditions
- **Multi-country APAs**: Bilateral/multilateral APAs with 2+ tax authorities
- **Pillar Two**: OECD Pillar Two (15% global minimum tax) calculations
- **Blockchain audit trail**: Immutable record of transfer pricing decisions
- **Value chain analysis**: Identify where value is created in global supply chain

---

## References

- [OECD Transfer Pricing Guidelines](https://www.oecd.org/tax/transfer-pricing/oecd-transfer-pricing-guidelines-for-multinational-enterprises-and-tax-administrations-20769717.htm)
- [OECD BEPS Actions](https://www.oecd.org/tax/beps/)
- [IRS Section 482](https://www.irs.gov/businesses/international-businesses/transfer-pricing)
- [CbC Reporting Implementation Package](https://www.oecd.org/tax/beps/beps-actions/action13/)
- [UN Transfer Pricing Manual](https://www.un.org/development/desa/financing/what-we-do/ECOSOC/tax-committee/un-manual-transfer-pricing)
