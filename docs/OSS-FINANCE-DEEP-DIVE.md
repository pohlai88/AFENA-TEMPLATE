# OSS Finance & Accounting — Deep-Dive Research Synthesis

> **Source repos:** frappe/erpnext (Python/JS), killbill/killbill (Java), tryton/tryton (Python)
> **Benchmark:** 280-item AIS Benchmark (AIS-BENCHMARK.md) — AFENDA at 100% coverage (280/280)
> **Architecture:** architecture.domain.md v2.3, 5-dimensional model, DomainContext contract
> **Purpose:** Extract production-grade architectural patterns for multi-tenancy, multi-company, inter-company, multi-national, and multi-industry finance — validate and enrich AFENDA-NEXUS design.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Multi-Tenancy Architecture](#2-multi-tenancy-architecture)
3. [Multi-Company & Inter-Company](#3-multi-company--inter-company)
4. [Multi-Currency & General Ledger](#4-multi-currency--general-ledger)
5. [FX Revaluation & Translation](#5-fx-revaluation--translation)
6. [Cost Centers & Budgetary Control](#6-cost-centers--budgetary-control)
7. [Period Closing & Financial Close](#7-period-closing--financial-close)
8. [Chart of Accounts Design](#8-chart-of-accounts-design)
9. [Consolidated Reporting](#9-consolidated-reporting)
10. [Tax Cascade Engine](#10-tax-cascade-engine)
11. [Bank Reconciliation & Matching](#11-bank-reconciliation--matching)
12. [AFENDA Advantage Matrix](#12-afenda-advantage-matrix)
13. [Actionable Recommendations](#13-actionable-recommendations)
14. [Appendix: Code References](#14-appendix-code-references)

---

## 1. Executive Summary

### Research Scope

Three OSS systems were analyzed via GitHub MCP code-level searches (~200 code excerpts total):

| System        | Focus                                 | Maturity                 |
| ------------- | ------------------------------------- | ------------------------ |
| **ERPNext**   | Full ERP: GL, IC, FX, consolidation   | 15+ years, 15k+ GitHub ★ |
| **Kill Bill** | Billing: multi-tenancy, subscriptions | 10+ years, 4.6k GitHub ★ |
| **Tryton**    | Modular accounting, company isolation | 17+ years, 1k+ GitHub ★  |

### Key Findings

| Dimension          | Industry Best Practice (from OSS)                 | AFENDA Current            | Gap                                 |
| ------------------ | ------------------------------------------------- | ------------------------- | ----------------------------------- |
| Multi-Tenancy      | Kill Bill: `tenant_record_id` + per-tenant config | RLS + `org_id`            | **None — AFENDA is stronger**       |
| Multi-Company      | ERPNext: Company NestedSet hierarchy              | `org_id` + `company_id`   | **None — AFENDA is equivalent**     |
| Inter-Company      | ERPNext: bidirectional JV reference linking       | Dedicated IC package      | **Depth opportunity**               |
| Multi-Currency GL  | ERPNext: dual-amount on every GL line             | `moneyMinor` + `fxRate`   | **None — same pattern**             |
| FX Revaluation     | ERPNext: full workflow → JV creation              | `fx-management` package   | **Workflow enrichment**             |
| Cost Center Alloc. | ERPNext: percentage-based GL splitting            | `cost-accounting` package | **Pattern available**               |
| Period Closing     | ERPNext: dimension-wise P&L reversal + async      | `financial-close` package | **Pattern available**               |
| Consolidation      | Tryton: `account_consolidation` module            | `consolidation` package   | **None — comprehensively designed** |
| Tax Cascade        | ERPNext: row-level charge type + previous-row ref | `tax-engine` calculator   | **Already planned (erpnext.md)**    |

**Bottom line:** AFENDA-NEXUS architecture already matches or exceeds every OSS peer on structural design. The value from this research is **implementation depth patterns** — not architectural gaps.

---

## 2. Multi-Tenancy Architecture

### 2.1 Kill Bill Pattern (Application-Level Isolation)

Kill Bill uses a **shared-schema, application-filtered** model:

```java
// InternalTenantContext — threaded through every service call
public class InternalTenantContext extends TimeAwareContext {
    protected final Long tenantRecordId;     // integer FK on every table
    protected final Long accountRecordId;    // account within tenant
    // Every SQL query appends: WHERE tenant_record_id = ?
}
```

**Architecture:**

- Every table has `tenant_record_id BIGINT` column (integer, not UUID)
- `InternalCallContextFactory` resolves `tenantRecordId` from API key → caches in `TenantRecordIdCacheLoader`
- `objectBelongsToTheRightTenant()` validates object ownership before every operation
- Per-tenant configuration via `MultiTenantInvoiceConfig` pattern — every config method has a `(InternalTenantContext)` overload

**Per-Tenant Config Pattern:**

```java
// Every config property has two signatures:
boolean isSanitySafetyBoundEnabled();                           // global default
boolean isSanitySafetyBoundEnabled(InternalTenantContext ctx);  // tenant override

// Resolution: tenant override → global default (fallback)
String result = getStringTenantConfig("isSanitySafetyBoundEnabled", tenantContext);
return result != null ? Boolean.parseBoolean(result) : isSanitySafetyBoundEnabled();
```

**Tenant Data Lifecycle:**

```sql
-- wipeoutTenant-postgresql.sql — cascading delete by tenant_record_id
DELETE FROM catalog_override_block_definition WHERE tenant_record_id = v_tenant_record_id;
DELETE FROM account_email_history WHERE tenant_record_id = v_tenant_record_id;
-- ... 40+ tables deleted in dependency order
```

### 2.2 AFENDA Advantage

| Aspect            | Kill Bill                                | AFENDA-NEXUS                               |
| ----------------- | ---------------------------------------- | ------------------------------------------ |
| **Isolation**     | Application-level `WHERE` clause         | Postgres RLS — DB-enforced, bypass-proof   |
| **Discriminator** | `tenant_record_id` (Long integer)        | `org_id` (Branded Text with Neon Auth JWT) |
| **Config**        | Per-tenant JSON key-value overrides      | Per-tenant + per-company configuration     |
| **Security**      | `objectBelongsToTheRightTenant()` checks | RLS `USING` + `WITH CHECK` — no app checks |
| **Cleanup**       | Manual cascading DELETE script           | RLS-aware bulk operations                  |

**Insight adopted:** Kill Bill's `MultiTenantConfig` dual-signature pattern is elegant. AFENDA should consider a similar pattern for tenant-overridable configuration (e.g., fiscal settings, approval thresholds, number formats) — a `TenantConfig<T>` resolver that checks tenant-level overrides before falling back to company-level, then org-level defaults.

---

## 3. Multi-Company & Inter-Company

### 3.1 ERPNext: Company NestedSet + IC Journal

ERPNext models companies as a **NestedSet tree** (parent/subsidiary hierarchy with `lft`/`rgt` columns):

```python
# company.py — companies form a tree for consolidation
class Company(NestedSet):
    nsm_parent_field = "parent_company"
    # Each company has: default_currency, chart_of_accounts, fiscal_year
```

**Inter-Company Journal Entry — Bidirectional Linking:**

```python
# journal_entry.py — creating a mirror JV in the other company
def make_inter_company_journal_entry(name, voucher_detail_no):
    # 1. Create mirror JV in counterpart company
    # 2. Link both directions:
    journal_entry.inter_company_journal_entry_reference = name
    journal_entry.inter_company_journal_entry = voucher_detail_no
    # 3. Validate balances match:
    #    assert total_debit == total_credit between linked JVs

def validate_inter_company_accounts(self):
    # Checks:
    # - from_company != to_company (no self-IC)
    # - GL accounts exist in the counterpart company
    # - total_debit/credit match between the pair
```

**IC Workflow:**

1. User creates IC Journal Entry in Company A
2. System auto-creates mirror entry in Company B via `make_inter_company_journal_entry()`
3. Both entries cross-reference each other via `inter_company_journal_entry_reference`
4. Validation ensures debit/credit totals match across the pair
5. Consolidation eliminates both entries

### 3.2 Tryton: Company-Scoped Multi-Value Fields

Tryton uses `CompanyMultiValueMixin` — accounts payable/receivable default values vary per company:

```python
class Party(CompanyMultiValueMixin, metaclass=PoolMeta):
    # account_payable and account_receivable are MultiValue fields
    # stored in party.party.account with company foreign key
    account_payable = fields.MultiValue(fields.Many2One(
        'account.account', "Account Payable",
        domain=[('company', '=', Eval('context', {}).get('company', -1))]))
```

```python
class PartyAccount(ModelSQL, CompanyValueMixin):
    # Actual per-company storage: one row per party × company
    party = fields.Many2One('party.party')
    account_payable = fields.Many2One('account.account')
    account_receivable = fields.Many2One('account.account')
    # company comes from CompanyValueMixin
```

### 3.3 Tryton: Account Consolidation Module

```python
# account_consolidation/account.py
class Invoice(metaclass=PoolMeta):
    consolidation_company = fields.Many2One(
        'company.company', "Consolidation Company",
        domain=[
            ('party', '=', Eval('party', -1)),        # party must be the company
            ('id', '!=', Eval('company', -1)),         # not self
        ])
```

Consolidation scenario (from tests):

1. Create parent + subsidiary companies (different currencies)
2. Create chart of accounts per company
3. Create invoices — system auto-detects `consolidation_company` when party is another company
4. Move gets `consolidation_company` propagated from invoice
5. Consolidation report aggregates across companies with currency translation

### 3.4 AFENDA Comparison & Insights

| Feature              | ERPNext                                               | Tryton                             | AFENDA                                                         |
| -------------------- | ----------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| Company hierarchy    | NestedSet (lft/rgt)                                   | Flat (per-context)                 | Flat `company_id` (consolidation hierarchy separate)           |
| IC JV linking        | Bidirectional `inter_company_journal_entry_reference` | `consolidation_company` on invoice | IC package with `from_company_id`/`to_company_id`              |
| Per-company defaults | Company-level Mode of Payment Account                 | `CompanyMultiValueMixin`           | Per-company config + `payment_method_accounts` table           |
| IC validation        | `validate_inter_company_accounts()`                   | Domain constraint                  | `CHECK (from_company_id <> to_company_id)` + IC status machine |

**Insights adopted:**

1. **Bidirectional IC JV reference** — ERPNext's pattern of `inter_company_journal_entry_reference` on both sides is safer than a unidirectional reference. AFENDA's `intercompany_transactions` table already models this with `from_company_id`/`to_company_id`, but the **journal entry** level should also carry the IC reference for audit trail completeness.
2. **Auto-detection of IC invoices** — Tryton's pattern of auto-populating `consolidation_company` when the party is a company entity reduces manual IC tagging. Useful for `afenda-crud` orchestration.

---

## 4. Multi-Currency & General Ledger

### 4.1 ERPNext: Dual-Amount GL Pattern

Every GL line in ERPNext carries **both** transaction currency and company (functional) currency amounts:

```python
# general_ledger.py — the GL entry structure
gl_entry = {
    'account': account,
    'debit_in_account_currency': amount,        # transaction currency
    'credit_in_account_currency': 0,
    'debit': amount * exchange_rate,             # company currency
    'credit': 0,
    'account_currency': currency,                # ISO 4217
    'against': against_account,
    'exchange_rate': exchange_rate,              # per-line rate
    'company': company,
    'fiscal_year': fiscal_year,
    'voucher_type': 'Sales Invoice',
    'voucher_no': invoice.name,
    'cost_center': cost_center,
    'project': project,
}
```

**GL Posting Pipeline:**

```
Document.make_gl_entries()
  → general_ledger.make_gl_entries(gl_map)
    → process_gl_map(gl_map)
      → distribute_gl_based_on_cost_center_allocation()   # split by %
      → merge_similar_entries()                            # combine same account
      → save_entries()                                     # validate + insert
```

**Key Design Choice:** `exchange_rate` is stored **per GL line**, not per document header. This allows a single document (e.g., multi-currency payment) to have different rates on different lines.

### 4.2 ERPNext: Payment Entry — Dual Currency Handling

```python
# payment_entry.py — handles cross-currency payments
class PaymentEntry:
    paid_from_account_currency    # source account currency
    paid_to_account_currency      # target account currency
    paid_amount                   # amount in source currency
    received_amount               # amount in target currency
    source_exchange_rate          # source → company currency
    target_exchange_rate          # target → company currency

    def make_gl_entries(self):
        # Creates GL entries with:
        # - debit_in_account_currency (paid amount)
        # - debit (paid amount × source_exchange_rate → company currency)
        # - credit_in_account_currency (received amount)
        # - credit (received amount × target_exchange_rate → company currency)
        # - Separate entry for exchange gain/loss if rates differ
```

### 4.3 AFENDA Comparison

| Feature               | ERPNext                                       | AFENDA                                             |
| --------------------- | --------------------------------------------- | -------------------------------------------------- |
| Monetary storage      | Float (`Currency` field type)                 | **Integer minor units** (`moneyMinor()` → BIGINT)  |
| Exchange rate storage | Per-line `exchange_rate` (Float)              | `fxRate()` → `numeric(20,10)` — higher precision   |
| Currency columns      | `account_currency` (text)                     | `currencyCodeStrict()` — branded type-safe         |
| Gain/loss journals    | Auto-created via `create_gain_loss_journal()` | `fx-management` package domain intent              |
| Posting pipeline      | `make_gl_entries()` → `process_gl_map()`      | Domain returns `DomainIntent[]` → Layer 3 executes |

**AFENDA advantages:**

- Integer minor units eliminate floating-point rounding errors that affect ERPNext
- Branded types (`CurrencyCode`, `MoneyMinor`) prevent mixing currencies at compile time
- Intent-based posting separates validation from execution — ERPNext mixes both in `make_gl_entries()`

---

## 5. FX Revaluation & Translation

### 5.1 ERPNext: Exchange Rate Revaluation Workflow

```python
# exchange_rate_revaluation.py — complete revaluation workflow
class ExchangeRateRevaluation:

    def get_accounts_data(self):
        # 1. Find all Balance Sheet accounts where account_currency != company_currency
        # 2. For each: query GL for current balance_in_account_currency
        # 3. Calculate: new_balance = balance_in_account_currency × new_exchange_rate
        # 4. Compute: gain_loss = new_balance - current_balance_in_company_currency

    def calculate_new_account_balance(self, ...):
        # Per-account calculation with zero-balance edge case handling:
        # - If balance_in_account_currency == 0 but balance_in_company_currency != 0:
        #   → gain_loss = -balance_in_company_currency (cleanup entry)
        # - Normal case: gain_loss = (new_rate × foreign_balance) - functional_balance

    def make_jv_entries(self):
        # Creates Journal Entry with:
        # - One line per account (debit or credit for gain/loss)
        # - Offset to Exchange Gain/Loss account
        # - voucher_type: "Exchange Rate Revaluation"

    def make_jv_for_zero_balance(self):
        # Special handling: accounts with zero foreign balance
        # but non-zero functional balance (rounding residuals)
        # Creates separate cleanup JV
```

**Critical edge cases handled:**

1. **Zero balance in foreign currency** — creates cleanup entry to clear functional currency residual
2. **Multiple accounts** — groups entries by account for single JV
3. **Party-wise revaluation** — optionally revalues per party (for AR/AP accounts)

### 5.2 Tryton: Currency Translation for Consolidation

Tryton's consolidation module handles translation differently per account type:

```python
# consolidated_trial_balance.py
def calculate_foreign_currency_translation_reserve():
    # BS accounts: closing rate (period-end rate)
    # P&L accounts: average rate (period average)
    # Equity: historical rate
    # Difference → Foreign Currency Translation Reserve (FCTR)
```

### 5.3 AFENDA Insights

AFENDA's `fx-management` package should implement the ERPNext revaluation workflow with these enhancements:

1. **Zero-balance edge case** — ERPNext's separate JV for zero-balance cleanup is important for correctness
2. **Party-wise granularity** — revalue per customer/supplier for aged balance accuracy
3. **Three-rate translation** — closing (BS), average (P&L), historical (equity) for IFRS consolidation
4. **FCTR accumulation** — track cumulative translation differences in equity

---

## 6. Cost Centers & Budgetary Control

### 6.1 ERPNext: Cost Center Allocation

```python
# cost_center_allocation.py — percentage-based GL splitting
class CostCenterAllocation:
    main_cost_center       # source cost center
    valid_from             # effective date
    # child table: cost_center + percentage (must sum to 100%)

    def validate_total_allocation_percentage(self):
        total = sum(child.percentage for child in self.allocation_percentages)
        assert total == 100  # strict validation

# general_ledger.py — allocation happens at GL posting time
def distribute_gl_based_on_cost_center_allocation(gl_map, ...):
    # For each GL entry with a cost center that has allocations:
    # 1. Look up CostCenterAllocation valid for posting date
    # 2. Split the GL entry proportionally:
    #    - Original entry: 60% → Cost Center A
    #    - New entry: 40% → Cost Center B
    # 3. Both entries maintain same voucher_type/voucher_no
```

**Key insight:** Allocation happens **at GL posting time**, not after. This means the GL always reflects allocated amounts — no post-hoc reallocation needed.

### 6.2 AFENDA Implications

AFENDA's `cost-accounting` package should:

- Store allocation rules with `valid_from` date (time-bounded like FX rates)
- Apply allocation **inside the GL posting intent** — not as a separate post-processing step
- Validate 100% allocation total at rule creation time
- Support both percentage-based and formula-based allocation

---

## 7. Period Closing & Financial Close

### 7.1 ERPNext: Period Closing Voucher

```python
# period_closing_voucher.py — dimension-wise P&L reversal
class PeriodClosingVoucher:

    closing_account_type    # Must be Liability or Equity (not P&L!)
    transaction_date        # Closing date
    fiscal_year             # Year being closed

    def check_closing_account_type(self):
        # CRITICAL: closing account MUST be Liability or Equity
        # Prevents circular P&L closing

    def check_closing_account_currency(self):
        # Closing account currency MUST match company default currency

    def get_pcv_gl_entries(self):
        gl_entries = []
        # 1. Reverse all P&L accounts (dimension-wise):
        for entry in self.get_gle_for_pl_account():
            gl_entries.append(entry)
        # 2. Post net to closing account:
        for entry in self.get_gle_for_closing_account():
            gl_entries.append(entry)
        return gl_entries

    def get_gle_for_pl_account(self):
        # GROUP BY: account, cost_center, finance_book, project
        #          + all custom accounting dimensions
        # This preserves dimensional reporting even after close
        # Each group gets a reversal entry
```

**Dimension-wise closing** is critical — it preserves the ability to report by cost center/project even after year-end close.

### 7.2 ERPNext: Async Period Closing

```python
# process_period_closing_voucher.py — large-volume async processing
class ProcessPeriodClosingVoucher:
    # For entities with millions of GL entries, processes day-by-day:
    # 1. iterate_gl_entries() — daily granularity
    # 2. summarize_and_post_ledger_entries() — batch posting
    # 3. AccountClosingBalance — snapshot table for fast queries

    def process_closing(self):
        # Separate processing for P&L and BS:
        # - P&L: reverse to closing account (Retained Earnings)
        # - BS: carry forward (create opening balances)
```

**AccountClosingBalance** is a snapshot table that stores period-end balances for fast reporting — avoiding full GL re-aggregation.

### 7.3 AFENDA Implications

AFENDA's `financial-close` package should implement:

1. **Dimension-wise P&L reversal** — GROUP BY all dimensions (cost_center, project, custom dimensions)
2. **Closing account validation** — Must be Liability/Equity type (DB CHECK constraint)
3. **Async processing** — For large entities, process day-by-day with progress tracking
4. **Balance snapshot** — Period-end balance cache table for fast reporting
5. **Multi-book support** — Close each finance book independently

---

## 8. Chart of Accounts Design

### 8.1 ERPNext: Standard Chart Structure

```python
# standard_chart_of_accounts.py
CHART = {
    "Application of Funds (Assets)": {
        "root_type": "Asset",
        "report_type": "Balance Sheet",
        "Current Assets": {
            "account_type": "Current Asset",
            "Accounts Receivable": {
                "account_type": "Receivable"
            },
            "Bank Accounts": {
                "account_type": "Bank",
                "account_currency": "USD"
            }
        }
    }
}
# Each account has: account_type, account_category, root_type, report_type, account_currency
```

**Key classifications:**

- `root_type`: Asset | Liability | Equity | Income | Expense
- `report_type`: Balance Sheet | Profit and Loss
- `account_type`: Bank | Cash | Receivable | Payable | Stock | Tax | etc.
- `account_currency`: Optional — if set, forces all entries in this currency

### 8.2 Tryton: Template-Based Chart

Tryton uses a chart template system — templates define the structure, then each company instantiates its own chart:

```python
# Account creation wizard:
# 1. Select chart template → 2. Create accounts per company
# Result: each company has independent chart, derived from same template
```

### 8.3 AFENDA Current Design

AFENDA's `chart_of_accounts` table already covers:

- `account_type`, `account_group`, `parent_account_id` (hierarchical)
- `currency_code` (optional account-level currency)
- `is_reconcilable`, `is_active`, `normal_balance` (debit/credit)
- Per-company scoping via `org_id` + `company_id`

**No gaps identified** — AFENDA's COA design is comprehensive.

---

## 9. Consolidated Reporting

### 9.1 ERPNext: Consolidated Trial Balance

```python
# consolidated_trial_balance.py
class ConsolidatedTrialBalance:

    def get_data(self):
        companies = self.get_companies()  # all subsidiaries
        for company in companies:
            # 1. Get company-wise trial balance data
            # 2. Convert to presentation currency using:
            #    - BS items: closing_rate
            #    - P&L items: average_rate
            # 3. Calculate FCTR (Foreign Currency Translation Reserve)

    def calculate_foreign_currency_translation_reserve(self):
        # FCTR = Total assets (at closing rate)
        #      - Total liabilities (at closing rate)
        #      - Equity at historical rates
        #      - P&L at average rates
        # Difference → FCTR in equity section

    def update_to_presentation_currency(self, data, currency):
        # Converts all monetary values using appropriate rate type
```

### 9.2 AFENDA Alignment

AFENDA's `consolidation` package already designs for multi-level consolidation with:

- Level 0 → 1 → 2 hierarchy
- IC eliminations
- Currency translation
- Minority interest adjustments

The ERPNext patterns confirm AFENDA's approach is correct. Key implementation detail to preserve: **FCTR calculation must be the balancing figure** — not independently calculated.

---

## 10. Tax Cascade Engine

### 10.1 ERPNext: Row-Level Tax Computation

ERPNext's tax engine supports cascading taxes where one tax is computed on the result of a previous tax:

```javascript
// taxes_and_totals.js — charge_type drives computation
charge_types = {
    'On Net Total':               base = net_total,
    'On Previous Row Amount':     base = previous_row.tax_amount,
    'On Previous Row Total':      base = previous_row.cumulative_total,
    'On Item Quantity':            base = total_qty,
    'Actual':                     fixed_amount (not percentage),
}
```

**Real-world cascade example (India GST + CESS):**

```
Line: Net Total = 10,000
Row 1: CGST 9% on Net Total     → 900      (cumulative: 10,900)
Row 2: SGST 9% on Net Total     → 900      (cumulative: 11,800)
Row 3: CESS 1% on Previous Row Total → 118  (1% of 11,800)
Grand Total: 11,918
```

### 10.2 AFENDA Status

This is **already planned** in [erpnext.md](../business-domain/erpnext.md) as Engine 6 (Tax cascade), with:

- `TaxChargeType` enum: `actual | on_net_total | on_previous_row_amount | on_previous_row_total`
- `TaxRow` type with charge type, rate, rounding method
- `calculateDocumentTaxes()` function iterating rows with cumulative tracking
- 13 cascade test scenarios planned (GST+CESS, PST on GST, stacked VAT+excise)

---

## 11. Bank Reconciliation & Matching

### 11.1 ERPNext: Bank Reconciliation Tool

```python
# bank_reconciliation_tool.py
class BankReconciliationTool:
    # Multi-currency aware reconciliation:
    # - Bank statement entries in bank_account.currency
    # - Payment entries may be in different currencies
    # - Matching considers exchange rate differences

    def get_linked_payments(self):
        # Searches across: Payment Entry, Journal Entry,
        # Sales/Purchase Invoice (direct bank payment)
        # Matches by: amount, reference, date range
```

### 11.2 AFENDA Status

Already planned in [erpnext.md](../business-domain/erpnext.md) as Engine 5 (Bank matching rules), with:

- `bank_matching_rules` table: field, operator, pattern, tolerance
- Auto-match vs. review modes
- Priority-ordered rule evaluation

---

## 12. AFENDA Advantage Matrix

| Dimension                  | ERPNext                       | Kill Bill             | Tryton                 | **AFENDA-NEXUS**                           |
| -------------------------- | ----------------------------- | --------------------- | ---------------------- | ------------------------------------------ |
| **Type Safety**            | ❌ Python, no types           | ❌ Java, verbose      | ❌ Python, no types    | ✅ TypeScript branded types                |
| **Tenant Isolation**       | ❌ Application filter         | ⚠️ App filter + cache | ❌ Transaction context | ✅ Postgres RLS (DB-enforced)              |
| **Money Precision**        | ❌ Float                      | ⚠️ BigDecimal         | ❌ Decimal (Python)    | ✅ Integer minor units (BIGINT)            |
| **Posting Model**          | ⚠️ Mixed validation/execution | N/A (billing)         | ⚠️ Mixed               | ✅ Intent-based (separate)                 |
| **Architecture**           | ⚠️ Monolith                   | ✅ Modular            | ✅ Modular             | ✅ Strict 4-layer monorepo                 |
| **Audit Trail**            | ⚠️ Partial (amended_from)     | ⚠️ History tables     | ⚠️ History tables      | ✅ entity_versions + audit_logs            |
| **Industry Extensibility** | ⚠️ Custom fields              | N/A                   | ⚠️ Module override     | ✅ Overlay pattern + feature flags         |
| **Domain Isolation**       | ❌ Cross-module imports       | ✅ Guice DI           | ⚠️ Pool dispatch       | ✅ Zero cross-domain imports (CI-enforced) |

---

## 13. Actionable Recommendations

### Priority 1: Implementation Depth (from ERPNext patterns)

| #   | Recommendation                                                | Source                                                  | AFENDA Package    |
| --- | ------------------------------------------------------------- | ------------------------------------------------------- | ----------------- |
| 1   | Implement FX revaluation with zero-balance edge case handling | ERPNext `ExchangeRateRevaluation`                       | `fx-management`   |
| 2   | Dimension-wise P&L period closing (GROUP BY all dimensions)   | ERPNext `PeriodClosingVoucher`                          | `financial-close` |
| 3   | GL-time cost center allocation (not post-hoc)                 | ERPNext `distribute_gl_based_on_cost_center_allocation` | `cost-accounting` |
| 4   | Period-end balance snapshot table for fast reporting          | ERPNext `AccountClosingBalance`                         | `financial-close` |
| 5   | Bidirectional IC JV reference on journal entries              | ERPNext `inter_company_journal_entry_reference`         | `intercompany`    |

### Priority 2: Configuration Patterns (from Kill Bill)

| #   | Recommendation                                                                        | Source                                                     | Application             |
| --- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------- |
| 6   | Per-tenant config resolver with cascading fallback (tenant → company → org → default) | Kill Bill `MultiTenantConfig`                              | `afenda-crud` Layer 3   |
| 7   | Config cache with broadcast invalidation                                              | Kill Bill `TenantConfigCacheLoader` + `TenantBroadcastDao` | Platform config service |

### Priority 3: Already Planned (validate against erpnext.md)

| #   | Item                                                 | Status                      | Reference             |
| --- | ---------------------------------------------------- | --------------------------- | --------------------- |
| 8   | 10 new schema tables (bank_accounts, payments, etc.) | ✅ Verified & implemented   | `erpnext.md`          |
| 9   | Tax cascade engine (`TaxChargeType` enum)            | ✅ Planned, tests specified | `erpnext.md` Engine 6 |
| 10  | Bank matching rules                                  | ✅ Planned                  | `erpnext.md` Engine 5 |
| 11  | Opening balance workflow                             | ✅ Planned                  | `erpnext.md` Tool 7   |

### Not Recommended (AFENDA is already stronger)

- ERPNext's NestedSet company hierarchy — AFENDA's flat `company_id` + consolidation hierarchy is cleaner
- Kill Bill's application-level tenant filtering — AFENDA's RLS is strictly superior
- ERPNext's float-based monetary arithmetic — AFENDA's integer minor units are correct
- Tryton's `Transaction().context` pattern — AFENDA's explicit `DomainContext` is more testable

---

## 14. Appendix: Code References

### ERPNext Files Analyzed

| File                                | Patterns Extracted                                      |
| ----------------------------------- | ------------------------------------------------------- |
| `journal_entry.py`                  | IC JV creation, bidirectional linking, validation       |
| `accounts_controller.py`            | `get_gl_dict()`, exchange rate handling, multi-currency |
| `general_ledger.py`                 | GL posting pipeline, cost center allocation, merge      |
| `exchange_rate_revaluation.py`      | Full revaluation workflow, zero-balance edge case       |
| `period_closing_voucher.py`         | Dimension-wise P&L reversal, closing account validation |
| `process_period_closing_voucher.py` | Async processing, AccountClosingBalance snapshots       |
| `cost_center_allocation.py`         | Percentage-based allocation, validation                 |
| `payment_entry.py`                  | Dual-currency payments, gain/loss journals              |
| `standard_chart_of_accounts.py`     | CoA structure, root_type/report_type/account_type       |
| `consolidated_trial_balance.py`     | Company-wise aggregation, FCTR calculation              |
| `bank_reconciliation_tool.py`       | Multi-currency matching                                 |
| `company.py`                        | NestedSet hierarchy                                     |

### Kill Bill Files Analyzed

| File                              | Patterns Extracted                                           |
| --------------------------------- | ------------------------------------------------------------ |
| `InternalTenantContext.java`      | `tenantRecordId` + `accountRecordId` dual discriminator      |
| `InternalCallContextFactory.java` | Tenant resolution, ownership validation, cross-tenant checks |
| `MultiTenantInvoiceConfig.java`   | Per-tenant config override pattern (dual-signature)          |
| `TenantConfigCacheLoader.java`    | Tenant config caching with broadcast invalidation            |
| `DefaultTenantDao.java`           | Tenant CRUD, key-value config storage                        |
| `wipeoutTenant-postgresql.sql`    | Cascading tenant data deletion                               |
| `TenantResource.java`             | REST API for tenant management, per-tenant config upload     |

### Tryton Files Analyzed

| File                               | Patterns Extracted                                             |
| ---------------------------------- | -------------------------------------------------------------- |
| `account/party.py`                 | `CompanyMultiValueMixin`, per-company account defaults         |
| `account/account.py`               | `AccountParty`, balance calculation, period deferral           |
| `account/move.py`                  | Reconciliation wizard, multi-currency reconciliation           |
| `account_consolidation/account.py` | `consolidation_company` auto-detection on invoices             |
| `account_consolidation/tests/`     | Multi-company consolidation scenario with currency translation |

---

> **Generated:** Research synthesis from GitHub MCP analysis of 3 OSS repositories (~200 code excerpts).
> **Validates:** AFENDA-NEXUS architecture.domain.md v2.3 + AIS-BENCHMARK.md (280/280 coverage).
> **Next:** Implement Priority 1 recommendations within existing domain packages.
