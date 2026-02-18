/**
 * Co-op Advertising Service
 * Manages co-op ad programs, partner marketing, and cost-sharing
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface CoOpProgram {
  programId: string;
  programName: string;
  
  // Details
  description: string;
  programType: 'ADVERTISING' | 'MERCHANDISING' | 'EVENTS' | 'TRAINING' | 'DIGITAL_MARKETING';
  
  // Eligibility
  eligiblePartnerTiers: string[];
  minimumPurchaseRequirement: number;
  
  // Funding
  fundingModel: 'PERCENTAGE_MATCH' | 'DOLLAR_MATCH' | 'ACCRUAL' | 'FIXED_AMOUNT';
  matchPercentage?: number;
  maxReimbursement: number;
  accrualRate?: number; // e.g., $0.50 per unit sold
  
  // Requirements
  requiredApprovals: string[];
  supportedActivities: string[];
  prohibitedActivities: string[];
  
  // Claims
  claimSubmissionDeadline: number; // days after activity
  proofRequired: string[];
  
  // Budget
  totalBudget: number;
  allocatedFunds: number;
  claimedFunds: number;
  remainingBudget: number;
  
  // Timeline
  programStart: Date;
  programEnd: Date;
  
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'SUSPENDED';
}

export interface CoOpClaim {
  claimId: string;
  claimNumber: string;
  
  // Program
  programId: string;
  partnerId: string;
  
  // Activity
  activityType: string;
  activityDescription: string;
  activityDate: Date;
  
  // Costs
  totalCost: number;
  requestedReimbursement: number;
  approvedReimbursement: number;
  
  // Documentation
  invoices: string[];
  proofOfPerformance: string[];
  
  // Submission
  submittedDate: Date;
  submittedBy: string;
  
  // Review
  reviewedBy?: string;
  reviewDate?: Date;
  reviewNotes?: string;
  
  // Payment
  paymentDate?: Date;
  paymentReference?: string;
  
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID';
}

export interface PartnerMarketingCampaign {
  campaignId: string;
  
  // Program
  coOpProgramId: string;
  partnerId: string;
  
  // Details
  campaignName: string;
  campaignType: 'PRINT' | 'DIGITAL' | 'RADIO' | 'TV' | 'SOCIAL_MEDIA' | 'EMAIL' | 'EVENT';
  
  // Scope
  targetAudience: string;
  geography: string[];
  
  // Timing
  launchDate: Date;
  endDate: Date;
  
  // Content
  creativeAssets: string[];
  brandGuidelines: boolean;
  preApproved: boolean;
  
  // Investment
  estimatedCost: number;
  actualCost: number;
  partnerContribution: number;
  coOpContribution: number;
  
  // Performance
  reach: number;
  impressions: number;
  conversions: number;
  
  status: 'PLANNING' | 'PENDING_APPROVAL' | 'APPROVED' | 'LIVE' | 'COMPLETED';
}

// ============================================================================
// Database Operations
// ============================================================================

export async function createCoOpProgram(
  _db: NeonHttpDatabase,
  _orgId: string,
  _program: Omit<CoOpProgram, 'programId' | 'allocatedFunds' | 'claimedFunds' | 'remainingBudget'>
): Promise<CoOpProgram> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function submitCoOpClaim(
  _db: NeonHttpDatabase,
  _orgId: string,
  _claim: Omit<CoOpClaim, 'claimId' | 'claimNumber' | 'approvedReimbursement'>
): Promise<CoOpClaim> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function reviewCoOpClaim(
  _db: NeonHttpDatabase,
  _orgId: string,
  _claimId: string,
  _decision: 'APPROVED' | 'REJECTED',
  _approvedAmount: number,
  _reviewNotes: string,
  _reviewedBy: string
): Promise<CoOpClaim> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function createPartnerCampaign(
  _db: NeonHttpDatabase,
  _orgId: string,
  _campaign: Omit<PartnerMarketingCampaign, 'campaignId'>
): Promise<PartnerMarketingCampaign> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getProgramUtilization(
  _db: NeonHttpDatabase,
  _orgId: string,
  _programId: string
): Promise<{
  program: CoOpProgram;
  utilizationRate: number;
  activeClaims: number;
  topPartners: Array<{ partnerId: string; claimedAmount: number }>;
}> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export async function getPartnerCoOpBalance(
  _db: NeonHttpDatabase,
  _orgId: string,
  _partnerId: string,
  _programId: string
): Promise<{
  accruedFunds: number;
  claimedFunds: number;
  availableBalance: number;
}> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateClaimNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]?.replace(/-/g, '') ?? '';
  const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `COOP-${dateStr}-${sequence}`;
}

export function calculateCoOpReimbursement(
  program: CoOpProgram,
  actualCost: number,
  partnerPurchases?: number
): {
  eligibleAmount: number;
  reimbursementAmount: number;
  cappedAtMax: boolean;
} {
  let reimbursementAmount = 0;
  
  switch (program.fundingModel) {
    case 'PERCENTAGE_MATCH':
      reimbursementAmount = actualCost * ((program.matchPercentage || 0) / 100);
      break;
    
    case 'DOLLAR_MATCH':
      // 1:1 match up to max
      reimbursementAmount = actualCost;
      break;
    
    case 'ACCRUAL':
      // Based on purchase volume
      if (partnerPurchases && program.accrualRate) {
        const accrued = partnerPurchases * program.accrualRate;
        reimbursementAmount = Math.min(actualCost, accrued);
      }
      break;
    
    case 'FIXED_AMOUNT':
      reimbursementAmount = program.maxReimbursement;
      break;
  }
  
  // Apply max cap
  const cappedAtMax = reimbursementAmount > program.maxReimbursement;
  if (cappedAtMax) {
    reimbursementAmount = program.maxReimbursement;
  }
  
  return {
    eligibleAmount: actualCost,
    reimbursementAmount: Math.round(reimbursementAmount * 100) / 100,
    cappedAtMax,
  };
}

export function validateClaimEligibility(
  claim: CoOpClaim,
  program: CoOpProgram
): {
  eligible: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];
  
  // Check if activity is supported
  if (!program.supportedActivities.includes(claim.activityType)) {
    reasons.push('Activity type not supported by program');
  }
  
  // Check submission deadline
  const daysSinceActivity = Math.floor(
    (claim.submittedDate.getTime() - claim.activityDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceActivity > program.claimSubmissionDeadline) {
    reasons.push('Claim submitted past deadline');
  }
  
  // Check if program is active
  if (program.status !== 'ACTIVE') {
    reasons.push('Program is not active');
  }
  
  // Check budget availability
  if (program.remainingBudget < claim.requestedReimbursement) {
    reasons.push('Insufficient program budget');
  }
  
  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

export function calculateProgramROI(
  program: CoOpProgram,
  partnerSales: number,
  baselineSales: number
): {
  investmentAmount: number;
  incrementalSales: number;
  roi: number;
} {
  const investmentAmount = program.claimedFunds;
  const incrementalSales = partnerSales - baselineSales;
  const roi = investmentAmount > 0 ? ((incrementalSales - investmentAmount) / investmentAmount) * 100 : 0;
  
  return {
    investmentAmount: Math.round(investmentAmount),
    incrementalSales: Math.round(incrementalSales),
    roi: Math.round(roi),
  };
}
