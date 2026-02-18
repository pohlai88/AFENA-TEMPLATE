/**
 * Promoter Analytics Service
 * Provides productivity metrics, conversion rates, and ROI per promoter
 */

import type { Promoter } from './promoter-recruitment';
import type { PromotionalEvent } from './assignment-management';
import type { ActivityReport } from './activity-tracking';
import type { PromoterPerformance } from './performance-management';

// ============================================================================
// Analytics Functions
// ============================================================================

export function identifyTopPromoters(
  promoters: Promoter[],
  performances: Map<string, PromoterPerformance>
): Array<{
  promoterId: string;
  name: string;
  eventsWorked: number;
  avgRating: number;
  attendanceRate: number;
  totalEngagements: number;
}> {
  return promoters
    .filter(p => p.status === 'ACTIVE')
    .map(p => {
      const perf = performances.get(p.promoterId);
      return {
        promoterId: p.promoterId,
        name: `${p.firstName} ${p.lastName}`,
        eventsWorked: perf?.eventsWorked || 0,
        avgRating: p.avgRating,
        attendanceRate: perf?.attendanceRate || 0,
        totalEngagements: perf?.totalEngagements || 0,
      };
    })
    .sort((a, b) => {
      // Sort by weighted score: rating * 0.4 + attendance * 0.3 + engagements * 0.3
      const scoreA = a.avgRating * 0.4 + a.attendanceRate * 0.3 + (a.totalEngagements / 100) * 0.3;
      const scoreB = b.avgRating * 0.4 + b.attendanceRate * 0.3 + (b.totalEngagements / 100) * 0.3;
      return scoreB - scoreA;
    })
    .slice(0, 20);
}

export function analyzeEventROI(
  event: PromotionalEvent,
  reports: ActivityReport[]
): {
  totalCost: number;
  costPerEngagement: number;
  costPerLead: number;
  engagementRate: number;
  leadConversionRate: number;
} {
  const totalEngagements = reports.reduce((sum, r) => sum + r.consumerEngagements, 0);
  const totalLeads = reports.reduce((sum, r) => sum + r.leadsCollected, 0);
  
  const costPerEngagement = totalEngagements > 0 ? event.actualCost / totalEngagements : 0;
  const costPerLead = totalLeads > 0 ? event.actualCost / totalLeads : 0;
  
  const engagementRate = event.targetEngagements > 0 
    ? (totalEngagements / event.targetEngagements) * 100 
    : 0;
  
  const leadConversionRate = totalEngagements > 0 
    ? (totalLeads / totalEngagements) * 100 
    : 0;
  
  return {
    totalCost: Math.round(event.actualCost),
    costPerEngagement: Math.round(costPerEngagement * 100) / 100,
    costPerLead: Math.round(costPerLead * 100) / 100,
    engagementRate: Math.round(engagementRate),
    leadConversionRate: Math.round(leadConversionRate * 10) / 10,
  };
}
