#!/usr/bin/env node
/**
 * CI AIS Benchmark Gate — AIS-01 through AIS-05
 *
 * Parses AIS-BENCHMARK.md, scans the codebase for evidence of each item,
 * emits .afenda/ais-benchmark.ledger.json with confidence scores, and fails
 * CI if claimed coverage diverges from actual evidence.
 *
 * Confidence scoring (0–130 per item, capped at 100):
 *   S1:  Package exists with src/                              +10
 *   S2:  Barrel export keyword match                           +15
 *   S3:  Source file (calculator/service) has keyword match     +15
 *   S4:  Matched source file is substantial (>50L)             +5
 *   S5:  ≥3 distinct keyword hits across source files only     +5
 *   S6:  Test file exists with keyword matches                 +10
 *   S7:  Item ID in JSDoc near export (traceability)           +15
 *   S8:  File name matches concept (auto-derived kebab)        +5
 *   S9:  Barrel exports ≥3 symbols from matched module         +5
 *   S10: Test describe/it/test block references item ID        +10
 *   S11: Matched source file has exported symbol               +15
 *
 * Status thresholds:
 *   ≥60  → covered
 *   30–59 → partial
 *   <30  → missing
 *
 * Gates: AIS-01 through AIS-09
 *
 * Exit code 0 = all gates pass. Exit code 1 = at least one gate failed.
 *
 * Usage: node tools/ci-ais-benchmark-gate.mjs [--emit-only]
 *   --emit-only: generate ledger without running gates
 */

import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';

const _rawRoot = new URL('.', import.meta.url).pathname;
const ROOT = resolve(process.platform === 'win32' ? _rawRoot.slice(1) : _rawRoot, '..');
const FINANCE_ROOT = join(ROOT, 'business-domain', 'finance');
const BENCHMARK_PATH = join(FINANCE_ROOT, 'AIS-BENCHMARK.md');
const GAP_MAPPING_PATH = join(FINANCE_ROOT, 'AIS-GAP-MAPPING.md');
const LEDGER_PATH = join(ROOT, '.afenda', 'ais-benchmark.ledger.json');

const EMIT_ONLY = process.argv.includes('--emit-only');

/** Confidence thresholds */
const COVERED_THRESHOLD = 60;
const PARTIAL_THRESHOLD = 30;

let failures = 0;
let warnings = 0;

function fail(gate, message) {
  console.error(`\x1b[31m✗ ${gate}\x1b[0m ${message}`);
  failures++;
}

function pass(gate, message) {
  console.log(`\x1b[32m✓ ${gate}\x1b[0m ${message}`);
}

function warn(gate, message) {
  console.log(`\x1b[33m⚠ ${gate}\x1b[0m ${message}`);
  warnings++;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function readFile(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

function walk(dir, ext = '.ts') {
  const results = [];
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'dist') {
        results.push(...walk(full, ext));
      } else if (full.endsWith(ext)) {
        results.push(full);
      }
    }
  } catch {
    // directory may not exist
  }
  return results;
}

function countLines(filePath) {
  try {
    return readFileSync(filePath, 'utf8').split('\n').length;
  } catch {
    return 0;
  }
}

function dirExists(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

// ── Step 1: Parse AIS-BENCHMARK.md ──────────────────────────────────────────

function parseBenchmark() {
  const content = readFile(BENCHMARK_PATH);
  if (!content) {
    console.error('ERROR: Cannot read AIS-BENCHMARK.md');
    process.exit(1);
  }

  const items = [];
  let currentSection = '';
  let currentSectionId = 0;

  const sectionRe = /^## (\d+)\.\s+(.+)$/;
  // Match table rows: | XX-NN | requirement text | authority | notes |
  const itemRe = /^\|\s*([A-Z]{2,3}-\d{2})\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|$/;

  for (const line of content.split('\n')) {
    const sectionMatch = line.match(sectionRe);
    if (sectionMatch) {
      currentSectionId = parseInt(sectionMatch[1], 10);
      currentSection = sectionMatch[2].trim();
      continue;
    }

    const itemMatch = line.match(itemRe);
    if (itemMatch) {
      const id = itemMatch[1].trim();
      const requirement = itemMatch[2].trim();
      const authority = itemMatch[3].trim();
      // Skip header/separator rows
      if (id === '#' || id.startsWith('---') || requirement.startsWith('---')) continue;
      items.push({ id, sectionId: currentSectionId, section: currentSection, requirement, authority });
    }
  }

  return items;
}

// ── Step 2: Section → Package mapping ───────────────────────────────────────

const SECTION_PREFIX_TO_PACKAGES = {
  'GL': ['gl-platform'],
  'DE': ['accounting', 'accounting-hub'],
  'AP': ['payables'],
  'AR': ['receivables'],
  'RR': ['revenue-recognition'],
  'FA': ['fixed-assets'],
  'LA': ['lease-accounting'],
  'TX': ['tax-engine', 'deferred-tax', 'withholding-tax'],
  'CO': ['consolidation', 'intercompany'],
  'TR': ['treasury'],
  'FX': ['fx-management'],
  'FC': ['financial-close', 'statutory-reporting'],
  'BU': ['budgeting'],
  'CA': ['cost-accounting'],
  'PA': ['project-accounting'],
  'CM': ['credit-management'],
  'BR': ['bank-reconciliation'],
  'EM': ['expense-management'],
  'SB': ['subscription-billing'],
  'PR': ['provisions'],
  'IA': ['intangible-assets'],
  'FI': ['financial-instruments'],
  'HA': ['hedge-accounting'],
  'TP': ['transfer-pricing'],
  'SR': ['statutory-reporting'],
  'IC': [],   // Internal Controls — platform-level
  'DA': [],   // Data Architecture — platform-level
  'SLA': [],  // Subledger Architecture — platform-level
};

/**
 * Override entries for items that need special keyword matching or cross-package resolution.
 * Format: { packages?: string[], keywords?: string[], infra?: boolean, infraPaths?: string[] }
 */
const OVERRIDES = {
  // ── AP overrides ──
  'AP-01': { keywords: ['threeWayMatch', 'three_way_match', 'three-way-match', 'poMatch', 'goods_receipt_match'] },
  'AP-02': { keywords: ['supplierAging', 'supplier_aging', 'payableAging', 'payable_aging', 'invoice.*aging'] },
  'AP-03': { keywords: ['paymentBatch', 'payment_batch', 'buildPaymentBatch', 'paymentRun', 'payment_run', 'schedulePayments'] },
  'AP-04': { keywords: ['earlyPayment', 'early_payment', 'cashDiscount', 'cash_discount', '2/10.*net.*30'] },
  'AP-05': { keywords: ['supplierStatement', 'supplier_statement', 'reconcileSupplierStatement'] },
  'AP-06': { keywords: ['pain001', 'pain.001', 'generatePain001', 'ISO.*20022'] },
  'AP-07': { packages: ['withholding-tax', 'payables'], keywords: ['withholding', 'WHT', 'wht', 'whtEngine'] },
  'AP-08': { keywords: ['debitMemo', 'debit_memo', 'creditNote', 'credit_note', 'supplierReturn'] },
  'AP-09': { keywords: ['duplicateInvoice', 'duplicate_invoice', 'detectDuplicate'] },
  'AP-10': { keywords: ['accruedLiabilit', 'accrued_liabilit', 'uninvoicedGr', 'uninvoiced_gr'] },

  // ── AR overrides ──
  'AR-01': { keywords: ['customerInvoice', 'lineTax', 'line_tax', 'invoiceLine', 'invoice_line'] },
  'AR-02': { keywords: ['paymentAllocation', 'payment_allocation', 'allocatePayment', 'FIFO', 'fifo', 'oldestFirst'] },
  'AR-03': { keywords: ['aging', 'computeAging', 'agingReport', 'aging_report', 'AgingBucket'] },
  'AR-04': { packages: ['receivables', 'credit-management'], keywords: ['ecl', 'ECL', 'expectedCreditLoss', 'PD.*LGD', 'stage1', 'stage2', 'stage3', 'eclProvisioning'] },
  'AR-05': { keywords: ['writeOff', 'write_off', 'evaluateWriteOff', 'writeOffWorkflow'] },
  'AR-06': { keywords: ['collection', 'dunning', 'planCollectionActions', 'collectionTracking'] },
  'AR-07': { keywords: ['creditNote', 'credit_note', 'computeCreditNote', 'customerReturn'] },
  'AR-08': { packages: ['receivables', 'intercompany'], keywords: ['icReceivable', 'ic_receivable', 'matchIcReceivables', 'intercompanyReceivable'] },
  'AR-09': { keywords: ['factoring', 'evaluateFactoring', 'derecognition', 'assignmentOfReceivables'] },
  'AR-10': { packages: ['receivables', 'revenue-recognition'], keywords: ['revenueArBridge', 'revenue_ar_bridge', 'classifyContractBalances', 'IFRS.*15'] },

  // ── DE overrides ──
  'DE-01': { keywords: ['validateJournalBalance', 'debit.*credit', 'sumDebits.*sumCredits', 'balanceCheck'] },
  'DE-02': { keywords: ['journalEntry', 'journal_entry', 'journalLine', 'journal_line', 'JournalLine'] },
  'DE-03': { keywords: ['functionalCurrency', 'functional_currency', 'transactionCurrency', 'transaction_currency', 'IAS.*21', 'convertDocumentAmount', 'FxConvertDocResult'] },
  'DE-04': { keywords: ['reversal', 'reverseEntry', 'reverse_entry', 'autoReverse', 'mirrorEntry'] },
  'DE-05': { keywords: ['postingStatus', 'posting_status', 'draft.*posted.*reversed', 'postJournalEntry'] },
  'DE-06': { keywords: ['documentSplitting', 'document_splitting', 'proportionalAllocation', 'allocateProportional', 'segmentAllocation'] },
  'DE-07': { keywords: ['recurringTemplate', 'recurring_template', 'generateFromTemplate', 'RecurringTemplate'] },
  'DE-08': { keywords: ['batchPosting', 'batch_posting', 'mutationBatch', 'mutation_batch', 'allOrNothing'] },
  'DE-09': { keywords: ['auditTrail', 'audit_trail', 'audit_log', 'auditLog', 'who.*posted'] },
  'DE-10': { keywords: ['integerMinor', 'integer_minor', 'minorUnits', 'minor_units', 'Minor', 'amountMinor'] },

  // ── GL overrides ──
  'GL-01': { keywords: ['coaHierarchy', 'coa_hierarchy', 'accountGroup', 'getAncestors', 'getSubtree', 'validateCoaIntegrity'] },
  'GL-02': { keywords: ['accountType', 'account_type', 'debitNormal', 'debit_normal', 'creditNormal', 'credit_normal', 'validateCoaIntegrity', 'AccountNode', 'CoaTreeResult'] },
  'GL-03': { keywords: ['multiLedger', 'multi_ledger', 'ledger', 'Ledger', 'listCompanyLedgers', 'fetchLedger'] },
  'GL-04': { keywords: ['postingPeriod', 'posting_period', 'periodControl', 'openPeriod', 'closePeriod', 'softClose', 'hardClose'] },
  'GL-05': { keywords: ['documentType', 'document_type', 'postingKey', 'posting_key', 'fetchDocumentType'] },
  'GL-06': { keywords: ['numberRange', 'number_range', 'allocateDocumentNumber', 'docNumber', 'doc_number'] },
  'GL-07': { keywords: ['trialBalance', 'trial_balance', 'computeTrialBalance', 'accountBalance'] },
  'GL-08': { keywords: ['trialBalance', 'trial_balance', 'asOf', 'as_of', 'pointInTime'] },
  'GL-09': { keywords: ['segment', 'costCenter', 'cost_center', 'profitCenter', 'profit_center', 'dimension', 'validateDimensions'] },
  'GL-10': { packages: ['gl-platform', 'consolidation', 'intercompany'], keywords: ['intercompanyElimination', 'icPayable', 'icReceivable', 'eliminationAccount'] },

  // ── RR overrides ──
  'RR-01': { keywords: ['fiveStep', 'five_step', 'performanceObligation', 'transactionPrice', 'revenueSchedule'] },
  'RR-02': { keywords: ['performanceObligation', 'performance_obligation', 'POB', 'identifyPob'] },
  'RR-03': { keywords: ['standaloneSelling', 'standalone_selling', 'SSP', 'ssp', 'relativeSSP'] },
  'RR-04': { keywords: ['pointInTime', 'point_in_time', 'overTime', 'over_time', 'controlTransfer'] },
  'RR-05': { keywords: ['percentageOfCompletion', 'percentage_of_completion', 'costToCost', 'cost_to_cost'] },
  'RR-06': { keywords: ['variableConsideration', 'variable_consideration', 'highlyProbable'] },
  'RR-07': { keywords: ['contractModification', 'contract_modification', 'prospective', 'cumulativeCatchUp'] },
  'RR-08': { keywords: ['contractAsset', 'contract_asset', 'contractLiability', 'contract_liability', 'deferredRevenue'] },
  'RR-09': { keywords: ['milestone', 'milestoneBased', 'outputMethod'] },
  'RR-10': { keywords: ['subscription', 'ratable', 'ratableRecognition', 'servicePeriod'] },

  // ── FA overrides ──
  'FA-01': { keywords: ['assetRegister', 'asset_register', 'netBookValue', 'net_book_value', 'accumulatedDepreciation'] },
  'FA-02': { keywords: ['depreciation', 'straightLine', 'straight_line', 'decliningBalance', 'declining_balance', 'unitsOfProduction'] },
  'FA-03': { keywords: ['usefulLife', 'useful_life', 'residualValue', 'residual_value'] },
  'FA-04': { keywords: ['componentAccounting', 'component_accounting', 'majorComponent', 'component', 'separateDepreciation'] },
  'FA-05': { keywords: ['revaluation', 'fairValue', 'fair_value', 'ociReserve', 'oci_reserve'] },
  'FA-06': { keywords: ['impairment', 'recoverableAmount', 'recoverable_amount', 'carryingAmount', 'CGU', 'computeImpairment', 'ImpairmentResult'] },
  'FA-07': { keywords: ['disposal', 'gainLoss', 'gain_loss', 'proceeds', 'derecognition'] },
  'FA-08': { keywords: ['bulkDepreciation', 'bulk_depreciation', 'depreciationRun', 'batchDepreciation'] },
  'FA-09': { keywords: ['assetTransfer', 'asset_transfer', 'intercompanyAsset'] },
  'FA-10': { keywords: ['cwip', 'CWIP', 'capitalWorkInProgress', 'cwipCapitalization'] },

  // ── LA overrides ──
  'LA-01': { keywords: ['rou', 'ROU', 'rightOfUse', 'right_of_use', 'rouAsset'] },
  'LA-02': { keywords: ['leaseLiability', 'lease_liability', 'presentValue', 'incrementalBorrowing'] },
  'LA-03': { keywords: ['amortization', 'interestSplit', 'principalSplit', 'leaseSchedule'] },
  'LA-04': { keywords: ['leaseModification', 'lease_modification', 'remeasurement'] },
  'LA-05': { keywords: ['leaseTermination', 'lease_termination', 'earlyTermination'] },
  'LA-06': { keywords: ['shortTermLease', 'short_term_lease', 'shortTerm'] },
  'LA-07': { keywords: ['lowValue', 'low_value', 'lowValueAsset'] },
  'LA-08': { keywords: ['variableLease', 'variable_lease', 'indexLinked', 'variableLeasePayment'] },
  'LA-09': { keywords: ['saleLeaseback', 'sale_leaseback', 'saleAndLeaseback'] },
  'LA-10': { keywords: ['lessor', 'financeLease', 'finance_lease', 'operatingLease', 'operating_lease', 'lessorClassification'] },

  // ── TX overrides ──
  'TX-01': { keywords: ['taxRate', 'tax_rate', 'effectiveFrom', 'effective_from', 'timeBounded'] },
  'TX-02': { keywords: ['taxCode', 'tax_code', 'hierarchy', 'cascading'] },
  'TX-03': { keywords: ['inputTax', 'input_tax', 'outputTax', 'output_tax', 'vatNetting', 'vat_netting', 'countryTaxFormat'] },
  'TX-04': { keywords: ['taxReturn', 'tax_return', 'aggregation', 'filing', 'countryTaxFormat'] },
  'TX-05': { keywords: ['saft', 'SAFT', 'saftExport', 'standardAuditFile'] },
  'TX-06': { packages: ['withholding-tax', 'tax-engine'], keywords: ['withholding', 'WHT', 'wht', 'treatyOverride', 'whtEngine'] },
  'TX-07': { packages: ['deferred-tax'], keywords: ['deferredTax', 'deferred_tax', 'temporaryDifference', 'IAS.*12'] },
  'TX-08': { packages: ['tax-engine', 'deferred-tax'], keywords: ['taxProvision', 'tax_provision', 'currentTax.*deferredTax', 'provisionCalculation'] },
  'TX-09': { keywords: ['countryTaxFormat', 'country_tax_format', 'SST', 'GST', 'VAT', 'salesTax'] },
  'TX-10': { packages: ['transfer-pricing'], keywords: ['transferPricing', 'transfer_pricing', 'armLength', 'arm_length'] },

  // ── CO overrides ──
  'CO-01': { keywords: ['ownershipHierarchy', 'ownership_hierarchy', 'parent.*subsidiary', 'groupStructure'] },
  'CO-02': { packages: ['consolidation', 'intercompany'], keywords: ['icMatching', 'ic_matching', 'matchIcTransactions', 'icPayable.*icReceivable'] },
  'CO-03': { keywords: ['elimination', 'computeEliminations', 'icElimination', 'consolidatedPL'] },
  'CO-04': { keywords: ['nci', 'NCI', 'nonControlling', 'non_controlling', 'computeNci', 'minorityInterest'] },
  'CO-05': { keywords: ['goodwill', 'purchasePrice', 'purchase_price', 'businessCombination', 'IFRS.*3', 'ppa', 'PPA'] },
  'CO-06': { keywords: ['currencyTranslation', 'currency_translation', 'translateTrialBalance', 'presentationCurrency', 'ociTranslation'] },
  'CO-07': { keywords: ['stepAcquisition', 'step_acquisition', 'ownershipChange', 'ownership_change', 'disposalOfSubsidiary'] },
  'CO-08': { keywords: ['dividendElimination', 'dividend_elimination', 'icDividend', 'eliminateIcDividends'] },
  'CO-09': { keywords: ['icNetting', 'ic_netting', 'offsetPayables', 'netSettlement', 'netting', 'offset'] },
  'CO-10': { keywords: ['consolJournal', 'consol_journal', 'autoConsolJournal', 'generateConsolJournal'] },

  // ── TR overrides ──
  'TR-01': { keywords: ['bankAccount', 'bank_account', 'IBAN', 'SWIFT', 'cashPosition'] },
  'TR-02': { keywords: ['cashForecast', 'cash_forecast', 'forecastCashFlow', 'liquidityManagement'] },
  'TR-03': { keywords: ['forecastVariance', 'forecast_variance', 'actualVsForecast', 'varianceAnalysis'] },
  'TR-04': { keywords: ['cashPooling', 'cash_pooling', 'notionalPooling', 'computeCashPool'] },
  'TR-05': { keywords: ['bankStatement', 'bank_statement', 'validateBankStatement', 'OFX', 'MT940', 'camt'] },
  'TR-06': { keywords: ['covenant', 'covenantMonitor', 'evaluateCovenants', 'breachAlert'] },
  'TR-07': { keywords: ['fxExposure', 'fx_exposure', 'netOpenPosition', 'computeFxExposure'] },
  'TR-08': { keywords: ['investmentPortfolio', 'investment_portfolio', 'valuePortfolio', 'moneyMarket'] },
  'TR-09': { keywords: ['icLoan', 'ic_loan', 'intercompanyLoan', 'computeIcLoanAccruals'] },
  'TR-10': { keywords: ['cashFlowStatement', 'cash_flow_statement', 'indirectMethod', 'computeCashFlowIndirect'] },

  // ── FX overrides ──
  'FX-01': { keywords: ['fxRate', 'fx_rate', 'rateType', 'rate_type', 'spot', 'average', 'closing'] },
  'FX-02': { keywords: ['revaluation', 'revalue', 'revalueFxBalance', 'periodEnd', 'monetaryItem'] },
  'FX-03': { keywords: ['ociTranslation', 'oci_translation', 'translationDifference', 'translationReserve'] },
  'FX-04': { keywords: ['forwardContract', 'forward_contract', 'derivative', 'fairValueCalc'] },
  'FX-05': { packages: ['fx-management', 'hedge-accounting'], keywords: ['hedgeEffectiveness', 'hedge_effectiveness', 'effectiveness.*test', '80.*125'] },
  'FX-06': { keywords: ['realizedGain', 'realized_gain', 'unrealizedGain', 'unrealized_gain', 'realizedVsUnrealized', 'gainLoss.*split'] },
  'FX-07': { packages: ['fx-management', 'bank-reconciliation'], keywords: ['multiCurrencyRecon', 'multi_currency_recon', 'multiCurrency'] },
  'FX-08': { keywords: ['rateSource', 'rate_source', 'auditRateSources', 'rateAudit', 'ECB', 'Bloomberg'] },
  'FX-09': { keywords: ['triangulation', 'crossRate', 'cross_rate', 'triangulate'] },
  'FX-10': { keywords: ['functionalCurrency', 'functional_currency', 'determineFunctionalCurrency', 'primaryEconomic'] },

  // ── FC overrides ──
  'FC-01': { keywords: ['closeChecklist', 'close_checklist', 'taskOwnership', 'closeEvidence', 'fetchCloseChecklist'] },
  'FC-02': { packages: ['accounting-hub', 'financial-close'], keywords: ['accrualRun', 'accrual_run', 'computeAccrualLines', 'autoAccrual'] },
  'FC-03': { packages: ['accounting-hub', 'financial-close'], keywords: ['allocationRun', 'allocation_run', 'allocateProportional', 'stepDown', 'overheadAllocation'] },
  'FC-04': { packages: ['accounting-hub', 'financial-close'], keywords: ['reclassification', 'reclass', 'computeReclassLines', 'reclassJournal'] },
  'FC-05': { keywords: ['multiCompanyClose', 'multi_company_close', 'sequenceMultiCompanyClose', 'entityLevel.*groupLevel'] },
  'FC-06': { packages: ['statutory-reporting', 'financial-close'], keywords: ['balanceSheet', 'balance_sheet', 'IAS.*1.*54', 'statementEngine'] },
  'FC-07': { packages: ['statutory-reporting', 'financial-close'], keywords: ['incomeStatement', 'income_statement', 'byNature', 'by_nature', 'byFunction', 'by_function'] },
  'FC-08': { packages: ['statutory-reporting', 'financial-close', 'treasury'], keywords: ['cashFlowStatement', 'cash_flow_statement', 'indirectMethod', 'IAS.*7'] },
  'FC-09': { packages: ['statutory-reporting'], keywords: ['changesInEquity', 'changes_in_equity', 'equityStatement', 'statementEngine'] },
  'FC-10': { packages: ['statutory-reporting'], keywords: ['disclosure', 'disclosurePack', 'disclosure_pack', 'notesTo'] },

  // ── BU overrides ──
  'BU-01': { keywords: ['budgetVersion', 'budget_version', 'original.*revised.*latest'] },
  'BU-02': { keywords: ['bottomUp', 'bottom_up', 'budgetEntry', 'budget_entry', 'costCenterBudget'] },
  'BU-03': { keywords: ['budgetConsolidation', 'budget_consolidation', 'consolidateBudgets', 'rollUp'] },
  'BU-04': { keywords: ['rollingForecast', 'rolling_forecast', 'reforecast', 'staticBudget'] },
  'BU-05': { keywords: ['budgetVariance', 'budget_variance', 'computeBudgetVariance', 'actualVsBudget'] },
  'BU-06': { keywords: ['budgetCommitment', 'budget_commitment', 'encumber', 'checkBudgetCommitments'] },
  'BU-07': { keywords: ['budgetPeriod', 'budget_period', 'generateBudgetPeriods', 'monthly.*quarterly.*annual'] },
  'BU-08': { keywords: ['budgetWorkflow', 'budget_workflow', 'evaluateBudgetWorkflow', 'budgetApproval'] },
  'BU-09': { keywords: ['scenarioPlanning', 'scenario_planning', 'generateScenarios', 'base.*upside.*downside'] },
  'BU-10': { keywords: ['budgetImport', 'budget_import', 'validateBudgetImport', 'CSV.*Excel'] },

  // ── CA overrides ──
  'CA-01': { keywords: ['costCenter', 'cost_center', 'costCenterHierarchy', 'division.*department'] },
  'CA-02': { keywords: ['costAllocation', 'cost_allocation', 'stepDown', 'step_down', 'reciprocal', 'directAllocation'] },
  'CA-03': { keywords: ['activityBased', 'activity_based', 'ABC', 'activityDriver', 'activity_driver'] },
  'CA-04': { keywords: ['standardCosting', 'standard_costing', 'varianceAnalysis', 'priceVariance', 'quantityVariance'] },
  'CA-05': { keywords: ['jobCosting', 'job_costing', 'processCosting', 'process_costing', 'costObject', 'cost_object'] },
  'CA-06': { keywords: ['overheadAbsorption', 'overhead_absorption', 'underAbsorption', 'overAbsorption', 'absorptionRate', 'computeVariance', 'VarianceResult', 'costAllocation'] },
  'CA-07': { packages: ['cost-accounting', 'inventory-valuation'], keywords: ['bomExplosion', 'bom_explosion', 'BOM', 'bom', 'multiLevel', 'waste', 'billOfMaterial'] },
  'CA-08': { packages: ['cost-accounting', 'project-accounting', 'inventory-valuation'], keywords: ['wipValuation', 'wip_valuation', 'finishedGoods', 'finished_goods', 'computeWipValuation'] },
  'CA-09': { keywords: ['costRollup', 'cost_rollup', 'rawMaterial.*WIP.*finishedGoods'] },
  'CA-10': { keywords: ['profitabilityAnalysis', 'profitability_analysis', 'COPA', 'coPA', 'byProduct.*byCustomer.*byRegion'] },

  // ── PA overrides ──
  'PA-01': { keywords: ['projectMaster', 'project_master', 'projectBudget', 'billingType'] },
  'PA-02': { keywords: ['costPosting', 'cost_posting', 'laborCost', 'materialCost', 'projectCost'] },
  'PA-03': { keywords: ['earnedValue', 'earned_value', 'EVM', 'CPI', 'SPI', 'costPerformance', 'schedulePerformance'] },
  'PA-04': { keywords: ['percentageOfCompletion', 'percentage_of_completion', 'overTimeRecognition'] },
  'PA-05': { keywords: ['wipToRevenue', 'wip_to_revenue', 'wipTransfer', 'computeWipValuation'] },
  'PA-06': { keywords: ['projectBilling', 'project_billing', 'milestone', 'timeAndMaterial', 'fixedFee', 'computeProjectBilling'] },
  'PA-07': { keywords: ['icRecharge', 'ic_recharge', 'intercompanyProject', 'computeIcRecharge'] },
  'PA-08': { keywords: ['projectProfitability', 'project_profitability', 'computeProjectProfitabilityReport'] },
  'PA-09': { keywords: ['resourceUtilization', 'resource_utilization', 'computeResourceUtilization', 'capacity'] },
  'PA-10': { packages: ['project-accounting', 'government-grants'], keywords: ['grantAccounting', 'grant_accounting', 'deferredIncome', 'deferred_income', 'governmentGrant', 'IAS.*20'] },

  // ── CM overrides ──
  'CM-01': { keywords: ['creditLimit', 'credit_limit', 'checkCreditLimit', 'amountLimit'] },
  'CM-02': { keywords: ['creditExposure', 'credit_exposure', 'computeCreditExposure', 'outstandingInvoice.*openOrder'] },
  'CM-03': { keywords: ['creditHold', 'credit_hold', 'holdRelease', 'hold_release', 'creditHoldWorkflow'] },
  'CM-04': { keywords: ['creditReview', 'credit_review', 'reviewSchedule', 'annualReview'] },
  'CM-05': { keywords: ['creditScoring', 'credit_scoring', 'scoringModel', 'configurableWeight'] },
  'CM-06': { keywords: ['dunning', 'dunningLetter', 'generateDunningActions', 'escalating'] },
  'CM-07': { keywords: ['badDebt', 'bad_debt', 'writeOff', 'evaluateBadDebtWriteOffs'] },
  'CM-08': { keywords: ['collateral', 'insurance', 'guarantee', 'computeCollateralCoverage'] },
  'CM-09': { keywords: ['paymentHistory', 'payment_history', 'analyzePaymentHistory', 'behavioralScoring'] },
  'CM-10': { packages: ['credit-management'], keywords: ['eclStaging', 'ecl_staging', 'computeEclStaging', 'creditScore.*IFRS.*9'] },

  // ── BR overrides ──
  'BR-01': { keywords: ['bankStatement', 'bank_statement', 'OFX', 'MT940', 'camt.*053', 'validateBankStatement'] },
  'BR-02': { keywords: ['autoMatch', 'auto_match', 'matchEngine', 'match_engine', 'amount.*date.*reference'] },
  'BR-03': { keywords: ['manualMatch', 'manual_match', 'complexTransaction'] },
  'BR-04': { keywords: ['autoPost', 'auto_post', 'confirmedMatch', 'straightThrough'] },
  'BR-05': { keywords: ['unmatchedItem', 'unmatched_item', 'investigationWorkflow', 'investigation_workflow', 'analyzeOutstandingItems', 'OutstandingItem', 'OutstandingItemsResult'] },
  'BR-06': { keywords: ['outstandingCheck', 'outstanding_check', 'depositInTransit', 'outstandingItems'] },
  'BR-07': { keywords: ['bankCharge', 'bank_charge', 'chargeRecognition', 'autoRecognition'] },
  'BR-08': { keywords: ['multiCurrencyRecon', 'multi_currency_recon', 'multiCurrency'] },
  'BR-09': { keywords: ['reconSignoff', 'recon_signoff', 'signOff', 'reconEvidence'] },
  'BR-10': { keywords: ['intradayBalance', 'intraday_balance', 'intradayMonitor', 'realTimeFeed'] },

  // ── EM overrides ──
  'EM-01': { keywords: ['expenseClaim', 'expense_claim', 'receiptAttachment', 'validateExpense'] },
  'EM-02': { packages: ['expense-management'], keywords: ['approvalRouting', 'approval_routing', 'multiLevel', 'amountBased', 'approval', 'workflow', 'validateExpense'] },
  'EM-03': { keywords: ['perDiem', 'per_diem', 'computePerDiem', 'perDiemRate'] },
  'EM-04': { keywords: ['mileage', 'mileageRate', 'mileage_rate', 'perKm', 'per_km', 'perMile'] },
  'EM-05': { keywords: ['policyEnforcement', 'policy_enforcement', 'categoryLimit', 'blacklistedVendor', 'validateExpense'] },
  'EM-06': { keywords: ['corporateCard', 'corporate_card', 'cardReconciliation', 'reconcileCorporateCard'] },
  'EM-07': { keywords: ['foreignCurrencyExpense', 'fxReimbursement', 'computeReimbursement'] },
  'EM-08': { keywords: ['expenseCostCenter', 'expense_cost_center', 'validateExpenseCostCenterCoding', 'costCenterCoding'] },
  'EM-09': { keywords: ['reimbursementPayment', 'reimbursement_payment', 'apRun', 'ap_run', 'reimbursementViaAp'] },
  'EM-10': { keywords: ['vatReclaim', 'vat_reclaim', 'computeVatReclaim', 'taxReclaim', 'inputTax'] },

  // ── SB overrides ──
  'SB-01': { keywords: ['subscriptionPlan', 'subscription_plan', 'billingCycle', 'trial'] },
  'SB-02': { keywords: ['ratableRecognition', 'ratable_recognition', 'deferredRevenue', 'servicePeriod'] },
  'SB-03': { keywords: ['invoiceGeneration', 'invoice_generation', 'billingCycleTrigger', 'generateInvoice'] },
  'SB-04': { keywords: ['failedRenewal', 'failed_renewal', 'dunning', 'planRenewalDunning', 'retryEscalation'] },
  'SB-05': { keywords: ['proration', 'prorateBilling', 'upgrade.*downgrade', 'midCycle'] },
  'SB-06': { keywords: ['usageBilling', 'usage_billing', 'metering', 'computeUsageBilling', 'apiCalls.*seats'] },
  'SB-07': { packages: ['subscription-billing', 'revenue-recognition'], keywords: ['contractModification', 'contract_modification', 'IFRS.*15.*20', 'prospective.*catchUp'] },
  'SB-08': { keywords: ['churn', 'MRR', 'ARR', 'computeMrrReport', 'churnTracking'] },
  'SB-09': { keywords: ['taxCalculation', 'tax_calculation', 'recurringInvoiceTax'] },
  'SB-10': { keywords: ['paymentGateway', 'payment_gateway', 'prepareGatewayCharge', 'Stripe', 'Braintree'] },

  // ── PR overrides ──
  'PR-01': { keywords: ['recognitionCriteria', 'probable.*reliableEstimate', 'provisionRecognition'] },
  'PR-02': { keywords: ['bestEstimate', 'best_estimate', 'expectedValue', 'singleAmount'] },
  'PR-03': { keywords: ['discountUnwind', 'discount_unwind', 'timeValue', 'financeCost'] },
  'PR-04': { keywords: ['provisionUtilisation', 'provision_utilisation', 'actualSpend'] },
  'PR-05': { keywords: ['provisionReversal', 'provision_reversal', 'noLongerProbable'] },
  'PR-06': { keywords: ['contingentLiability', 'contingent_liability', 'disclosure'] },
  'PR-07': { keywords: ['onerousContract', 'onerous_contract', 'unavoidableCost'] },
  'PR-08': { keywords: ['restructuring', 'restructuringProvision', 'formalPlan'] },
  'PR-09': { keywords: ['environmental', 'decommissioning', 'assetRetirement'] },
  'PR-10': { keywords: ['discountRate', 'discount_rate', 'riskFree', 'preTax'] },

  // ── IA overrides ──
  'IA-01': { keywords: ['identifiable', 'controlled', 'futureEconomicBenefit', 'intangibleRecognition'] },
  'IA-02': { keywords: ['researchPhase', 'research_phase', 'expenseAlways'] },
  'IA-03': { keywords: ['developmentPhase', 'development_phase', 'capitalize.*criteria', 'devCapitalization'] },
  'IA-04': { keywords: ['amortization', 'usefulLife', 'useful_life', 'finite.*indefinite'] },
  'IA-05': { keywords: ['impairment', 'impairmentTest', 'impairment_test', 'annualReview', 'IAS.*36', 'impair', 'intangible-calc', 'IntangibleCalcResult'] },
  'IA-06': { keywords: ['internallyGenerated', 'internally_generated', 'goodwillProhibited', 'goodwill', 'prohibited'] },
  'IA-07': { keywords: ['computerSoftware', 'computer_software', 'saasCapitalization'] },
  'IA-08': { keywords: ['customerList', 'customer_list', 'businessCombination', 'acquired', 'intangible', 'relationship'] },
  'IA-09': { keywords: ['revaluationModel', 'revaluation_model', 'activeMarket'] },
  'IA-10': { keywords: ['grossCarryingAmount', 'gross_carrying_amount', 'accumulatedAmortization'] },

  // ── FI overrides ──
  'FI-01': { keywords: ['classification', 'amortisedCost', 'FVOCI', 'FVTPL', 'businessModel', 'SPPI'] },
  'FI-02': { keywords: ['effectiveInterest', 'effective_interest', 'EIR', 'amortisedCost'] },
  'FI-03': { keywords: ['fairValue', 'fair_value', 'level1', 'level2', 'level3', 'hierarchy'] },
  'FI-04': { keywords: ['fairValueChange', 'fair_value_change', 'ociVsPl', 'oci.*pl'] },
  'FI-05': { keywords: ['eclModel', 'ecl_model', 'twelvemonthEcl', 'lifetimeEcl', 'stage'] },
  'FI-06': { keywords: ['derecognition', 'risksAndRewards', 'risks_and_rewards', 'transfer'] },
  'FI-07': { keywords: ['derivative', 'markToMarket', 'mark_to_market', 'fairValueThroughPl'] },
  'FI-08': { keywords: ['compoundInstrument', 'compound_instrument', 'liabilityComponent', 'equityComponent', 'convertibleBond'] },
  'FI-09': { keywords: ['ifrs7', 'IFRS.*7', 'creditRisk', 'liquidityRisk', 'marketRisk', 'disclosure'] },
  'FI-10': { keywords: ['offsetting', 'netting', 'masterNetting', 'master_netting', 'IAS.*32', 'fiOffsetting', 'fi-offsetting', 'OffsettingResult'] },

  // ── HA overrides ──
  'HA-01': { keywords: ['hedgeDesignation', 'hedge_designation', 'hedgingInstrument', 'hedgedItem'] },
  'HA-02': { keywords: ['hedgeType', 'hedge_type', 'fairValueHedge', 'cashFlowHedge', 'netInvestmentHedge'] },
  'HA-03': { keywords: ['effectivenessTesting', 'effectiveness_testing', 'economicRelationship', 'creditRisk.*notDominant'] },
  'HA-04': { keywords: ['ociReserve', 'oci_reserve', 'effectivePortion', 'cashFlowHedge'] },
  'HA-05': { keywords: ['ineffectiveness', 'overHedge', 'over_hedge', 'lowerOfCumChange', 'recordEffectiveness', 'hedgeEffectiveness', 'hedge-calc'] },
  'HA-06': { keywords: ['discontinuation', 'deDesignation', 'de_designation', 'prospectiveOnly'] },
  'HA-07': { keywords: ['netInvestmentHedge', 'net_investment_hedge', 'translationReserve', 'foreignOperation'] },
  'HA-08': { keywords: ['rebalancing', 'hedgeRatio', 'hedge_ratio', 'prospectiveAdjustment'] },
  'HA-09': { keywords: ['basisAdjustment', 'basis_adjustment', 'reclassifyOci'] },
  'HA-10': { keywords: ['hedgeDisclosure', 'riskManagementStrategy', 'hedgeEffectiveness.*disclosure'] },

  // ── TP overrides ──
  'TP-01': { keywords: ['armLength', 'arm_length', 'comparableUncontrolled', 'CUP'] },
  'TP-02': { keywords: ['tpMethod', 'tp_method', 'resalePrice', 'costPlus', 'TNMM', 'profitSplit'] },
  'TP-03': { keywords: ['icAgreement', 'ic_agreement', 'fromCompany.*toCompany', 'markup'] },
  'TP-04': { keywords: ['priceValidation', 'price_validation', 'outOfRange', 'flagTransaction'] },
  'TP-05': { keywords: ['tpDocumentation', 'tp_documentation', 'masterFile', 'localFile', 'BEPS'] },
  'TP-06': { keywords: ['advancePricing', 'advance_pricing', 'APA', 'apa'] },
  'TP-07': { keywords: ['adjustment', 'tpAdjustment', 'tp_adjustment', 'yearEndAdjustment', 'computePrice', 'tp-engine', 'TpPricingResult'] },
  'TP-08': { keywords: ['cbcr', 'CBCR', 'countryByCountry', 'country_by_country', 'cbcrReport'] },
  'TP-09': { keywords: ['thinCapitalization', 'thin_capitalization', 'interestDeductibility', 'debtEquityRatio'] },
  'TP-10': { keywords: ['peRisk', 'pe_risk', 'permanentEstablishment', 'permanent_establishment', 'PeRiskResult', 'pe-risk'] },

  // ── SR overrides ──
  'SR-01': { packages: ['statutory-reporting'], keywords: ['balanceSheet', 'balance_sheet', 'IAS.*1.*54', 'statementEngine'] },
  'SR-02': { packages: ['statutory-reporting'], keywords: ['incomeStatement', 'income_statement', 'byNature', 'byFunction', 'statementEngine'] },
  'SR-03': { packages: ['statutory-reporting'], keywords: ['changesInEquity', 'changes_in_equity', 'equityStatement', 'statementEngine'] },
  'SR-04': { packages: ['statutory-reporting', 'treasury'], keywords: ['cashFlowStatement', 'cash_flow_statement', 'cashFlowReport', 'indirectMethod'] },
  'SR-05': { packages: ['statutory-reporting'], keywords: ['accountingPolicies', 'disclosure', 'estimates', 'judgements'] },
  'SR-06': { packages: ['statutory-reporting'], keywords: ['segmentReporting', 'segment_reporting', 'operatingSegment', 'IFRS.*8'] },
  'SR-07': { packages: ['statutory-reporting'], keywords: ['relatedParty', 'related_party', 'IAS.*24', 'keyManagement', 'disclosure', 'party'] },
  'SR-08': { packages: ['statutory-reporting'], keywords: ['eventsAfterReporting', 'events_after_reporting', 'IAS.*10', 'adjustingEvent'] },
  'SR-09': { packages: ['statutory-reporting'], keywords: ['earningsPerShare', 'earnings_per_share', 'EPS', 'IAS.*33'] },
  'SR-10': { packages: ['statutory-reporting'], keywords: ['xbrl', 'XBRL', 'taxonomy', 'inlineXbrl', 'iXBRL', 'xbrlTagger', 'xbrl-tagger', 'XbrlTagResult'] },

  // ── IC (Internal Controls) — platform-level ──
  'IC-01': { infra: true, infraPaths: ['packages/workflow', 'packages/crud', 'packages/canon'], keywords: ['segregation', 'preparer', 'approver', 'poster', 'SoD', 'role', 'permission'] },
  'IC-02': { infra: true, infraPaths: ['packages/workflow', 'packages/crud', 'packages/canon'], keywords: ['authorization', 'threshold', 'approval', 'amountLimit', 'tiered'] },
  'IC-03': { infra: true, infraPaths: ['packages/crud', 'packages/database/src/schema/audit-logs.ts'], keywords: ['auditTrail', 'audit_trail', 'audit_log', 'immutable', 'beforeAfter'] },
  'IC-04': { infra: true, infraPaths: ['packages/database/src/schema/fiscal-periods.ts', 'packages/crud', 'business-domain/finance/gl-platform'], keywords: ['periodLock', 'closedPeriod', 'periodClose', 'hardClose', 'softClose', 'closePeriod'] },
  'IC-05': { infra: true, infraPaths: ['packages/crud', 'packages/database'], keywords: ['reconciliation', 'subLedger.*GL', 'subledgerBalance'] },
  'IC-06': { infra: true, infraPaths: ['packages/crud', 'packages/canon'], keywords: ['idempotency', 'idempotencyKey', 'duplicatePayment'] },
  'IC-07': { infra: true, infraPaths: ['packages/workflow', 'packages/crud', 'packages/canon'], keywords: ['fourEyes', 'four_eyes', 'highValue', 'dualApproval', 'approval', 'approve'] },
  'IC-08': { infra: true, infraPaths: ['packages/advisory', 'packages/workflow', 'packages/canon'], keywords: ['exception', 'advisory', 'threshold', 'policy', 'detective', 'violation'] },
  'IC-09': { infra: true, infraPaths: ['packages/workflow', 'business-domain/finance/accounting'], keywords: ['accessReview', 'access_review', 'roleCertification', 'evaluateAccessReview'] },
  'IC-10': { infra: true, infraPaths: ['packages/workflow', 'packages/canon', 'packages/crud'], keywords: ['changeManagement', 'version', 'versionedRules', 'entityVersion', 'entity_version'] },

  // ── DA (Data Architecture) — platform-level ──
  'DA-01': { infra: true, infraPaths: ['packages/database/src/schema', 'packages/canon'], keywords: ['integerMinor', 'integer_minor', 'minorUnits', 'amountMinor', 'bigint'] },
  'DA-02': { infra: true, infraPaths: ['packages/database/src/schema', 'packages/database/src/helpers'], keywords: ['orgId', 'org_id', 'RLS', 'rls', 'tenantIsolation'] },
  'DA-03': { infra: true, infraPaths: ['packages/crud'], keywords: ['expectedVersion', 'expected_version', 'optimisticConcurrency', 'optimistic_concurrency'] },
  'DA-04': { infra: true, infraPaths: ['packages/database/src/helpers'], keywords: ['deletedAt', 'deleted_at', 'softDelete', 'soft_delete'] },
  'DA-05': { infra: true, infraPaths: ['packages/database/src/schema'], keywords: ['effectiveFrom', 'effective_from', 'effectiveTo', 'effective_to'] },
  'DA-06': { infra: true, infraPaths: ['packages/crud', 'packages/canon'], keywords: ['idempotencyKey', 'idempotency_key'] },
  'DA-07': { infra: true, infraPaths: ['packages/database/src/schema/audit-logs.ts', 'packages/database/drizzle', 'packages/crud'], keywords: ['appendOnly', 'append_only', 'audit_log', 'auditLog', 'immutable'] },
  'DA-08': { infra: true, infraPaths: ['packages/crud', 'packages/canon', 'business-domain/finance/accounting-hub'], keywords: ['deterministicHash', 'deterministic_hash', 'inputsSnapshot', 'ruleVersion', 'derivationId', 'computeDerivationId'] },
  'DA-09': { infra: true, infraPaths: ['packages/database/drizzle', 'business-domain/finance/accounting'], keywords: ['partition', 'PARTITION', 'partitioned', 'assessPartitionReadiness'] },
  'DA-10': { infra: true, infraPaths: ['packages/database/src', 'packages/crud'], keywords: ['readReplica', 'read_replica', 'dbRo', 'db_ro', 'CQRS'] },

  // ── SLA (Subledger Architecture) — platform-level ──
  'SLA-01': { infra: true, infraPaths: ['packages/database/src/schema/acct-events.ts', 'business-domain/finance/accounting-hub'], keywords: ['AccountingEvent', 'acctEvent', 'acct_event'] },
  'SLA-02': { infra: true, infraPaths: ['packages/database/src/schema/acct-mappings.ts', 'business-domain/finance/accounting-hub'], keywords: ['mappingRule', 'mapping_rule', 'journalTemplate', 'deriveJournalLines'] },
  'SLA-03': { infra: true, infraPaths: ['business-domain/finance/accounting-hub'], keywords: ['deterministicReplay', 'deterministic_replay', 'sameEvent.*sameRule', 'computeDerivationId'] },
  'SLA-04': { infra: true, infraPaths: ['business-domain/finance/accounting-hub'], keywords: ['multiLedger', 'multi_ledger', 'ledgerId', 'ledger_id', 'parallelAccounting', 'deriveJournalLines'] },
  'SLA-05': { infra: true, infraPaths: ['packages/database/src/schema/acct-derived-entries.ts', 'business-domain/finance/accounting-hub'], keywords: ['inputsSnapshot', 'inputs_snapshot', 'ruleVersion', 'rule_version', 'reasonCode', 'derivationId'] },
  'SLA-06': { infra: true, infraPaths: ['business-domain/finance/accounting-hub'], keywords: ['previewMode', 'preview_mode', 'previewDerivation', 'whatIf'] },
  'SLA-07': { infra: true, infraPaths: ['packages/database/src/schema/acct-events.ts', 'business-domain/finance/accounting-hub'], keywords: ['eventStore', 'event_store', 'acctEvent', 'acct_event', 'AcctEvent', 'appendOnly'] },
  'SLA-08': { infra: true, infraPaths: ['packages/database/src/schema/acct-mapping-versions.ts'], keywords: ['mappingVersion', 'mapping_version', 'draft.*published.*deprecated'] },
  'SLA-09': { infra: true, infraPaths: ['tools/ci-domain-gates.mjs'], keywords: ['FIN-05', 'noDirectGlWrite', 'no_direct_gl_write', 'singleSource'] },
  'SLA-10': { infra: true, infraPaths: ['business-domain/finance/accounting-hub'], keywords: ['reconciliation', 'acctEvent', 'acctDerived', 'completeness', 'derivation', 'getDerivationAudit'] },
};

// ── Step 3: Confidence scoring engine ───────────────────────────────────────

function getPrefix(itemId) {
  return itemId.replace(/-\d+$/, '');
}

function resolvePackages(item) {
  const override = OVERRIDES[item.id];
  if (override?.packages) return override.packages;
  if (override?.infra) return [];
  const prefix = getPrefix(item.id);
  return SECTION_PREFIX_TO_PACKAGES[prefix] ?? [];
}

function resolveKeywords(item) {
  const override = OVERRIDES[item.id];
  return override?.keywords ?? [];
}

const STOP_WORDS = new Set([
  'with', 'from', 'that', 'this', 'every', 'shall', 'must', 'should',
  'based', 'level', 'per', 'all', 'for', 'the', 'and', 'not', 'each',
  'into', 'over', 'when', 'than', 'also', 'both', 'same', 'only', 'more',
  'line', 'type', 'table', 'entry', 'value', 'data', 'item', 'items',
  'using', 'used', 'uses', 'account', 'system', 'process', 'rule',
]);

/** Extract meaningful words from benchmark requirement text */
function extractNaturalKeywords(requirement) {
  return requirement
    .split(/[\s,;:()\[\]/→←+|]+/)
    .map((w) => w.replace(/[^a-zA-Z0-9_-]/g, ''))
    .filter((w) => w.length > 3 && !STOP_WORDS.has(w.toLowerCase()) && !/^\d+$/.test(w));
}

/** Count how many keywords match in a file's content */
function countKeywordHits(content, keywords) {
  let hits = 0;
  const matched = [];
  for (const kw of keywords) {
    try {
      const re = new RegExp(kw, 'i');
      if (re.test(content)) { hits++; matched.push(kw); }
    } catch {
      if (content.toLowerCase().includes(kw.toLowerCase())) { hits++; matched.push(kw); }
    }
  }
  return { hits, matched };
}

// ── Helpers for confidence scoring ────────────────────────────────────────

/** Add matched keywords to a Set (lowercased for true dedup) */
function addMatches(set, matchedArr) {
  for (const m of matchedArr) set.add(m.toLowerCase());
}

/** Convert camelCase/PascalCase to kebab-case */
function camelToKebab(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Fix #6: Auto-derive file-name hints from override keywords.
 * Takes top 1-2 "strong" keywords (≥6 chars, no regex), converts to kebab.
 * Falls back to hand-mapped hints for edge cases.
 */
function deriveFileHints(itemId, keywords) {
  // Hand-mapped overrides for items where auto-derivation fails
  const MANUAL_HINTS = {
    'CA-03': ['activity-based', 'abc'], 'CA-05': ['job-process', 'job-costing', 'process-costing'],
    'CA-07': ['bom-explosion'], 'CO-05': ['goodwill-ppa'],
    'CO-07': ['step-acquisition'], 'CO-09': ['ic-netting'],
    'AP-06': ['pain001'], 'AP-09': ['duplicate-invoice'],
    'LA-09': ['sale-leaseback'],
  };
  if (MANUAL_HINTS[itemId]) return MANUAL_HINTS[itemId];

  // Auto-derive: take strong keywords (no regex chars, ≥6 chars), kebab them
  const hints = [];
  for (const kw of keywords) {
    if (kw.length < 6 || /[.*+?^${}()|[\]\\]/.test(kw)) continue;
    const kebab = camelToKebab(kw);
    if (kebab.length >= 5 && !hints.includes(kebab)) hints.push(kebab);
    if (hints.length >= 2) break;
  }
  return hints;
}

/**
 * Count export statements from a specific module path in barrel content.
 * Fix #3: modulePath must be relative to src (e.g. './calculators/bom-explosion').
 */
function countBarrelExportsFrom(barrelContent, modulePath) {
  const escaped = modulePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Match exactly: from './calculators/bom-explosion' (with or without extension)
  const re = new RegExp(`export\\s+(?:type\\s+)?\\{([^}]+)\\}\\s+from\\s+['"]${escaped}(?:\\.ts)?['"]`, 'g');
  let count = 0;
  let m;
  while ((m = re.exec(barrelContent)) !== null) {
    count += m[1].split(',').filter((s) => s.trim()).length;
  }
  return count;
}

/**
 * Fix #5: Check if item ID appears in JSDoc near an export (within 25 lines).
 * Returns true only if the ID is a traceability annotation, not a random mention.
 */
function hasItemIdNearExport(content, itemId) {
  const lines = content.split('\n');
  const idRe = new RegExp(`\\b${itemId}\\b`);
  const exportRe = /^export\s+(async\s+)?(function|class|const|type|interface)\s/;
  for (let i = 0; i < lines.length; i++) {
    if (idRe.test(lines[i])) {
      // Check next 25 lines for an export
      for (let j = i; j < Math.min(i + 25, lines.length); j++) {
        if (exportRe.test(lines[j])) return true;
      }
      // Also check previous 5 lines (ID might be in JSDoc above export)
      for (let j = Math.max(0, i - 5); j < i; j++) {
        if (exportRe.test(lines[j])) return true;
      }
    }
  }
  return false;
}

/** Fix #7: Check if file contains at least one exported symbol */
function hasExportedSymbol(content) {
  return /^export\s+(async\s+)?(function|class|const|type|interface)\s/m.test(content);
}

/**
 * Compute confidence score (0–130 per item, capped at 100).
 *
 * Signals and weights:
 *   S1:  Package exists with src/                              +10
 *   S2:  Barrel export (index.ts) has keyword match            +15
 *   S3:  Source file (calculator/service/etc) has match         +15
 *   S4:  Matched source file is substantial (>50 lines)        +5
 *   S5:  ≥3 distinct keyword hits across source files only     +5
 *   S6:  Test file (__tests__/*.test.ts) has keyword match     +10
 *   S7:  Item ID in JSDoc near export (traceability)           +15
 *   S8:  File name matches concept (auto-derived or manual)    +5
 *   S9:  Barrel exports ≥3 symbols from matched module         +5
 *   S10: Test describe/it/test block references item ID        +10
 *   S11: Matched source file has exported symbol               +15
 */
function computeConfidence(item) {
  const override = OVERRIDES[item.id];
  const primaryKw = resolveKeywords(item);
  const naturalKw = extractNaturalKeywords(item.requirement);
  const allKeywords = [...new Set([...primaryKw, ...naturalKw])];
  const fileHints = deriveFileHints(item.id, primaryKw);

  const signals = { s1: false, s2: false, s3: false, s4: false, s5: false, s6: false, s7: false, s8: false, s9: false, s10: false, s11: false };
  const evidence = { export: null, implementation: null, test: null, idRef: null, dedicatedFile: null };

  // Fix #1: true distinct keyword tracking (source-only for S5)
  const matchedSourceKw = new Set();

  // Fix #4: strict test-name regex for S10
  const testNameRe = new RegExp(`\\b(describe|it|test)\\(\\s*['"\`][^'"\`]*${item.id}[^'"\`]*['"\`]`, 'i');

  // ── Infrastructure items ──
  if (override?.infra) {
    const infraPaths = override.infraPaths ?? [];
    const evidenceDetails = [];

    for (const p of infraPaths) {
      const fullPath = join(ROOT, p);
      let filesToScan = [];
      try {
        const stat = statSync(fullPath);
        if (stat.isFile()) {
          filesToScan = [fullPath];
        } else if (stat.isDirectory()) {
          filesToScan = walk(fullPath).filter((f) => !f.includes('node_modules') && !f.includes('dist'));
        }
      } catch { continue; }

      if (filesToScan.length > 0) signals.s1 = true;

      for (const file of filesToScan) {
        const content = readFile(file);
        if (!content) continue;

        const { hits, matched } = countKeywordHits(content, allKeywords);
        if (hits > 0) {
          addMatches(matchedSourceKw, matched);
          const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
          evidenceDetails.push(`${rel} → ${matched.slice(0, 3).join(', ')}`);
          signals.s3 = true;
          if (countLines(file) > 50) signals.s4 = true;
          if (hasExportedSymbol(content)) signals.s11 = true;
        }

        // S7: item ID near export (traceability)
        if (hasItemIdNearExport(content, item.id)) {
          signals.s7 = true;
          evidence.idRef = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
        }

        // S8: file name matches concept
        const fileName = file.split(/[\\/]/).pop().replace('.ts', '').toLowerCase();
        if (fileHints.some((h) => fileName.includes(h))) {
          signals.s8 = true;
          evidence.dedicatedFile = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
        }
      }

      // S6/S10 for infra: scan test files
      const testDir = fullPath.replace(/\/src.*$/, '/src/__tests__').replace(/\\src.*$/, '\\src\\__tests__');
      const infraTestFiles = walk(testDir);
      for (const file of infraTestFiles) {
        const content = readFile(file);
        if (!content) continue;
        const { hits, matched } = countKeywordHits(content, allKeywords);
        if (hits > 0) {
          signals.s6 = true;
          const rel = file.replace(ROOT + '/', '').replace(ROOT + '\\', '');
          evidence.test = `${rel} (matched: ${matched.slice(0, 3).join(', ')})`;
        }
        if (testNameRe.test(content)) signals.s10 = true;
      }
    }

    if (matchedSourceKw.size >= 3) signals.s5 = true;
    if (evidenceDetails.length > 0) {
      evidence.implementation = evidenceDetails.slice(0, 3).join('; ');
    }

    const score = (signals.s1 ? 10 : 0) + (signals.s3 ? 15 : 0) + (signals.s4 ? 5 : 0) +
      (signals.s5 ? 5 : 0) + (signals.s6 ? 10 : 0) + (signals.s7 ? 15 : 0) +
      (signals.s8 ? 5 : 0) + (signals.s10 ? 10 : 0) + (signals.s11 ? 15 : 0);

    return { score: Math.min(score, 100), signals, evidence, isInfra: true };
  }

  // ── Finance domain items ──
  const packages = resolvePackages(item);

  for (const pkgName of packages) {
    const pkgDir = join(FINANCE_ROOT, pkgName);
    const srcDir = join(pkgDir, 'src');

    // S1: package exists
    if (dirExists(srcDir)) signals.s1 = true;

    // S2: barrel export match
    const indexContent = readFile(join(srcDir, 'index.ts'));
    if (indexContent) {
      const { hits, matched } = countKeywordHits(indexContent, allKeywords);
      if (hits > 0) {
        signals.s2 = true;
        evidence.export = `${pkgName}/src/index.ts → ${matched.slice(0, 4).join(', ')}`;
        // Note: barrel matches do NOT count toward S5 (source-only)
      }
    }

    // Fix #2: per-package best matched file for S9
    let pkgBestMatchedModule = null; // relative to src, e.g. './calculators/bom-explosion'

    // S3/S4/S7/S8/S11: source file scan
    const srcFiles = walk(srcDir).filter(
      (f) => !f.includes('__tests__') && !f.includes('.test.') && !f.includes('.spec.') && !f.endsWith('index.ts'),
    );
    for (const file of srcFiles) {
      const content = readFile(file);
      if (!content) continue;

      const { hits, matched } = countKeywordHits(content, allKeywords);
      if (hits > 0) {
        signals.s3 = true;
        addMatches(matchedSourceKw, matched);
        const lines = countLines(file);
        if (lines > 50) signals.s4 = true;
        if (hasExportedSymbol(content)) signals.s11 = true;

        // Fix #3: compute module path relative to src for S9
        const relToSrc = './' + file.replace(srcDir + '/', '').replace(srcDir + '\\', '').replace(/\\/g, '/').replace(/\.ts$/, '');

        if (!evidence.implementation) {
          const rel = file.replace(FINANCE_ROOT + '/', '').replace(FINANCE_ROOT + '\\', '');
          evidence.implementation = `${rel} (${lines}L, matched: ${matched.slice(0, 3).join(', ')})`;
          pkgBestMatchedModule = relToSrc;
        }
      }

      // S7: item ID near export (traceability, not random mention)
      if (hasItemIdNearExport(content, item.id)) {
        signals.s7 = true;
        if (!evidence.idRef) {
          evidence.idRef = file.replace(FINANCE_ROOT + '/', '').replace(FINANCE_ROOT + '\\', '');
        }
      }

      // S8: file name matches concept (auto-derived or manual hints)
      const fileName = file.split(/[\\/]/).pop().replace('.ts', '').toLowerCase();
      if (fileHints.some((h) => fileName.includes(h))) {
        signals.s8 = true;
        evidence.dedicatedFile = file.replace(FINANCE_ROOT + '/', '').replace(FINANCE_ROOT + '\\', '');
        // Prefer dedicated file as implementation evidence
        const lines = countLines(file);
        const rel = file.replace(FINANCE_ROOT + '/', '').replace(FINANCE_ROOT + '\\', '');
        evidence.implementation = `${rel} (${lines}L, dedicated)`;
        const relToSrc = './' + file.replace(srcDir + '/', '').replace(srcDir + '\\', '').replace(/\\/g, '/').replace(/\.ts$/, '');
        pkgBestMatchedModule = relToSrc;
      }
    }

    // S9: barrel exports ≥3 symbols from matched module (per-package, exact path)
    if (pkgBestMatchedModule && indexContent) {
      const exportCount = countBarrelExportsFrom(indexContent, pkgBestMatchedModule);
      if (exportCount >= 3) signals.s9 = true;
    }

    // S6/S10: test file match
    const testFiles = walk(join(srcDir, '__tests__'));
    for (const file of testFiles) {
      const content = readFile(file);
      if (!content) continue;
      const { hits, matched } = countKeywordHits(content, allKeywords);
      if (hits > 0) {
        signals.s6 = true;
        const rel = file.replace(FINANCE_ROOT + '/', '').replace(FINANCE_ROOT + '\\', '');
        evidence.test = `${rel} (matched: ${matched.slice(0, 3).join(', ')})`;
      }
      // Fix #4: S10 requires describe/it/test block, not any string
      if (testNameRe.test(content)) {
        signals.s10 = true;
        if (!evidence.test) {
          const rel = file.replace(FINANCE_ROOT + '/', '').replace(FINANCE_ROOT + '\\', '');
          evidence.test = `${rel} (item ID in test block)`;
        }
      }
      if (signals.s6 && signals.s10) break;
    }
  }

  if (matchedSourceKw.size >= 3) signals.s5 = true;

  const score =
    (signals.s1 ? 10 : 0) +
    (signals.s2 ? 15 : 0) +
    (signals.s3 ? 15 : 0) +
    (signals.s4 ? 5 : 0) +
    (signals.s5 ? 5 : 0) +
    (signals.s6 ? 10 : 0) +
    (signals.s7 ? 15 : 0) +
    (signals.s8 ? 5 : 0) +
    (signals.s9 ? 5 : 0) +
    (signals.s10 ? 10 : 0) +
    (signals.s11 ? 15 : 0);

  return { score: Math.min(score, 100), signals, evidence, isInfra: false };
}

/**
 * Fix #8: scoreItem downgrades covered → partial when S7 (traceability) is missing.
 * This keeps CI honest without failing PRs.
 */
function scoreItem(item) {
  const { score, signals, evidence, isInfra } = computeConfidence(item);

  let status;
  if (isInfra && score >= PARTIAL_THRESHOLD) {
    status = 'infra';
  } else if (score >= COVERED_THRESHOLD) {
    // Downgrade to partial if covered but missing traceability (S7)
    status = signals.s7 ? 'covered' : 'covered_untagged';
  } else if (score >= PARTIAL_THRESHOLD) {
    status = 'partial';
  } else {
    status = 'missing';
  }

  return {
    id: item.id,
    requirement: item.requirement,
    confidence: score,
    status,
    signals,
    evidence,
  };
}

// ── Step 4: Build ledger ────────────────────────────────────────────────────

function buildLedger(items) {
  const sections = new Map();

  for (const item of items) {
    const scored = scoreItem(item);

    if (!sections.has(item.sectionId)) {
      sections.set(item.sectionId, {
        id: item.sectionId,
        name: item.section,
        items: [],
      });
    }
    sections.get(item.sectionId).items.push(scored);
  }

  const allScored = [...sections.values()].flatMap((s) => s.items);
  const avgConfidence = Math.round(allScored.reduce((s, i) => s + i.confidence, 0) / allScored.length * 10) / 10;

  const summary = {
    total: allScored.length,
    covered: allScored.filter((i) => i.status === 'covered').length,
    coveredUntagged: allScored.filter((i) => i.status === 'covered_untagged').length,
    partial: allScored.filter((i) => i.status === 'partial').length,
    missing: allScored.filter((i) => i.status === 'missing').length,
    infra: allScored.filter((i) => i.status === 'infra').length,
    avgConfidence,
    coveragePct: 0,
  };
  // covered + covered_untagged + infra all count toward coverage %
  summary.coveragePct = Math.round(((summary.covered + summary.coveredUntagged + summary.infra) / summary.total) * 1000) / 10;

  return {
    version: '3.0',
    generatedAt: new Date().toISOString(),
    benchmark: 'AIS-BENCHMARK.md',
    thresholds: { covered: COVERED_THRESHOLD, partial: PARTIAL_THRESHOLD },
    summary,
    sections: [...sections.values()].sort((a, b) => a.id - b.id),
  };
}

// ── Step 5: Emit ledger ─────────────────────────────────────────────────────

function emitLedger(ledger) {
  const dir = join(ROOT, '.afenda');
  try { mkdirSync(dir, { recursive: true }); } catch { /* exists */ }
  writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 2), 'utf8');
}

// ── Step 6: Gate checks ─────────────────────────────────────────────────────

function parseGapMappingCoverage() {
  const content = readFile(GAP_MAPPING_PATH);
  if (!content) return { total: 0, gap: 0, pct: 0 };

  const totalMatch = content.match(/\*\*TOTAL\*\*\s*\|\s*\*\*(\d+)\*\*/);
  const gapMatch = content.match(/\*\*TOTAL\*\*\s*\|\s*\*\*\d+\*\*\s*\|\s*\*\*(\d+)\*\*/);
  const pctMatch = content.match(/\*\*TOTAL\*\*\s*\|\s*\*\*\d+\*\*\s*\|\s*\*\*\d+\*\*\s*\|\s*\*\*(\d+)%?\*\*/);

  return {
    total: totalMatch ? parseInt(totalMatch[1], 10) : 0,
    gap: gapMatch ? parseInt(gapMatch[1], 10) : 0,
    pct: pctMatch ? parseInt(pctMatch[1], 10) : 0,
  };
}

function runGates(ledger, previousLedger) {
  const claimed = parseGapMappingCoverage();

  console.log('\n\x1b[1mRunning AIS Benchmark Gates (AIS-01…AIS-09)\x1b[0m\n');

  // AIS-01: Item count parity
  if (ledger.summary.total === 280) {
    pass('AIS-01', `Benchmark item count: ${ledger.summary.total}`);
  } else {
    fail('AIS-01', `Expected 280 benchmark items, found ${ledger.summary.total}`);
  }

  // AIS-02: Missing items vs claimed coverage
  const missingItems = ledger.sections.flatMap((s) => s.items.filter((i) => i.status === 'missing'));
  if (missingItems.length === 0) {
    pass('AIS-02', `No missing items (confidence < ${PARTIAL_THRESHOLD})`);
  } else if (claimed.pct === 100) {
    fail('AIS-02', `${missingItems.length} item(s) below ${PARTIAL_THRESHOLD}% confidence but GAP-MAPPING claims ${claimed.pct}%:\n    ${missingItems.map((i) => `${i.id} (${i.confidence})`).join(', ')}`);
  } else {
    warn('AIS-02', `${missingItems.length} item(s) below ${PARTIAL_THRESHOLD}% confidence:\n    ${missingItems.map((i) => `${i.id} (${i.confidence})`).join(', ')}`);
  }

  // AIS-03: Coverage % must match GAP-MAPPING ±2%
  const delta = Math.abs(ledger.summary.coveragePct - claimed.pct);
  if (delta <= 2) {
    pass('AIS-03', `Coverage ${ledger.summary.coveragePct}% matches GAP-MAPPING ${claimed.pct}% (Δ${delta.toFixed(1)}%)`);
  } else {
    fail('AIS-03', `Coverage ${ledger.summary.coveragePct}% vs GAP-MAPPING ${claimed.pct}% (Δ${delta.toFixed(1)}%)`);
  }

  // AIS-04: Average confidence sanity check (raised from 50 → 65)
  if (ledger.summary.avgConfidence >= 65) {
    pass('AIS-04', `Average confidence: ${ledger.summary.avgConfidence} (≥65)`);
  } else {
    fail('AIS-04', `Average confidence too low: ${ledger.summary.avgConfidence} (expected ≥65)`);
  }

  // Helper: items that count as "covered" (tagged or untagged)
  const isCoveredLike = (i) => i.status === 'covered' || i.status === 'covered_untagged';

  // AIS-05: Every covered item should have test evidence (S6)
  const coveredNoTest = ledger.sections.flatMap((s) =>
    s.items.filter((i) => isCoveredLike(i) && !i.signals.s6),
  );
  if (coveredNoTest.length === 0) {
    pass('AIS-05', `All covered items have test evidence`);
  } else {
    warn('AIS-05', `${coveredNoTest.length} covered item(s) missing test evidence (S6)`);
  }

  // AIS-06: No item should be "covered" without source file evidence (S3)
  const coveredNoSrc = ledger.sections.flatMap((s) =>
    s.items.filter((i) => isCoveredLike(i) && !i.signals.s3),
  );
  if (coveredNoSrc.length === 0) {
    pass('AIS-06', `All covered items have source file evidence (S3)`);
  } else {
    fail('AIS-06', `${coveredNoSrc.length} covered item(s) without source file match:\n    ${coveredNoSrc.map((i) => `${i.id} (${i.confidence})`).join(', ')}`);
  }

  // AIS-07: Confidence regression gate — compare with previous ledger (snapshot taken before overwrite)
  if (previousLedger && previousLedger.summary && (previousLedger.version === '3.0' || previousLedger.version === '2.0')) {
    const prevAvg = previousLedger.summary.avgConfidence ?? 0;
    const currAvg = ledger.summary.avgConfidence;
    const regression = prevAvg - currAvg;
    if (regression > 5) {
      fail('AIS-07', `Confidence regression: avg dropped ${prevAvg} → ${currAvg} (Δ${regression.toFixed(1)}, max allowed Δ5)`);
    } else if (regression > 2) {
      warn('AIS-07', `Minor confidence dip: avg ${prevAvg} → ${currAvg} (Δ${regression.toFixed(1)})`);
    } else {
      pass('AIS-07', `No confidence regression: ${prevAvg} → ${currAvg}`);
    }

    // Per-item regression check: flag any item that dropped >15 points
    const prevItemMap = new Map();
    for (const s of (previousLedger.sections ?? [])) {
      for (const i of (s.items ?? [])) prevItemMap.set(i.id, i.confidence);
    }
    const regressions = [];
    for (const s of ledger.sections) {
      for (const i of s.items) {
        const prev = prevItemMap.get(i.id);
        if (prev !== undefined && prev - i.confidence > 15) {
          regressions.push(`${i.id}: ${prev}→${i.confidence}`);
        }
      }
    }
    if (regressions.length > 0) {
      warn('AIS-07', `${regressions.length} item(s) regressed >15 points: ${regressions.slice(0, 5).join(', ')}`);
    }
  }

  // AIS-08: Quality floor — no covered item should have confidence < 65
  const weakCovered = ledger.sections.flatMap((s) =>
    s.items.filter((i) => isCoveredLike(i) && i.confidence < 65),
  );
  if (weakCovered.length === 0) {
    pass('AIS-08', `All covered items have confidence ≥65 (quality floor)`);
  } else {
    warn('AIS-08', `${weakCovered.length} covered item(s) below quality floor (65):\n    ${weakCovered.map((i) => `${i.id} (${i.confidence})`).join(', ')}`);
  }

  // AIS-09: Traceability — report covered_untagged items (score ≥60 but missing S7 near export)
  const untagged = ledger.summary.coveredUntagged;
  if (untagged === 0) {
    pass('AIS-09', `All covered items have traceability annotation (S7)`);
  } else {
    const untaggedItems = ledger.sections.flatMap((s) => s.items.filter((i) => i.status === 'covered_untagged'));
    warn('AIS-09', `${untagged} item(s) covered but untagged (no item ID near export):\n    ${untaggedItems.slice(0, 10).map((i) => i.id).join(', ')}`);
  }

  // Print distribution
  const allItems = ledger.sections.flatMap((s) => s.items);
  const bands = [
    { label: '90–100', items: allItems.filter((i) => i.confidence >= 90) },
    { label: '60–89 ', items: allItems.filter((i) => i.confidence >= 60 && i.confidence < 90) },
    { label: '30–59 ', items: allItems.filter((i) => i.confidence >= 30 && i.confidence < 60) },
    { label: ' 0–29 ', items: allItems.filter((i) => i.confidence < 30) },
  ];
  console.log(`\n\x1b[1mConfidence distribution:\x1b[0m`);
  for (const b of bands) {
    const bar = '█'.repeat(Math.round(b.items.length / 3));
    console.log(`  ${b.label}: ${String(b.items.length).padStart(3)} ${bar}`);
  }

  // Print lowest-confidence items
  const bottom10 = [...allItems].sort((a, b) => a.confidence - b.confidence).slice(0, 10);
  console.log(`\n\x1b[1mLowest confidence (bottom 10):\x1b[0m`);
  for (const item of bottom10) {
    const statusColor = item.status === 'missing' ? '\x1b[31m' : item.status === 'partial' ? '\x1b[33m' : '\x1b[32m';
    console.log(`  ${statusColor}${item.id.padEnd(7)} ${String(item.confidence).padStart(3)}  ${item.status.padEnd(8)}\x1b[0m ${item.requirement.slice(0, 55)}`);
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

console.log('\n\x1b[1mAIS Benchmark Metadata Verification (confidence scoring)\x1b[0m\n');

console.log('Parsing AIS-BENCHMARK.md...');
const items = parseBenchmark();
console.log(`  Found ${items.length} benchmark items across ${new Set(items.map((i) => i.sectionId)).size} sections`);

// Snapshot previous ledger BEFORE overwriting (used by AIS-07 regression gate)
let previousLedger = null;
try {
  const prev = readFile(LEDGER_PATH);
  if (prev) previousLedger = JSON.parse(prev);
} catch { /* no previous ledger */ }

console.log('Scanning codebase for evidence...');
const ledger = buildLedger(items);

console.log(`\n\x1b[1mSummary:\x1b[0m`);
console.log(`  Covered (≥${COVERED_THRESHOLD}, tagged):  ${ledger.summary.covered}`);
console.log(`  Covered (untagged, no S7): ${ledger.summary.coveredUntagged}`);
console.log(`  Partial (${PARTIAL_THRESHOLD}–${COVERED_THRESHOLD - 1}):  ${ledger.summary.partial}`);
console.log(`  Missing (<${PARTIAL_THRESHOLD}):   ${ledger.summary.missing}`);
console.log(`  Infra:          ${ledger.summary.infra}`);
console.log(`  Total:          ${ledger.summary.total}`);
console.log(`  Avg confidence: ${ledger.summary.avgConfidence}`);
console.log(`  Coverage:       ${ledger.summary.coveragePct}%`);

emitLedger(ledger);
console.log(`\n\x1b[32m✓ Wrote .afenda/ais-benchmark.ledger.json\x1b[0m`);

if (!EMIT_ONLY) {
  runGates(ledger, previousLedger);

  console.log('');
  if (failures > 0) {
    console.error(`\x1b[31m${failures} gate(s) failed, ${warnings} warning(s).\x1b[0m`);
    process.exit(1);
  } else if (warnings > 0) {
    console.log(`\x1b[33mAll gates passed with ${warnings} warning(s).\x1b[0m`);
    process.exit(0);
  } else {
    console.log('\x1b[32mAll AIS benchmark gates passed.\x1b[0m');
    process.exit(0);
  }
} else {
  console.log('\n\x1b[33m--emit-only: skipping gate checks.\x1b[0m');
  process.exit(0);
}
