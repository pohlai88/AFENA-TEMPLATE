/**
 * Hedge Accounting Service
 *
 * Tracks hedge accounting relationships and effectiveness testing.
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';

// Schemas
export const trackHedgeSchema = z.object({
  hedgeType: z.enum(['cash_flow', 'fair_value', 'net_investment']),
  hedgedItemId: z.string().uuid(),
  hedgingInstrumentId: z.string().uuid(),
  notionalAmount: z.number().int(),
  currency: z.string().length(3),
  maturityDate: z.string().datetime(),
  designationDate: z.string().datetime().optional(),
});

export const testEffectivenessSchema = z.object({
  hedgeRelationshipId: z.string().uuid(),
  testDate: z.string().datetime(),
  hedgedItemChange: z.number().int(),
  hedgingInstrumentChange: z.number().int(),
});

export type TrackHedgeInput = z.infer<typeof trackHedgeSchema>;
export type TestEffectivenessInput = z.infer<typeof testEffectivenessSchema>;

// Types
export type HedgeType = 'cash_flow' | 'fair_value' | 'net_investment';

export interface HedgeRelationship {
  id: string;
  hedgeType: HedgeType;
  hedgedItemId: string;
  hedgedItemDescription: string;
  hedgingInstrumentId: string;
  hedgingInstrumentDescription: string;
  notionalAmount: number;
  currency: string;
  maturityDate: string;
  designationDate: string;
  status: 'active' | 'de_designated' | 'matured';
  effectivenessRatio: string | null;
  lastEffectivenessTest: string | null;
}

export interface EffectivenessTestResult {
  hedgeRelationshipId: string;
  testDate: string;
  hedgedItemChange: number;
  hedgingInstrumentChange: number;
  effectivenessRatio: string;
  isEffective: boolean;
  accountingTreatment: 'hedge_accounting' | 'mark_to_market';
}

/**
 * Track hedge accounting relationship
 *
 * Designate hedging instrument to hedged item under IFRS 9 / ASC 815.
 *
 * Hedge types:
 * - Cash Flow Hedge: Hedge future cash flows (e.g., forward contract for future purchase)
 * - Fair Value Hedge: Hedge fair value of existing asset/liability
 * - Net Investment Hedge: Hedge FX exposure of foreign subsidiary
 */
export async function trackHedgeRelationship(
  db: NeonHttpDatabase,
  orgId: string,
  input: TrackHedgeInput,
): Promise<HedgeRelationship> {
  const validated = trackHedgeSchema.parse(input);

  // TODO: Insert hedge_relationships table
  // TODO: Validate hedged item exists
  // TODO: Validate hedging instrument exists
  // TODO: Check notional amounts match (or proportionate)
  // TODO: Require hedge documentation

  return {
    id: '',
    hedgeType: validated.hedgeType,
    hedgedItemId: validated.hedgedItemId,
    hedgedItemDescription: '',
    hedgingInstrumentId: validated.hedgingInstrumentId,
    hedgingInstrumentDescription: '',
    notionalAmount: validated.notionalAmount,
    currency: validated.currency,
    maturityDate: validated.maturityDate,
    designationDate: validated.designationDate || new Date().toISOString(),
    status: 'active',
    effectivenessRatio: null,
    lastEffectivenessTest: null,
  };
}

/**
 * Test hedge effectiveness
 *
 * IFRS 9 / ASC 815 requires effectiveness testing:
 * - Prospective: Expected to be effective (qualitative)
 * - Retrospective: Was effective (quantitative, 80-125% rule)
 *
 * Effectiveness Ratio = Change in Hedging Instrument / Change in Hedged Item
 *
 * Hedge accounting allowed if ratio between 80% - 125%
 */
export async function testHedgeEffectiveness(
  db: NeonHttpDatabase,
  orgId: string,
  input: TestEffectivenessInput,
): Promise<EffectivenessTestResult> {
  const validated = testEffectivenessSchema.parse(input);

  const ratio = calculateEffectivenessRatio(
    validated.hedgingInstrumentChange,
    validated.hedgedItemChange,
  );

  const isEffective = ratio >= 0.8 && ratio <= 1.25;

  // TODO: Update hedge_relationships.effectiveness_ratio
  // TODO: Log effectiveness test result
  // TODO: If ineffective, de-designate hedge and revert to mark-to-market

  return {
    hedgeRelationshipId: validated.hedgeRelationshipId,
    testDate: validated.testDate,
    hedgedItemChange: validated.hedgedItemChange,
    hedgingInstrumentChange: validated.hedgingInstrumentChange,
    effectivenessRatio: ratio.toFixed(4),
    isEffective,
    accountingTreatment: isEffective ? 'hedge_accounting' : 'mark_to_market',
  };
}

/**
 * Calculate effectiveness ratio
 */
function calculateEffectivenessRatio(
  hedgingInstrumentChange: number,
  hedgedItemChange: number,
): number {
  if (hedgedItemChange === 0) {
    return 0;
  }
  return Math.abs(hedgingInstrumentChange / hedgedItemChange);
}

/**
 * Determine accounting treatment for hedge
 *
 * Cash Flow Hedge: Effective portion → OCI, ineffective → P&L
 * Fair Value Hedge: Both hedged item and instrument → P&L
 * Net Investment Hedge: Effective portion → CTA (OCI)
 */
export function getHedgeAccountingTreatment(
  hedgeType: HedgeType,
  isEffective: boolean,
): { effectivePortion: string; ineffectivePortion: string } {
  if (!isEffective) {
    return {
      effectivePortion: 'none',
      ineffectivePortion: 'p_and_l',
    };
  }

  switch (hedgeType) {
    case 'cash_flow':
      return {
        effectivePortion: 'oci',
        ineffectivePortion: 'p_and_l',
      };
    case 'fair_value':
      return {
        effectivePortion: 'p_and_l',
        ineffectivePortion: 'p_and_l',
      };
    case 'net_investment':
      return {
        effectivePortion: 'cta_oci',
        ineffectivePortion: 'p_and_l',
      };
  }
}
