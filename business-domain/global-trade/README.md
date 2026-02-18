# Global Trade (afenda-global-trade)

**Global trade compliance with customs duties calculation, HS code classification, landed cost, FTA certificate management, and export controls.**

---

## Purpose

This package implements **global trade compliance** for import/export operations:

1. **HS code classification**: Harmonized System product codes (6-10 digits)
2. **Customs duty calculation**: Tariffs, anti-dumping duties, countervailing duties
3. **Landed cost**: Total cost of goods (product + freight + insurance + duties + fees)
4. **FTA management**: Free Trade Agreement certificates (USMCA, EU FTAs, RCEP)
5. **Export controls**: Denied party screening, export licensing (EAR, ITAR)
6. **Country of origin**: Rules of origin determination for preferential treatment

Critical for:
- **Importers/exporters**: Accurate duty calculation, cost planning
- **Manufacturing**: Sourcing decisions based on landed cost
- **Compliance**: Avoid penalties for misclassification, denied party violations
- **Cost optimization**: Leverage FTAs for duty savings

---

## When to Use

- **Import customs clearance**: Calculate duties before shipment arrival
- **Landed cost estimation**: Quote accurate prices including all import costs
- **FTA qualification**: Determine if goods qualify for duty-free treatment
- **Export screening**: Check customers/countries against denied party lists
- **Transfer pricing**: Customs value for intercompany shipments
- **Trade compliance**: Maintain audit trail for customs authorities

---

## Key Concepts

### Harmonized System (HS) Codes

Universal product classification system (World Customs Organization):
- **6 digits**: International standard (e.g., 8517.12 = mobile phones)
- **8-10 digits**: Country-specific (e.g., 8517.12.00.00 = US HTS code)
- **Classification rules**: General Rules of Interpretation (GRI)

### Customs Duties

Tariffs imposed on imported goods:
- **Ad valorem**: Percentage of customs value (e.g., 5% duty)
- **Specific**: Fixed amount per unit (e.g., $0.50/kg)
- **Compound**: Combination (e.g., 5% + $2/unit)
- **Anti-dumping**: Additional duties on subsidized imports
- **Section 301**: US tariffs on China (25% on many products)

### Landed Cost

Total cost to deliver goods to final destination:
```
Landed Cost = Product Cost + Freight + Insurance + Duties + Customs Fees + Handling
```

Critical for:
- Purchase price comparison (China vs. Mexico vs. Vietnam)
- Transfer pricing (arm's length price)
- Product pricing (ensure profitability)

### Free Trade Agreements (FTAs)

Bilateral/multilateral agreements for preferential duty treatment:
- **USMCA** (US-Mexico-Canada): Replaces NAFTA
- **EU FTAs**: 40+ countries
- **RCEP** (Asia-Pacific): China, Japan, Korea, ASEAN, Australia, NZ
- **CPTPP** (Trans-Pacific Partnership)

Requirements:
- **Rules of origin**: Product must originate in FTA country
- **Certificates**: USMCA cert, EUR.1, Form A (GSP)
- **Tariff shift**: Product transformed (HS code changed)
- **Value content**: Minimum % of value from FTA region

### Export Controls

US regulations restricting exports:
- **EAR** (Export Administration Regulations): Dual-use items
- **ITAR** (International Traffic in Arms Regulations): Military items
- **OFAC**: Sanctioned countries (Iran, North Korea, Syria, etc.)
- **Denied party screening**: Check against BIS, SDN, DPL lists

---

## Services

### `hs-classifier.ts`

Classifies products into HS codes using rules and AI:

**Example**:
```typescript
const classification = await classifyProduct({
    orgId: 'org_123',
    productDescription: 'Smartphone with 5G, 128GB storage',
    attributes: {
        category: 'electronics',
        subcategory: 'mobile_phones'
    }
});
// → { hsCode: '8517.12.00', description: 'Telephones for cellular networks', confidence: 0.95 }
```

### `duty-calculator.ts`

Calculates customs duties based on HS code, origin, destination:

**Example**:
```typescript
const duty = await calculateDuty({
    orgId: 'org_123',
    hsCode: '8517.12.00',
    originCountry: 'CN',
    destinationCountry: 'US',
    customsValue: 10000,
    quantity: 100
});
// → { dutyRate: 0.25, dutyAmount: 2500, tariffType: 'Section 301 China', effectiveDate: '2024-01-01' }
```

### `landed-cost-calculator.ts`

Calculates total landed cost including all fees:

**Example**:
```typescript
const landedCost = await calculateLandedCost({
    orgId: 'org_123',
    productCost: 10000,
    freight: 500,
    insurance: 100,
    hsCode: '8517.12.00',
    originCountry: 'CN',
    destinationCountry: 'US'
});
// → { landedCost: 13225, breakdown: { product: 10000, freight: 500, insurance: 100, duty: 2500, merchandiseProcessingFee: 105, harborMaintenanceFee: 20 } }
```

### `fta-manager.ts`

Manages FTA certificates and qualification:

**Example**:
```typescript
const ftaQualification = await checkFTAQualification({
    orgId: 'org_123',
    hsCode: '8517.12.00',
    originCountry: 'MX',
    destinationCountry: 'US',
    fta: 'USMCA',
    regionalValueContent: 0.65 // 65% North American content
});
// → { qualifies: true, dutyRate: 0.00, certificateRequired: 'USMCA_CERT', savingsVsNormal: 2500 }
```

### `export-screening.ts`

Screens parties and destinations against denied lists:

**Example**:
```typescript
const screening = await screenParty({
    orgId: 'org_123',
    partyName: 'ABC Trading Company',
    address: 'Shanghai, China',
    country: 'CN'
});
// → { status: 'clear', checks: [{ list: 'BIS_DPL', result: 'no_match' }, { list: 'OFAC_SDN', result: 'no_match' }] }
```

### `coo-determiner.ts`

Determines country of origin based on manufacturing process:

**Example**:
```typescript
const coo = await determineCountryOfOrigin({
    orgId: 'org_123',
    hsCode: '8517.12.00',
    manufacturingSteps: [
        { country: 'CN', process: 'component_assembly', valueAdded: 5000 },
        { country: 'VN', process: 'final_assembly', valueAdded: 3000 }
    ]
});
// → { countryOfOrigin: 'VN', rule: 'substantial_transformation', tariffShift: true }
```

---

## Architecture

### Layer
**Layer 2: Domain Service**

### Dependencies
- `afenda-canon` - Standard types
- `afenda-database` - HS codes, duty rates, FTA rules, denied party lists
- `afenda-logger` - Audit logging (compliance requirement)
- `drizzle-orm` - Database queries
- `zod` - Input validation

### Integration
- **Purchasing**: Landed cost for vendor selection
- **Inventory**: Track country of origin for products
- **Accounting**: Post duty expenses to GL
- **Sales**: Export controls screening
- **Document management**: Store FTA certificates, commercial invoices

### Compliance Mappings
- **WCO**: Harmonized System nomenclature
- **US CBP**: Customs & Border Protection regulations
- **BIS**: Bureau of Industry and Security (export controls)
- **OFAC**: Office of Foreign Assets Control (sanctions)
- **USMCA**: US-Mexico-Canada Agreement
- **EU Customs Code**: Union Customs Code (UCC)

---

## Why This Wins Deals

### China Tariff Strategy
**"How do we reduce our China tariff exposure?"**

Section 301 tariffs added **25% duty** on $300B+ of Chinese imports. Companies need strategies:
- **Country diversification**: Source from Vietnam, Mexico, India (0-5% duty vs. 25%)
- **Landed cost comparison**: Tool shows "China $100 landed = Mexico $85 landed"
- **FTA optimization**: USMCA (Mexico/Canada) = 0% duty

**Without trade tool**: Spreadsheets, guesswork, surprise duty bills  
**With trade tool**: Real-time landed cost, automated FTA checks, duty optimization

### Customs Penalties
**"We got hit with a $50k penalty for HS code misclassification."**

US Customs penalties:
- **Misclassification**: Up to value of goods + fines
- **Undervaluation**: Penalties + interest
- **Denied party violation**: Criminal liability

Automated HS classification + audit trail = **risk mitigation**.

### Landed Cost Accuracy
**"Our quotes were off by 30% because we forgot to include duties."**

Old way:
- Sales quotes product cost only
- Customer shocked by actual price (product + freight + 25% duty)
- Lost deals, unhappy customers

New way:
- Landed cost calculator in quote tool
- All-in price (CIF + duties + fees)
- **Accurate quotes** = competitive advantage

### FTA Savings
**"We're leaving $200k/year in duty savings on the table."**

Companies don't claim FTA benefits because:
- Don't know which FTAs apply
- Don't have certificates
- Manual process too complex

Example: $10M imports from Mexico at 5% duty = $500k/year duties  
With USMCA certificate: $0 duties = **$500k savings**

Automated FTA management pays for itself in 1 month.

---

## Usage Example

```typescript
import {
    classifyProduct,
    calculateDuty,
    calculateLandedCost,
    checkFTAQualification,
    screenParty
} from 'afenda-global-trade';

// Step 1: Classify product to get HS code
const hsCode = await classifyProduct({
    orgId: 'org_123',
    productDescription: 'Laptop computer, 15-inch display',
    attributes: { category: 'electronics' }
});

// Step 2: Calculate duty for China import
const dutyChina = await calculateDuty({
    orgId: 'org_123',
    hsCode: hsCode.hsCode,
    originCountry: 'CN',
    destinationCountry: 'US',
    customsValue: 50000,
    quantity: 100
});
console.log(`China duty: $${dutyChina.dutyAmount} (${dutyChina.dutyRate * 100}%)`);

// Step 3: Calculate landed cost from China
const landedCostChina = await calculateLandedCost({
    orgId: 'org_123',
    productCost: 50000,
    freight: 2000,
    insurance: 500,
    hsCode: hsCode.hsCode,
    originCountry: 'CN',
    destinationCountry: 'US'
});
console.log(`China landed cost: $${landedCostChina.landedCost}`);

// Step 4: Compare with Mexico (USMCA)
const landedCostMexico = await calculateLandedCost({
    orgId: 'org_123',
    productCost: 55000, // 10% higher labor cost
    freight: 1000, // Closer to US
    insurance: 500,
    hsCode: hsCode.hsCode,
    originCountry: 'MX',
    destinationCountry: 'US'
});
console.log(`Mexico landed cost: $${landedCostMexico.landedCost}`);

// Step 5: Check FTA qualification for Mexico
const usmca = await checkFTAQualification({
    orgId: 'org_123',
    hsCode: hsCode.hsCode,
    originCountry: 'MX',
    destinationCountry: 'US',
    fta: 'USMCA',
    regionalValueContent: 0.70
});
console.log(`USMCA savings: $${usmca.savingsVsNormal}`);

// Step 6: Screen export customer
const screening = await screenParty({
    orgId: 'org_123',
    partyName: 'Customer XYZ',
    country: 'AE',
    address: 'Dubai, UAE'
});
if (screening.status !== 'clear') {
    console.warn('Export denied - customer on watchlist');
}
```

---

## Future Enhancements

- **AI classification**: Machine learning for automatic HS code assignment
- **Duty drawback**: Track duties paid, claim refund on re-exports
- **Bonded warehouse**: Defer duty payment until goods sold
- **AEO programs**: Authorized Economic Operator (fast-track clearance)
- **Incoterms**: DDP vs. DAP vs. FOB calculations
- **Brexit**: UK/EU trade after Brexit
- **De minimis**: Track $800 exemption for US imports

---

## References

- [WCO Harmonized System](https://www.wcoomd.org/en/topics/nomenclature/overview.aspx)
- [US HTS (Harmonized Tariff Schedule)](https://hts.usitc.gov/)
- [USMCA Agreement](https://ustr.gov/trade-agreements/free-trade-agreements/united-states-mexico-canada-agreement)
- [BIS Denied Parties List](https://www.bis.doc.gov/index.php/policy-guidance/lists-of-parties-of-concern/denied-persons-list)
- [OFAC Sanctions](https://home.treasury.gov/policy-issues/office-of-foreign-assets-control-sanctions-programs-and-information)
- [EU TARIC Database](https://ec.europa.eu/taxation_customs/dds2/taric/)
