import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * G-12 / CM-10 — ECL ↔ Credit Score → IFRS 9 Staging Integration
 *
 * Maps credit scores to IFRS 9 ECL stages and computes expected credit losses.
 *
 * Stage 1: 12-month ECL (performing, no significant increase in credit risk)
 * Stage 2: Lifetime ECL (significant increase in credit risk)
 * Stage 3: Lifetime ECL (credit-impaired)
 *
 * Pure function — no I/O.
 */

export type CreditExposure = {
  exposureId: string;
  counterpartyId: string;
  outstandingMinor: number;
  creditScore: number;
  daysPastDue: number;
  pdTwelveMonth: number;
  pdLifetime: number;
  lgdPct: number;
};

export type EclStagingResult = {
  exposureId: string;
  counterpartyId: string;
  stage: 1 | 2 | 3;
  stagingReason: string;
  eclMinor: number;
  pdUsed: number;
  lgdPct: number;
};

export type EclPortfolioResult = {
  entries: EclStagingResult[];
  totalEclMinor: number;
  stage1Count: number;
  stage2Count: number;
  stage3Count: number;
  stage1EclMinor: number;
  stage2EclMinor: number;
  stage3EclMinor: number;
};

export type StagingThresholds = {
  stage2ScoreBelow: number;
  stage3ScoreBelow: number;
  stage2DpdAbove: number;
  stage3DpdAbove: number;
};

const DEFAULT_THRESHOLDS: StagingThresholds = {
  stage2ScoreBelow: 600,
  stage3ScoreBelow: 400,
  stage2DpdAbove: 30,
  stage3DpdAbove: 90,
};

export function computeEclStaging(
  exposures: CreditExposure[],
  thresholds: StagingThresholds = DEFAULT_THRESHOLDS,
): CalculatorResult<EclPortfolioResult> {
  if (exposures.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one credit exposure required');
  }

  const entries: EclStagingResult[] = exposures.map((exp) => {
    let stage: 1 | 2 | 3;
    let stagingReason: string;

    if (exp.daysPastDue > thresholds.stage3DpdAbove || exp.creditScore < thresholds.stage3ScoreBelow) {
      stage = 3;
      stagingReason = exp.daysPastDue > thresholds.stage3DpdAbove
        ? `DPD ${exp.daysPastDue} > ${thresholds.stage3DpdAbove}`
        : `Score ${exp.creditScore} < ${thresholds.stage3ScoreBelow}`;
    } else if (exp.daysPastDue > thresholds.stage2DpdAbove || exp.creditScore < thresholds.stage2ScoreBelow) {
      stage = 2;
      stagingReason = exp.daysPastDue > thresholds.stage2DpdAbove
        ? `DPD ${exp.daysPastDue} > ${thresholds.stage2DpdAbove}`
        : `Score ${exp.creditScore} < ${thresholds.stage2ScoreBelow}`;
    } else {
      stage = 1;
      stagingReason = 'Performing';
    }

    const pdUsed = stage === 1 ? exp.pdTwelveMonth : exp.pdLifetime;
    const eclMinor = Math.round(exp.outstandingMinor * pdUsed * (exp.lgdPct / 100));

    return {
      exposureId: exp.exposureId,
      counterpartyId: exp.counterpartyId,
      stage,
      stagingReason,
      eclMinor,
      pdUsed,
      lgdPct: exp.lgdPct,
    };
  });

  const byStage = (s: 1 | 2 | 3) => entries.filter((e) => e.stage === s);

  return {
    result: {
      entries,
      totalEclMinor: entries.reduce((s, e) => s + e.eclMinor, 0),
      stage1Count: byStage(1).length,
      stage2Count: byStage(2).length,
      stage3Count: byStage(3).length,
      stage1EclMinor: byStage(1).reduce((s, e) => s + e.eclMinor, 0),
      stage2EclMinor: byStage(2).reduce((s, e) => s + e.eclMinor, 0),
      stage3EclMinor: byStage(3).reduce((s, e) => s + e.eclMinor, 0),
    },
    inputs: { exposureCount: exposures.length, thresholds },
    explanation: `ECL staging: S1=${byStage(1).length} S2=${byStage(2).length} S3=${byStage(3).length}, total ECL ${entries.reduce((s, e) => s + e.eclMinor, 0)}`,
  };
}
