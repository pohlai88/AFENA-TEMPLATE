/**
 * Advertising Analytics Service
 * Analyzes ROAS, CPM/CPC metrics, campaign effectiveness, and attribution modeling
 */

import type { AdvertisingCampaign } from './campaign-planning';
import type { AdPerformance } from './performance-tracking';

// ============================================================================
// Interfaces
// ============================================================================

export interface AttributionModel {
  modelId: string;
  
  // Model details
  modelType: 'LAST_CLICK' | 'FIRST_CLICK' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'DATA_DRIVEN';
  modelName: string;
  
  // Configuration
  lookbackWindow: number; // days
  
  // Results
  conversions: ConversionAttribution[];
}

export interface ConversionAttribution {
  conversionId: string;
  conversionDate: Date;
  conversionValue: number;
  
  touchpoints: Touchpoint[];
  attributedCampaigns: Array<{
    campaignId: string;
    attributionCredit: number; // 0-1
    attributedValue: number;
  }>;
}

export interface Touchpoint {
  timestamp: Date;
  channel: string;
  campaignId?: string;
  touchpointType: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculateROAS(revenue: number, spend: number): number {
  if (spend === 0) return 0;
  return Math.round((revenue / spend) * 100) / 100;
}

export function analyzeAdvertisingPerformance(
  campaigns: AdvertisingCampaign[],
  performance: AdPerformance[]
): {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgCTR: number;
  avgConversionRate: number;
  avgCPC: number;
  avgCPA: number;
  avgROAS: number;
  spendByChannel: Record<string, number>;
  topCampaignsByROAS: Array<{ name: string; roas: number }>;
} {
  const totalSpend = performance.reduce((sum, p) => sum + p.spend, 0);
  const totalImpressions = performance.reduce((sum, p) => sum + p.impressions, 0);
  const totalClicks = performance.reduce((sum, p) => sum + p.clicks, 0);
  const totalConversions = performance.reduce((sum, p) => sum + p.conversions, 0);
  
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
  const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const avgCPA = totalConversions > 0 ? totalSpend / totalConversions : 0;
  
  const totalRevenue = performance.reduce((sum, p) => sum + p.revenue, 0);
  const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  
  // Spend by channel
  const spendByChannel: Record<string, number> = {};
  campaigns.forEach(campaign => {
    const campaignSpend = campaign.actualSpend;
    spendByChannel[campaign.campaignType] = (spendByChannel[campaign.campaignType] ?? 0) + campaignSpend;
  });
  
  // Top campaigns by ROAS
  const campaignROAS = new Map<string, number>();
  performance.forEach(p => {
    if (!campaignROAS.has(p.campaignId)) {
      campaignROAS.set(p.campaignId, p.roas);
    }
  });
  
  const topCampaignsByROAS = campaigns
    .map(c => ({
      name: c.name,
      roas: campaignROAS.get(c.campaignId) ?? 0,
    }))
    .sort((a, b) => b.roas - a.roas)
    .slice(0, 5);
  
  return {
    totalSpend: Math.round(totalSpend),
    totalImpressions,
    totalClicks,
    totalConversions,
    avgCTR: Math.round(avgCTR * 100) / 100,
    avgConversionRate: Math.round(avgConversionRate * 100) / 100,
    avgCPC: Math.round(avgCPC * 100) / 100,
    avgCPA: Math.round(avgCPA * 100) / 100,
    avgROAS: Math.round(avgROAS * 100) / 100,
    spendByChannel,
    topCampaignsByROAS,
  };
}
