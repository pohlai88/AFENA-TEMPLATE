/**
 * Sourcing & RFQ Service
 * 
 * Handles RFQ/RFP creation, bid evaluation, and vendor award.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';

export interface RFQParams {
  reqIds?: string[];
  vendors: string[];
  responseDeadline: string;
  evaluationCriteria: Array<{
    criterion: string;
    weight: number;
  }>;
  items?: Array<{
    description: string;
    quantity: number;
    specifications?: string;
  }>;
}

export interface BidEvaluation {
  rfqId: string;
  rankings: Array<{
    vendorId: string;
    totalScore: number;
    rank: number;
    breakdown: Record<string, number>;
  }>;
}

export interface RFQAward {
  awardId: string;
  rfqId: string;
  vendorId: string;
  poDraftId?: string;
  status: 'awarded' | 'pending_po';
}

/**
 * Create RFQ package for vendor bidding
 * 
 * @param db - Database connection
 * @param orgId - Organization ID
 * @param params - RFQ parameters
 * @returns Created RFQ with ID
 */
export async function createRFQ(
  db: NeonHttpDatabase,
  orgId: string,
  params: RFQParams,
): Promise<{ rfqId: string; status: string; bidCount: number; evaluationCriteria: RFQParams['evaluationCriteria'] }> {
  // Validate evaluation criteria weights sum to 1.0
  const totalWeight = params.evaluationCriteria.reduce((sum, c) => sum + c.weight, 0);
  if (Math.abs(totalWeight - 1.0) > 0.001) {
    throw new Error(`Evaluation criteria weights must sum to 1.0, got ${totalWeight}`);
  }

  // TODO: Generate RFQ number
  const rfqId = `RFQ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

  // TODO: Insert RFQ into database
  // const rfq = await db.insert(rfqs).values({...}).returning();

  // TODO: Send RFQ to vendors (email/portal notification)

  return {
    rfqId,
    status: 'sent',
    bidCount: 0,
    evaluationCriteria: params.evaluationCriteria,
  };
}

/**
 * Evaluate vendor bids using weighted criteria
 * 
 * @param db - Database connection
 * @param orgId - Organization ID
 * @param params - Evaluation parameters
 * @returns Ranked vendor proposals
 */
export async function evaluateBids(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    rfqId: string;
    criteria: Array<{ criterion: string; weight: number }>;
    weights: number[];
    bids: Array<{
      vendorId: string;
      scores: number[]; // Score for each criterion (0-100)
    }>;
  },
): Promise<BidEvaluation> {
  // Calculate weighted scores for each bid
  const rankings = params.bids.map((bid) => {
    let totalScore = 0;
    const breakdown: Record<string, number> = {};

    params.criteria.forEach((criterion, index) => {
      const weightedScore = bid.scores[index] * criterion.weight;
      totalScore += weightedScore;
      breakdown[criterion.criterion] = bid.scores[index];
    });

    return {
      vendorId: bid.vendorId,
      totalScore: Math.round(totalScore * 10) / 10, // Round to 1 decimal
      rank: 0, // Will be assigned after sorting
      breakdown,
    };
  });

  // Sort by score descending and assign ranks
  rankings.sort((a, b) => b.totalScore - a.totalScore);
  rankings.forEach((ranking, index) => {
    ranking.rank = index + 1;
  });

  return {
    rfqId: params.rfqId,
    rankings,
  };
}

/**
 * Award RFQ to selected vendor
 * 
 * @param db - Database connection
 * @param orgId - Organization ID
 * @param params - Award parameters
 * @returns Award confirmation with optional PO draft
 */
export async function awardRFQ(
  db: NeonHttpDatabase,
  orgId: string,
  params: {
    rfqId: string;
    vendorId: string;
    items: Array<{ description: string; quantity: number }>;
    createPO?: boolean;
  },
): Promise<RFQAward> {
  // TODO: Update RFQ status to awarded
  // await db.update(rfqs).set({ status: 'awarded', awardedVendorId: params.vendorId });

  const awardId = `AWD-${new Date().getFullYear()}-${params.rfqId.split('-')[2]}`;

  // TODO: Create PO draft if requested
  let poDraftId: string | undefined;
  if (params.createPO) {
    poDraftId = `PO-DRAFT-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    // await createPODraft(db, orgId, {...});
  }

  // TODO: Notify unsuccessful vendors

  return {
    awardId,
    rfqId: params.rfqId,
    vendorId: params.vendorId,
    poDraftId,
    status: params.createPO ? 'pending_po' : 'awarded',
  };
}
