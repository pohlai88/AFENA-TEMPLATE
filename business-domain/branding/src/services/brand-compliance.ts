/**
 * Brand Compliance Service
 * Manages usage compliance, brand audits, and violation tracking
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

// ============================================================================
// Interfaces
// ============================================================================

export interface BrandComplianceReview {
  reviewId: string;
  
  // Scope
  reviewType: 'MARKETING_MATERIAL' | 'PRODUCT_PACKAGING' | 'WEBSITE' | 'SOCIAL_MEDIA' | 'EVENT' | 'GENERAL';
  materialName: string;
  materialUrl?: string;
  
  // Review
  reviewDate: Date;
  reviewer: string;
  
  // Checks
  logoCompliance: ComplianceCheck;
  colorCompliance: ComplianceCheck;
  typographyCompliance: ComplianceCheck;
  messagingCompliance: ComplianceCheck;
  imageryCompliance: ComplianceCheck;
  
  // Overall
  overallScore: number;
  passed: boolean;
  
  // Issues
  issues: BrandIssue[];
  recommendations: string[];
  
  // Approval
  approvedForUse: boolean;
  approvalNotes?: string;
  
  status: 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PENDING_REVISION';
}

export interface ComplianceCheck {
  area: string;
  score: number;
  isCompliant: boolean;
  findings: string[];
}

export interface BrandIssue {
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  category: string;
  description: string;
  recommendation: string;
}

// ============================================================================
// Database Operations
// ============================================================================

export async function conductComplianceReview(
  _db: NeonHttpDatabase,
  _orgId: string,
  _review: Omit<BrandComplianceReview, 'reviewId' | 'overallScore' | 'passed'>
): Promise<BrandComplianceReview> {
  // TODO: Implement with Drizzle ORM
  throw new Error('Not implemented');
}

// ============================================================================
// Helper Functions
// ============================================================================

export function calculateComplianceScore(checks: ComplianceCheck[]): {
  overallScore: number;
  passed: boolean;
} {
  if (checks.length === 0) {
    return { overallScore: 0, passed: false };
  }
  
  const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
  const overallScore = totalScore / checks.length;
  const passed = overallScore >= 80;
  
  return {
    overallScore: Math.round(overallScore),
    passed,
  };
}

export function analyzeBrandCompliance(
  reviews: BrandComplianceReview[]
): {
  totalReviews: number;
  approvedCount: number;
  rejectedCount: number;
  avgComplianceScore: number;
  commonIssues: Array<{ category: string; count: number }>;
  complianceRate: number;
} {
  const totalReviews = reviews.length;
  const approvedCount = reviews.filter(r => r.status === 'APPROVED').length;
  const rejectedCount = reviews.filter(r => r.status === 'REJECTED').length;
  
  const totalScore = reviews.reduce((sum, r) => sum + r.overallScore, 0);
  const avgComplianceScore = totalReviews > 0 ? totalScore / totalReviews : 0;
  
  const issueMap = new Map<string, number>();
  reviews.forEach(review => {
    review.issues.forEach(issue => {
      issueMap.set(issue.category, (issueMap.get(issue.category) || 0) + 1);
    });
  });
  
  const commonIssues = Array.from(issueMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  const complianceRate = totalReviews > 0 ? (approvedCount / totalReviews) * 100 : 0;
  
  return {
    totalReviews,
    approvedCount,
    rejectedCount,
    avgComplianceScore: Math.round(avgComplianceScore),
    commonIssues,
    complianceRate: Math.round(complianceRate),
  };
}
