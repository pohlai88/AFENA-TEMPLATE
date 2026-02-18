/**
 * Secretariat Analytics Service
 * Provides meeting statistics, compliance metrics, and governance reporting
 */

import type { BoardMeeting } from './meeting-management';
import type { StatutoryFiling, ComplianceDeadline } from './compliance-tracking';

// ============================================================================
// Analytics Functions
// ============================================================================

export function analyzeGovernanceCompliance(
  meetings: BoardMeeting[],
  filings: StatutoryFiling[],
  deadlines: ComplianceDeadline[]
): {
  // Meetings
  totalMeetings: number;
  meetingsHeld: number;
  quorumSuccessRate: number;
  avgAttendeesPerMeeting: number;
  
  // Filings
  totalFilings: number;
  filedOnTime: number;
  onTimeFilingRate: number;
  overdueFilings: number;
  
  // Compliance
  totalDeadlines: number;
  completedDeadlines: number;
  complianceRate: number;
  upcomingDeadlines: number;
  overdueItems: number;
  
  // Overall score
  overallComplianceScore: number;
} {
  // Meeting analysis
  const totalMeetings = meetings.length;
  const completedMeetings = meetings.filter(m => m.status === 'COMPLETED');
  const meetingsHeld = completedMeetings.length;
  const quorumMet = meetings.filter(m => m.quorumMet).length;
  const quorumSuccessRate = meetingsHeld > 0 ? (quorumMet / meetingsHeld) * 100 : 0;
  
  let totalAttendees = 0;
  completedMeetings.forEach(m => {
    totalAttendees += m.attendees.filter(a => a.attendanceConfirmed).length;
  });
  const avgAttendeesPerMeeting = meetingsHeld > 0 ? totalAttendees / meetingsHeld : 0;
  
  // Filing analysis
  const totalFilings = filings.length;
  const filedOnTime = filings.filter(f => 
    f.status === 'ACCEPTED' && f.filingDate && f.filingDate <= f.dueDate
  ).length;
  const onTimeFilingRate = totalFilings > 0 ? (filedOnTime / totalFilings) * 100 : 0;
  const overdueFilings = filings.filter(f => f.status === 'OVERDUE').length;
  
  // Deadline compliance
  const totalDeadlines = deadlines.length;
  const completedDeadlines = deadlines.filter(d => d.completed).length;
  const complianceRate = totalDeadlines > 0 ? (completedDeadlines / totalDeadlines) * 100 : 0;
  
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);
  
  const upcomingDeadlines = deadlines.filter(d => 
    !d.completed && d.dueDate >= today && d.dueDate <= futureDate
  ).length;
  
  const overdueItems = deadlines.filter(d => 
    !d.completed && d.dueDate < today
  ).length;
  
  // Overall score (weighted average)
  const overallComplianceScore = (
    quorumSuccessRate * 0.3 +
    onTimeFilingRate * 0.4 +
    complianceRate * 0.3
  );
  
  return {
    totalMeetings,
    meetingsHeld,
    quorumSuccessRate: Math.round(quorumSuccessRate),
    avgAttendeesPerMeeting: Math.round(avgAttendeesPerMeeting * 10) / 10,
    
    totalFilings,
    filedOnTime,
    onTimeFilingRate: Math.round(onTimeFilingRate),
    overdueFilings,
    
    totalDeadlines,
    completedDeadlines,
    complianceRate: Math.round(complianceRate),
    upcomingDeadlines,
    overdueItems,
    
    overallComplianceScore: Math.round(overallComplianceScore),
  };
}
