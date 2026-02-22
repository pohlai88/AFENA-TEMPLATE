# AIS / Accounting 360-Degree Benchmark Reference

> Synthesized from: IFRS Standards (IAS/IFRS), FASB ASC (US GAAP), AICPA/COSO Internal Control Framework, AIS textbooks (Romney & Steinbart, Hall), OSS ERP systems (LedgerSMB, Tryton, ERPNext, Akaunting, FrontAccounting), and SAP/Oracle SLA design patterns.
>
> Purpose: Authoritative reference for validating AFENDA finance domain coverage. Every row is a benchmark requirement that a production-grade AIS must satisfy.

---

## 1. Chart of Accounts & General Ledger Structure

| #     | Benchmark Requirement                                                                | Authority                    | Notes                            |
| ----- | ------------------------------------------------------------------------------------ | ---------------------------- | -------------------------------- |
| GL-01 | Hierarchical CoA with account groups (Assets, Liabilities, Equity, Revenue, Expense) | IAS 1, FASB ASC 210          | Minimum 4-level hierarchy        |
| GL-02 | Account type enforcement (debit-normal vs credit-normal)                             | AIS textbooks                | Prevents sign-error postings     |
| GL-03 | Multi-ledger: IFRS ledger, local GAAP ledger, tax ledger per legal entity            | IAS 1 §16, IFRS 10           | Parallel books                   |
| GL-04 | Posting period control: open / soft-close / hard-close per (company, ledger, period) | ERPNext, SAP FI              | Prevents backdated postings      |
| GL-05 | Document types + posting keys per company (invoice, payment, journal, reversal)      | SAP FI, LedgerSMB            | Drives number ranges             |
| GL-06 | Number ranges per document type per company (fiscal-year-dependent)                  | SAP FI, Tryton               | Audit trail completeness         |
| GL-07 | Account balance = sum of all posted journal lines (no separate balance table)        | Double-entry axiom           | Derived, never stored separately |
| GL-08 | Trial balance at any point-in-time (`asOf`) — not just period-end                    | IFRS 10, auditor requirement | Enables interim reporting        |
| GL-09 | Segment / cost-center / profit-center dimensions on journal lines                    | SAP CO, ERPNext              | Multi-dimensional P&L            |
| GL-10 | Intercompany elimination accounts (IC payable / IC receivable mirror pairs)          | IFRS 10 §B86                 | Consolidation prerequisite       |

---

## 2. Double-Entry Bookkeeping Engine

| #     | Benchmark Requirement                                                                 | Authority                  | Notes                          |
| ----- | ------------------------------------------------------------------------------------- | -------------------------- | ------------------------------ |
| DE-01 | Every posting: sum(debits) = sum(credits) enforced at DB level                        | Accounting axiom           | CHECK constraint or trigger    |
| DE-02 | Journal entry header + lines (1:N) — header carries doc metadata, lines carry amounts | Romney & Steinbart         | Standard journal structure     |
| DE-03 | Functional currency + transaction currency on every line (IAS 21)                     | IAS 21 §20                 | Two-currency columns mandatory |
| DE-04 | Reversal journal: auto-creates mirror entry on period open                            | IAS 10, accrual accounting | Recurring accruals             |
| DE-05 | Posting status machine: draft → posted → reversed (no direct delete)                  | Audit requirement          | Immutable once posted          |
| DE-06 | Document splitting by segment/cost center (proportional allocation)                   | SAP New GL                 | Segment reporting              |
| DE-07 | Recurring journal templates (fixed amount or formula-based)                           | ERPNext, Tryton            | Reduces manual entry           |
| DE-08 | Batch posting with rollback on any line failure                                       | ACID requirement           | All-or-nothing                 |
| DE-09 | Audit trail: who posted, when, from which source document                             | AICPA AU-C §315            | Non-repudiation                |
| DE-10 | Integer minor units for all monetary amounts (no floating point)                      | IEEE 754 risk              | Penny-exact arithmetic         |

---

## 3. Accounts Payable (AP)

| #     | Benchmark Requirement                                            | Authority                | Notes                          |
| ----- | ---------------------------------------------------------------- | ------------------------ | ------------------------------ |
| AP-01 | 3-way match: Purchase Order → Goods Receipt → Supplier Invoice   | COSO Control Activity    | Prevents fraudulent invoices   |
| AP-02 | Supplier invoice aging (0–30, 31–60, 61–90, 90+ days)            | FASB ASC 210-20          | Cash flow management           |
| AP-03 | Payment run: batch selection by due date, bank, currency         | LedgerSMB, ERPNext       | Efficiency                     |
| AP-04 | Early payment discount capture (2/10 net 30 terms)               | FASB ASC 310-10          | Cash discount accounting       |
| AP-05 | Supplier statement reconciliation                                | AICPA best practice      | Detects unrecorded liabilities |
| AP-06 | ISO 20022 `pain.001` payment file generation                     | SWIFT/ISO 20022          | Bank connectivity              |
| AP-07 | Withholding tax deduction at payment (WHT)                       | Local tax law (MY/SG/UK) | Statutory requirement          |
| AP-08 | Debit memo / credit note handling                                | ERPNext, Tryton          | Supplier returns               |
| AP-09 | Duplicate invoice detection (supplier + invoice number + amount) | COSO fraud prevention    | Prevents double payment        |
| AP-10 | Accrued liabilities for uninvoiced GRs at period-end             | IAS 37, accrual basis    | Completeness assertion         |

---

## 4. Accounts Receivable (AR)

| #     | Benchmark Requirement                                          | Authority        | Notes                     |
| ----- | -------------------------------------------------------------- | ---------------- | ------------------------- |
| AR-01 | Customer invoice with line-level tax, discount, and net amount | IAS 18 / IFRS 15 | Revenue recognition basis |
| AR-02 | Payment allocation: FIFO, specific invoice, or oldest-first    | FASB ASC 310-10  | Aging accuracy            |
| AR-03 | Customer aging report (0–30, 31–60, 61–90, 90+ days)           | FASB ASC 310-10  | Credit management         |
| AR-04 | ECL provisioning: IFRS 9 Stage 1/2/3 (PD × LGD × EAD)          | IFRS 9 §5.5      | Impairment model          |
| AR-05 | Write-off workflow with approval gate                          | AICPA AU-C §330  | Authorization control     |
| AR-06 | Collection action tracking (calls, letters, legal)             | COSO monitoring  | Dunning process           |
| AR-07 | Credit note / return handling                                  | ERPNext, Tryton  | Customer returns          |
| AR-08 | Intercompany receivable matching                               | IFRS 10 §B86     | IC elimination            |
| AR-09 | Factoring / assignment of receivables                          | IFRS 9 §3.2      | Derecognition             |
| AR-10 | Revenue recognition integration (IFRS 15 5-step model)         | IFRS 15          | AR ≠ revenue              |

---

## 5. Revenue Recognition (IFRS 15 / ASC 606)

| #     | Benchmark Requirement                                                            | Authority      | Notes                      |
| ----- | -------------------------------------------------------------------------------- | -------------- | -------------------------- |
| RR-01 | 5-step model: identify contract → POB → transaction price → allocate → recognize | IFRS 15 §9     | Core framework             |
| RR-02 | Performance obligation (POB) identification per contract                         | IFRS 15 §22    | Distinct goods/services    |
| RR-03 | Standalone selling price (SSP) allocation across POBs                            | IFRS 15 §74    | Relative SSP method        |
| RR-04 | Point-in-time vs over-time recognition criteria                                  | IFRS 15 §35    | Control transfer test      |
| RR-05 | Percentage-of-completion (cost-to-cost method) for over-time                     | IFRS 15 §39    | Construction contracts     |
| RR-06 | Variable consideration constraint assessment                                     | IFRS 15 §56    | Highly probable threshold  |
| RR-07 | Contract modification: prospective vs cumulative catch-up                        | IFRS 15 §20    | Modification accounting    |
| RR-08 | Contract asset vs contract liability (deferred revenue)                          | IFRS 15 §105   | Balance sheet presentation |
| RR-09 | Milestone-based recognition (output method)                                      | IFRS 15 §B14   | Project billing            |
| RR-10 | Subscription / SaaS: ratable recognition over service period                     | IFRS 15 §35(b) | Recurring revenue          |

---

## 6. Fixed Assets (IAS 16 / ASC 360)

| #     | Benchmark Requirement                                                       | Authority       | Notes                     |
| ----- | --------------------------------------------------------------------------- | --------------- | ------------------------- |
| FA-01 | Asset register: cost, accumulated depreciation, net book value              | IAS 16 §30      | Core asset record         |
| FA-02 | Depreciation methods: straight-line, declining balance, units-of-production | IAS 16 §62      | Method per asset class    |
| FA-03 | Useful life + residual value review annually                                | IAS 16 §51      | Prospective adjustment    |
| FA-04 | Component accounting: major components depreciated separately               | IAS 16 §43      | Significant components    |
| FA-05 | Revaluation model: fair value uplift → OCI reserve                          | IAS 16 §31      | Alternative to cost model |
| FA-06 | Impairment testing: recoverable amount vs carrying amount                   | IAS 36          | CGU-level test            |
| FA-07 | Disposal: gain/loss = proceeds − NBV                                        | IAS 16 §67      | Derecognition             |
| FA-08 | Bulk depreciation run: all assets in one batch intent                       | ERPNext, Tryton | Period-end automation     |
| FA-09 | Asset transfer between companies / cost centers                             | SAP AA          | Intercompany asset        |
| FA-10 | Capital work-in-progress (CWIP) → asset capitalization                      | IAS 16 §7       | Construction period       |

---

## 7. Lease Accounting (IFRS 16 / ASC 842)

| #     | Benchmark Requirement                                                      | Authority    | Notes                      |
| ----- | -------------------------------------------------------------------------- | ------------ | -------------------------- |
| LA-01 | Right-of-use (ROU) asset recognition at commencement                       | IFRS 16 §22  | Lessee model               |
| LA-02 | Lease liability: PV of future lease payments at incremental borrowing rate | IFRS 16 §26  | Effective interest method  |
| LA-03 | Amortization schedule: interest + principal split per period               | IFRS 16 §36  | Monthly journal            |
| LA-04 | Lease modification: remeasurement of liability + ROU                       | IFRS 16 §45  | Change in scope/payments   |
| LA-05 | Lease termination: derecognition of ROU + liability                        | IFRS 16 §46  | Early termination          |
| LA-06 | Short-term lease exemption (≤12 months)                                    | IFRS 16 §B34 | Expense directly           |
| LA-07 | Low-value asset exemption                                                  | IFRS 16 §B3  | Expense directly           |
| LA-08 | Variable lease payments (index-linked)                                     | IFRS 16 §28  | CPI/rate-linked            |
| LA-09 | Sale-and-leaseback accounting                                              | IFRS 16 §98  | IFRS 15 + IFRS 16 combined |
| LA-10 | Lessor accounting: finance vs operating lease classification               | IFRS 16 §61  | Lessor perspective         |

---

## 8. Tax Engine

| #     | Benchmark Requirement                                                  | Authority                 | Notes                 |
| ----- | ---------------------------------------------------------------------- | ------------------------- | --------------------- |
| TX-01 | Multi-jurisdiction tax rate tables (time-bounded, effective_from/to)   | Local tax law             | Rate changes          |
| TX-02 | Tax code hierarchy: country → state/province → city                    | ERPNext, Tryton           | Cascading rates       |
| TX-03 | Input tax vs output tax netting for VAT/GST return                     | EU VAT Directive, MY SST  | Net filing            |
| TX-04 | Tax return aggregation by period and company                           | Local tax law             | Filing requirement    |
| TX-05 | SAF-T (Standard Audit File for Tax) export                             | OECD SAF-T                | Tax authority audit   |
| TX-06 | Withholding tax (WHT): rate per payee type + treaty override           | OECD Model Tax Convention | Cross-border payments |
| TX-07 | Deferred tax: temporary difference method (IAS 12)                     | IAS 12 §15                | Tax vs accounting     |
| TX-08 | Tax provision calculation (current + deferred)                         | IAS 12                    | Period-end            |
| TX-09 | Country-specific formats: MY SST, SG GST, UK VAT, EU VAT, US sales tax | Local regulations         | Multi-national        |
| TX-10 | Transfer pricing: arm's-length price validation                        | OECD TP Guidelines        | IC transactions       |

---

## 9. Consolidation & Intercompany (IFRS 10 / ASC 810)

| #     | Benchmark Requirement                                             | Authority              | Notes                    |
| ----- | ----------------------------------------------------------------- | ---------------------- | ------------------------ |
| CO-01 | Group ownership hierarchy (parent → subsidiary → sub-subsidiary)  | IFRS 10 §B85           | Multi-level              |
| CO-02 | Intercompany transaction matching (IC payable = IC receivable)    | IFRS 10 §B86           | Elimination prerequisite |
| CO-03 | IC elimination: revenue vs cost, receivable vs payable            | IFRS 10 §B86           | Consolidated P&L/BS      |
| CO-04 | Non-controlling interest (NCI) calculation                        | IFRS 10 §22            | Minority interest        |
| CO-05 | Goodwill on acquisition (IFRS 3): purchase price allocation       | IFRS 3 §32             | Business combination     |
| CO-06 | Currency translation: functional → presentation currency (IAS 21) | IAS 21 §39             | OCI translation reserve  |
| CO-07 | Ownership % change over time (acquisition / disposal)             | IFRS 10 §23            | Step acquisition         |
| CO-08 | Dividend elimination (IC dividend = equity reduction)             | IFRS 10 §B86           | Intercompany             |
| CO-09 | IC netting: offset payables vs receivables for settlement         | Treasury best practice | Cash efficiency          |
| CO-10 | Consolidation journal: auto-generated from IC matching results    | ERPNext, SAP SEM-BCS   | Automation               |

---

## 10. Treasury & Cash Management

| #     | Benchmark Requirement                                  | Authority              | Notes                   |
| ----- | ------------------------------------------------------ | ---------------------- | ----------------------- |
| TR-01 | Bank account master: IBAN, SWIFT, currency, company    | ERPNext, LedgerSMB     | Multi-bank              |
| TR-02 | Cash flow forecast: actual + committed + projected     | IAS 7                  | Liquidity management    |
| TR-03 | Actual vs forecast variance analysis                   | Treasury best practice | Rolling forecast        |
| TR-04 | Cash pooling / notional pooling positions              | Treasury best practice | Group cash optimization |
| TR-05 | Bank statement import: OFX, MT940, camt.053, CSV       | ISO 20022, SWIFT       | Reconciliation input    |
| TR-06 | Covenant monitoring: debt covenants with breach alerts | IFRS 7                 | Lender requirements     |
| TR-07 | FX exposure reporting: net open position by currency   | IFRS 7 §33             | Market risk             |
| TR-08 | Investment portfolio tracking (money market, bonds)    | IFRS 9                 | Financial instruments   |
| TR-09 | Intercompany loan management                           | IAS 24                 | Related party           |
| TR-10 | Cash flow statement (indirect method) auto-generation  | IAS 7 §18              | Statutory reporting     |

---

## 11. FX Management (IAS 21 / IFRS 9)

| #     | Benchmark Requirement                                           | Authority          | Notes                        |
| ----- | --------------------------------------------------------------- | ------------------ | ---------------------------- |
| FX-01 | FX rate types: spot, average, closing, budget, hedge            | IAS 21 §21         | Rate type per use case       |
| FX-02 | Period-end revaluation of monetary items                        | IAS 21 §23         | Balance sheet date           |
| FX-03 | OCI translation difference tracking (functional → presentation) | IAS 21 §39         | Separate OCI component       |
| FX-04 | Forward contract fair value calculation                         | IFRS 9 §4.1        | Derivative                   |
| FX-05 | Hedge effectiveness testing: 80%–125% range                     | IFRS 9 §6.4.1      | Prospective + retrospective  |
| FX-06 | FX gain/loss: realized vs unrealized separation                 | IAS 21 §28         | P&L classification           |
| FX-07 | Multi-currency bank reconciliation                              | ERPNext, LedgerSMB | Practical requirement        |
| FX-08 | Rate source audit trail (ECB, Bloomberg, manual)                | IFRS 13            | Fair value hierarchy         |
| FX-09 | Triangulation: cross-rate via USD (A/USD × USD/B)               | Market convention  | Rate derivation              |
| FX-10 | Functional currency determination per entity                    | IAS 21 §9          | Primary economic environment |

---

## 12. Financial Close & Reporting

| #     | Benchmark Requirement                                       | Authority       | Notes                   |
| ----- | ----------------------------------------------------------- | --------------- | ----------------------- |
| FC-01 | Period-end close checklist with task ownership and evidence | AICPA AU-C §265 | Control documentation   |
| FC-02 | Accrual run: auto-generate accrual journals from templates  | Accrual basis   | Completeness            |
| FC-03 | Allocation run: overhead → cost centers (step-down method)  | Cost accounting | Period-end              |
| FC-04 | Reclassification journals (reclass)                         | IFRS 1 §41      | Presentation            |
| FC-05 | Multi-company close: entity-level → group-level sequencing  | SAP S/4         | Group close             |
| FC-06 | Balance sheet (IAS 1 §54 line items)                        | IAS 1           | Statutory               |
| FC-07 | Income statement: by nature or by function                  | IAS 1 §99       | Two formats             |
| FC-08 | Cash flow statement: indirect method (IAS 7)                | IAS 7 §18       | Statutory               |
| FC-09 | Statement of changes in equity                              | IAS 1 §106      | Statutory               |
| FC-10 | Notes to financial statements (disclosure pack)             | IAS 1 §112      | Qualitative disclosures |

---

## 13. Budgeting & Planning

| #     | Benchmark Requirement                                 | Authority             | Notes               |
| ----- | ----------------------------------------------------- | --------------------- | ------------------- |
| BU-01 | Budget versions: original / revised / latest estimate | SAP BPC, Anaplan      | Version management  |
| BU-02 | Bottom-up budget entry by cost center / department    | ERPNext, Tryton       | Decentralized input |
| BU-03 | Budget consolidation across companies                 | Group planning        | Roll-up             |
| BU-04 | Rolling forecast vs static annual budget              | FP&A best practice    | Agility             |
| BU-05 | Budget vs actual variance report                      | Management accounting | Performance         |
| BU-06 | Budget commitment: encumber on PO creation            | ERPNext               | Spend control       |
| BU-07 | Budget period: monthly / quarterly / annual           | Configurable          | Granularity         |
| BU-08 | Workflow approval for budget submissions              | COSO control          | Authorization       |
| BU-09 | Scenario planning (base / upside / downside)          | FP&A best practice    | Risk analysis       |
| BU-10 | Budget import from spreadsheet (CSV/Excel)            | ERPNext, Tryton       | Practical adoption  |

---

## 14. Cost Accounting

| #     | Benchmark Requirement                                             | Authority         | Notes                    |
| ----- | ----------------------------------------------------------------- | ----------------- | ------------------------ |
| CA-01 | Cost center hierarchy (company → division → department)           | SAP CO            | Organizational structure |
| CA-02 | Cost allocation: direct, step-down, reciprocal methods            | CIMA, AICPA       | Overhead distribution    |
| CA-03 | Activity-based costing (ABC): activity drivers + rates            | CIMA              | Accurate product costing |
| CA-04 | Standard costing: variance analysis (price, quantity, efficiency) | CIMA              | Manufacturing            |
| CA-05 | Job costing vs process costing distinction                        | CIMA              | Industry-specific        |
| CA-06 | Overhead absorption rate + under/over-absorption                  | CIMA              | Period-end adjustment    |
| CA-07 | BOM explosion: multi-level with waste %                           | Manufacturing ERP | Material cost            |
| CA-08 | WIP valuation and transfer to finished goods                      | IAS 2             | Inventory costing        |
| CA-09 | Cost rollup: raw material → WIP → finished goods                  | ERPNext, Tryton   | Full absorption          |
| CA-10 | Profitability analysis by product / customer / region             | SAP CO-PA         | Management reporting     |

---

## 15. Project Accounting

| #     | Benchmark Requirement                                    | Authority             | Notes                 |
| ----- | -------------------------------------------------------- | --------------------- | --------------------- |
| PA-01 | Project master: budget, start/end date, billing type     | ERPNext, Tryton       | Project setup         |
| PA-02 | Cost posting to project (labor, material, expense)       | IAS 11 / IFRS 15      | Cost accumulation     |
| PA-03 | Earned value management: EV, PV, AC, CPI, SPI            | PMI PMBOK             | Performance           |
| PA-04 | Percentage-of-completion revenue recognition             | IFRS 15 §39           | Over-time recognition |
| PA-05 | WIP-to-revenue transfer journal                          | IAS 11                | Period-end            |
| PA-06 | Project billing: milestone, time-and-material, fixed-fee | IFRS 15               | Revenue model         |
| PA-07 | Intercompany project cost recharge                       | IAS 24                | Related party         |
| PA-08 | Project profitability report                             | Management accounting | Performance           |
| PA-09 | Resource utilization tracking                            | ERPNext               | Capacity              |
| PA-10 | Grant accounting: conditions + deferred income           | IAS 20                | Government grants     |

---

## 16. Credit Management

| #     | Benchmark Requirement                               | Authority          | Notes               |
| ----- | --------------------------------------------------- | ------------------ | ------------------- |
| CM-01 | Credit limit per customer (amount + currency)       | COSO control       | Risk management     |
| CM-02 | Credit exposure: outstanding invoices + open orders | ERPNext, LedgerSMB | Real-time check     |
| CM-03 | Credit hold / release workflow with approval        | COSO               | Authorization       |
| CM-04 | Credit review scheduling (annual / triggered)       | AICPA              | Periodic assessment |
| CM-05 | Credit scoring model (configurable weights)         | Risk management    | Quantitative        |
| CM-06 | Dunning: escalating letters (1st, 2nd, 3rd notice)  | ERPNext            | Collections         |
| CM-07 | Bad debt write-off workflow                         | AICPA AU-C §330    | Authorization       |
| CM-08 | Insurance / guarantee tracking                      | Risk management    | Collateral          |
| CM-09 | Customer payment history analysis                   | ERPNext            | Behavioral scoring  |
| CM-10 | ECL integration: credit score → IFRS 9 staging      | IFRS 9 §5.5        | Impairment          |

---

## 17. Bank Reconciliation

| #     | Benchmark Requirement                             | Authority              | Notes                       |
| ----- | ------------------------------------------------- | ---------------------- | --------------------------- |
| BR-01 | Bank statement import: OFX, MT940, camt.053, CSV  | ISO 20022              | Automation                  |
| BR-02 | Auto-matching: amount + date + reference          | ERPNext, LedgerSMB     | Efficiency                  |
| BR-03 | Manual match for complex transactions             | ERPNext                | Exception handling          |
| BR-04 | Auto-post confirmed matches to GL                 | ERPNext                | Straight-through processing |
| BR-05 | Unmatched item investigation workflow             | AICPA                  | Control                     |
| BR-06 | Outstanding checks / deposits-in-transit tracking | AICPA                  | Reconciliation items        |
| BR-07 | Bank charges auto-recognition                     | ERPNext                | Automation                  |
| BR-08 | Multi-currency reconciliation                     | ERPNext                | FX accounts                 |
| BR-09 | Reconciliation sign-off with evidence             | AICPA AU-C §265        | Control documentation       |
| BR-10 | Intraday balance monitoring (real-time feed)      | Treasury best practice | Liquidity                   |

---

## 18. Expense Management

| #     | Benchmark Requirement                                    | Authority          | Notes              |
| ----- | -------------------------------------------------------- | ------------------ | ------------------ |
| EM-01 | Expense claim submission with receipt attachment         | COSO control       | Evidence           |
| EM-02 | Multi-level approval routing (amount-based)              | COSO               | Authorization      |
| EM-03 | Per-diem rate tables (jurisdiction-aware, time-bounded)  | IRS, HMRC, LHDN    | Statutory rates    |
| EM-04 | Mileage rate calculation (per km/mile)                   | IRS, HMRC          | Statutory rates    |
| EM-05 | Policy enforcement: category limits, blacklisted vendors | COSO               | Preventive control |
| EM-06 | Corporate card reconciliation hook                       | ERPNext            | Card spend         |
| EM-07 | Foreign currency expense reimbursement (IAS 21)          | IAS 21             | FX conversion      |
| EM-08 | Project / cost center coding on expense lines            | Cost accounting    | Allocation         |
| EM-09 | Reimbursement payment via AP run                         | ERPNext, LedgerSMB | Integration        |
| EM-10 | Tax reclaim on business expenses (VAT/GST)               | Local tax law      | Input tax          |

---

## 19. Subscription & Recurring Billing

| #     | Benchmark Requirement                                 | Authority          | Notes                  |
| ----- | ----------------------------------------------------- | ------------------ | ---------------------- |
| SB-01 | Subscription plan master: price, billing cycle, trial | SaaS best practice | Plan management        |
| SB-02 | Ratable revenue recognition over service period       | IFRS 15 §35(b)     | Deferred revenue       |
| SB-03 | Invoice generation on billing cycle trigger           | ERPNext            | Automation             |
| SB-04 | Dunning for failed renewals (retry + escalation)      | SaaS best practice | Revenue recovery       |
| SB-05 | Upgrade / downgrade mid-cycle proration               | SaaS best practice | Fair billing           |
| SB-06 | Usage-based billing metering (API calls, seats, GB)   | SaaS best practice | Consumption model      |
| SB-07 | Contract modification: IFRS 15 §20 treatment          | IFRS 15 §20        | Prospective / catch-up |
| SB-08 | Churn tracking and MRR/ARR reporting                  | SaaS metrics       | Business intelligence  |
| SB-09 | Tax calculation on recurring invoices                 | Local tax law      | Compliance             |
| SB-10 | Payment gateway integration hook (Stripe, Braintree)  | SaaS best practice | Collection             |

---

## 20. Provisions & Contingencies (IAS 37)

| #     | Benchmark Requirement                                         | Authority  | Notes                   |
| ----- | ------------------------------------------------------------- | ---------- | ----------------------- |
| PR-01 | Recognition criteria: probable + reliable estimate            | IAS 37 §14 | Three-part test         |
| PR-02 | Best estimate: single amount or expected value                | IAS 37 §36 | Measurement             |
| PR-03 | Discount unwind: time value of money for long-term provisions | IAS 37 §45 | Finance cost            |
| PR-04 | Provision utilisation: actual spend vs provision              | IAS 37 §61 | Derecognition           |
| PR-05 | Provision reversal: no longer probable                        | IAS 37 §59 | Release to P&L          |
| PR-06 | Contingent liability disclosure (not recognized)              | IAS 37 §86 | Notes only              |
| PR-07 | Onerous contract provision                                    | IAS 37 §66 | Unavoidable costs       |
| PR-08 | Restructuring provision: formal plan + announcement           | IAS 37 §72 | Constructive obligation |
| PR-09 | Environmental / decommissioning provision                     | IAS 37 §14 | Asset retirement        |
| PR-10 | Discount rate selection (risk-free, pre-tax)                  | IAS 37 §47 | Measurement input       |

---

## 21. Intangible Assets (IAS 38)

| #     | Benchmark Requirement                                                    | Authority   | Notes                        |
| ----- | ------------------------------------------------------------------------ | ----------- | ---------------------------- |
| IA-01 | Recognition criteria: identifiable, controlled, future economic benefits | IAS 38 §21  | Three-part test              |
| IA-02 | Research phase → expense always                                          | IAS 38 §54  | No capitalization            |
| IA-03 | Development phase → capitalize if 6 criteria met                         | IAS 38 §57  | Conditional                  |
| IA-04 | Amortization: useful life determination (finite vs indefinite)           | IAS 38 §88  | Indefinite = no amortization |
| IA-05 | Impairment test for indefinite-life intangibles (annual)                 | IAS 36 §10  | CGU allocation               |
| IA-06 | Internally generated goodwill: prohibited                                | IAS 38 §48  | Expense only                 |
| IA-07 | Computer software: capitalize development, expense research              | IAS 38 §57  | SaaS capitalization          |
| IA-08 | Customer lists / relationships acquired in business combination          | IFRS 3      | PPA allocation               |
| IA-09 | Revaluation model (active market required)                               | IAS 38 §75  | Rare in practice             |
| IA-10 | Disclosure: gross carrying amount, accumulated amortization              | IAS 38 §118 | Note requirement             |

---

## 22. Financial Instruments (IFRS 9 / IAS 32 / IFRS 7)

| #     | Benchmark Requirement                                                  | Authority      | Notes                 |
| ----- | ---------------------------------------------------------------------- | -------------- | --------------------- |
| FI-01 | Classification: AC / FVOCI / FVTPL based on business model + SPPI test | IFRS 9 §4.1    | Three categories      |
| FI-02 | Effective interest rate (EIR) method for amortised cost                | IFRS 9 §B5.4.1 | Interest income       |
| FI-03 | Fair value measurement: Level 1 / 2 / 3 hierarchy                      | IFRS 13 §72    | Valuation             |
| FI-04 | Fair value change: OCI vs P&L routing by classification                | IFRS 9 §5.7    | Presentation          |
| FI-05 | ECL model: 12-month vs lifetime ECL (Stage 1/2/3)                      | IFRS 9 §5.5    | Impairment            |
| FI-06 | Derecognition: transfer of risks and rewards test                      | IFRS 9 §3.2    | Factoring             |
| FI-07 | Derivatives: fair value through P&L (default)                          | IFRS 9 §4.1.4  | Mark-to-market        |
| FI-08 | Compound instruments: split liability + equity components              | IAS 32 §28     | Convertible bonds     |
| FI-09 | IFRS 7 disclosures: credit risk, liquidity risk, market risk           | IFRS 7 §31     | Notes                 |
| FI-10 | Offsetting: legal right + intention to net settle                      | IAS 32 §42     | Balance sheet netting |

---

## 23. Hedge Accounting (IFRS 9 §6)

| #     | Benchmark Requirement                                                   | Authority      | Notes                          |
| ----- | ----------------------------------------------------------------------- | -------------- | ------------------------------ |
| HA-01 | Hedge designation: hedging instrument + hedged item + hedge type        | IFRS 9 §6.4.1  | Formal documentation           |
| HA-02 | Hedge types: fair value, cash flow, net investment                      | IFRS 9 §6.5    | Three models                   |
| HA-03 | Effectiveness testing: economic relationship + credit risk not dominant | IFRS 9 §6.4.1  | Qualitative or quantitative    |
| HA-04 | OCI reserve: effective portion of cash flow hedge                       | IFRS 9 §6.5.11 | Recycled to P&L on transaction |
| HA-05 | Ineffectiveness: recognized immediately in P&L                          | IFRS 9 §6.5.11 | Separate line item             |
| HA-06 | Discontinuation: on failure or voluntary de-designation                 | IFRS 9 §6.5.6  | Prospective only               |
| HA-07 | Net investment hedge: OCI until disposal of foreign operation           | IFRS 9 §6.5.13 | Translation reserve            |
| HA-08 | Rebalancing: adjust hedge ratio without discontinuation                 | IFRS 9 §6.5.8  | Prospective adjustment         |
| HA-09 | Basis adjustment: reclassify OCI to asset/liability cost                | IFRS 9 §6.5.15 | Cash flow hedge                |
| HA-10 | Disclosure: risk management strategy, hedge effectiveness               | IFRS 7 §22A    | Notes                          |

---

## 24. Transfer Pricing (OECD Guidelines)

| #     | Benchmark Requirement                                                      | Authority                    | Notes                |
| ----- | -------------------------------------------------------------------------- | ---------------------------- | -------------------- |
| TP-01 | Arm's-length principle: IC price = comparable uncontrolled price           | OECD TP Guidelines §1.6      | Core principle       |
| TP-02 | Transfer pricing methods: CUP, resale price, cost-plus, TNMM, profit split | OECD TP Guidelines §2        | Five methods         |
| TP-03 | IC agreement master: from/to company, item type, method, markup %          | OECD §1.52                   | Documentation        |
| TP-04 | Price validation at transaction time: flag out-of-range                    | OECD §1.33                   | Preventive control   |
| TP-05 | TP documentation: master file + local file                                 | OECD BEPS Action 13          | Country-by-country   |
| TP-06 | Advance pricing agreement (APA) tracking                                   | OECD §4.123                  | Certainty            |
| TP-07 | TP adjustment: year-end true-up journal                                    | OECD §1.33                   | Correction           |
| TP-08 | Country-by-country reporting (CbCR)                                        | OECD BEPS Action 13          | Group >€750M revenue |
| TP-09 | Thin capitalization: interest deductibility limits                         | OECD BEPS Action 4           | Debt/equity ratio    |
| TP-10 | Permanent establishment risk flag                                          | OECD Model Tax Convention §5 | PE exposure          |

---

## 25. Internal Controls (COSO / AICPA)

| #     | Benchmark Requirement                                                       | Authority                | Notes                 |
| ----- | --------------------------------------------------------------------------- | ------------------------ | --------------------- |
| IC-01 | Segregation of duties: preparer ≠ approver ≠ poster                         | COSO Control Environment | Fraud prevention      |
| IC-02 | Authorization matrix: amount thresholds per role                            | COSO Control Activity    | Tiered approval       |
| IC-03 | Audit trail: immutable log of all mutations (who, what, when, before/after) | AICPA AU-C §315          | Non-repudiation       |
| IC-04 | Period-end lock: no posting to closed period without override               | COSO                     | Completeness          |
| IC-05 | Reconciliation controls: sub-ledger = GL balance                            | AICPA                    | Accuracy              |
| IC-06 | Duplicate payment prevention: idempotency key on payment intents            | COSO                     | Fraud prevention      |
| IC-07 | Four-eyes principle on high-value transactions                              | COSO                     | Authorization         |
| IC-08 | Exception reporting: transactions outside policy thresholds                 | COSO Monitoring          | Detective control     |
| IC-09 | User access review: quarterly role certification                            | SOX §404, COSO           | Access control        |
| IC-10 | Change management: versioned rules, no silent overrides                     | COSO IT Controls         | Configuration control |

---

## 26. Data Architecture (AIS Textbook Requirements)

| #     | Benchmark Requirement                                                     | Authority                | Notes              |
| ----- | ------------------------------------------------------------------------- | ------------------------ | ------------------ |
| DA-01 | Integer minor units for all monetary storage (no FLOAT/DECIMAL for money) | Romney & Steinbart       | Precision          |
| DA-02 | Tenant isolation: org_id on every table + RLS enforced                    | Multi-tenant AIS         | Data security      |
| DA-03 | Optimistic concurrency: expectedVersion on all mutations                  | AIS best practice        | Conflict detection |
| DA-04 | Soft delete: deleted_at timestamp, never hard DELETE on financial records | Audit requirement        | Recoverability     |
| DA-05 | Effective dating: effective_from / effective_to on rate/rule tables       | IAS 8                    | Temporal accuracy  |
| DA-06 | Idempotency keys on all write operations                                  | AIS best practice        | Retry safety       |
| DA-07 | Append-only audit log: REVOKE UPDATE/DELETE from authenticated            | AICPA                    | Tamper-proof       |
| DA-08 | Deterministic hash on derived entries (inputs + rule version → hash)      | Audit replay             | Reproducibility    |
| DA-09 | Partitioned tables for high-volume data (audit_logs, journal lines)       | PostgreSQL best practice | Performance        |
| DA-10 | Read replica routing for reporting queries                                | AIS scalability          | CQRS pattern       |

---

## 27. Statutory Reporting & Disclosure

| #     | Benchmark Requirement                                      | Authority       | Notes                      |
| ----- | ---------------------------------------------------------- | --------------- | -------------------------- |
| SR-01 | Balance sheet per IAS 1 §54 minimum line items             | IAS 1           | Statutory                  |
| SR-02 | Income statement: by nature (MY/SG) or by function (US/UK) | IAS 1 §99       | Two formats                |
| SR-03 | Statement of changes in equity                             | IAS 1 §106      | Statutory                  |
| SR-04 | Cash flow statement: indirect method (IAS 7)               | IAS 7 §18       | Statutory                  |
| SR-05 | Notes: accounting policies, estimates, judgements          | IAS 1 §112      | Disclosure                 |
| SR-06 | Segment reporting: operating segments per IFRS 8           | IFRS 8          | Listed entities            |
| SR-07 | Related party disclosures (IAS 24)                         | IAS 24          | Key management, IC         |
| SR-08 | Events after reporting period (IAS 10)                     | IAS 10          | Adjusting vs non-adjusting |
| SR-09 | Earnings per share (IAS 33)                                | IAS 33          | Listed entities            |
| SR-10 | XBRL tagging for regulatory filing                         | SEC, MAS, Bursa | Digital submission         |

---

## 28. Subledger Accounting Architecture (SAP SLA / Oracle SLA Pattern)

| #      | Benchmark Requirement                                                                    | Authority           | Notes                  |
| ------ | ---------------------------------------------------------------------------------------- | ------------------- | ---------------------- |
| SLA-01 | Operational domains emit AccountingEvent — not hand-crafted journals                     | SAP SLA, Oracle SLA | Single posting engine  |
| SLA-02 | Mapping rules: event class → journal template (versioned)                                | SAP SLA             | Rule-driven derivation |
| SLA-03 | Deterministic replay: same event + rule version → identical journal                      | Audit requirement   | Hash equality          |
| SLA-04 | Multi-ledger derivation: one event → IFRS + local GAAP + tax journals                    | SAP SLA             | Parallel accounting    |
| SLA-05 | Posting audit: inputs_snapshot_hash + rule_version + reason_codes on every derived entry | AICPA               | Explainability         |
| SLA-06 | Preview mode: derive without posting (what-if)                                           | SAP SLA             | User review            |
| SLA-07 | Event store: immutable acct_events table (append-only)                                   | Event sourcing      | Replayability          |
| SLA-08 | Mapping version lifecycle: draft → published → deprecated                                | SAP SLA             | Change control         |
| SLA-09 | No direct GL write from operational packages (FIN-05 gate)                               | AFENDA invariant    | Single source          |
| SLA-10 | Reconciliation: acct_events count = acct_derived_entries count per period                | Audit               | Completeness           |
