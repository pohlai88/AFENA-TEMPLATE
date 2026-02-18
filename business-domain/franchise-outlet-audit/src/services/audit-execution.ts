import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import type { AuditCategory, AuditResult, AuditType, OutletAudit } from '../types/common.js';

/**
 * Create a new outlet audit
 */
export async function createAudit(
  db: NeonHttpDatabase,
  orgId: string,
  data: Omit<OutletAudit, 'id' | 'createdAt' | 'status'>,
): Promise<OutletAudit> {
  // TODO: Insert into database with SCHEDULED status
  // INSERT INTO outlet_audits (org_id, outlet_id, audit_type, audit_date, auditor_id, status, ...)
  throw new Error('Database integration pending');
}

/**
 * Get audits for an outlet
 */
export async function getOutletAudits(
  db: NeonHttpDatabase,
  outletId: string,
  dateFrom?: Date,
  dateTo?: Date,
): Promise<OutletAudit[]> {
  // TODO: Query database with optional date range filter
  throw new Error('Database integration pending');
}

/**
 * Start an audit (change status to IN_PROGRESS)
 */
export async function startAudit(
  db: NeonHttpDatabase,
  auditId: string,
  auditorId: string,
): Promise<OutletAudit> {
  // TODO: Update audit status to IN_PROGRESS
  // UPDATE outlet_audits SET status = 'IN_PROGRESS' WHERE id = $1
  throw new Error('Database integration pending');
}

/**
 * Complete an audit with final score and result
 */
export async function completeAudit(
  db: NeonHttpDatabase,
  auditId: string,
  overallScore: number,
): Promise<OutletAudit> {
  // TODO: Update audit with score, result, completed_at
  const result = determineAuditResult(overallScore);
  throw new Error('Database integration pending');
}

/**
 * Add category scores to an audit
 */
export async function addCategoryScore(
  db: NeonHttpDatabase,
  auditId: string,
  categoryData: Omit<AuditCategory, 'id'>,
): Promise<AuditCategory> {
  // TODO: Insert category score into database
  throw new Error('Database integration pending');
}

/**
 * Calculate overall audit score from category scores
 */
export function calculateOverallScore(categories: AuditCategory[]): number {
  if (categories.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const category of categories) {
    if (category.score !== undefined) {
      weightedSum += (category.score / category.maxScore) * 100 * category.weight;
      totalWeight += category.weight;
    }
  }

  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * Determine audit result based on score
 */
export function determineAuditResult(score: number): AuditResult {
  if (score >= 95) return 'EXCELLENT';
  if (score >= 85) return 'GOOD';
  if (score >= 70) return 'SATISFACTORY';
  if (score >= 50) return 'NEEDS_IMPROVEMENT';
  return 'CRITICAL_FAILURE';
}

/**
 * Generate audit checklist for a specific audit type
 */
export function generateAuditChecklist(auditType: AuditType): Array<{
  category: string;
  items: Array<{ description: string; weight: number }>;
}> {
  const checklists: Record<AuditType, Array<{
    category: string;
    items: Array<{ description: string; weight: number }>;
  }>> = {
    QUALITY: [
      {
        category: 'Product Quality',
        items: [
          { description: 'Food temperature compliance', weight: 3 },
          { description: 'Portion control accuracy', weight: 2 },
          { description: 'Presentation standards', weight: 2 },
          { description: 'Ingredient freshness', weight: 3 },
        ],
      },
      {
        category: 'Service Quality',
        items: [
          { description: 'Order accuracy', weight: 3 },
          { description: 'Service speed', weight: 2 },
          { description: 'Customer interaction', weight: 2 },
        ],
      },
    ],
    HEALTH_SAFETY: [
      {
        category: 'Food Safety',
        items: [
          { description: 'Temperature logs maintained', weight: 3 },
          { description: 'HACCP compliance', weight: 3 },
          { description: 'Cross-contamination prevention', weight: 3 },
          { description: 'Proper food storage', weight: 2 },
        ],
      },
      {
        category: 'Sanitation',
        items: [
          { description: 'Equipment cleanliness', weight: 2 },
          { description: 'Hand washing compliance', weight: 3 },
          { description: 'Pest control', weight: 2 },
        ],
      },
    ],
    BRAND_STANDARDS: [
      {
        category: 'Visual Standards',
        items: [
          { description: 'Signage condition', weight: 2 },
          { description: 'Interior cleanliness', weight: 3 },
          { description: 'Uniform compliance', weight: 2 },
          { description: 'Brand materials updated', weight: 1 },
        ],
      },
    ],
    OPERATIONAL: [
      {
        category: 'Operations',
        items: [
          { description: 'Labor scheduling efficiency', weight: 2 },
          { description: 'Inventory management', weight: 2 },
          { description: 'Equipment maintenance', weight: 2 },
          { description: 'Cash handling procedures', weight: 3 },
        ],
      },
    ],
    FINANCIAL: [
      {
        category: 'Financial Controls',
        items: [
          { description: 'Daily reconciliation', weight: 3 },
          { description: 'Variance analysis', weight: 2 },
          { description: 'Waste tracking', weight: 2 },
          { description: 'POS compliance', weight: 2 },
        ],
      },
    ],
    MYSTERY_SHOPPER: [
      {
        category: 'Customer Experience',
        items: [
          { description: 'Greeting quality', weight: 2 },
          { description: 'Product knowledge', weight: 2 },
          { description: 'Upselling attempt', weight: 1 },
          { description: 'Problem resolution', weight: 3 },
          { description: 'Overall satisfaction', weight: 2 },
        ],
      },
    ],
  };

  return checklists[auditType] || [];
}

/**
 * Validate audit completion (all required categories scored)
 */
export function validateAuditCompletion(
  auditType: AuditType,
  categories: AuditCategory[],
): {
  isComplete: boolean;
  missingCategories: string[];
} {
  const checklist = generateAuditChecklist(auditType);
  const scoredCategories = new Set(categories.map((c) => c.categoryName));
  const missingCategories: string[] = [];

  for (const checkCategory of checklist) {
    if (!scoredCategories.has(checkCategory.category)) {
      missingCategories.push(checkCategory.category);
    }
  }

  return {
    isComplete: missingCategories.length === 0,
    missingCategories,
  };
}

/**
 * Compare audit scores against previous audit
 */
export function compareWithPreviousAudit(
  currentScore: number,
  previousScore: number,
): {
  improvement: number;
  percentChange: number;
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
} {
  const improvement = currentScore - previousScore;
  const percentChange = previousScore > 0 ? (improvement / previousScore) * 100 : 0;

  let trend: 'IMPROVING' | 'STABLE' | 'DECLINING' = 'STABLE';
  if (percentChange > 2) trend = 'IMPROVING';
  else if (percentChange < -2) trend = 'DECLINING';

  return { improvement, percentChange, trend };
}

