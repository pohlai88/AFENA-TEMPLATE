/**
 * Marketing Analytics Service
 * 
 * Provides dashboards, reports, and performance analysis for marketing operations.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { MarketingCampaign, CampaignActivity } from './campaign-management';
import type { Lead } from './lead-management';

// ============================================================================
// Interfaces
// ============================================================================

export interface CampaignPerformance {
  campaignId: string;
  period: { start: Date; end: Date };
  
  // Reach
  totalReach: number;
  totalImpressions: number;
  uniqueVisitors: number;
  
  // Engagement
  totalClicks: number;
  clickThroughRate: number;
  engagementRate: number;
  
  // Leads
  totalLeads: number;
  mqls: number; // Marketing qualified leads
  sqls: number; // Sales qualified leads
  
  // Conversions
  totalConversions: number;
  conversionRate: number;
  revenueGenerated: number;
  
  // Cost metrics
  totalSpent: number;
  costPerLead: number;
  costPerConversion: number;
  costPerClick: number;
  
  // ROI
  roi: number;
  roas: number; // Return on ad spend
}

export interface MarketingFunnelMetrics {
  period: { start: Date; end: Date };
  
  // Funnel stages
  visitors: number;
  leads: number;
  mqls: number;
  sqls: number;
  opportunities: number;
  conversions: number;
  
  // Conversion rates
  visitorToLeadRate: number;
  leadToMQLRate: number;
  mqlToSQLRate: number;
  sqlToOpportunityRate: number;
  opportunityToConversionRate: number;
  overallConversionRate: number;
  
  // Velocity
  avgTimeToMQL: number; // days
  avgTimeToSQL: number; // days
  avgTimeToConversion: number; // days
}

export interface ChannelPerformance {
  channel: string;
  
  // Volume
  campaigns: number;
  leads: number;
  conversions: number;
  
  // Cost
  totalSpent: number;
  costPerLead: number;
  costPerConversion: number;
  
  // Effectiveness
  conversionRate: number;
  roi: number;
  roas: number;
  
  // Engagement
  avgEngagementRate: number;
  avgClickThroughRate: number;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function getCampaignPerformance(
  _db: NeonHttpDatabase,
  _orgId: string,
  _campaignId: string,
  _period: { start: Date; end: Date }
): Promise<CampaignPerformance> {
  // TODO: Query and calculate campaign performance metrics
  throw new Error('Database integration pending');
}

export async function getMarketingDashboard(
  _db: NeonHttpDatabase,
  _orgId: string,
  _period: { start: Date; end: Date }
): Promise<{
  overview: Omit<CampaignPerformance, 'campaignId'>;
  funnelMetrics: MarketingFunnelMetrics;
  channelPerformance: ChannelPerformance[];
  topCampaigns: Array<{ campaignId: string; name: string; roi: number }>;
}> {
  // TODO: Generate comprehensive marketing dashboard
  throw new Error('Database integration pending');
}

// ============================================================================
// Analytics Functions
// ============================================================================

export function analyzeMarketingPerformance(
  campaigns: MarketingCampaign[],
  leads: Lead[],
  _activities: CampaignActivity[]
): {
  totalBudget: number;
  totalSpent: number;
  budgetUtilization: number;
  totalLeads: number;
  mqls: number;
  sqls: number;
  leadToMQLRate: number;
  mqlToSQLRate: number;
  totalConversions: number;
  conversionRate: number;
  avgCostPerLead: number;
  avgROI: number;
  topChannel: string;
} {
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budgetAllocated, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.budgetSpent, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  
  const totalLeads = leads.length;
  const mqls = leads.filter(l => 
    l.qualifyStatus === 'MARKETING_QUALIFIED' || l.qualifyStatus === 'SALES_QUALIFIED'
  ).length;
  const sqls = leads.filter(l => l.qualifyStatus === 'SALES_QUALIFIED').length;
  
  const leadToMQLRate = totalLeads > 0 ? (mqls / totalLeads) * 100 : 0;
  const mqlToSQLRate = mqls > 0 ? (sqls / mqls) * 100 : 0;
  
  const totalConversions = leads.filter(l => l.status === 'CONVERTED').length;
  const conversionRate = totalLeads > 0 ? (totalConversions / totalLeads) * 100 : 0;
  
  const avgCostPerLead = totalLeads > 0 ? totalSpent / totalLeads : 0;
  
  // Simplified ROI (would need actual revenue data)
  const estimatedRevenue = totalConversions * 1000; // Placeholder
  const avgROI = totalSpent > 0 ? ((estimatedRevenue - totalSpent) / totalSpent) * 100 : 0;
  
  // Find top channel by lead count
  const channelLeads = new Map<string, number>();
  leads.forEach(lead => {
    const source = lead.source;
    channelLeads.set(source, (channelLeads.get(source) || 0) + 1);
  });
  
  const topChannel = Array.from(channelLeads.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'UNKNOWN';
  
  return {
    totalBudget: Math.round(totalBudget),
    totalSpent: Math.round(totalSpent),
    budgetUtilization: Math.round(budgetUtilization),
    totalLeads,
    mqls,
    sqls,
    leadToMQLRate: Math.round(leadToMQLRate),
    mqlToSQLRate: Math.round(mqlToSQLRate),
    totalConversions,
    conversionRate: Math.round(conversionRate * 10) / 10,
    avgCostPerLead: Math.round(avgCostPerLead),
    avgROI: Math.round(avgROI),
    topChannel,
  };
}

export function identifyTopPerformingCampaigns(
  campaigns: MarketingCampaign[],
  performance: Record<string, CampaignPerformance>
): Array<{
  campaignId: string;
  name: string;
  roi: number;
  leads: number;
  conversions: number;
}> {
  return campaigns
    .map(campaign => ({
      campaignId: campaign.campaignId,
      name: campaign.name,
      roi: performance[campaign.campaignId]?.roi || 0,
      leads: performance[campaign.campaignId]?.totalLeads || 0,
      conversions: performance[campaign.campaignId]?.totalConversions || 0,
    }))
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 10);
}

export function calculateFunnelMetrics(
  leads: Lead[],
  visitors: number = 0
): MarketingFunnelMetrics {
  const totalLeads = leads.length;
  const mqls = leads.filter(l => 
    l.qualifyStatus === 'MARKETING_QUALIFIED' || l.qualifyStatus === 'SALES_QUALIFIED'
  ).length;
  const sqls = leads.filter(l => l.qualifyStatus === 'SALES_QUALIFIED').length;
  const conversions = leads.filter(l => l.status === 'CONVERTED').length;
  
  // Would need opportunity data from CRM
  const opportunities = sqls; // Placeholder
  
  return {
    period: { start: new Date(), end: new Date() },
    
    visitors,
    leads: totalLeads,
    mqls,
    sqls,
    opportunities,
    conversions,
    
    visitorToLeadRate: visitors > 0 ? (totalLeads / visitors) * 100 : 0,
    leadToMQLRate: totalLeads > 0 ? (mqls / totalLeads) * 100 : 0,
    mqlToSQLRate: mqls > 0 ? (sqls / mqls) * 100 : 0,
    sqlToOpportunityRate: sqls > 0 ? (opportunities / sqls) * 100 : 0,
    opportunityToConversionRate: opportunities > 0 ? (conversions / opportunities) * 100 : 0,
    overallConversionRate: visitors > 0 ? (conversions / visitors) * 100 : 0,
    
    avgTimeToMQL: 0, // Would need to calculate from lead data
    avgTimeToSQL: 0,
    avgTimeToConversion: 0,
  };
}

export function identifyUnderperformingCampaigns(
  campaigns: MarketingCampaign[],
  performance: Record<string, CampaignPerformance>,
  thresholds: {
    minROI?: number;
    minConversionRate?: number;
    minBudgetUtilization?: number;
  }
): Array<{
  campaignId: string;
  name: string;
  issues: string[];
  roi: number;
  conversionRate: number;
}> {
  const minROI = thresholds.minROI || 0;
  const minConversionRate = thresholds.minConversionRate || 1;
  const minBudgetUtilization = thresholds.minBudgetUtilization || 50;
  
  return campaigns
    .filter(campaign => {
      const perf = performance[campaign.campaignId];
      if (!perf) return false;
      
      return (
        perf.roi < minROI ||
        perf.conversionRate < minConversionRate ||
        (campaign.budgetSpent / campaign.budgetAllocated) * 100 < minBudgetUtilization
      );
    })
    .map(campaign => {
      const perf = performance[campaign.campaignId];
      const issues: string[] = [];
      
      if (!perf) return { campaignId: campaign.campaignId, name: campaign.name, issues: ['No performance data'], roi: 0, conversionRate: 0 };
      
      if (perf.roi < minROI) issues.push(`Low ROI (${perf.roi.toFixed(1)}%)`);
      if (perf.conversionRate < minConversionRate) issues.push(`Low conversion rate (${perf.conversionRate.toFixed(1)}%)`);
      
      const utilization = (campaign.budgetSpent / campaign.budgetAllocated) * 100;
      if (utilization < minBudgetUtilization) issues.push(`Low budget utilization (${utilization.toFixed(1)}%)`);
      
      return {
        campaignId: campaign.campaignId,
        name: campaign.name,
        issues,
        roi: perf.roi,
        conversionRate: perf.conversionRate,
      };
    })
    .slice(0, 10);
}

export function forecastLeadGeneration(
  historicalLeads: Array<{ date: Date; count: number }>,
  forecastDays: number = 30
): Array<{ date: Date; forecastedLeads: number; confidenceInterval: [number, number] }> {
  // Simple moving average forecast
  if (historicalLeads.length < 7) {
    return [];
  }
  
  const avgDailyLeads = historicalLeads.reduce((sum, d) => sum + d.count, 0) / historicalLeads.length;
  const stdDev = Math.sqrt(
    historicalLeads.reduce((sum, d) => sum + Math.pow(d.count - avgDailyLeads, 2), 0) / historicalLeads.length
  );
  
  const forecast: Array<{ date: Date; forecastedLeads: number; confidenceInterval: [number, number] }> = [];
  const lastRecord = historicalLeads[historicalLeads.length - 1];
  if (!lastRecord) return [];
  
  const lastDate = lastRecord.date;
  
  for (let i = 1; i <= forecastDays; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    forecast.push({
      date: forecastDate,
      forecastedLeads: Math.round(avgDailyLeads),
      confidenceInterval: [
        Math.max(0, Math.round(avgDailyLeads - 1.96 * stdDev)),
        Math.round(avgDailyLeads + 1.96 * stdDev),
      ],
    });
  }
  
  return forecast;
}
