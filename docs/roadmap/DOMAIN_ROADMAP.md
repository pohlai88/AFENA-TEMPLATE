# AFENDA-NEXUS Enterprise ERP Domain Architecture

## Overview

This document proposes the complete enterprise ERP domain structure for AFENDA-NEXUS, following the established layered architecture pattern with strict dependency rules and clean separation of concerns.

---

## Current State (Implemented)

### Layer 1: Foundation ✅

- `canon` - Type system, schemas, contracts (211+ entity types)
- `database` - Schema definitions, ORM (150+ tables)
- `logger` - Centralized logging
- `ui` - React component library

### Layer 2: Domain Services (Partially Implemented) ✅

- `accounting` - Tax, FX, depreciation, revenue recognition, payment allocation, fiscal periods, bank reconciliation
- `inventory` - UOM conversion, lot traceability, manufacturing BOM, landed costs, three-way matching
- `crm` - Pricing, discounts, budget enforcement
- `intercompany` - IC transactions, matching, eliminations
- `workflow` - Rules engine, orchestration
- `advisory` - Analytics, forecasting, anomaly detection
- `search` - Full-text search
- `migration` - Data migration pipeline

### Layer 3: Application ✅

- `crud` - Entity operations, authorization, lifecycle management

---

## Proposed Complete Enterprise Domain Structure

Following the **same architectural pattern**: Layer 2 (Domain Services) packages that depend only on Layer 1 (Foundation) + logger.

---

## 🏦 Financial Management Domain

### 1. `accounting` ✅ (Implemented)

**Responsibility**: Core financial accounting operations

**Services**:

- Tax calculation & compliance
- Foreign exchange management
- Depreciation schedules
- Revenue recognition (ASC 606, IFRS 15)
- Payment allocation
- Fiscal period controls
- Bank reconciliation

---

### 2. `treasury` (Proposed)

**Responsibility**: Cash management, liquidity, and banking operations

**Services**:

```typescript
// Cash positioning & forecasting
- getCashPosition(companyId, date) → cash balances by account/currency
- forecastCashFlow(companyId, periods) → projected cash in/out
- calculateWorkingCapital(companyId) → current assets - current liabilities

// Bank account management
- reconcileBankStatement(accountId, statementLines) → matched/unmatched
- processBankFeed(accountId, transactions) → auto-import
- validateBankTransfer(from, to, amount) → compliance checks

// Treasury operations
- createCashPooling(accounts, masterAccount) → zero-balance structure
- allocateLiquidity(demands, sources) → optimal allocation
- hedgeFxExposure(positions, instruments) → hedge recommendations

// Payment processing
- initiatePaymentRun(payables, priorityRules) → grouped payments
- generatePaymentFile(payments, format) → ISO 20022, NACHA, SEPA
- trackPaymentStatus(paymentId) → pending/cleared/failed
```

**Dependencies**: `canon`, `database`, `logger`, `accounting` (for FX rates)

**Key Features**:

- Multi-currency cash positioning
- Payment factory (batch payments)
- Bank connectivity (MT940, camt.053)
- Netting & cash pooling
- Liquidity forecasting

---

### 3. `fixed-assets` (Proposed)

**Responsibility**: Asset lifecycle management and compliance

**Services**:

```typescript
// Asset registration & tracking
- registerAsset(assetData) → asset master record
- transferAsset(assetId, from, to) → location/custodian transfer
- retireAsset(assetId, method) → disposal, sale, write-off

// Depreciation management (enhanced from accounting)
- calculateDepreciation(assetId, method, books[]) → multi-book depreciation
- runDepreciationBatch(period, bookId) → process all assets
- adjustDepreciation(assetId, reason, amount) → impairment, revaluation

// Asset valuation
- revalueAsset(assetId, fairValue, method) → IAS 16 revaluation
- impairAsset(assetId, recoverable) → IAS 36 impairment
- calculateAssetValue(assetId, date, bookId) → NBV at date

// Compliance & reporting
- generateAssetRegister(companyId, date) → full asset listing
- calculateCapitalGainLoss(sale) → tax implications
- trackAssetSubsidy(assetId, grant) → government grants (IAS 20)

// Maintenance integration
- scheduleAssetMaintenance(assetId, schedule) → preventive maintenance
- recordMaintenanceEvent(assetId, event) → capitalize vs. expense
```

**Dependencies**: `canon`, `database`, `logger`, `accounting`

**Key Features**:

- Multi-book depreciation (tax, GAAP, IFRS, management)
- Asset lifecycle (acquisition → retirement)
- Revaluation & impairment (IAS 16, IAS 36)
- Leasing (ASC 842, IFRS 16)
- Integration with maintenance

---

### 4. `tax-compliance` (Proposed)

**Responsibility**: Tax calculation, filing, and regulatory compliance

**Services**:

```typescript
// Tax determination
- determineTaxJurisdiction(address, taxType) → jurisdiction codes
- calculateWithholdingTax(payment, vendor, treaty) → WHT amount
- applyTaxTreaty(jurisdiction, taxType, amount) → reduced rate

// VAT/GST management
- calculateVAT(transaction, rules) → input/output VAT
- generateVATReturn(period, jurisdiction) → return data
- validateVATNumber(vatNo, country) → VIES validation

// Tax reporting
- generateTaxReport(jurisdiction, period, reportType) → compliance report
- calculate1099Forms(vendors, year) → US 1099 forms
- generateTransferPricingDoc(transactions) → TP documentation

// Nexus & compliance
- determineNexus(sales, jurisdictions) → tax registration requirements
- trackExemptionCertificates(customer) → certificate validity
- calculateUseTax(purchases, jurisdiction) → use tax liability

// Indirect tax
- applyExciseTax(product, jurisdiction) → excise duty
- calculateCustomsDuty(import, tariffCode) → customs duty
- processTaxCredit(purchases, rules) → ITC eligibility
```

**Dependencies**: `canon`, `database`, `logger`, `accounting`

**Key Features**:

- Multi-jurisdiction tax rules
- VAT/GST/Sales tax automation
- Withholding tax (domestic & treaty)
- Transfer pricing
- Tax credit/refund tracking
- E-filing integration

---

## 🛒 Procurement-to-Pay (P2P) Domain

### 5. `procurement` (Proposed)

**Responsibility**: Purchase requisitions, sourcing, and procurement workflows

**Services**:

```typescript
// Requisition management
- createRequisition(items, requester, budgetCheck) → req-xxx
- routeForApproval(reqId, approvalChain) → workflow instance
- consolidateRequisitions(reqIds) → combined sourcing

// Sourcing & RFQ
- createRFQ(reqId, vendors, deadline) → RFQ package
- evaluateBids(rfqId, criteria, weights) → scored proposals
- awardRFQ(rfqId, vendorId, items) → create PO draft

// Vendor selection
- qualifyVendor(vendorId, criteria) → approved/rejected
- rankVendors(category, criteria) → preferred suppliers
- assessVendorPerformance(vendorId, metrics) → scorecard

// Contract management
- createPurchaseContract(vendor, terms, items) → blanket PO
- releaseFromContract(contractId, quantity) → call-off order
- trackContractCompliance(contractId) → spend vs. commitment

// Spend analysis
- analyzeSpendByCategory(period, dimensions) → category spend
- identifySavingsOpportunities(data) → consolidation opportunities
- trackMaverickSpend(purchases, policy) → non-compliant purchases
```

**Dependencies**: `canon`, `database`, `logger`, `workflow`, `crm` (budget)

**Key Features**:

- Multi-level approval workflows
- RFQ/RFP management
- Vendor qualification & evaluation
- Contract lifecycle management
- Spend analytics
- Budget integration

---

### 6. `purchasing` (Proposed)

**Responsibility**: Purchase order management and execution

**Services**:

```typescript
// PO creation & management
- createPurchaseOrder(requisitionId, vendor, items) → PO-xxx
- amendPurchaseOrder(poId, changes, reason) → PO version control
- closePurchaseOrder(poId, reason) → final close

// PO approval
- submitForApproval(poId) → route to approvers
- approvePurchaseOrder(poId, approverId, comments) → approval stamp
- escalatePurchaseOrder(poId, reason) → exception handling

// Order tracking
- acknowledgeOrder(poId, vendorConfirmation) → confirmed date
- updateDeliverySchedule(poId, newDates) → reschedule
- trackOrderStatus(poId) → open/partial/received/closed

// Expediting & follow-up
- identifyOverdueOrders(threshold) → late orders
- sendVendorReminder(poId, messageTemplate) → email/EDI
- evaluateOnTimeDelivery(vendorId, period) → OTD %

// PO analytics
- analyzePurchaseLeadTime(category, vendor) → avg lead time
- calculatePurchaseCycle(from, to) → req-to-receive time
- trackPriceVariance(poId, priceChanges) → price volatility
```

**Dependencies**: `canon`, `database`, `logger`, `workflow`, `procurement`

**Key Features**:

- PO versioning & change management
- Multi-level approval
- Vendor acknowledgment tracking
- EDI integration (850, 855, 856)
- Delivery schedule management

---

### 7. `receiving` (Proposed)

**Responsibility**: Goods receipt, inspection, and put-away

**Services**:

```typescript
// Goods receipt
- createGoodsReceipt(poId, receivedItems) → GRN-xxx
- inspectReceipt(grnId, qualityChecks) → passed/failed/partial
- acceptReceipt(grnId, warehouseLocation) → update inventory

// Return to vendor
- createReturnAuthorization(grnId, items, reason) → RTV-xxx
- processReturn(rtvId, replacement, credit) → vendor credit

// Receipt matching (enhanced from inventory)
- matchToOrder(grnId, poId, tolerances) → 2-way match
- matchToInvoice(grnId, invoiceId, tolerances) → 3-way match
- resolveMatchException(matchId, resolution) → variance approval

// Put-away & storage
- assignStorageLocation(grnId, items, strategy) → bin allocation
- generatePutAwayTask(grnId, locations) → warehouse task
- confirmPutAway(taskId) → inventory updated

// Receipt analytics
- calculateReceiptAccuracy(period) → receipt vs. PO variance
- trackInspectionRejects(vendor, period) → quality metrics
- analyzeReceivingCycle(from, to) → dock-to-stock time
```

**Dependencies**: `canon`, `database`, `logger`, `inventory`, `purchasing`

**Key Features**:

- Barcode/RFID scanning
- Quality inspection workflows
- Blind receiving support
- Cross-docking
- ASN (advanced shipping notice) processing

---

### 8. `payables` (Proposed)

**Responsibility**: Accounts payable, invoice processing, vendor payments

**Services**:

```typescript
// Invoice processing
- captureInvoice(invoiceData, source) → OCR/EDI/manual
- validateInvoice(invoiceId, rules) → validation errors
- matchInvoiceToReceipt(invoiceId, grnId) → 3-way match

// Invoice approval
- routeForApproval(invoiceId, approvers) → approval workflow
- approveInvoice(invoiceId, glCoding) → ready for payment
- disputeInvoice(invoiceId, reason, vendor) → resolution workflow

// Payment processing
- schedulePayment(invoiceId, terms, discounts) → payment date
- createPaymentBatch(dueDate, priority, method) → grouped payments
- executePayments(batchId, bankAccount) → payment file

// Payment application (enhanced from accounting)
- applyPayment(paymentId, invoices, allocation) → cleared invoices
- processVendorCredit(creditId, application) → offset invoice
- handlePaymentReversal(paymentId, reason) → reverse entries

// Vendor management
- analyzePaymentBehavior(vendorId) → on-time payment %
- trackEarlyPaymentDiscounts(taken, missed) → discount capture
- calculateDPO(period) → days payable outstanding

// Cash flow management
- forecastPayables(periods, confidence) → projected outflows
- optimizePaymentTiming(invoices, cash, discounts) → payment plan
- trackCashDiscounts(period) → discount earned vs. available
```

**Dependencies**: `canon`, `database`, `logger`, `accounting`, `treasury`, `workflow`

**Key Features**:

- OCR invoice capture
- 3-way matching automation
- Early payment discount tracking
- Payment terms management (net 30, 2/10 net 30)
- Vendor self-service portal
- 1099 tracking

---

## 💰 Order-to-Cash (O2C) Domain

### 9. `sales` (Proposed)

**Responsibility**: Sales order management, quotations, and fulfillment

**Services**:

```typescript
// Quotation management
- createQuotation(customer, items, validity) → QT-xxx
- calculateQuotePrice(items, discounts, terms) → total price
- convertQuotationToOrder(quoteId) → SO-xxx

// Sales order processing
- createSalesOrder(customer, items, terms) → SO-xxx
- validateOrder(soId, checks) → credit limit, inventory, pricing
- confirmOrder(soId, promisedDate) → customer acknowledgment

// ATP (Available-to-Promise)
- checkAvailability(items, requestDate) → ATP quantities
- reserveInventory(soId, items) → allocate stock
- promiseDeliveryDate(items, location) → estimated date

// Order fulfillment
- releaseToWarehouse(soId) → picking authorization
- allocateStock(soId, allocationRule) → pick locations
- stageFulfillment(soId, shipments) → staged for shipping

// Order changes & cancellation
- amendSalesOrder(soId, changes, reason) → version control
- cancelSalesOrder(soId, cancellationReason) → release inventory
- processReturns(invoiceId, items, reason) → RMA processing

// Sales analytics
- analyzeSalesCycle(from, to) → quote-to-cash time
- trackOrderFillRate(period) → % complete shipments
- calculateBackorderRate(period) → backorder/total orders
```

**Dependencies**: `canon`, `database`, `logger`, `workflow`, `crm`, `inventory`

**Key Features**:

- CPQ (Configure-Price-Quote)
- ATP/CTP (capable-to-promise)
- Stock reservation
- Backorder management
- Drop-ship & special orders
- RMA (return merchandise authorization)

---

### 10. `shipping` (Proposed)

**Responsibility**: Shipping execution, carrier management, logistics

**Services**:

```typescript
// Shipment planning
- planShipment(soIds, consolidationRules) → shipments
- selectCarrier(shipment, criteria) → optimal carrier
- calculateShippingCost(shipment, carrier, service) → freight cost

// Shipment execution
- createShipment(soIds, carrier, service) → SHIP-xxx
- generatePackingList(shipmentId) → packing slip PDF
- generateBillOfLading(shipmentId) → BOL document

// Carrier integration
- rateShop(shipment, carriers) → best rate/service
- createShippingLabel(shipmentId, carrier) → label PDF/ZPL
- trackShipment(shipmentId, trackingNo) → real-time status

// Loading & dispatch
- createLoadPlan(shipments, vehicle) → loading sequence
- confirmLoading(loadId, items) → loaded items
- dispatchShipment(shipmentId, driverSignature) → in-transit

// Delivery confirmation
- confirmDelivery(shipmentId, signature, timestamp) → delivered
- processDeliveryException(shipmentId, exception) → damage, shortage
- generateProofOfDelivery(shipmentId) → POD document

// Logistics analytics
- calculateOnTimeDelivery(period) → OTD %
- analyzeFreightCost(dimensions) → freight spend
- trackCarrierPerformance(carrierId) → scorecard
```

**Dependencies**: `canon`, `database`, `logger`, `sales`, `inventory`

**Key Features**:

- Multi-carrier integration (UPS, FedEx, DHL)
- Rate shopping & optimization
- Advanced shipping notice (ASN)
- Track & trace
- Freight audit & payment
- Route optimization

---

### 11. `receivables` (Proposed)

**Responsibility**: Accounts receivable, invoicing, collections

**Services**:

```typescript
// Invoice generation
- generateInvoice(shipmentId, billingRules) → INV-xxx
- consolidateInvoices(soIds, customerId) → combined invoice
- applyInvoiceAdjustments(invoiceId, adjustments) → credit/debit memo

// Invoice delivery
- sendInvoice(invoiceId, method, recipient) → email/EDI/print
- trackInvoiceDelivery(invoiceId) → opened/bounced
- generateInvoicePDF(invoiceId, template) → printable invoice

// Payment collection (enhanced from accounting)
- processCustomerPayment(payment, method) → cash application
- applyPaymentToInvoices(paymentId, allocation) → cleared invoices
- handlePaymentDiscrepancies(paymentId, variance) → unapplied cash

// Collections management
- ageReceivables(customerId, date) → aging buckets
- prioritizeCollections(criteria) → collector worklist
- generateDunningLetters(overdue, strategy) → collection letters

// Credit management
- checkCreditLimit(customerId, orderAmount) → approved/blocked
- reviewCreditExposure(customerId) → current exposure
- recommendCreditAction(customerId, metrics) → increase/reduce/hold

// AR analytics
- calculateDSO(period) → days sales outstanding
- forecastCollections(periods, confidence) → projected inflows
- analyzeBadDebtRisk(customers, model) → risk scores
- trackCashDiscount(offered, taken) → discount effectiveness
```

**Dependencies**: `canon`, `database`, `logger`, `accounting`, `sales`, `workflow`

**Key Features**:

- Auto-matching payments to invoices
- Dunning management (automated reminders)
- Credit limit enforcement
- Lockbox processing
- E-invoicing (PEPPOL, EDI)
- Customer portal access

---

## 📦 Supply Chain & Operations Domain

### 12. `inventory` ✅ (Implemented - Enhanced)

**Current Services**: UOM conversion, lot traceability, manufacturing BOM, landed costs, three-way matching

**Proposed Enhancements**:

```typescript
// Inventory planning
- calculateReorderPoint(productId, location) → safety stock + lead time demand
- generateReplenishmentPlan(location, horizon) → transfer/purchase recommendations
- optimizeInventoryLevels(products, service level) → min/max levels

// Cycle counting
- generateCycleCountSchedule(location, strategy) → count tasks
- recordCycleCount(taskId, counted) → adjustments
- analyzeCountAccuracy(location, period) → accuracy %

// Inventory valuation
- calculateInventoryValue(location, date, method) → FIFO/LIFO/Avg
- processInventoryAdjustment(location, reason, amount) → write-off/write-up
- generateInventoryValuationReport(date, book) → inventory GL value
```

---

### 13. `warehouse` (Proposed)

**Responsibility**: Warehouse operations, picking, packing, storage

**Services**:

```typescript
// Warehouse layout & storage
- defineWarehouseZones(warehouseId, zones) → zone structure
- assignStorageStrategy(productId, strategy) → fixed/random/zone
- optimizeBinLocation(productId, movement) → ABC classification

// Inbound operations
- receiveASN(asn) → expected receipts
- createPutAwayTask(grnId, strategy) → directed put-away
- executePutAway(taskId, binLocation) → update bin inventory

// Outbound operations
- createPickList(soIds, waveRules) → pick tasks
- optimizePickRoute(pickList, method) → efficient route
- confirmPicking(pickListId, picked) → staged inventory

// Packing & shipping
- createPackingTask(pickedItems) → pack station assignment
- packOrder(taskId, boxes, weights) → shipping units
- generateShippingLabels(shipmentId) → labels

// Inventory moves
- createTransferTask(from, to, items) → internal transfer
- executeReplenishment(pickZone, reserveZone) → auto-replenish
- processInventoryCycle(location, items) → cycle count

// Warehouse analytics
- calculatePickAccuracy(period) → pick error rate
- trackPutAwayTime(taskIds) → avg put-away time
- analyzeStorageUtilization(warehouse) → % capacity used
- measureThroughput(period) → lines picked/hour
```

**Dependencies**: `canon`, `database`, `logger`, `inventory`, `receiving`, `shipping`

**Key Features**:

- Directed picking (wave, batch, zone, discrete)
- Slotting optimization
- Cross-docking
- Kitting & bundling
- RF/barcode scanning
- Labor management integration

---

### 14. `manufacturing` (Proposed - Split from inventory)

**Responsibility**: Production planning, work orders, shop floor

**Services**:

```typescript
// Production planning
- createProductionPlan(demand, capacity, horizon) → MPS (master production schedule)
- runMRP(demand, bom, inventory) → material requirements
- capacityCheck(plan, resources) → bottleneck analysis

// Work order management
- createWorkOrder(productId, quantity, dueDate) → WO-xxx
- releaseWorkOrder(woId, materials) → issued to shop floor
- scheduleWorkOrder(woId, resources, constraints) → start/end dates

// Material issuance
- issueComponents(woId, bomLines) → issue from inventory
- backflushComponents(woId, quantity) → auto-consume on completion
- returnExcessMaterial(woId, items) → return to stock

// Production execution
- startOperation(woId, operationId, operator) → clock-in
- recordProduction(woId, quantity, yield, scrap) → output
- completeWorkOrder(woId, actualCosts) → close WO

// Quality control
- createInspectionPlan(productId, operations) → QC checkpoints
- recordInspection(woId, operation, results) → pass/fail/rework
- processRework(woId, defects, disposition) → scrap/rework/use-as-is

// Manufacturing analytics
- calculateOEE(resource, period) → overall equipment effectiveness
- trackYieldRate(productId, period) → actual/theoretical yield
- analyzeScrapRate(period, causes) → quality metrics
- measureCycleTime(productId) → avg production time
```

**Dependencies**: `canon`, `database`, `logger`, `inventory`

**Key Features**:

- MRP (Material Requirements Planning)
- Shop floor control
- BOM explosion (already in inventory)
- Routing & operations
- Backflushing
- Work center management
- Production costing

---

### 15. `quality` (Proposed)

**Responsibility**: Quality management, inspections, non-conformance

**Services**:

```typescript
// Inspection management
- defineInspectionPlan(entity, checkpoints) → inspection template
- scheduleInspection(entityId, planId, date) → inspection task
- executeInspection(inspectionId, measurements) → results

// Non-conformance tracking
- createNCR(entityId, defects, severity) → NCR-xxx (non-conformance report)
- investigateRootCause(ncrId, analysis) → 5-why, fishbone
- implementCorrectiveAction(ncrId, actions, responsible) → CAPA

// Supplier quality
- auditSupplier(vendorId, criteria) → audit report
- trackSupplierDefects(vendorId, period) → defect PPM
- issueSupplierCAR(vendorId, issues) → corrective action request

// Calibration management
- scheduledCalibration(equipmentId, interval) → cal due date
- performCalibration(equipmentId, results, certificate) → cal record
- trackCalibrationStatus(equipmentId) → in-cal/overdue

// Quality analytics
- calculateDefectRate(product, period) → defects/units
- trackCustomerComplaints(period) → complaint trends
- analyzeScrapCost(period) → cost of quality
- measureFirstPassYield(operation) → FPY %
```

**Dependencies**: `canon`, `database`, `logger`, `inventory`, `manufacturing`

**Key Features**:

- SPC (statistical process control)
- CAPA (corrective/preventive action)
- Certificate of analysis (COA)
- Complaint management
- Audit trails
- ISO 9001 compliance

---

### 16. `planning` (Proposed)

**Responsibility**: Demand planning, supply planning, S&OP

**Services**:

```typescript
// Demand forecasting
- forecastDemand(productId, method, horizon) → statistical forecast
- adjustForecast(productId, period, override) → consensus forecast
- analyzeforecastAccuracy(period) → MAPE, bias

// Safety stock optimization
- calculateSafetyStock(productId, service level) → buffer inventory
- optimizeInventoryPolicy(productId, costs) → (s,S) or (R,s,S)
- simulateStockout(scenarios) → service level impact

// Supply planning
- generateSupplyPlan(demand, constraints) → planned orders
- netRequirements(demand, onHand, scheduled) → net requirements
- proposeSupplyActions(exceptions) → expedite/postpone/cancel

// S&OP (Sales & Operations Planning)
- consolidateDemandPlan(sales, marketing, customers) → demand view
- balanceSupplyCapacity(demand, capacity, constraints) → supply view
- reconcilePlans(demand, supply, financial) → consensus plan

// Scenario planning
- createScenario(assumptions, changes) → what-if scenario
- comparePlans(scenarios, metrics) → scenario analysis
- recommendPlan(scenarios, objectives) → optimal plan
```

**Dependencies**: `canon`, `database`, `logger`, `inventory`, `sales`

**Key Features**:

- Time-series forecasting (ARIMA, exponential smoothing)
- Demand sensing (POS data integration)
- Collaborative planning (CPFR)
- Constraint-based planning
- What-if analysis

---

## 👥 Human Capital Management (HCM) Domain

### 17. `hr-core` (Proposed)

**Responsibility**: Employee master data, organizational structure

**Services**:

```typescript
// Employee management
- hireEmployee(employeeData, position, startDate) → EMP-xxx
- transferEmployee(empId, newPosition, newDepartment) → transfer
- terminateEmployee(empId, terminationDate, reason) → final pay

// Organizational structure
- defineOrgHierarchy(departments, positions) → org chart
- assignManager(empId, managerId, effectiveDate) → reporting line
- defineJobPosition(title, department, grade, description) → JOB-xxx

// Employee data
- updateEmployeeInfo(empId, changes, effectiveDate) → versioned data
- trackEmployeeHistory(empId) → position/salary/location history
- manageEmployeeDocuments(empId, docType, file) → document vault

// Competency & skills
- defineCompetencyModel(position, competencies) → required skills
- assessEmployeeSkills(empId, competencies, ratings) → skill matrix
- identifySkillGaps(empId, targetPosition) → gap analysis

// Workforce analytics
- analyzeHeadcount(dimensions, period) → HC by dept/location/grade
- trackTurnover(period, segments) → attrition rate
- calculateSpanOfControl(managerId) → direct reports
- forecastWorkforce(growth, attrition, horizon) → HC projection
```

**Dependencies**: `canon`, `database`, `logger`, `workflow`

**Key Features**:

- Employee self-service
- Organizational charting
- Position management
- Job requisitions
- Background checks
- I-9/E-Verify integration

---

### 18. `payroll` (Proposed)

**Responsibility**: Payroll processing, pay calculation, tax withholding

**Services**:

```typescript
// Payroll processing
- calculateGrossPay(empId, period, earnings) → gross amount
- calculateDeductions(empId, gross, deductions) → withholdings
- calculateNetPay(empId, gross, deductions, adjustments) → net pay

// Tax withholding
- calculateFederalTax(empId, gross, w4Data) → federal withholding
- calculateStateTax(empId, gross, state) → state withholding
- calculateLocalTax(empId, gross, jurisdiction) → local tax

// Payroll execution
- openPayrollPeriod(companyId, periodEnd) → PAYROLL-xxx
- processPayroll(payrollId, employees) → pay calculations
- approvePayroll(payrollId, approverId) → ready for payment
- finalizePayroll(payrollId) → generate payments, GL entries

// Payment methods
- generateACHFile(payrollId, bankAccount) → direct deposit file
- generatePaychecks(payrollId, checkStock) → printed checks
- issuePayCards(payrollId, cardProvider) → paycard transfers

// Year-end processing
- generateW2Forms(employees, year) → W-2s
- generate1095Forms(employees, year) → ACA reporting
- reconcilePayrollTaxes(year, returns) → tax reconciliation

// Payroll analytics
- analyzeLabourCost(dimensions, period) → labor cost breakdown
- trackOvertimeHours(department, period) → OT hours
- calculateBurdenRate(benefits, gross) → burden %
```

**Dependencies**: `canon`, `database`, `logger`, `accounting`, `hr-core`

**Key Features**:

- Multi-state/country payroll
- Tax computation (federal, state, local)
- Garnishment processing
- Direct deposit/ACH
- W-2/1099 generation
- Tax filing integration (EFTPS)

---

### 19. `time-attendance` (Proposed)

**Responsibility**: Time tracking, attendance, leave management

**Services**:

```typescript
// Time capture
- clockIn(empId, timestamp, location) → time punch
- clockOut(empId, timestamp) → duration calculation
- recordTimeEntry(empId, date, hours, activity) → manual entry

// Attendance tracking
- trackAttendance(empId, date, status) → present/absent/late
- calculateAbsences(empId, period, types) → sick/vacation/unpaid
- flagAttendanceException(empId, date, reason) → exception

// Leave management
- requestLeave(empId, type, from, to, reason) → leave request
- approveLeave(requestId, managerId, comments) → approved leave
- accrueLeave(empId, period, policy) → leave balance update

// Schedule management
- defineWorkSchedule(empId, pattern, effectiveDate) → shift schedule
- scheduleShift(empId, date, startTime, endTime) → shift assignment
- handleShiftSwap(emp1, emp2, date, reason) → swap approval

// Overtime management
- calculateOvertimeHours(empId, period, rules) → OT hours
- approveOvertime(empId, hours, reason) → OT authorization
- trackOTBudget(department, actual, budget) → variance

// Time analytics
- analyzeTimeUtilization(empId, period) → productive/non-productive
- trackAbsenteeism(department, period) → absence rate
- calculateLabourVariance(actual, planned) → variance analysis
```

**Dependencies**: `canon`, `database`, `logger`, `workflow`, `hr-core`, `payroll`

**Key Features**:

- Biometric/badge integration
- Mobile time entry
- Shift scheduling
- PTO (paid time off) accrual
- FMLA tracking
- Labor law compliance (break rules, overtime)

---

### 20. `benefits` (Proposed)

**Responsibility**: Benefits administration, enrollment, claims

**Services**:

```typescript
// Benefits enrollment
- definebenefitPlan(type, coverage, cost, carrier) → plan setup
- enrollEmployee(empId, planIds, effectiveDate, beneficiaries) → enrollment
- processQualifyingEvent(empId, event, changes) → life event change

// Benefits administration
- calculateEmployerContribution(empId, planId) → employer cost
- calculateEmployeeDeduction(empId, planId) → payroll deduction
- reconcileBenefitsCarrier(carrier, period) → carrier invoicing

// COBRA administration
- triggerCOBRA(empId, event, date) → COBRA eligibility
- enrollCOBRA(empId, plans, effectiveDate) → COBRA coverage
- trackCOBRAPremiums(empId, payments) → premium tracking

// FSA/HSA management
- createFlexAccount(empId, type, election) → FSA/HSA/DCA account
- processFlexClaim(accountId, claimData, receipts) → claim adjudication
- reimburseFlexClaim(claimId, amount) → payment

// Benefits analytics
- analyzeBenefitsCost(dimensions, period) → cost trends
- trackEnrollmentRates(plans) → participation %
- calculateBenefitsUtilization(plan, period) → utilization rate
```

**Dependencies**: `canon`, `database`, `logger`, `workflow`, `hr-core`, `payroll`

**Key Features**:

- Open enrollment automation
- Life event processing
- Carrier EDI integration (834, 837)
- ACA compliance (1095-C)
- COBRA automation
- Dependent verification

---

### 21. `performance` (Proposed)

**Responsibility**: Performance management, goals, reviews

**Services**:

```typescript
// Goal management
- cascadeGoals(orgGoals, department) → aligned goals
- setEmployeeGoals(empId, goals, weights, dueDate) → individual goals
- trackGoalProgress(goalId, status, milestones) → progress updates

// Performance reviews
- initiateReviewCycle(period, participants, template) → review cycle
- conductSelfAssessment(empId, reviewId, responses) → self-review
- conductManagerReview(empId, managerId, ratings, comments) → manager review
- calibrateRatings(department, reviews) → calibration session

// 360 feedback
- initiate360Feedback(empId, reviewers, competencies) → 360 request
- collect360Responses(feedbackId, responses) → aggregated feedback
- generate360Report(feedbackId) → feedback summary

// Performance improvement
- createPIP(empId, deficiencies, actions, timeline) → improvement plan
- trackPIPProgress(pipId, milestones, status) → progress tracking
- concludePIP(pipId, outcome) → successful/unsuccessful

// Succession planning
- identifyKeypPositions(criticality, risk) → key positions
- assessSuccessionReadiness(position, candidates) → readiness matrix
- developSuccessors(empId, targetPosition, plan) → development plan

// Talent analytics
- analyze9Box(employees, performance, potential) → talent grid
- identifyHighPotential(criteria, threshold) → HiPo pool
- trackPromotionRate(period, segments) → internal mobility
```

**Dependencies**: `canon`, `database`, `logger`, `workflow`, `hr-core`

**Key Features**:

- Continuous feedback
- OKR (Objectives & Key Results)
- Competency-based reviews
- Multi-rater feedback
- Calibration workflows
- Development plans

---

## 📊 Project & Services Domain

### 22. `projects` (Proposed)

**Responsibility**: Project management, time tracking, billing

**Services**:

```typescript
// Project management
- createProject(customer, contract, budget, timeline) → PROJ-xxx
- defineWBS(projectId, tasks, dependencies) → work breakdown
- assignResources(projectId, tasks, resources) → resource allocation

// Time tracking
- recordProjectTime(empId, projectId, taskId, hours) → time entry
- approveTimesheet(empId, period, approverId) → approved hours
- allocateTimeToBilling(projectId, hours, billable) → revenue recognition

// Project costing
- captureProjectCost(projectId, costType, amount) → actual cost
- calculateEAC(projectId, burn rate, remaining) → estimate at completion
- analyzeCostVariance(projectId, actual, budget) → variance

// Billing & revenue
- generateProjectInvoice(projectId, period, method) → T&M/fixed/milestone
- recognizeProjectRevenue(projectId, method, pct) → POC revenue
- trackUnbilledRevenue(projectId) → WIP/unbilled

// Resource management
- forecastResourceDemand(projects, horizon) → resource needs
- allocateResources(projects, availableResources) → optimal allocation
- trackResourceUtilization(resourceId, period) → billable %

// Project analytics
- calculateProjectMargin(projectId) → actual margin
- trackOnTimeDelivery(projects, period) → % on-time
- analyzeBudgetVariance(projectId) → budget vs. actual
```

**Dependencies**: `canon`, `database`, `logger`, `accounting`, `time-attendance`

**Key Features**:

- Gantt charts & dependencies
- Resource capacity planning
- Time & expense tracking
- Project billing (T&M, fixed, milestone)
- WIP & revenue recognition
- Earned value management

---

## 🔐 Compliance & Governance Domain

### 23. `audit` (Proposed)

**Responsibility**: Audit trail, change tracking, compliance reporting

**Services**:

```typescript
// Audit logging (enhanced from CRUD)
- logEntityChange(entity, action, before, after, userId) → audit entry
- trackFieldChange(entity, field, old, new, reason) → field audit
- recordSystemAccess(userId, resource, action, result) → access log

// Audit analysis
- queryAuditTrail(filters, dateRange) → audit records
- analyzeUserActivity(userId, period) → activity summary
- detectAnomalousActivity(patterns) → suspicious activity

// Compliance reporting
- generateAuditReport(entity, period, format) → audit report
- trackRegulatoryChanges(jurisdiction, regulations) → compliance calendar
- reportComplianceStatus(controls, assessments) → compliance dashboard

// Data retention
- archiveOldRecords(entity, retentionPolicy) → archived data
- purgeExpiredData(entity, legal hold check) → deleted records
- restoreArchivedData(archiveId, reason) → data restoration

// Internal controls
- defineSODRule(role1, role2, conflict) → segregation of duties
- detectSODViolations(userId, roles, actions) → violations
- reviewAccessPermissions(userId, certificationPeriod) → access review
```

**Dependencies**: `canon`, `database`, `logger`

**Key Features**:

- Immutable audit logs
- SOX compliance
- GDPR right-to-audit
- Change history & rollback
- Who-did-what reporting

---

### 24. `regulatory` (Proposed)

**Responsibility**: Regulatory reporting, statutory compliance

**Services**:

```typescript
// Financial reporting
- generateFinancialStatement(companyId, period, standard) → GAAP/IFRS reports
- consolidateFinancials(entities, eliminations) → consolidated FS
- reconcileIntercompany(entities, period) → IC reconciliation

// Tax reporting (enhanced from tax-compliance)
- generateTaxReturn(jurisdiction, period, form) → tax return data
- reconcileTaxProvision(actual, provision) → tax true-up
- prepareTaxDisclosures(footnotes, schedules) → tax footnotes

// Statutory reporting
- generateStatutoryReport(jurisdiction, reportType) → local GAAP report
- fileRegulatoryReturn(jurisdiction, data, deadline) → e-filing
- trackFilingDeadlines(jurisdiction, reports) → compliance calendar

// Industry-specific
- generateFDAReport(product, event, type) → pharma compliance
- reportEnvironmentalData(emissions, waste) → EPA reporting
- fileSecurityReport(data, regulationSEC/FINRA) → financial services

// Compliance validation
- validateReportAccuracy(report, reconciliation) → accuracy check
- certifyCompliance(report, certifier, signature) → SOX certification
- trackFilingStatus(filings, statuses) → filed/pending/amended
```

**Dependencies**: `canon`, `database`, `logger`, `accounting`, `tax-compliance`

**Key Features**:

- Multi-jurisdiction reporting
- XBRL generation
- E-filing integration
- Compliance calendars
- Certification workflows

---

## 📈 Analytics & Business Intelligence Domain

### 25. `advisory` ✅ (Implemented - To be enhanced)

**Current Services**: Anomaly detection, forecasting, statistical scoring

**Proposed Enhancements**:

```typescript
// Predictive analytics
- forecastSales(productId, method, horizon) → sales forecast
- predictCustomerChurn(customerId, features) → churn probability
- estimateProjectCost(projectSpec, historicalData) → cost estimate

// Prescriptive analytics
- optimizePricing(product, demand, competition) → optimal price
- recommendInventoryLevel(product, service level, costs) → min/max
- suggestProductMix(capacity, margin, demand) → optimal mix

// Risk analytics
- assessCreditRisk(customerId, model) → default probability
- evaluateSupplierRisk(vendorId, factors) → risk score
- analyzePortfolioRisk(projects, correlations) → portfolio VaR
```

---

### 26. `reporting` (Proposed)

**Responsibility**: Business intelligence, dashboards, KPIs

**Services**:

```typescript
// Report generation
- executeReport(reportId, parameters, format) → report output
- scheduleReport(reportId, schedule, recipients) → scheduled report
- cacheReportData(reportId, freshness) → cached dataset

// Dashboard management
- createDashboard(widgets, layout, filters) → dashboard
- refreshDashboard(dashboardId, realtime) → live data
- exportDashboard(dashboardId, format) → PDF/Excel

// KPI tracking
- defineKPI(metric, formula, targets, thresholds) → KPI definition
- calculateKPI(kpiId, period, dimensions) → KPI values
- trackKPITrends(kpiId, periods) → trending analysis

// Data visualization
- generateChart(data, chartType, options) → chart
- createPivotTable(dataset, rows, cols, values) → pivot
- buildDataModel(sources, joins, calculations) → semantic model

// Ad-hoc analysis
- queryDataMart(dimensions, measures, filters) → result set
- drillDown(report, level, filter) → detailed view
- drillThrough(summary, details) → transaction detail
```

**Dependencies**: `canon`, `database`, `logger`, `advisory`

**Key Features**:

- Self-service BI
- Interactive dashboards
- Drill-down/drill-through
- Export to Excel/PDF
- Scheduled report delivery
- Embedded analytics

---

### 27. `budgeting` (Proposed - Split from CRM/advisory)

**Responsibility**: Budgeting, forecasting, planning

**Services**:

```typescript
// Budget preparation
- createBudget(fiscalYear, scenario, version) → BUD-xxx
- allocateBudget(total, dimensions, driver) → budget allocation
- copyBudget(sourceId, targetYear, inflationRate) → new budget

// Budget workflow
- submitBudget(budgetId, submitter) → approval routing
- consolidateBudgets(departmentBudgets) → company budget
- approveBudget(budgetId, approverId, adjustments) → approved

// Budget vs. Actual
- compareBudgetActual(period, dimensions) → variance report
- analyzeVariance(actual, budget, threshold) → significant variances
- forecastYearEnd(actuals, budget, remaining) → full-year forecast

// Rolling forecasts
- updateForecast(period, assumptions, drivers) → revised forecast
- trackForecastAccuracy(forecasts, actuals) → MAPE by period
- recommendForecastModel(historicalAccuracy) → best model

// Scenario planning (enhanced)
- defineScenario(name, assumptions, probabilities) → scenario
- compareScenarios(scenarios, metrics, risk) → scenario comparison
- weightScenarios(scenarios, probabilities) → weighted forecast

// Planning analytics
- calculateBudgetFlexing(actual volume, budgeted rate) → flexed budget
- trackBudgetUtilization(budget, actuals) → consumption %
- identifyBudgetOpportunities(variances) → savings opportunities
```

**Dependencies**: `canon`, `database`, `logger`, `accounting`, `workflow`

**Key Features**:

- Top-down & bottom-up budgeting
- Driver-based planning
- Scenario modeling
- Rolling forecasts
- Budget workflows & approvals
- What-if analysis

---

## 🔧 Platform & Integration Domain

### 28. `workflow` ✅ (Implemented)

**Current Services**: Rules engine, workflow orchestration, envelope generation

**Note**: Already well-implemented - continue to enhance

---

### 29. `integration` (Proposed)

**Responsibility**: API management, EDI, data exchange

**Services**:

```typescript
// API management
- defineAPIEndpoint(entity, operations, auth) → REST/GraphQL API
- generateAPIKey(partner, scopes, expiration) → API credentials
- trackAPIUsage(apiKey, endpoint, volume) → usage metering

// EDI processing
- parseEDIMessage(message, standard, version) → structured data
- validateEDI(message, rules) → validation errors
- generateEDIMessage(data, standard, partner) → EDI file

// Data mapping
- defineMapping(source, target, transformations) → mapping template
- executeMapping(sourceData, mappingId) → transformed data
- validateMapping(mappingId, testData) → validation results

// Integration monitoring
- trackIntegrationStatus(integrationId, health) → up/down/degraded
- logIntegrationError(integrationId, error, payload) → error log
- retryFailedMessage(messageId, retryCount) → retry attempt

// File exchange
- receiveFTPFile(connection, pattern) → incoming files
- parseFileFormat(file, format) → CSV/XML/JSON/fixed-width
- sendFileToPartner(data, format, destination) → outbound file
```

**Dependencies**: `canon`, `database`, `logger`

**Key Features**:

- REST & GraphQL APIs
- EDI (X12, EDIFACT, XML)
- SFTP/FTP/AS2 transfers
- Webhook support
- Message queues (Kafka, RabbitMQ)
- API rate limiting

---

### 30. `notifications` (Proposed)

**Responsibility**: Alerts, notifications, messaging

**Services**:

```typescript
// Notification delivery
- sendEmail(recipient, template, data, attachments) → email sent
- sendSMS(phoneNumber, message, priority) → SMS sent
- sendPushNotification(userId, title, body, data) → push sent

// Notification templates
- defineTemplate(name, channel, content, variables) → template
- renderTemplate(templateId, data) → rendered content
- testTemplate(templateId, testData) → preview

// Subscription management
- subscribeToEvent(userId, eventType, channels) → subscription
- unsubscribeFromEvent(userId, eventType) → unsubscribed
- configurePreferences(userId, preferences) → notification settings

// Notification tracking
- trackDeliveryStatus(notificationId) → sent/delivered/failed/read
- analyzeNotificationEngagement(campaign) → open/click rates
- retryFailedNotification(notificationId, maxRetries) → retry

// Alert management
- defineAlertRule(condition, recipients, priority) → alert rule
- evaluateAlertConditions(rules, data) → triggered alerts
- escalateAlert(alertId, escalationPath) → escalation
```

**Dependencies**: `canon`, `database`, `logger`

**Key Features**:

- Multi-channel (email, SMS, push, in-app)
- Template management
- User preferences
- Delivery tracking
- Alert escalation

---

## 📦 Package Summary

### Layer 1: Foundation (4 packages) ✅

Already implemented and solid.

### Layer 2: Domain Services (30 packages total)

**Financial Management (6 packages)**

1. ✅ `accounting` - Core accounting
2. 🆕 `treasury` - Cash & banking
3. 🆕 `fixed-assets` - Asset lifecycle
4. 🆕 `tax-compliance` - Tax automation
5. ✅ `intercompany` - IC transactions
6. 🆕 `budgeting` - Planning & forecasting

**Procurement-to-Pay (4 packages)** 7. 🆕 `procurement` - Requisitions, RFQ, sourcing 8. 🆕 `purchasing` - Purchase orders 9. 🆕 `receiving` - Goods receipt 10. 🆕 `payables` - AP & payments

**Order-to-Cash (3 packages)** 11. 🆕 `sales` - Sales orders & quotations 12. 🆕 `shipping` - Logistics & carriers 13. 🆕 `receivables` - AR & collections

**Supply Chain (6 packages)** 14. ✅ `inventory` - Inventory management 15. 🆕 `warehouse` - WMS operations 16. 🆕 `manufacturing` - Production control 17. 🆕 `quality` - Quality management 18. 🆕 `planning` - Demand & supply planning 19. ✅ `crm` - Customer & pricing

**Human Capital (5 packages)** 20. 🆕 `hr-core` - Employee master data 21. 🆕 `payroll` - Payroll processing 22. 🆕 `time-attendance` - Time tracking 23. 🆕 `benefits` - Benefits administration 24. 🆕 `performance` - Performance management

**Project & Services (1 package)** 25. 🆕 `projects` - Project management

**Compliance (2 packages)** 26. 🆕 `audit` - Audit trail & controls 27. 🆕 `regulatory` - Regulatory reporting

**Analytics (3 packages)** 28. ✅ `advisory` - Predictive analytics 29. 🆕 `reporting` - BI & dashboards 30. 🆕 `budgeting` - (already listed above)

**Platform (4 packages)** 31. ✅ `workflow` - Rules engine 32. ✅ `search` - Full-text search 33. ✅ `migration` - Data migration 34. 🆕 `integration` - APIs & EDI 35. 🆕 `notifications` - Alerts & messaging

### Layer 3: Application (1 package) ✅

- `crud` - Entity orchestration

---

## Total Package Count

- **Current**: 15 packages (4 foundation + 10 domain + 1 application)
- **Proposed**: 40 packages (4 foundation + 35 domain + 1 application)
- **New packages to create**: 25 domain packages

---

## Implementation Priority

### Phase 1: Core Transactional (P2P + O2C)

- `procurement`, `purchasing`, `receiving`, `payables`
- `sales`, `shipping`, `receivables`
- `warehouse`

### Phase 2: Financial Management

- `treasury`, `fixed-assets`, `tax-compliance`, `budgeting`

### Phase 3: Manufacturing & Supply Chain

- `manufacturing`, `quality`, `planning`

### Phase 4: Human Capital

- `hr-core`, `payroll`, `time-attendance`, `benefits`, `performance`

### Phase 5: Services & Analytics

- `projects`, `reporting`, `integration`, `notifications`

### Phase 6: Governance

- `audit`, `regulatory`

---

## Architectural Consistency Checklist

All new packages MUST follow these patterns:

### ✅ Package Structure

```
packages/[domain-name]/
├── package.json          # exports: {"main": "./src/index.ts"}
├── tsconfig.json         # extends afenda-typescript-config/base.json
├── eslint.config.js      # extends @afenda/eslint-config
├── README.md             # Purpose, When to Use, Key Concepts, Examples
└── src/
    ├── index.ts          # Public API exports only
    ├── services/         # Business logic implementations
    └── types.ts          # (optional) Domain-specific types
```

### ✅ Dependencies

- Layer 2 packages depend ONLY on: Layer 1 (foundation) + `logger`
- Exception: Can depend on other Layer 2 packages if justified (document in GOVERNANCE.md)
- Always include: `afenda-canon`, `afenda-database`, `drizzle-orm`(if DB access)
- DevDependencies: `afenda-eslint-config`, `afenda-typescript-config`, `typescript`

### ✅ Exports Pattern

```typescript
// src/index.ts
export {
  functionName1,
  functionName2,
  type TypeName1,
  type TypeName2,
} from './services/service-name.js';
```

### ✅ Service Pattern

```typescript
// src/services/service-name.ts
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export async function serviceName(
  db: NeonHttpDatabase,
  orgId: string,
  params: ParamsType,
): Promise<ResultType> {
  // Implementation
}
```

### ✅ Documentation

Every README must include:

1. **Purpose** - What this package does
2. **When to Use** - Use cases bullet list
3. **Key Concepts** - Domain concepts explained
4. **Dependencies** - Why each dependency
5. **Public API** - TypeScript import example
6. **Usage Examples** - Real code examples
7. **See Also** - Links to ARCHITECTURE.md, GOVERNANCE.md

### ✅ Validation

After creating each package:

```bash
pnpm install
pnpm run validate:deps  # Must pass
pnpm --filter afenda-[package] type-check  # Must pass
```

---

**Last Updated**: February 17, 2026
**Status**: Proposed Architecture
**Approval Required**: Yes (Product Owner, Tech Lead)
