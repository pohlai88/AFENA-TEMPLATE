import type { Candidate, StageTransition } from './candidate-management';
import type { JobRequisition } from './requisition-management';
import type { JobOffer } from './offer-management';

export type { StageTransition };

export interface RecruitmentMetrics {
  period: { start: Date; end: Date };
  
  // Requisitions
  totalRequisitions: number;
  openRequisitions: number;
  filledRequisitions: number;
  
  // Application flow
  totalApplications: number;
  screenedCandidates: number;
  interviewedCandidates: number;
  offersExtended: number;
  offersAccepted: number;
  
  // Conversion rates
  screeningRate: number;
  interviewRate: number;
  offerRate: number;
  acceptanceRate: number;
  
  // Time metrics
  avgTimeToFill: number; // days
  avgTimeToScreening: number;
  avgTimeToInterview: number;
  avgTimeToOffer: number;
  
  // Quality metrics
  avgCandidateRating: number;
  offerDeclineRate: number;
  
  // Sources
  topSources: Array<{ source: string; applications: number }>;
}

export function calculateTimeToFill(
  requisition: JobRequisition,
  offerAcceptedDate: Date
): number {
  const openDate = requisition.openDate;
  const diffTime = offerAcceptedDate.getTime() - openDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function analyzeRecruitmentFunnel(
  candidates: Candidate[]
): {
  totalApplications: number;
  screeningPassRate: number;
  interviewPassRate: number;
  offerPassRate: number;
  overallConversionRate: number;
  avgDaysInStage: Record<string, number>;
} {
  const totalApplications = candidates.length;
  
  const screened = candidates.filter(c => 
    ['SCREENING', 'PHONE_SCREEN', 'INTERVIEW', 'ASSESSMENT', 'REFERENCE_CHECK', 'OFFER', 'HIRED'].includes(c.currentStage)
  ).length;
  
  const interviewed = candidates.filter(c => 
    ['INTERVIEW', 'ASSESSMENT', 'REFERENCE_CHECK', 'OFFER', 'HIRED'].includes(c.currentStage)
  ).length;
  
  const offered = candidates.filter(c => 
    ['OFFER', 'HIRED'].includes(c.currentStage)
  ).length;
  
  const hired = candidates.filter(c => c.status === 'HIRED').length;
  
  const screeningPassRate = totalApplications > 0 ? (screened / totalApplications) * 100 : 0;
  const interviewPassRate = screened > 0 ? (interviewed / screened) * 100 : 0;
  const offerPassRate = interviewed > 0 ? (offered / interviewed) * 100 : 0;
  const overallConversionRate = totalApplications > 0 ? (hired / totalApplications) * 100 : 0;
  
  // Calculate avg days in each stage (simplified)
  const avgDaysInStage: Record<string, number> = {
    SCREENING: 3,
    PHONE_SCREEN: 5,
    INTERVIEW: 7,
    ASSESSMENT: 4,
    REFERENCE_CHECK: 3,
    OFFER: 5,
  };
  
  return {
    totalApplications,
    screeningPassRate: Math.round(screeningPassRate),
    interviewPassRate: Math.round(interviewPassRate),
    offerPassRate: Math.round(offerPassRate),
    overallConversionRate: Math.round(overallConversionRate * 10) / 10,
    avgDaysInStage,
  };
}

export function analyzeRecruitmentMetrics(
  requisitions: JobRequisition[],
  candidates: Candidate[],
  offers: JobOffer[]
): RecruitmentMetrics {
  const totalRequisitions = requisitions.length;
  const openRequisitions = requisitions.filter(r => r.status === 'OPEN').length;
  const filledRequisitions = requisitions.filter(r => r.status === 'FILLED').length;
  
  const totalApplications = candidates.length;
  const screenedCandidates = candidates.filter(c => 
    c.currentStage !== 'NEW'
  ).length;
  const interviewedCandidates = candidates.filter(c => 
    ['INTERVIEW', 'ASSESSMENT', 'REFERENCE_CHECK', 'OFFER', 'HIRED'].includes(c.currentStage)
  ).length;
  const offersExtended = offers.filter(o => o.status === 'EXTENDED' || o.status === 'ACCEPTED').length;
  const offersAccepted = offers.filter(o => o.status === 'ACCEPTED').length;
  
  const screeningRate = totalApplications > 0 ? (screenedCandidates / totalApplications) * 100 : 0;
  const interviewRate = screenedCandidates > 0 ? (interviewedCandidates / screenedCandidates) * 100 : 0;
  const offerRate = interviewedCandidates > 0 ? (offersExtended / interviewedCandidates) * 100 : 0;
  const acceptanceRate = offersExtended > 0 ? (offersAccepted / offersExtended) * 100 : 0;
  
  // Source analysis
  const sourceMap = new Map<string, number>();
  candidates.forEach(c => {
    sourceMap.set(c.source, (sourceMap.get(c.source) || 0) + 1);
  });
  const topSources = Array.from(sourceMap.entries())
    .map(([source, applications]) => ({ source, applications }))
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 5);
  
  return {
    period: { start: new Date(), end: new Date() },
    
    totalRequisitions,
    openRequisitions,
    filledRequisitions,
    
    totalApplications,
    screenedCandidates,
    interviewedCandidates,
    offersExtended,
    offersAccepted,
    
    screeningRate: Math.round(screeningRate),
    interviewRate: Math.round(interviewRate),
    offerRate: Math.round(offerRate),
    acceptanceRate: Math.round(acceptanceRate),
    
    avgTimeToFill: 30, // Would calculate from actual data
    avgTimeToScreening: 3,
    avgTimeToInterview: 10,
    avgTimeToOffer: 20,
    
    avgCandidateRating: 0, // Would calculate from ratings
    offerDeclineRate: 100 - acceptanceRate,
    
    topSources,
  };
}
