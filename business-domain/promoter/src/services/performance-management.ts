/**
 * Performance Management Service
 * Manages KPI tracking, evaluations, and incentives
 */

import type { Promoter } from './promoter-recruitment';
import type { PromoterAssignment } from './assignment-management';
import type { ActivityReport } from './activity-tracking';

// ============================================================================
// Interfaces
// ============================================================================

export interface PromoterPerformance {
  promoterId: string;
  period: { start: Date; end: Date };
  
  // Activity
  eventsWorked: number;
  totalHoursWorked: number;
  avgHoursPerEvent: number;
  
  // Attendance
  scheduledEvents: number;
  completedEvents: number;
  noShows: number;
  attendanceRate: number;
  
  // Punctuality
  onTimeCheckIns: number;
  lateCheckIns: number;
  punctualityRate: number;
  
  // Quality
  avgPerformanceRating: number;
  tasksCompletionRate: number;
  
  // Engagement
  totalEngagements: number;
  avgEngagementsPerEvent: number;
  leadsGenerated: number;
  samplesDistributed: number;
  
  // Compensation
  totalEarnings: number;
  totalExpenses: number;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculatePromoterPay(
  hourlyRate: number,
  actualHours: number,
  expenses: number
): {
  basePay: number;
  expenses: number;
  totalCompensation: number;
} {
  const basePay = hourlyRate * actualHours;
  return {
    basePay: Math.round(basePay * 100) / 100,
    expenses: Math.round(expenses * 100) / 100,
    totalCompensation: Math.round((basePay + expenses) * 100) / 100,
  };
}

export function calculateAttendanceRate(
  completedEvents: number,
  scheduledEvents: number
): number {
  if (scheduledEvents === 0) return 0;
  return Math.round((completedEvents / scheduledEvents) * 10000) / 100;
}

export function calculatePunctualityRate(
  onTimeCheckIns: number,
  totalCheckIns: number
): number {
  if (totalCheckIns === 0) return 0;
  return Math.round((onTimeCheckIns / totalCheckIns) * 10000) / 100;
}

export function analyzePromoterPerformance(
  promoter: Promoter,
  assignments: PromoterAssignment[],
  reports: ActivityReport[]
): PromoterPerformance {
  const completedAssignments = assignments.filter(a => a.status === 'COMPLETED');
  const scheduledAssignments = assignments.filter(a => 
    a.status !== 'CANCELLED' && a.status !== 'NO_SHOW'
  );
  
  const eventsWorked = completedAssignments.length;
  const totalHoursWorked = completedAssignments.reduce((sum, a) => sum + (a.actualHours || 0), 0);
  const avgHoursPerEvent = eventsWorked > 0 ? totalHoursWorked / eventsWorked : 0;
  
  const noShows = assignments.filter(a => a.status === 'NO_SHOW').length;
  const attendanceRate = calculateAttendanceRate(eventsWorked, scheduledAssignments.length);
  
  // Punctuality (on-time check-ins)
  const onTimeCheckIns = completedAssignments.filter(a => {
    if (!a.checkInTime || !a.scheduledStartTime) return false;
    // Consider on-time if within 15 minutes of scheduled start
    const scheduled = new Date(`2000-01-01T${a.scheduledStartTime}`);
    const actual = new Date(`2000-01-01T${a.checkInTime}`);
    const diffMinutes = (actual.getTime() - scheduled.getTime()) / (1000 * 60);
    return diffMinutes <= 15;
  }).length;
  const punctualityRate = calculatePunctualityRate(onTimeCheckIns, eventsWorked);
  
  // Quality metrics
  const ratings = completedAssignments
    .map(a => a.performanceRating)
    .filter((r): r is number => r !== undefined);
  const avgPerformanceRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    : 0;
  
  // Engagement metrics
  const totalEngagements = reports.reduce((sum, r) => sum + r.consumerEngagements, 0);
  const avgEngagementsPerEvent = reports.length > 0 ? totalEngagements / reports.length : 0;
  const leadsGenerated = reports.reduce((sum, r) => sum + r.leadsCollected, 0);
  const samplesDistributed = reports.reduce((sum, r) => sum + r.samplesDistributed, 0);
  
  // Compensation
  const totalEarnings = completedAssignments.reduce((sum, a) => sum + a.totalPay, 0);
  const totalExpenses = completedAssignments.reduce((sum, a) => sum + a.expenses, 0);
  
  return {
    promoterId: promoter.promoterId,
    period: { start: new Date(), end: new Date() }, // Would be actual period
    
    eventsWorked,
    totalHoursWorked: Math.round(totalHoursWorked * 10) / 10,
    avgHoursPerEvent: Math.round(avgHoursPerEvent * 10) / 10,
    
    scheduledEvents: scheduledAssignments.length,
    completedEvents: eventsWorked,
    noShows,
    attendanceRate: Math.round(attendanceRate),
    
    onTimeCheckIns,
    lateCheckIns: eventsWorked - onTimeCheckIns,
    punctualityRate: Math.round(punctualityRate),
    
    avgPerformanceRating: Math.round(avgPerformanceRating * 10) / 10,
    tasksCompletionRate: 0, // Would need detailed task tracking
    
    totalEngagements,
    avgEngagementsPerEvent: Math.round(avgEngagementsPerEvent),
    leadsGenerated,
    samplesDistributed,
    
    totalEarnings: Math.round(totalEarnings),
    totalExpenses: Math.round(totalExpenses),
  };
}
