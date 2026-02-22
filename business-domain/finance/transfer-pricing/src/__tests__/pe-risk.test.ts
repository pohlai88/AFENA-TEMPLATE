import { describe, expect, it } from 'vitest';
import { assessPeRisk } from '../calculators/pe-risk';
import type { PeIndicator } from '../calculators/pe-risk';

describe('assessPeRisk', () => {
  it('flags high risk when multiple indicators triggered', () => {
    const indicators: PeIndicator[] = [
      { jurisdiction: 'SG', indicatorType: 'fixed_place', description: 'Office', daysPresent: 200, hasAuthority: false, revenueMinor: 500000 },
      { jurisdiction: 'SG', indicatorType: 'dependent_agent', description: 'Sales agent', daysPresent: 0, hasAuthority: true, revenueMinor: 300000 },
    ];
    const { result } = assessPeRisk(indicators);
    expect(result.assessments[0]!.riskLevel).toBe('high');
    expect(result.highRiskCount).toBe(1);
  });

  it('flags medium risk for single trigger', () => {
    const indicators: PeIndicator[] = [
      { jurisdiction: 'US', indicatorType: 'service_pe', description: 'Consulting', daysPresent: 190, hasAuthority: false, revenueMinor: 200000 },
    ];
    const { result } = assessPeRisk(indicators);
    expect(result.assessments[0]!.riskLevel).toBe('medium');
  });

  it('flags no risk when below thresholds', () => {
    const indicators: PeIndicator[] = [
      { jurisdiction: 'JP', indicatorType: 'fixed_place', description: 'Visit', daysPresent: 30, hasAuthority: false, revenueMinor: 0 },
    ];
    const { result } = assessPeRisk(indicators);
    expect(result.assessments[0]!.riskLevel).toBe('none');
  });

  it('groups by jurisdiction', () => {
    const indicators: PeIndicator[] = [
      { jurisdiction: 'SG', indicatorType: 'fixed_place', description: 'Office', daysPresent: 100, hasAuthority: false, revenueMinor: 0 },
      { jurisdiction: 'US', indicatorType: 'fixed_place', description: 'Branch', daysPresent: 50, hasAuthority: false, revenueMinor: 0 },
    ];
    const { result } = assessPeRisk(indicators);
    expect(result.jurisdictionsAssessed).toBe(2);
  });

  it('includes recommendation text', () => {
    const indicators: PeIndicator[] = [
      { jurisdiction: 'SG', indicatorType: 'dependent_agent', description: 'Agent', daysPresent: 0, hasAuthority: true, revenueMinor: 100000 },
    ];
    const { result } = assessPeRisk(indicators);
    expect(result.assessments[0]!.recommendation).toContain('Monitor');
  });

  it('throws for empty indicators', () => {
    expect(() => assessPeRisk([])).toThrow('At least one');
  });
});
