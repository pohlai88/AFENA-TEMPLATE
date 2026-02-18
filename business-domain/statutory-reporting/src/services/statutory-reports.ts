/**
 * Statutory Reporting Service
 * Handles local GAAP reporting, regulatory filings, and jurisdiction-specific compliance
 */

// ============================================================================
// Interfaces
// ============================================================================

export interface StatutoryReport {
  reportId: string;
  entityId: string;
  jurisdiction: string;
  reportType: 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'CASH_FLOW' | 'EQUITY' | 'NOTES' | 'DIRECTORS_REPORT';
  accountingStandard: 'LOCAL_GAAP' | 'IFRS' | 'US_GAAP' | 'TAX_BASIS';
  periodType: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  periodEnd: Date;
  status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'FILED' | 'ACCEPTED';
  filingDeadline: Date;
  filedDate?: Date;
  preparedBy: string;
  reviewedBy?: string;
  attachmentUrl?: string;
}

export interface GAAPreconcilement {
  reconciliationId: string;
  entityId: string;
  periodEnd: Date;
  fromStandard: 'IFRS' | 'US_GAAP' | 'LOCAL_GAAP';
  toStandard: 'IFRS' | 'US_GAAP' | 'LOCAL_GAAP';
  adjustments: GAAPredjustment[];
  netIncomeFrom: number;
  netIncomeTo: number;
  equityFrom: number;
  equityTo: number;
}

export interface GAAPAdjustment {
  sequenceNumber: number;
  category: 'REVENUE_RECOGNITION' | 'DEPRECIATION' | 'LEASE' | 'PENSION' | 'INVENTORY' | 
            'GOODWILL' | 'PROVISION' | 'DEFERRED_TAX' | 'OTHER';
  description: string;
  impactOnIncome: number;
  impactOnEquity: number;
  debitAccount: string;
  creditAccount: string;
  notes?: string;
}

export interface RegulatoryFiling {
  filingId: string;
  entityId: string;
  filingType: 'ANNUAL_RETURN' | 'DIRECTORS_APPOINTMENT' | 'SHAREHOLDER_CHANGE' | 
               'CONSTITUTIONAL_CHANGE' | 'ADDRESS_CHANGE' | 'FINANCIAL_STATEMENTS';
  jurisdiction: string;
  regulatoryBody: string;
  filingDate: Date;
  deadline: Date;
  status: 'PENDING' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED' | 'OVERDUE';
  confirmationNumber?: string;
  fees: number;
  penalties?: number;
}

export interface AuditRequirement {
  requirementId: string;
  entityId: string;
  jurisdiction: string;
  isAuditRequired: boolean;
  auditType: 'STATUTORY' | 'VOLUNTARY' | 'EXEMPT';
  exemptionReason?: 'SIZE' | 'DORMANT' | 'SUBSIDIARY' | 'OTHER';
  revenueThreshold: number;
  assetThreshold: number;
  employeeThreshold: number;
  auditorRequired: boolean;
  deadline: Date;
}

export interface LocalDisclosure {
  disclosureId: string;
  reportId: string;
  disclosureType: 'RELATED_PARTY' | 'CONTINGENT_LIABILITY' | 'SEGMENT' | 'GOING_CONCERN' | 
                  'POST_BALANCE_EVENT' | 'ACCOUNTING_POLICY' | 'KEY_MANAGEMENT_COMPENSATION';
  description: string;
  amount?: number;
  isQuantitative: boolean;
  isMandatory: boolean;
  notes: string;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createStatutoryReport(
  report: Omit<StatutoryReport, 'reportId'>
): Promise<StatutoryReport> {
  // TODO: Implement with Drizzle ORM
  // const reportId = generateStatReportId();
  // return await db.insert(statutoryReports).values({ ...report, reportId }).returning();
  throw new Error('Not implemented');
}

export async function createGAAPReconciliation(
  reconciliation: Omit<GAAPReconciliation, 'reconciliationId'>
): Promise<GAAPReconciliation> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function fileRegulatoryDocument(
  filing: Omit<RegulatoryFiling, 'filingId'>
): Promise<RegulatoryFiling> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function assessAuditRequirement(
  entity: { entityId: string; jurisdiction: string; revenue: number; assets: number; employees: number }
): Promise<AuditRequirement> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function createLocalDisclosure(
  disclosure: Omit<LocalDisclosure, 'disclosureId'>
): Promise<LocalDisclosure> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getUpcomingFilings(
  entityId: string,
  daysAhead: number = 30
): Promise<RegulatoryFiling[]> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateStatReportId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `SR-${dateStr}-${sequence}`;
}

export function determineAccountingStandard(
  jurisdiction: string
): {
  primaryStandard: StatutoryReport['accountingStandard'];
  alternativeStandards: StatutoryReport['accountingStandard'][];
  isIFRSMandatory: boolean;
} {
  // Simplified mapping (would use comprehensive jurisdiction database)
  const ifrsJurisdictions = ['GB', 'FR', 'DE', 'AU', 'NZ', 'SG', 'HK', 'ZA'];
  const usGAAPJurisdictions = ['US'];
  
  let primaryStandard: StatutoryReport['accountingStandard'] = 'LOCAL_GAAP';
  const alternativeStandards: StatutoryReport['accountingStandard'][] = [];
  
  if (ifrsJurisdictions.includes(jurisdiction)) {
    primaryStandard = 'IFRS';
    alternativeStandards.push('LOCAL_GAAP');
  } else if (usGAAPJurisdictions.includes(jurisdiction)) {
    primaryStandard = 'US_GAAP';
  } else {
    alternativeStandards.push('IFRS');
  }
  
  const isIFRSMandatory = ifrsJurisdictions.includes(jurisdiction);
  
  return {
    primaryStandard,
    alternativeStandards,
    isIFRSMandatory,
  };
}

export function calculateFilingDeadline(
  periodEnd: Date,
  jurisdiction: string,
  entityType: 'PUBLIC' | 'PRIVATE' | 'LIMITED' | 'SME'
): Date {
  // Simplified deadline calculation (varies significantly by jurisdiction)
  const deadlineMonths = (() => {
    if (jurisdiction === 'US') {
      return entityType === 'PUBLIC' ? 2.5 : 3;
    } else if (jurisdiction === 'GB') {
      return entityType === 'PUBLIC' ? 4 : 9;
    } else if (['FR', 'DE'].includes(jurisdiction)) {
      return 6;
    }
    return 6; // Default
  })();
  
  const deadline = new Date(periodEnd);
  deadline.setMonth(deadline.getMonth() + deadlineMonths);
  
  return deadline;
}

export function reconcileGAAPDifferences(
  transactions: Array<{
    transactionId: string;
    category: GAAPredjustment['category'];
    ifrsAmount: number;
    localGAAPAmount: number;
  }>
): GAAPReconciliation {
  const adjustments: GAAPredjustment[] = [];
  let totalIncomeImpact = 0;
  let totalEquityImpact = 0;
  
  transactions.forEach((tx, index) => {
    const variance = tx.ifrsAmount - tx.localGAAPAmount;
    
    if (Math.abs(variance) > 0) {
      adjustments.push({
        sequenceNumber: index + 1,
        category: tx.category,
        description: `${tx.category} difference: IFRS vs Local GAAP`,
        impactOnIncome: variance,
        impactOnEquity: variance,
        debitAccount: variance > 0 ? 'GAAP_ADJUSTMENT_DR' : 'GAAP_ADJUSTMENT_CR',
        creditAccount: variance > 0 ? 'GAAP_ADJUSTMENT_CR' : 'GAAP_ADJUSTMENT_DR',
        notes: `Transaction: ${tx.transactionId}`,
      });
      
      totalIncomeImpact += variance;
      totalEquityImpact += variance;
    }
  });
  
  return {
    reconciliationId: `RECON-${Date.now()}`,
    entityId: 'ENTITY',
    periodEnd: new Date(),
    fromStandard: 'LOCAL_GAAP',
    toStandard: 'IFRS',
    adjustments,
    netIncomeFrom: 0, // Would be calculated
    netIncomeTo: totalIncomeImpact,
    equityFrom: 0,
    equityTo: totalEquityImpact,
  };
}

export function assessAuditExemption(
  entity: {
    jurisdiction: string;
    entityType: 'PUBLIC' | 'PRIVATE' | 'LIMITED' | 'SME';
    revenue: number;
    assets: number;
    employees: number;
  }
): {
  isExempt: boolean;
  reason?: AuditRequirement['exemptionReason'];
  thresholds: {
    revenue: number;
    assets: number;
    employees: number;
  };
  qualifyingCriteria: number;
} {
  // UK thresholds (example) - varies by jurisdiction
  const thresholds = {
    revenue: 10200000, // £10.2M
    assets: 5100000,   // £5.1M
    employees: 50,
  };
  
  let qualifyingCriteria = 0;
  
  // Must meet 2 of 3 criteria for small company exemption
  if (entity.revenue <= thresholds.revenue) qualifyingCriteria++;
  if (entity.assets <= thresholds.assets) qualifyingCriteria++;
  if (entity.employees <= thresholds.employees) qualifyingCriteria++;
  
  const isExempt = qualifyingCriteria >= 2 && entity.entityType !== 'PUBLIC';
  const reason: AuditRequirement['exemptionReason'] | undefined = 
    isExempt ? 'SIZE' : undefined;
  
  return {
    isExempt,
    reason,
    thresholds,
    qualifyingCriteria,
  };
}

export function generateMandatoryDisclosures(
  entity: {
    entityId: string;
    jurisdiction: string;
    accountingStandard: string;
  },
  financialData: {
    relatedPartyTransactions: number;
    contingentLiabilities: number;
    postBalanceEvents: Array<{ description: string; amount: number }>;
  }
): LocalDisclosure[] {
  const disclosures: LocalDisclosure[] = [];
  
  // Related party transactions (mandatory)
  if (financialData.relatedPartyTransactions > 0) {
    disclosures.push({
      disclosureId: `DISC-${Date.now()}-1`,
      reportId: 'REPORT',
      disclosureType: 'RELATED_PARTY',
      description: 'Transactions with related parties during the period',
      amount: financialData.relatedPartyTransactions,
      isQuantitative: true,
      isMandatory: true,
      notes: 'Disclosure required under IAS 24 / local GAAP',
    });
  }
  
  // Contingent liabilities (mandatory if material)
  if (financialData.contingentLiabilities > 0) {
    disclosures.push({
      disclosureId: `DISC-${Date.now()}-2`,
      reportId: 'REPORT',
      disclosureType: 'CONTINGENT_LIABILITY',
      description: 'Contingent liabilities not recognized in balance sheet',
      amount: financialData.contingentLiabilities,
      isQuantitative: true,
      isMandatory: true,
      notes: 'Disclosure required under IAS 37 / local GAAP',
    });
  }
  
  // Post balance sheet events
  financialData.postBalanceEvents.forEach((event, index) => {
    disclosures.push({
      disclosureId: `DISC-${Date.now()}-${index + 3}`,
      reportId: 'REPORT',
      disclosureType: 'POST_BALANCE_EVENT',
      description: event.description,
      amount: event.amount,
      isQuantitative: true,
      isMandatory: true,
      notes: 'Disclosure required under IAS 10 / local GAAP',
    });
  });
  
  return disclosures;
}

export function calculateStatutoryPenalties(
  filing: RegulatoryFiling,
  currentDate: Date
): {
  isPenaltyApplicable: boolean;
  daysOverdue: number;
  penaltyAmount: number;
  calculation: string;
} {
  const daysOverdue = Math.max(0, 
    Math.floor((currentDate.getTime() - filing.deadline.getTime()) / (1000 * 60 * 60 * 24))
  );
  
  if (daysOverdue === 0) {
    return {
      isPenaltyApplicable: false,
      daysOverdue: 0,
      penaltyAmount: 0,
      calculation: 'Filed on time',
    };
  }
  
  // UK Companies House penalty structure (example)
  let penaltyAmount = 0;
  let calculation = '';
  
  if (filing.filingType === 'FINANCIAL_STATEMENTS') {
    if (daysOverdue <= 30) {
      penaltyAmount = 150;
      calculation = '1-30 days late: £150';
    } else if (daysOverdue <= 90) {
      penaltyAmount = 375;
      calculation = '31-90 days late: £375';
    } else if (daysOverdue <= 180) {
      penaltyAmount = 750;
      calculation = '91-180 days late: £750';
    } else {
      penaltyAmount = 1500;
      calculation = 'Over 180 days late: £1,500';
    }
  } else {
    // Other filings: £100 flat penalty
    penaltyAmount = 100;
    calculation = `${daysOverdue} days late: £100`;
  }
  
  return {
    isPenaltyApplicable: true,
    daysOverdue,
    penaltyAmount,
    calculation,
  };
}

export function analyzeStatutoryCompliance(
  reports: StatutoryReport[],
  filings: RegulatoryFiling[]
): {
  totalReports: number;
  filedOnTime: number;
  overdueReports: number;
  complianceRate: number;
  totalPenalties: number;
  upcomingDeadlines: Array<{ reportId: string; deadline: Date; daysRemaining: number }>;
  byJurisdiction: Array<{ jurisdiction: string; count: number; complianceRate: number }>;
} {
  const now = new Date();
  const totalReports = reports.length;
  const filedOnTime = reports.filter(r => 
    r.status === 'FILED' && r.filedDate && r.filedDate <= r.filingDeadline
  ).length;
  const overdueReports = reports.filter(r => 
    (r.status !== 'FILED' && r.filingDeadline < now) ||
    (r.status === 'FILED' && r.filedDate && r.filedDate > r.filingDeadline)
  ).length;
  
  const complianceRate = totalReports > 0 ? (filedOnTime / totalReports) * 100 : 0;
  
  const totalPenalties = filings.reduce((sum, f) => sum + (f.penalties || 0), 0);
  
  const upcomingDeadlines = reports
    .filter(r => r.status !== 'FILED' && r.filingDeadline > now)
    .map(r => ({
      reportId: r.reportId,
      deadline: r.filingDeadline,
      daysRemaining: Math.floor((r.filingDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 10);
  
  const jurisdictionMap = new Map<string, { total: number; onTime: number }>();
  reports.forEach(r => {
    if (!jurisdictionMap.has(r.jurisdiction)) {
      jurisdictionMap.set(r.jurisdiction, { total: 0, onTime: 0 });
    }
    const data = jurisdictionMap.get(r.jurisdiction)!;
    data.total++;
    if (r.status === 'FILED' && r.filedDate && r.filedDate <= r.filingDeadline) {
      data.onTime++;
    }
  });
  
  const byJurisdiction = Array.from(jurisdictionMap.entries()).map(([jurisdiction, data]) => ({
    jurisdiction,
    count: data.total,
    complianceRate: data.total > 0 ? (data.onTime / data.total) * 100 : 0,
  }));
  
  return {
    totalReports,
    filedOnTime,
    overdueReports,
    complianceRate,
    totalPenalties,
    upcomingDeadlines,
    byJurisdiction,
  };
}
