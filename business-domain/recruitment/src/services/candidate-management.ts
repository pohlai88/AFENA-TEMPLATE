import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface Education {
  degree: string;
  field: string;
  institution: string;
  graduationYear: number;
}

export interface StageTransition {
  fromStage: string;
  toStage: string;
  transitionDate: Date;
  notes?: string;
}

export interface Candidate {
  candidateId: string;
  candidateNumber: string;
  
  // Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Location
  currentLocation: string;
  willingToRelocate: boolean;
  
  // Application
  appliedRequisitionId: string;
  jobTitle: string;
  applicationDate: Date;
  source: 'JOB_BOARD' | 'COMPANY_WEBSITE' | 'REFERRAL' | 'RECRUITER' | 'SOCIAL_MEDIA' | 'CAREER_FAIR' | 'OTHER';
  referredBy?: string;
  
  // Documents
  resumeUrl: string;
  coverLetterUrl?: string;
  portfolioUrl?: string;
  
  // Screening
  screeningScore?: number;
  keywordMatches: string[];
  
  // Experience
  yearsOfExperience: number;
  previousEmployers: string[];
  education: Education[];
  
  // Pipeline stage
  currentStage: 'NEW' | 'SCREENING' | 'PHONE_SCREEN' | 'INTERVIEW' | 'ASSESSMENT' | 
                'REFERENCE_CHECK' | 'OFFER' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';
  
  stageHistory: StageTransition[];
  
  // Assessment
  overallRating?: number;
  interviewers: string[];
  
  // Offer
  offerId?: string;
  
  // Disposition
  rejectionReason?: string;
  withdrawalReason?: string;
  
  status: 'ACTIVE' | 'HIRED' | 'REJECTED' | 'WITHDRAWN';
}

export async function submitApplication(
  _db: NeonHttpDatabase,
  _orgId: string,
  _candidate: Omit<Candidate, 'candidateId' | 'candidateNumber' | 'currentStage' | 'stageHistory' | 'interviewers'>
): Promise<Candidate> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export function generateCandidateNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]!.replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `CND-${dateStr}-${sequence}`;
}
