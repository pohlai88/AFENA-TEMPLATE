/**
 * Attribution Engine Service
 * 
 * Manages multi-touch attribution models and ROI calculation for marketing campaigns.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface Touchpoint {
  touchpointId: string;
  leadId: string;
  
  // Source
  campaignId?: string;
  source: string;
  medium: string;
  channel: 'ORGANIC_SEARCH' | 'PAID_SEARCH' | 'SOCIAL_MEDIA' | 'EMAIL' | 'DIRECT' | 'REFERRAL' | 'DISPLAY';
  
  // Details
  touchpointDate: Date;
  position: number; // Position in customer journey
  
  // Content
  contentId?: string;
  pageUrl?: string;
  
  // Value
  attributedRevenue?: number;
  attributionWeight?: number;
}

export interface AttributionModel {
  modelType: 'FIRST_TOUCH' | 'LAST_TOUCH' | 'LINEAR' | 'TIME_DECAY' | 'POSITION_BASED' | 'ALGORITHMIC';
  parameters?: {
    decayRate?: number; // For time-decay model
    firstTouchWeight?: number; // For position-based model
    lastTouchWeight?: number; // For position-based model
  };
}

export interface ChannelAttribution {
  channel: Touchpoint['channel'];
  
  touchpoints: number;
  attributedRevenue: number;
  attributedConversions: number;
  
  costPerConversion: number;
  roas: number; // Return on ad spend
  roi: number;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function recordTouchpoint(
  _db: NeonHttpDatabase,
  _orgId: string,
  _touchpoint: Omit<Touchpoint, 'touchpointId' | 'position' | 'attributedRevenue' | 'attributionWeight'>
): Promise<Touchpoint> {
  // TODO: Record touchpoint and calculate position in journey
  throw new Error('Database integration pending');
}

export async function getLeadTouchpoints(
  _db: NeonHttpDatabase,
  _orgId: string,
  _leadId: string
): Promise<Touchpoint[]> {
  // TODO: Query all touchpoints for a lead
  throw new Error('Database integration pending');
}

export async function getConversionPath(
  _db: NeonHttpDatabase,
  _orgId: string,
  _leadId: string
): Promise<{
  touchpoints: Touchpoint[];
  conversionValue: number;
  conversionDate: Date;
}> {
  // TODO: Get complete conversion path with value
  throw new Error('Database integration pending');
}

// ============================================================================
// Attribution Functions
// ============================================================================

export function applyAttributionModel(
  touchpoints: Touchpoint[],
  conversionValue: number,
  model: AttributionModel
): Touchpoint[] {
  const touchpointsWithAttribution = [...touchpoints];
  const totalTouchpoints = touchpoints.length;
  
  if (totalTouchpoints === 0) return touchpointsWithAttribution;
  
  switch (model.modelType) {
    case 'FIRST_TOUCH':
      // 100% credit to first touchpoint
      if (touchpointsWithAttribution[0]) {
        touchpointsWithAttribution[0].attributionWeight = 1.0;
        touchpointsWithAttribution[0].attributedRevenue = conversionValue;
      }
      break;
      
    case 'LAST_TOUCH':
      // 100% credit to last touchpoint
      const lastIndex = totalTouchpoints - 1;
      if (touchpointsWithAttribution[lastIndex]) {
        touchpointsWithAttribution[lastIndex].attributionWeight = 1.0;
        touchpointsWithAttribution[lastIndex].attributedRevenue = conversionValue;
      }
      break;
      
    case 'LINEAR':
      // Equal credit to all touchpoints
      const linearWeight = 1 / totalTouchpoints;
      const linearRevenue = conversionValue / totalTouchpoints;
      touchpointsWithAttribution.forEach(tp => {
        tp.attributionWeight = linearWeight;
        tp.attributedRevenue = linearRevenue;
      });
      break;
      
    case 'TIME_DECAY':
      // Exponential decay - more recent touchpoints get more credit
      const decayRate = model.parameters?.decayRate || 0.5;
      let totalDecayWeight = 0;
      
      touchpointsWithAttribution.forEach((tp, index) => {
        const weight = Math.pow(decayRate, totalTouchpoints - index - 1);
        tp.attributionWeight = weight;
        totalDecayWeight += weight;
      });
      
      // Normalize weights and assign revenue
      touchpointsWithAttribution.forEach(tp => {
        tp.attributionWeight = (tp.attributionWeight || 0) / totalDecayWeight;
        tp.attributedRevenue = conversionValue * (tp.attributionWeight || 0);
      });
      break;
      
    case 'POSITION_BASED':
      // 40% to first, 40% to last, 20% evenly distributed
      const firstWeight = model.parameters?.firstTouchWeight || 0.4;
      const lastWeight = model.parameters?.lastTouchWeight || 0.4;
      const middleWeight = 1 - firstWeight - lastWeight;
      
      touchpointsWithAttribution.forEach((tp, index) => {
        if (index === 0) {
          tp.attributionWeight = firstWeight;
        } else if (index === totalTouchpoints - 1) {
          tp.attributionWeight = lastWeight;
        } else {
          tp.attributionWeight = middleWeight / (totalTouchpoints - 2);
        }
        tp.attributedRevenue = conversionValue * (tp.attributionWeight || 0);
      });
      break;
  }
  
  return touchpointsWithAttribution;
}

export function calculateChannelAttribution(
  touchpoints: Touchpoint[],
  channelCosts: Record<string, number>
): ChannelAttribution[] {
  const channelStats = new Map<Touchpoint['channel'], {
    touchpoints: number;
    attributedRevenue: number;
    attributedConversions: number;
  }>();
  
  touchpoints.forEach(tp => {
    const current = channelStats.get(tp.channel) || {
      touchpoints: 0,
      attributedRevenue: 0,
      attributedConversions: 0,
    };
    
    current.touchpoints++;
    current.attributedRevenue += tp.attributedRevenue || 0;
    if (tp.attributionWeight && tp.attributionWeight > 0) {
      current.attributedConversions += tp.attributionWeight;
    }
    
    channelStats.set(tp.channel, current);
  });
  
  return Array.from(channelStats.entries()).map(([channel, stats]) => {
    const cost = channelCosts[channel] || 0;
    const costPerConversion = stats.attributedConversions > 0
      ? cost / stats.attributedConversions
      : 0;
    const roas = cost > 0 ? stats.attributedRevenue / cost : 0;
    const roi = cost > 0 ? ((stats.attributedRevenue - cost) / cost) * 100 : 0;
    
    return {
      channel,
      touchpoints: stats.touchpoints,
      attributedRevenue: Math.round(stats.attributedRevenue * 100) / 100,
      attributedConversions: Math.round(stats.attributedConversions * 100) / 100,
      costPerConversion: Math.round(costPerConversion * 100) / 100,
      roas: Math.round(roas * 100) / 100,
      roi: Math.round(roi * 10) / 10,
    };
  });
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculateROI(revenue: number, cost: number): number {
  if (cost === 0) return 0;
  return Math.round(((revenue - cost) / cost) * 10000) / 100;
}

export function calculateConversionRate(conversions: number, visits: number): number {
  if (visits === 0) return 0;
  return Math.round((conversions / visits) * 10000) / 100;
}

export function calculateROAS(revenue: number, adSpend: number): number {
  if (adSpend === 0) return 0;
  return Math.round((revenue / adSpend) * 100) / 100;
}

export function identifyTopConversionPaths(
  conversionPaths: Array<{
    path: Touchpoint[];
    conversionValue: number;
    conversions: number;
  }>,
  limit: number = 10
): typeof conversionPaths {
  return conversionPaths
    .sort((a, b) => b.conversions - a.conversions)
    .slice(0, limit);
}

export function calculateAssistedConversions(
  touchpoints: Touchpoint[]
): {
  channel: Touchpoint['channel'];
  assistedConversions: number;
  lastClickConversions: number;
  assistedConversionValue: number;
}[] {
  const channelStats = new Map<Touchpoint['channel'], {
    assisted: number;
    lastClick: number;
    assistedValue: number;
  }>();
  
  // Group touchpoints by lead
  const leadTouchpoints = new Map<string, Touchpoint[]>();
  touchpoints.forEach(tp => {
    const tps = leadTouchpoints.get(tp.leadId) || [];
    tps.push(tp);
    leadTouchpoints.set(tp.leadId, tps);
  });
  
  // Analyze each lead's journey
  leadTouchpoints.forEach(tps => {
    const sortedTps = tps.sort((a, b) => a.position - b.position);
    const lastTouchpoint = sortedTps[sortedTps.length - 1];
    
    if (!lastTouchpoint) return;
    
    sortedTps.forEach(tp => {
      const current = channelStats.get(tp.channel) || {
        assisted: 0,
        lastClick: 0,
        assistedValue: 0,
      };
      
      if (tp.touchpointId === lastTouchpoint.touchpointId) {
        current.lastClick++;
      } else {
        current.assisted++;
        current.assistedValue += tp.attributedRevenue || 0;
      }
      
      channelStats.set(tp.channel, current);
    });
  });
  
  return Array.from(channelStats.entries()).map(([channel, stats]) => ({
    channel,
    assistedConversions: stats.assisted,
    lastClickConversions: stats.lastClick,
    assistedConversionValue: Math.round(stats.assistedValue * 100) / 100,
  }));
}
