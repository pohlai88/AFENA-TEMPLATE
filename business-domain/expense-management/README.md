# Expense Management (afenda-expense-management)

**Employee expense submission, policy enforcement, receipt OCR, per diem calculation, and corporate card integration.**

---

## Purpose

This package implements **employee expense management** workflows, from receipt capture to reimbursement:

1. **Receipt capture**: Mobile app photo upload with OCR
2. **Expense submission**: Create expense reports with line items
3. **Policy enforcement**: Automatic validation against expense policies
4. **Approval workflow**: Multi-level approval routing
5. **Reimbursement**: Integration with payroll or AP
6. **Corporate card integration**: Auto-match card transactions to expenses
7. **Per diem calculation**: Country/city-specific rates

Critical for:
- **Employee satisfaction**: Easy expense submission (mobile-first)
- **Policy compliance**: Enforce limits, approval requirements, receipt rules
- **Audit trail**: Complete expense history with receipts
- **Finance efficiency**: Eliminate manual expense processing

---

## When to Use

- **Employee reimbursement**: Travel, meals, entertainment, mileage
- **Corporate card reconciliation**: Match card transactions to expense reports
- **Per diem management**: Calculate daily allowances for business travel
- **Policy enforcement**: Limit hotel rates, meal amounts, airline class
- **Approval workflows**: Route expenses by amount, category, department
- **Tax compliance**: Track VAT/GST on expenses for reclaim

---

## Key Concepts

### Expense Types

- **Mileage**: Distance × rate (personal vehicle for business)
- **Per diem**: Daily allowance for meals/lodging (no receipts required)
- **Out-of-pocket**: Receipts required (hotels, flights, meals, supplies)
- **Corporate card**: Charged to company card (auto-imported)

### Expense Policies

Rules enforced at submission:
- **Amount limits**: Max hotel rate per night ($200), max meal ($75)
- **Receipt threshold**: Receipt required for expenses over $25
- **Advance approval**: Expenses over $1,000 require pre-approval
- **Category restrictions**: No alcohol for junior employees
- **Mileage rates**: IRS standard rate (e.g., $0.67/mile in 2024)
- **Airline class**: Economy for domestic, business for international >6hr

### Approval Routing

Multi-level approval chains:
- **Manager approval**: First level (under $1,000)
- **Department head**: Second level ($1,000-$5,000)
- **CFO approval**: Third level (over $5,000)
- **Parallel approval**: Multiple approvers for compliance (e.g., project manager + finance)

### Corporate Card Integration

Auto-match transactions:
- Import card transactions (Visa, Amex, Mastercard feeds)
- Match to expense reports by amount, date, merchant
- Flag unreconciled transactions
- Support split transactions (partial personal use)

---

## Services

### `receipt-ocr.ts`

Extracts data from receipt images using OCR:

**Example**:
```typescript
const ocrResult = await processReceipt({
    orgId: 'org_123',
    employeeId: 'emp_456',
    imageUrl: 's3://receipts/IMG_001.jpg'
});
// → { merchant: 'Hilton Hotel', amount: 189.50, date: '2026-02-10', currency: 'USD', category: 'lodging' }
```

### `expense-submission.ts`

Creates expense reports with line items:

**Example**:
```typescript
const expenseReport = await submitExpense({
    orgId: 'org_123',
    employeeId: 'emp_456',
    reportName: 'NYC Sales Trip - Feb 2026',
    lineItems: [
        { category: 'airfare', amount: 450, date: '2026-02-10', receiptUrl: '...' },
        { category: 'hotel', amount: 189.50, date: '2026-02-11', receiptUrl: '...' },
        { category: 'meals', amount: 65, date: '2026-02-11', receiptUrl: '...' }
    ]
});
// → { reportId: 'exp_001', status: 'submitted', totalAmount: 704.50 }
```

### `policy-validator.ts`

Validates expenses against company policies:

**Example**:
```typescript
const validation = await validateAgainstPolicy({
    orgId: 'org_123',
    employeeId: 'emp_456',
    lineItem: {
        category: 'hotel',
        amount: 350, // Over $200 limit
        date: '2026-02-10'
    }
});
// → { valid: false, violations: [{ code: 'HOTEL_OVER_LIMIT', message: 'Hotel exceeds $200/night policy', severity: 'error' }] }
```

### `approval-router.ts`

Routes expense reports through approval workflow:

**Example**:
```typescript
const routing = await routeForApproval({
    orgId: 'org_123',
    reportId: 'exp_001',
    totalAmount: 704.50,
    employeeId: 'emp_456'
});
// → { approvers: ['mgr_101'], level: 1, dueDate: '2026-02-20' }
```

### `mileage-calculator.ts`

Calculates mileage reimbursement:

**Example**:
```typescript
const mileage = await calculateMileage({
    orgId: 'org_123',
    employeeId: 'emp_456',
    distance: 250, // miles
    date: '2026-02-10',
    purpose: 'Client meeting'
});
// → { distance: 250, rate: 0.67, reimbursement: 167.50 }
```

### `per-diem-calculator.ts`

Calculates per diem allowances by location:

**Example**:
```typescript
const perDiem = await calculatePerDiem({
    orgId: 'org_123',
    employeeId: 'emp_456',
    location: 'New York, NY',
    startDate: '2026-02-10',
    endDate: '2026-02-12', // 3 days
    mealBreakdown: true
});
// → { totalPerDiem: 279, meals: 219, lodging: 60, breakdown: { breakfast: 21, lunch: 31, dinner: 46 } × 3 }
```

### `card-reconciliation.ts`

Matches corporate card transactions to expense reports:

**Example**:
```typescript
const reconciliation = await reconcileCardTransactions({
    orgId: 'org_123',
    employeeId: 'emp_456',
    cardTransactions: [
        { transactionId: 'txn_001', amount: 189.50, date: '2026-02-11', merchant: 'HILTON HOTELS' }
    ],
    expenseReportId: 'exp_001'
});
// → { matched: 1, unmatched: 0, matchedTransactions: [{ transactionId: 'txn_001', expenseLineId: 'line_002' }] }
```

---

## Architecture

### Layer
**Layer 2: Domain Service**

### Dependencies
- `afenda-canon` - Standard types
- `afenda-database` - Expense reports, receipts, policies
- `afenda-logger` - Audit logging
- `drizzle-orm` - Database queries
- `zod` - Input validation

### Integration
- **Workflow**: Approval routing
- **Accounting**: Post expense reimbursements to GL
- **Payroll**: Add reimbursements to payroll run
- **Document management**: Store receipt images
- **Tax compliance**: Track VAT/GST for reclaim

---

## Why This Wins Deals

### Employee Experience
**"Our employees hate submitting expenses. Too much manual entry."**

Old way:
- Print receipts
- Fill out paper form
- Tape receipts to form
- Mail to accounting
- Wait 30 days for reimbursement

New way:
- Photo receipt with phone
- OCR extracts data (2 seconds)
- Submit expense report (30 seconds)
- Auto-approval (under policy limits)
- Reimbursement in next payroll

**10x better employee experience** = competitive advantage for talent retention.

### Finance Efficiency
Manual expense processing costs **$20-$30 per report** (data entry, validation, approval tracking, GL posting, check cutting).

Automated expense management costs **$2-$5 per report**.

Company with 500 employees × 12 expense reports/year = 6,000 reports/year:
- Manual: $120,000-$180,000/year
- Automated: $12,000-$30,000/year
- **Savings: $90,000-$150,000/year**

### Policy Compliance
**"We keep paying hotel bills over our $200 policy limit."**

Without policy enforcement:
- Employees don't know limits
- Managers approve out-of-policy expenses
- Finance catches it post-facto (too late)
- CFO frustrated

With policy enforcement:
- System flags violations at submission
- Requires business justification
- Routes to higher approval level
- Metrics on policy violations (identify training needs)

### Audit Trail
**"Auditors want to see receipts for every expense. We can't find them."**

Paper receipts:
- Lost, faded, damaged
- Hard to search (boxes of paper)
- Missing for old expenses

Digital receipts:
- Stored forever (S3)
- Searchable by merchant, amount, date, employee
- **Immutable audit trail** (SOX compliance)

---

## Usage Example

```typescript
import {
    processReceipt,
    submitExpense,
    validateAgainstPolicy,
    routeForApproval,
    calculateMileage,
    calculatePerDiem
} from 'afenda-expense-management';

// Employee photo uploads receipt
const receipt = await processReceipt({
    orgId: 'org_123',
    employeeId: 'emp_456',
    imageUrl: 's3://receipts/hotel_receipt.jpg'
});

// System extracts: Hilton, $189.50, 2026-02-11

// Employee creates expense report
const report = await submitExpense({
    orgId: 'org_123',
    employeeId: 'emp_456',
    reportName: 'Sales Trip NYC',
    lineItems: [
        {
            category: 'hotel',
            amount: receipt.amount,
            date: receipt.date,
            merchant: receipt.merchant,
            receiptUrl: receipt.imageUrl
        }
    ]
});

// System validates against policy
const policyCheck = await validateAgainstPolicy({
    orgId: 'org_123',
    employeeId: 'emp_456',
    lineItem: report.lineItems[0]
});

if (policyCheck.valid) {
    // Route for approval
    const routing = await routeForApproval({
        orgId: 'org_123',
        reportId: report.reportId,
        totalAmount: report.totalAmount,
        employeeId: 'emp_456'
    });
    
    console.log(`Routed to ${routing.approvers[0]} for approval`);
}

// Calculate mileage for personal vehicle
const mileage = await calculateMileage({
    orgId: 'org_123',
    employeeId: 'emp_456',
    distance: 125, // miles to client site
    date: '2026-02-10'
});

console.log(`Mileage reimbursement: $${mileage.reimbursement}`);

// Calculate per diem for 3-day trip
const perDiem = await calculatePerDiem({
    orgId: 'org_123',
    employeeId: 'emp_456',
    location: 'San Francisco, CA',
    startDate: '2026-02-10',
    endDate: '2026-02-12'
});

console.log(`Per diem: $${perDiem.totalPerDiem} (meals + lodging)`);
```

---

## Future Enhancements

- **Mobile app**: Native iOS/Android for receipt capture
- **Credit card feeds**: Real-time transaction import (Plaid, Finicity)
- **AI categorization**: Auto-categorize expenses (machine learning)
- **VAT reclaim**: Automatic VAT/GST reclaim for international travel
- **Budget integration**: Check against project/department budgets
- **Analytics**: Top spenders, policy violation trends, category analysis

---

## References

- [IRS Mileage Rates](https://www.irs.gov/tax-professionals/standard-mileage-rates)
- [GSA Per Diem Rates](https://www.gsa.gov/travel/plan-book/per-diem-rates)
- [Concur Expense Management](https://www.concur.com/)
- [Expensify](https://www.expensify.com/)
- [SAP Concur](https://www.concur.com/en-us/expense-management)
