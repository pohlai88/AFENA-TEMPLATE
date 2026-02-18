/**
 * Performance Tracking Service
 * Tracks impressions, clicks, conversions, viewability, and engagement metrics
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface AdPerformance {
  performanceId: string;
  
  // Context
  campaignId: string;
  date: Date;
  
  // Delivery
  impressions: number;
  reach: number;
  frequency: number;
  
  // Engagement
  clicks: number;
  ctr: number;
  videoViews?: number;
  videoCompletionRate?: number;
  engagementRate: number;
  
  // Conversions
  conversions: number;
  conversionValue: number;
  conversionRate: number;
  
  // Costs
  spend: number;
  cpm: number;
  cpc: number;
  cpa: number;
  
  // ROI
  revenue: number;
  roas: number;
  roi: number;
}

// ============================================================================
// Database Operations
// ============================================================================

export function recordAdPerformance(
  _db: NeonHttpDatabase,
  _orgId: string,
  _performance: Omit<AdPerformance, 'performanceId' | 'ctr' | 'conversionRate' | 'cpm' | 'cpc' | 'cpa' | 'roas' | 'roi'>
): AdPerformance {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculateCTR(clicks: number, impressions: number): number {
  if (impressions === 0) return 0;
  return Math.round((clicks / impressions) * 10000) / 100;
}

export function calculateCPM(spend: number, impressions: number): number {
  if (impressions === 0) return 0;
  return Math.round((spend / impressions) * 1000 * 100) / 100;
}

export function calculateCPC(spend: number, clicks: number): number {
  if (clicks === 0) return 0;
  return Math.round((spend / clicks) * 100) / 100;
}

export function calculateCPA(spend: number, conversions: number): number {
  if (conversions === 0) return 0;
  return Math.round((spend / conversions) * 100) / 100;
}
