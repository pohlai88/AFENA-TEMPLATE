/**
 * Transfer Pricing Management Service
 * Handles intercompany pricing, arm's length compliance, documentation, and TP studies
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface IntercompanyTransaction {
  transactionId: string;
  sellingEntityId: string;
  buyingEntityId: string;
  transactionType: 'GOODS' | 'SERVICES' | 'INTANGIBLES' | 'FINANCING' | 'MANAGEMENT_FEES';
  transactionDate: Date;
  amount: number;
  currency: string;
  pricingMethod: 'CUP' | 'RESALE_PRICE' | 'COST_PLUS' | 'TNMM' | 'PROFIT_SPLIT';
  transferPrice: number;
  armLengthPrice?: number;
  documentationStatus: 'PENDING' | 'DOCUMENTED' | 'REVIEWED' | 'APPROVED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface TransferPricing Policy {
  policyId: string;
  entityPair: { sellerEntityId: string buyerEntityId: string };
  productCategory: string;
  pricingMethod: IntercompanyTransaction['pricingMethod'];
  markup: number; // percentage
  validFrom: Date;
  validTo?: Date;
  status: 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'SUPERSEDED';
  approvedBy?: string;
  approvalDate?: Date;
  benchmarkStudy?: string;
}

export interface BenchmarkStudy {
  studyId: string;
  productCategory: string;
  studyDate: Date;
  validUntil: Date;
  methodology: 'DATABASE' | 'INTERNAL' | 'EXTERNAL';
  comparables: ComparableCompany[];
  armsLengthRange: { min: number; max: number; median: number; quartile: 'LOWER' | 'MEDIAN' | 'UPPER' };
  status: 'DRAFT' | 'FINAL' | 'EXPIRED';
}

export interface ComparableCompany {
  companyId: string;
  companyName: string;
  industry: string;
  geography: string;
  revenue: number;
  profitMargin: number;
  reliabilityScore: number; // 0-100
  adjustments: Array<{ type: string; value: number }>;
}

export interface TPDocumentation {
  documentationId: string;
  transactionId: string;
  documentType: 'MASTER_FILE' | 'LOCAL_FILE' | 'COUNTRY_BY_COUNTRY' | 'FUNCTIONAL_ANALYSIS' | 
                  'ECONOMIC_ANALYSIS' | 'BENCHMARK_STUDY';
  preparedBy: string;
  preparedDate: Date;
  reviewedBy?: string;
  reviewDate?: Date;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'ARCHIVED';
  attachmentUrl?: string;
  expiryDate?: Date;
}

export interface ArmLengthTest {
  testId: string;
  transactionId: string;
  testDate: Date;
  transferPrice: number;
  armsLengthRange: { min: number; max: number; median: number };
  result: 'WITHIN_RANGE' | 'BELOW_RANGE' | 'ABOVE_RANGE';
  adjustmentRequired: boolean;
  adjustmentAmount?: number;
  justification?: string;
}

export interface CountryByCountryReport {
  reportId: string;
  reportingPeriod: { year: number };
  mneFroup: string;
  jurisdictions: CBCJurisdiction[];
  totalRevenue: number;
  totalProfitLoss: number;
  totalTaxPaid: number;
  effectiveTaxRate: number;
  filingDeadline: Date;
  status: 'DRAFT' | 'FILED' | 'ACCEPTED';
}

export interface CBCJurisdiction {
  jurisdiction: string;
  entities: string[];
  revenues: {
    related: number;
    unrelated: number;
    total: number;
  };
  profitLoss: number;
  taxPaid: number;
  taxAccrued: number;
  employees: number;
  tangibleAssets: number;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function recordIntercompanyTransaction(
  transaction: Omit<IntercompanyTransaction, 'transactionId'>
): Promise<IntercompanyTransaction> {
  // TODO: Implement with Drizzle ORM
  // const transactionId = generateICTransactionId();
  // return await db.insert(icTransactions).values({ ...transaction, transactionId }).returning();
  throw new Error('Not implemented');
}

export async function createTPPolicy(
  policy: Omit<TransferPricingPolicy, 'policyId'>
): Promise<TransferPricingPolicy> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function createBenchmarkStudy(
  study: Omit<BenchmarkStudy, 'studyId'>
): Promise<BenchmarkStudy> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function performArmLengthTest(
  test: Omit<ArmLengthTest, 'testId'>
): Promise<ArmLengthTest> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function createCBCReport(
  report: Omit<CountryByCountryReport, 'reportId'>
): Promise<CountryByCountryReport> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getApplicablePolicy(
  sellerEntityId: string,
  buyerEntityId: string,
  productCategory: string
): Promise<TransferPricingPolicy | null> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateICTransactionId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `IC-${dateStr}-${sequence}`;
}

export function calculateTransferPrice(
  costBase: number,
  pricingMethod: IntercompanyTransaction['pricingMethod'],
  markup: number,
  benchmarkRange?: { min: number; max: number; median: number }
): {
  transferPrice: number;
  targetMargin: number;
  isWithinArmLength: boolean;
} {
  let transferPrice = 0;
  let targetMargin = markup;

  switch (pricingMethod) {
    case 'COST_PLUS':
      // Cost + markup
      transferPrice = costBase * (1 + markup / 100);
      break;
      
    case 'RESALE_PRICE':
      // Resale price - margin
      transferPrice = costBase / (1 - markup / 100);
      break;
      
    case 'CUP':
      // Comparable Uncontrolled Price (use benchmark median)
      transferPrice = benchmarkRange?.median || costBase;
      break;
      
    case 'TNMM':
      // Transactional Net Margin Method (use benchmark median)
      transferPrice = costBase * (1 + (benchmarkRange?.median || markup) / 100);
      break;
      
    case 'PROFIT_SPLIT':
      // Profit split (simplified - use median)
      transferPrice = costBase * (1 + (benchmarkRange?.median || markup) / 100);
      break;
  }

  const isWithinArmLength = benchmarkRange
    ? transferPrice >= benchmarkRange.min && transferPrice <= benchmarkRange.max
    : true;

  return {
    transferPrice,
    targetMargin,
    isWithinArmLength,
  };
}

export function assessTPRisk(
  transaction: IntercompanyTransaction,
  policy?: TransferPricingPolicy,
  benchmarkStudy?: BenchmarkStudy
): {
  riskLevel: IntercompanyTransaction['riskLevel'];
  riskFactors: string[];
  recommendations: string[];
} {
  const riskFactors: string[] = [];
  const recommendations: string[] = [];
  let riskScore = 0;

  // No written policy
  if (!policy) {
    riskScore += 30;
    riskFactors.push('No documented transfer pricing policy');
    recommendations.push('Create and document TP policy');
  }

  // Missing benchmark study
  if (!benchmarkStudy || benchmarkStudy.status === 'EXPIRED') {
    riskScore += 25;
    riskFactors.push('Missing or expired benchmark study');
    recommendations.push('Conduct current benchmark analysis');
  }

  // Large transaction value (>$1M)
  if (transaction.amount > 1000000) {
    riskScore += 15;
    riskFactors.push('Material transaction value');
    recommendations.push('Ensure robust documentation');
  }

  // Significant deviation from arm's length
  if (transaction.armLengthPrice) {
    const deviation = Math.abs((transaction.transferPrice - transaction.armLengthPrice) / transaction.armLengthPrice) * 100;
    if (deviation > 10) {
      riskScore += 25;
      riskFactors.push(`Transfer price deviates ${deviation.toFixed(1)}% from arm's length`);
      recommendations.push('Adjust pricing or provide strong justification');
    }
  }

  // Intangibles are high-risk
  if (transaction.transactionType === 'INTANGIBLES') {
    riskScore += 20;
    riskFactors.push('Intangible transaction (high scrutiny)');
    recommendations.push('Obtain detailed valuation and documentation');
  }

  let riskLevel: IntercompanyTransaction['riskLevel'] = 'LOW';
  if (riskScore >= 60) riskLevel = 'CRITICAL';
  else if (riskScore >= 40) riskLevel = 'HIGH';
  else if (riskScore >= 20) riskLevel = 'MEDIUM';

  return {
    riskLevel,
    riskFactors,
    recommendations,
  };
}

export function calculateArmsLengthRange(
  comparables: ComparableCompany[],
  method: 'INTERQUARTILE' | 'FULL_RANGE' = 'INTERQUARTILE'
): {
  min: number;
  max: number;
  median: number;
  quartile: 'LOWER' | 'MEDIAN' | 'UPPER';
} {
  if (comparables.length === 0) {
    return { min: 0, max: 0, median: 0, quartile: 'MEDIAN' };
  }

  // Sort by profit margin
  const sorted = [...comparables].sort((a, b) => a.profitMargin - b.profitMargin);
  
  let min: number;
  let max: number;
  
  if (method === 'INTERQUARTILE') {
    // Interquartile range (25th to 75th percentile)
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    min = sorted[q1Index].profitMargin;
    max = sorted[q3Index].profitMargin;
  } else {
    // Full range
    min = sorted[0].profitMargin;
    max = sorted[sorted.length - 1].profitMargin;
  }
  
  const medianIndex = Math.floor(sorted.length / 2);
  const median = sorted[medianIndex].profitMargin;
  
  return {
    min,
    max,
    median,
    quartile: 'MEDIAN',
  };
}

export function applyComparabilityAdjustments(
  comparable: ComparableCompany,
  adjustments: Array<{ type: 'GEOGRAPHIC' | 'SIZE' | 'FUNCTION' | 'RISK'; value: number }>
): {
  originalMargin: number;
  adjustedMargin: number;
  totalAdjustment: number;
  reliabilityScore: number;
} {
  const originalMargin = comparable.profitMargin;
  let totalAdjustment = 0;
  let reliabilityPenalty = 0;

  adjustments.forEach(adj => {
    totalAdjustment += adj.value;
    // Each adjustment reduces reliability slightly
    reliabilityPenalty += 5;
  });

  const adjustedMargin = originalMargin + totalAdjustment;
  const reliabilityScore = Math.max(comparable.reliabilityScore - reliabilityPenalty, 0);

  return {
    originalMargin,
    adjustedMargin,
    totalAdjustment,
    reliabilityScore,
  };
}

export function generateCBCReport(
  entities: Array<{
    entityId: string;
    jurisdiction: string;
    relatedRevenue: number;
    unrelatedRevenue: number;
    profitLoss: number;
    taxPaid: number;
    taxAccrued: number;
    employees: number;
    tangibleAssets: number;
  }>
): Omit<CountryByCountryReport, 'reportId' | 'status'> {
  const jurisdictionMap = new Map<string, CBCJurisdiction>();

  entities.forEach(entity => {
    if (!jurisdictionMap.has(entity.jurisdiction)) {
      jurisdictionMap.set(entity.jurisdiction, {
        jurisdiction: entity.jurisdiction,
        entities: [],
        revenues: { related: 0, unrelated: 0, total: 0 },
        profitLoss: 0,
        taxPaid: 0,
        taxAccrued: 0,
        employees: 0,
        tangibleAssets: 0,
      });
    }

    const jurisdiction = jurisdictionMap.get(entity.jurisdiction)!;
    jurisdiction.entities.push(entity.entityId);
    jurisdiction.revenues.related += entity.relatedRevenue;
    jurisdiction.revenues.unrelated += entity.unrelatedRevenue;
    jurisdiction.revenues.total += entity.relatedRevenue + entity.unrelatedRevenue;
    jurisdiction.profitLoss += entity.profitLoss;
    jurisdiction.taxPaid += entity.taxPaid;
    jurisdiction.taxAccrued += entity.taxAccrued;
    jurisdiction.employees += entity.employees;
    jurisdiction.tangibleAssets += entity.tangibleAssets;
  });

  const jurisdictions = Array.from(jurisdictionMap.values());
  
  const totalRevenue = jurisdictions.reduce((sum, j) => sum + j.revenues.total, 0);
  const totalProfitLoss = jurisdictions.reduce((sum, j) => sum + j.profitLoss, 0);
  const totalTaxPaid = jurisdictions.reduce((sum, j) => sum + j.taxPaid, 0);
  const effectiveTaxRate = totalProfitLoss > 0 ? (totalTaxPaid / totalProfitLoss) * 100 : 0;

  const year = new Date().getFullYear();
  const filingDeadline = new Date(year + 1, 11, 31); // December 31 of following year

  return {
    reportingPeriod: { year },
    mneGroup: 'Group', // Would be parameter
    jurisdictions,
    totalRevenue,
    totalProfitLoss,
    totalTaxPaid,
    effectiveTaxRate,
    filingDeadline,
  };
}

export function analyzeTPCompliance(
  transactions: IntercompanyTransaction[],
  policies: TransferPricingPolicy[]
): {
  totalTransactions: number;
  documentedTransactions: number;
  complianceRate: number;
  highRiskTransactions: number;
  totalAdjustments: number;
  avgMarkup: number;
  txByMethod: Array<{ method: string; count: number; totalValue: number }>;
} {
  const totalTransactions = transactions.length;
  const documentedTransactions = transactions.filter(t => 
    t.documentationStatus === 'DOCUMENTED' || t.documentationStatus === 'APPROVED'
  ).length;
  
  const complianceRate = totalTransactions > 0 ? (documentedTransactions / totalTransactions) * 100 : 0;
  const highRiskTransactions = transactions.filter(t => 
    t.riskLevel === 'HIGH' || t.riskLevel === 'CRITICAL'
  ).length;

  // Calculate total adjustments needed
  const totalAdjustments = transactions
    .filter(t => t.armLengthPrice && Math.abs(t.transferPrice - t.armLengthPrice) > t.transferPrice * 0.1)
    .reduce((sum, t) => sum + Math.abs(t.transferPrice - (t.armLengthPrice || 0)), 0);

  // Average markup from policies
  const avgMarkup = policies.length > 0
    ? policies.reduce((sum, p) => sum + p.markup, 0) / policies.length
    : 0;

  // Transaction breakdown by method
  const methodCounts = new Map<string, { count: number; totalValue: number }>();
  transactions.forEach(t => {
    if (!methodCounts.has(t.pricingMethod)) {
      methodCounts.set(t.pricingMethod, { count: 0, totalValue: 0 });
    }
    const data = methodCounts.get(t.pricingMethod)!;
    data.count++;
    data.totalValue += t.amount;
  });

  const txByMethod = Array.from(methodCounts.entries()).map(([method, data]) => ({
    method,
    ...data,
  }));

  return {
    totalTransactions,
    documentedTransactions,
    complianceRate,
    highRiskTransactions,
    totalAdjustments,
    avgMarkup,
    txByMethod,
  };
}
