/**
 * Lead Management Service
 * 
 * Manages lead capture, qualification, scoring, and lifecycle tracking.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface Lead {
  leadId: string;
  leadNumber: string;
  
  // Source
  source: 'WEBSITE' | 'SOCIAL_MEDIA' | 'EMAIL' | 'EVENT' | 'REFERRAL' | 'ADVERTISING' | 'OTHER';
  campaignId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Contact
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  
  // Qualification
  leadScore: number;
  leadGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  qualifyStatus: 'NEW' | 'MARKETING_QUALIFIED' | 'SALES_QUALIFIED' | 'DISQUALIFIED';
  
  // Interest
  interestedProducts: string[];
  behaviorScore: number;
  demographicScore: number;
  
  // Journey
  firstTouchDate: Date;
  lastActivityDate: Date;
  touchpoints: number;
  
  // Assignment
  assignedTo?: string;
  assignmentDate?: Date;
  
  status: 'NEW' | 'CONTACTED' | 'NURTURING' | 'CONVERTED' | 'LOST';
  conversionDate?: Date;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function captureLead(
  _db: NeonHttpDatabase,
  _orgId: string,
  _lead: Omit<Lead, 'leadId' | 'leadNumber' | 'leadScore' | 'leadGrade' | 'touchpoints'>
): Promise<Lead> {
  // TODO: Insert lead and calculate lead score
  throw new Error('Database integration pending');
}

export async function updateLeadScore(
  _db: NeonHttpDatabase,
  _orgId: string,
  _leadId: string,
  _behaviorScore: number,
  _demographicScore: number
): Promise<Lead> {
  // TODO: Recalculate and update lead score
  throw new Error('Database integration pending');
}

export async function qualifyLead(
  _db: NeonHttpDatabase,
  _orgId: string,
  _leadId: string,
  _qualifyStatus: Lead['qualifyStatus']
): Promise<Lead> {
  // TODO: Update lead qualification status
  throw new Error('Database integration pending');
}

export async function assignLead(
  _db: NeonHttpDatabase,
  _orgId: string,
  _leadId: string,
  _assignedTo: string
): Promise<Lead> {
  // TODO: Assign lead to sales rep
  throw new Error('Database integration pending');
}

export async function updateLeadStatus(
  _db: NeonHttpDatabase,
  _orgId: string,
  _leadId: string,
  _status: Lead['status'],
  _additionalData?: { conversionDate?: Date }
): Promise<Lead> {
  // TODO: Update lead status and handle conversion
  throw new Error('Database integration pending');
}

export async function recordLeadTouchpoint(
  _db: NeonHttpDatabase,
  _orgId: string,
  _leadId: string,
  _touchpointData: {
    type: string;
    channel: string;
    campaignId?: string;
  }
): Promise<Lead> {
  // TODO: Increment touchpoints and update last activity
  throw new Error('Database integration pending');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function generateLeadNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]!.replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `LEAD-${dateStr}-${sequence}`;
}

export function calculateLeadScore(
  behaviorScore: number,
  demographicScore: number
): { totalScore: number; grade: 'A' | 'B' | 'C' | 'D' | 'F' } {
  // Weight: 60% behavior, 40% demographic
  const totalScore = (behaviorScore * 0.6) + (demographicScore * 0.4);
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 60) grade = 'B';
  else if (totalScore >= 40) grade = 'C';
  else if (totalScore >= 20) grade = 'D';
  else grade = 'F';
  
  return {
    totalScore: Math.round(totalScore),
    grade,
  };
}

export function segmentLeadsByScore(
  leads: Lead[]
): {
  hotLeads: Lead[];
  warmLeads: Lead[];
  coldLeads: Lead[];
} {
  const hotLeads = leads.filter(l => l.leadGrade === 'A' || l.leadGrade === 'B');
  const warmLeads = leads.filter(l => l.leadGrade === 'C');
  const coldLeads = leads.filter(l => l.leadGrade === 'D' || l.leadGrade === 'F');
  
  return { hotLeads, warmLeads, coldLeads };
}

export function segmentLeadsByQualification(
  leads: Lead[]
): {
  new: Lead[];
  mql: Lead[];
  sql: Lead[];
  disqualified: Lead[];
} {
  return {
    new: leads.filter(l => l.qualifyStatus === 'NEW'),
    mql: leads.filter(l => l.qualifyStatus === 'MARKETING_QUALIFIED'),
    sql: leads.filter(l => l.qualifyStatus === 'SALES_QUALIFIED'),
    disqualified: leads.filter(l => l.qualifyStatus === 'DISQUALIFIED'),
  };
}

export function identifyStaleLeads(
  leads: Lead[],
  daysThreshold: number = 30
): Lead[] {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
  
  return leads.filter(lead => 
    lead.status !== 'CONVERTED' &&
    lead.status !== 'LOST' &&
    lead.lastActivityDate < thresholdDate
  );
}

export function calculateLeadVelocity(
  leads: Lead[],
  periodDays: number = 7
): {
  newLeads: number;
  conversions: number;
  avgTimeToConversion: number;
} {
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - periodDays);
  
  const newLeads = leads.filter(l => l.firstTouchDate >= periodStart).length;
  
  const convertedInPeriod = leads.filter(l => 
    l.status === 'CONVERTED' &&
    l.conversionDate &&
    l.conversionDate >= periodStart
  );
  
  const conversions = convertedInPeriod.length;
  
  let totalConversionTime = 0;
  convertedInPeriod.forEach(lead => {
    if (lead.conversionDate) {
      const timeToConvert = lead.conversionDate.getTime() - lead.firstTouchDate.getTime();
      totalConversionTime += timeToConvert;
    }
  });
  
  const avgTimeToConversion = conversions > 0
    ? Math.round((totalConversionTime / conversions) / (1000 * 60 * 60 * 24)) // Convert to days
    : 0;
  
  return {
    newLeads,
    conversions,
    avgTimeToConversion,
  };
}
