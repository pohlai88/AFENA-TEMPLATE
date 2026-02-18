# Payments Orchestration (afenda-payments-orchestration)

<!-- afenda:badges -->
![A - Financial Management](https://img.shields.io/badge/A-Financial+Management-0052CC?style=flat-square) ![Layer 2](https://img.shields.io/badge/layer-2%20Domain%20Service-5C4EE5?style=flat-square) ![pkg](https://img.shields.io/badge/pkg-afenda--payments--orchestration-555555?style=flat-square) ![docs](https://img.shields.io/badge/class-A%20·%20of%2010-lightgrey?style=flat-square)


## Purpose

Enterprise payment execution with ISO 20022 bank connectivity, automated reconciliation, sanctions screening, and payment factory capabilities. Provides centralized payment processing for AP disbursements and AR collections with fraud controls.

## When to Use

- **Enterprises with high payment volumes**: Automates payment file generation and bank reconciliation
- **Multi-bank operations**: Centralized payment factory across multiple bank relationships 
- **International payments**: ISO 20022 (SWIFT) + regional formats (NACHA, SEPA, BACS)
- **Regulatory compliance**: OFAC sanctions screening, fraud detection, payment controls
- **Treasury optimization**: Payment netting, cash concentration, zero-balance accounts

## Key Concepts

### Payment Factory
Centralized payment processing hub that consolidates payments from multiple entities, performs netting, and executes via optimal bank relationships.

### ISO 20022
Global standard for financial messaging. Key formats:
- **pain.001** - Customer Credit Transfer Initiation (outbound payments)
- **camt.053** - Bank Statement (reconciliation)
- **pacs.008** - Financial Institution Credit Transfer (bank-to-bank)

### Bank Formats
- **NACHA** - US ACH (Automated Clearing House)
- **SEPA** - Single Euro Payments Area (EU)
- **BACS** - UK bulk payments
- **MT940/MT101** - SWIFT legacy formats (pre-ISO 20022)
- **BAI2** - US bank statement format

### Sanctions Screening
Automatic screening of payment beneficiaries against:
- **OFAC SDN** (Office of Foreign Assets Control - US)
- **EU Consolidated List** (European Union)
- **UN Sanctions Lists** (United Nations)
- **HMT** (UK His Majesty's Treasury)

### Payment Controls
- **Dual approval** - Segregation of duties for large payments
- **Velocity checks** - Detect unusual payment frequency
- **Duplicate detection** - Prevent double payments
- **Bank account validation** - IBAN/routing number verification

## Architecture

- **Layer**: 2 (Domain Service)
- **Dependencies**: 
  - `afenda-canon` - Type definitions
  - `afenda-database` - Data access
  - `drizzle-orm` - ORM (catalog)
  - `zod` - Schema validation (catalog)
- **Catalog Compliance**: ✅ All external dependencies use `catalog:`
- **Pattern**: Source package (no build step), exports via `src/index.ts`

## Services

### 1. payment-formatter.ts
Generate bank payment files in various formats.

**Input**: Payment batch (vendor, invoice, amount, bank account)  
**Output**: ISO 20022 XML, NACHA file, SEPA XML, BACS file, MT101

**Key Logic**:
- Format selection by bank account country
- Batch header/trailer with control totals
- Payment grouping (same bank, same value date)
- Remittance information (invoice references)
- SEPA validation (BIC, IBAN check digits)

### 2. statement-parser.ts
Parse bank statement files for reconciliation.

**Input**: Bank statement file (camt.053, MT940, BAI2)  
**Output**: Transaction records (date, amount, reference, balance)

**Key Logic**:
- Format detection (XML vs. fixed-width vs. CSV)
- Transaction extraction (debits, credits, fees)
- Balance reconciliation (opening + transactions = closing)
- Reference parsing (ACH, wire reference numbers)
- Multi-currency handling

### 3. auto-reconciliation.ts
Automatically match payments to open invoices/ receivables.

**Input**: Bank transactions  
**Output**: Matched transactions, exceptions

**Matching Rules**:
1. **Exact match**: Amount + invoice number
2. **Fuzzy match**: Amount within tolerance + date range
3. **Partial payment**: Amount < invoice (allocate)
4. **Overpayment**: Amount > invoice (create credit)
5. **Bulk payment**: Single transaction → multiple invoices

### 4. sanctions-screening.ts
Screen payment beneficiaries against global sanctions lists.

**Input**: Beneficiary name, address, bank  
**Output**: Match risk score, flagged payments

**Screening Logic**:
- Exact name match (100% score)
- Fuzzy match (Levenshtein distance <3)
- Address screening (country, city)
- Bank BIC screening (sanctioned banks)
- Real-time API integration (Dow Jones, Refinitiv)

**Lists**:
- OFAC SDN (12,000+ entities)
- EU Consolidated List (2,000+ entities)
- UN Sanctions (varies by regime)

### 5. fraud-detector.ts
Detect fraudulent or duplicate payments.

**Fraud Rules**:
1. **Duplicate payment**: Same vendor + amount + 24 hours
2. **Velocity**: >10 payments to same vendor in 1 hour
3. **Round amount**: Payments ending in .00 or .99 (suspicious)
4. **Bank account change**: Vendor changed bank within 7 days
5. **High value**: Single payment >$100k requires dual approval

**Output**: Risk score, auto-block threshold, approval queue

### 6. payment-factory.ts
** Payment netting and centralized execution.

**Netting Logic**:
1. **Bilateral netting**: Entity A owes B $100, B owes A $60 → Net $40 A→B
2. **Multilateral netting**: Optimize across all intercompany balances
3. **Currency netting**: Net FX exposure, execute spot trades

**Factory Benefits**:
- **Reduced bank fees**: 100 payments → 1 bulk payment
- **Cash optimization**: Delay outflows, accelerate inflows
- **FX efficiency**: Net currency positions before trading
- **Control**: Centralized approval, sanctions screening

## Quick Start

```typescript
import {
  generatePaymentFile,
  parseStatementFile,
  autoReconcile,
  screenBeneficiary,
  detectFraud,
  executePaymentFactory
} from 'afenda-payments-orchestration';

// 1. Generate ISO 20022 payment file
const paymentFile = await generatePaymentFile({
  orgId: 'org_123',
  batchId: 'batch_001',
  payments: [
    {
      vendorId: 'vendor_abc',
      invoiceId: 'inv_001',
      amount: 5000.00,
      currency: 'USD',
      bankAccount: 'acct_123',
      dueDate: '2026-02-25'
    }
  ],
  format: 'ISO20022_PAIN001',
  debitAccountId: 'bank_acct_456'
});

// 2. Parse bank statement
const transactions = await parseStatementFile({
  orgId: 'org_123',
  fileContent: base64Statement,
  format: 'CAMT053',
  bankAccountId: 'bank_acct_456'
});

// 3. Auto-reconcile
const reconciled = await autoReconcile({
  orgId: 'org_123',
  transactions: transactions.transactions,
  matchingRules: ['EXACT', 'FUZZY', 'PARTIAL']
});

// 4. Sanctions screening
const screeningResult = await screenBeneficiary({
  beneficiaryName: 'ACME Corp',
  beneficiaryCountry: 'US',
  beneficiaryBank: 'CHASUS33XXX',
  lists: ['OFAC', 'EU', 'UN']
});

// 5. Fraud detection
const fraudCheck = await detectFraud({
  orgId: 'org_123',
  payment: {
    vendor: 'vendor_abc',
    amount: 10000.00,
    bankAccount: 'new_acct_789'
  }
});

// 6. Payment factory netting
const netted = await executePaymentFactory({
  orgId: 'org_123',
  entities: ['entity_a', 'entity_b', 'entity_c'],
  nettingType: 'MULTILATERAL',
  valueDate: '2026-02-28'
});
```

## Database Schema (Planned)

```sql
-- Payment batches
CREATE TABLE payment_batches (
  batch_id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  status TEXT, -- draft, pending_approval, approved, submitted, failed
  format TEXT, -- ISO20022_PAIN001, NACHA, SEPA, BACS
  total_amount DECIMAL(15,2),
  payment_count INTEGER,
  value_date DATE,
  created_at TIMESTAMPTZ
);

-- Payment instructions
CREATE TABLE payment_instructions (
  payment_id TEXT PRIMARY KEY,
  batch_id TEXT REFERENCES payment_batches(batch_id),
  vendor_id TEXT,
  invoice_id TEXT,
  amount DECIMAL(15,2),
  currency TEXT(3),
  bank_account_id TEXT,
  remittance_info TEXT,
  status TEXT, -- pending, submitted, cleared, failed
  sanctions_screened BOOLEAN,
  fraud_checked BOOLEAN
);

-- Bank statements
CREATE TABLE bank_statements (
  statement_id TEXT PRIMARY KEY,
  bank_account_id TEXT,
  statement_date DATE,
  opening_balance DECIMAL(15,2),
  closing_balance DECIMAL(15,2),
  transaction_count INTEGER
);

-- Bank transactions
CREATE TABLE bank_transactions (
  transaction_id TEXT PRIMARY KEY,
  statement_id TEXT REFERENCES bank_statements(statement_id),
  transaction_date DATE,
  value_date DATE,
  amount DECIMAL(15,2),
  type TEXT, -- debit, credit
  reference TEXT,
  reconciled BOOLEAN,
  matched_invoice_id TEXT
);

-- Sanctions screening results
CREATE TABLE sanctions_screening (
  screening_id TEXT PRIMARY KEY,
  entity_name TEXT,
  match_score INTEGER, -- 0-100
  matched_list TEXT, -- OFAC, EU, UN
  status TEXT, -- clear, review, blocked
  screened_at TIMESTAMPTZ
);
```

## Integration Points

###Bank APIs
- **SWIFT MT** - Legacy message formats (MT940, MT101)
- **ISO 20022** - Modern XML formats (pain.001, camt.053)
- **Direct bank APIs** - Bank-specific REST/SOAP (Wells Fargo, JPMorgan, HSBC)

### Payment Gateways
- **NACHA Direct** - US ACH network
- **SEPA Cleared** - European payment system
- **BACS** - UK bulk payment service

### Sanctions Data Providers
- **Dow Jones Risk & Compliance** - Real-time sanctions screening API
- **Refinitiv World-Check** - Global sanctions database
- **OFAC SDN API** - US Treasury direct feed

### ERP Integration
- **Payables**: Payment batch from open invoices
- **Receivables**: Bank statement auto-application
- **Treasury**: Cash position, forecasting
- **Accounting**: GL posting from bank transactions

## Compliance

### Regulations
- **BSA/AML** - Bank Secrecy Act / Anti-Money Laundering (US)
- **OFAC** - Sanctions compliance
- **PSD2** - Payment Services Directive (EU)
- **NACHA Rules** - ACH operating rules (US)
- **SEPA Rulebook** - European payment standards

### Standards
- **ISO 20022** - Universal financial messaging
- **SWIFT Standards** - MT/MX message formats
- **IBAN** - International Bank Account Number
- **BIC/SWIFT Code** - Bank Identifier Code

## Why This Wins Deals

**Manual payment processing** = fraud risk + inefficiency:
- Payment file generation: 2 hours → 2 minutes (automated)
- Bank reconciliation: 4 hours/day → real-time
- Sanctions screening: Manual lists → automated API
- Duplicate payments: Common error → auto-prevented

**Payment factory benefits**:
- $20-50/payment → $2-5/payment (90% cost reduction)
- 500 payments = $10k-25k savings/month
- 100% sanctions screening coverage
- Dual approval automated (SOX compliance)

**Enterprise requirements**:
- Cannot pay international suppliers without ISO 20022
- Cannot operate in EU without SEPA
- Cannot process US ACH without NACHA compliance
- Sanctions violations = $250k-1M fines per incident

**ROI**: Large enterprises process $50M-500M/month in payments. 1% error rate = $500k-5M at risk
