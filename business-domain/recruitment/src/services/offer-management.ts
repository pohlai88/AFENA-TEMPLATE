import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface JobOffer {
  offerId: string;
  offerNumber: string;
  
  // Candidate & Position
  candidateId: string;
  candidateName: string;
  requisitionId: string;
  jobTitle: string;
  department: string;
  
  // Terms
  employmentType: string;
  startDate: Date;
  reportingTo: string;
  workLocation: string;
  
  // Compensation
  baseSalary: number;
  currency: string;
  bonus?: number;
  equity?: string;
  benefits: string[];
  
  // Other terms
  probationPeriod?: number; // days
  vacationDays: number;
  additionalTerms: string[];
  
  // Validity
  offerDate: Date;
  expiryDate: Date;
  
  // Approval
  approvedBy: string;
  approvalDate: Date;
  
  // Response
  candidateResponse?: 'ACCEPTED' | 'DECLINED' | 'COUNTERED';
  responseDate?: Date;
  declineReason?: string;
  counterProposal?: string;
  
  // Documents
  offerLetterUrl?: string;
  
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'EXTENDED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'WITHDRAWN';
}

export async function extendOffer(
  _db: NeonHttpDatabase,
  _orgId: string,
  _offer: Omit<JobOffer, 'offerId' | 'offerNumber'>
): Promise<JobOffer> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

export function generateOfferNumber(): string {
  const year = new Date().getFullYear();
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
  const sequence = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `OFF-${year}${month}-${sequence}`;
}
