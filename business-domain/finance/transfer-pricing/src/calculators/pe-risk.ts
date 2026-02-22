import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

/**
 * @see TP-10 — Permanent establishment risk flag
 * G-16 / TP — Permanent Establishment (PE) Risk Flag
 *
 * Evaluates whether activities in a jurisdiction may create a PE risk
 * based on OECD Model Tax Convention Article 5 indicators.
 *
 * Pure function — no I/O.
 */

export type PeIndicator = {
  jurisdiction: string;
  indicatorType: 'fixed_place' | 'dependent_agent' | 'service_pe' | 'construction' | 'digital_presence';
  description: string;
  daysPresent: number;
  hasAuthority: boolean;
  revenueMinor: number;
};

export type PeRiskAssessment = {
  jurisdiction: string;
  riskLevel: 'high' | 'medium' | 'low' | 'none';
  indicators: { type: string; triggered: boolean; reason: string }[];
  totalDaysPresent: number;
  totalRevenueMinor: number;
  recommendation: string;
};

export type PeRiskResult = {
  assessments: PeRiskAssessment[];
  highRiskCount: number;
  mediumRiskCount: number;
  jurisdictionsAssessed: number;
};

export type PeThresholds = {
  fixedPlaceDays: number;
  servicePeDays: number;
  constructionDays: number;
};

const DEFAULT_THRESHOLDS: PeThresholds = {
  fixedPlaceDays: 183,
  servicePeDays: 183,
  constructionDays: 365,
};

export function assessPeRisk(
  indicators: PeIndicator[],
  thresholds: PeThresholds = DEFAULT_THRESHOLDS,
): CalculatorResult<PeRiskResult> {
  if (indicators.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one PE indicator required');
  }

  const byJurisdiction = new Map<string, PeIndicator[]>();
  for (const ind of indicators) {
    const group = byJurisdiction.get(ind.jurisdiction) ?? [];
    group.push(ind);
    byJurisdiction.set(ind.jurisdiction, group);
  }

  const assessments: PeRiskAssessment[] = [];

  for (const [jurisdiction, inds] of byJurisdiction) {
    const totalDays = inds.reduce((s, i) => s + i.daysPresent, 0);
    const totalRevenue = inds.reduce((s, i) => s + i.revenueMinor, 0);
    const triggered: PeRiskAssessment['indicators'] = [];

    for (const ind of inds) {
      let isTriggered = false;
      let reason = '';

      switch (ind.indicatorType) {
        case 'fixed_place':
          isTriggered = ind.daysPresent >= thresholds.fixedPlaceDays;
          reason = isTriggered ? `${ind.daysPresent} days >= ${thresholds.fixedPlaceDays} threshold` : `${ind.daysPresent} days < threshold`;
          break;
        case 'dependent_agent':
          isTriggered = ind.hasAuthority;
          reason = isTriggered ? 'Agent has authority to conclude contracts' : 'Agent has no binding authority';
          break;
        case 'service_pe':
          isTriggered = ind.daysPresent >= thresholds.servicePeDays;
          reason = isTriggered ? `${ind.daysPresent} service days >= ${thresholds.servicePeDays}` : `${ind.daysPresent} days < threshold`;
          break;
        case 'construction':
          isTriggered = ind.daysPresent >= thresholds.constructionDays;
          reason = isTriggered ? `${ind.daysPresent} construction days >= ${thresholds.constructionDays}` : `${ind.daysPresent} days < threshold`;
          break;
        case 'digital_presence':
          isTriggered = ind.revenueMinor > 0 && ind.daysPresent > 0;
          reason = isTriggered ? 'Digital revenue with local presence' : 'No digital PE trigger';
          break;
      }

      triggered.push({ type: ind.indicatorType, triggered: isTriggered, reason });
    }

    const triggeredCount = triggered.filter((t) => t.triggered).length;
    let riskLevel: 'high' | 'medium' | 'low' | 'none';
    let recommendation: string;

    if (triggeredCount >= 2) {
      riskLevel = 'high';
      recommendation = 'Immediate review required — multiple PE indicators triggered';
    } else if (triggeredCount === 1) {
      riskLevel = 'medium';
      recommendation = 'Monitor closely — single PE indicator triggered';
    } else if (totalDays > thresholds.fixedPlaceDays * 0.7) {
      riskLevel = 'low';
      recommendation = 'Approaching threshold — track days carefully';
    } else {
      riskLevel = 'none';
      recommendation = 'No PE risk identified';
    }

    assessments.push({ jurisdiction, riskLevel, indicators: triggered, totalDaysPresent: totalDays, totalRevenueMinor: totalRevenue, recommendation });
  }

  return {
    result: {
      assessments,
      highRiskCount: assessments.filter((a) => a.riskLevel === 'high').length,
      mediumRiskCount: assessments.filter((a) => a.riskLevel === 'medium').length,
      jurisdictionsAssessed: assessments.length,
    },
    inputs: { indicatorCount: indicators.length, thresholds },
    explanation: `PE risk: ${assessments.length} jurisdictions, ${assessments.filter((a) => a.riskLevel === 'high').length} high, ${assessments.filter((a) => a.riskLevel === 'medium').length} medium`,
  };
}
