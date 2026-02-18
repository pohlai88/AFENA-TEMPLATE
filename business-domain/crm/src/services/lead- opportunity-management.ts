import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Lead {
  id: string;
  orgId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  source: string;
  assignedTo?: string;
  score: number;
  createdAt: Date;
}

export interface Opportunity {
  id: string;
  orgId: string;
  accountId: string;
  name: string;
  amount: number;
  currency: string;
  stage: 'PROSPECTING' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'CLOSED_WON' | 'CLOSED_LOST';
  probability: number;
  expectedCloseDate: Date;
  ownerId: string;
}

export interface Account {
  id: string;
  orgId: string;
  name: string;
  industry: string;
  website?: string;
  phone?: string;
  status: 'PROSPECT' | 'CUSTOMER' | 'INACTIVE';
  accountOwnerId: string;
  annualRevenue?: number;
}

export async function createLead(
  db: NeonHttpDatabase,
  data: Omit<Lead, 'id' | 'status' | 'score' | 'createdAt'>,
): Promise<Lead> {
  // TODO: Insert lead with NEW status and calculated score
  throw new Error('Database integration pending');
}

export async function convertLead(
  db: NeonHttpDatabase,
  leadId: string,
): Promise<{ accountId: string; opportunityId: string }> {
  // TODO: Create account and opportunity from lead
  throw new Error('Database integration pending');
}

export async function createOpportunity(
  db: NeonHttpDatabase,
  data: Omit<Opportunity, 'id'>,
): Promise<Opportunity> {
  // TODO: Insert opportunity
  throw new Error('Database integration pending');
}

export async function updateOpportunityStage(
  db: NeonHttpDatabase,
  opportunityId: string,
  stage: Opportunity['stage'],
): Promise<Opportunity> {
  // TODO: Update opportunity stage and probability
  throw new Error('Database integration pending');
}

export function calculateLeadScore(
  lead: Lead,
  scoringCriteria: {
    emailDomain?: string[];
    companySizePoints?: number;
    engagementPoints?: number;
  },
): number {
  let score = 0;

  // Email domain scoring
  if (scoringCriteria.emailDomain && lead.email) {
    const domain = lead.email.split('@')[1];
    if (scoringCriteria.emailDomain.includes(domain)) {
      score += 20;
    }
  }

  // Company presence
  if (lead.company) score += 15;

  // Contact info completeness
  if (lead.phone) score += 10;

  return Math.min(score, 100);
}

export function calculatePipelineCoverage(
  opportunities: Opportunity[],
  quota: number,
): { coverage: number; weightedCoverage: number } {
  const totalPipeline = opportunities
    .filter((opp) => opp.stage !== 'CLOSED_LOST')
    .reduce((sum, opp) => sum + opp.amount, 0);

  const weightedPipeline = opportunities
    .filter((opp) => opp.stage !== 'CLOSED_LOST')
    .reduce((sum, opp) => sum + opp.amount * (opp.probability / 100), 0);

  return {
    coverage: quota > 0 ? totalPipeline / quota : 0,
    weightedCoverage: quota > 0 ? weightedPipeline / quota : 0,
  };
}

export function calculateWinRate(
  opportunities: Opportunity[],
  periodStart: Date,
  periodEnd: Date,
): { winRate: number; avgDealSize: number; avgSalesCycle: number } {
  const closed = opportunities.filter((opp) => 
    opp.stage === 'CLOSED_WON' || opp.stage === 'CLOSED_LOST'
  );

  const won = closed.filter((opp) => opp.stage === 'CLOSED_WON');
  const winRate = closed.length > 0 ? (won.length / closed.length) * 100 : 0;
  
  const avgDealSize = won.length > 0 
    ? won.reduce((sum, opp) => sum + opp.amount, 0) / won.length 
    : 0;

  const avgSalesCycle = 0; // TODO: Calculate based on creation to close date

  return { winRate, avgDealSize, avgSalesCycle };
}

export function forecastRevenue(
  opportunities: Opportunity[],
  method: 'PIPELINE' | 'STAGE' | 'HISTORICAL',
): number {
  if (method === 'PIPELINE') {
    return opportunities
      .filter((opp) => opp.stage !== 'CLOSED_LOST')
      .reduce((sum, opp) => sum + opp.amount * (opp.probability / 100), 0);
  }

  // Stage-based or historical methods would require additional data
  return 0;
}

export function identifyAtRiskDeals(
  opportunities: Opportunity[],
  thresholdDays: number = 30,
): Opportunity[] {
  const today = new Date();
  
  return opportunities
    .filter((opp) => {
      if (opp.stage === 'CLOSED_WON' || opp.stage === 'CLOSED_LOST') return false;
      
      const daysToClose = Math.floor(
        (opp.expectedCloseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
      );

      return daysToClose < thresholdDays && daysToClose >= 0;
    })
    .sort((a, b) => a.expectedCloseDate.getTime() - b.expectedCloseDate.getTime());
}
