import { describe, expect, it } from 'vitest';
import { evaluateRecognitionCriteria } from '../calculators/recognition-criteria';

describe('RR-04 — Recognition Criteria', () => {
  it('identifies over-time when customer receives benefit simultaneously', () => {
    const { result } = evaluateRecognitionCriteria({
      contractId: 'C-1',
      performanceObligationId: 'PO-1',
      customerReceivesBenefitSimultaneously: true,
      customerControlsAssetAsCreated: false,
      noAlternativeUse: false,
      enforceableRightToPayment: false,
    });
    expect(result.recognitionMethod).toBe('over-time');
    expect(result.overTimeCriteriaMet.criterion1).toBe(true);
    expect(result.satisfiedCriteriaCount).toBe(1);
  });

  it('identifies over-time when no alternative use + right to payment', () => {
    const { result } = evaluateRecognitionCriteria({
      contractId: 'C-2',
      performanceObligationId: 'PO-2',
      customerReceivesBenefitSimultaneously: false,
      customerControlsAssetAsCreated: false,
      noAlternativeUse: true,
      enforceableRightToPayment: true,
    });
    expect(result.recognitionMethod).toBe('over-time');
    expect(result.overTimeCriteriaMet.criterion3).toBe(true);
  });

  it('identifies point-in-time when no criteria met', () => {
    const { result } = evaluateRecognitionCriteria({
      contractId: 'C-3',
      performanceObligationId: 'PO-3',
      customerReceivesBenefitSimultaneously: false,
      customerControlsAssetAsCreated: false,
      noAlternativeUse: false,
      enforceableRightToPayment: false,
      controlIndicators: {
        rightToPayment: true, legalTitle: true, physicalPossession: true,
        risksAndRewards: false, customerAccepted: false,
      },
    });
    expect(result.recognitionMethod).toBe('point-in-time');
    expect(result.controlIndicatorsMet).toBe(3);
  });

  it('criterion 3 requires both conditions', () => {
    const { result } = evaluateRecognitionCriteria({
      contractId: 'C-4',
      performanceObligationId: 'PO-4',
      customerReceivesBenefitSimultaneously: false,
      customerControlsAssetAsCreated: false,
      noAlternativeUse: true,
      enforceableRightToPayment: false,
    });
    expect(result.recognitionMethod).toBe('point-in-time');
    expect(result.overTimeCriteriaMet.criterion3).toBe(false);
  });

  it('returns CalculatorResult shape', () => {
    const res = evaluateRecognitionCriteria({
      contractId: 'X', performanceObligationId: 'Y',
      customerReceivesBenefitSimultaneously: false,
      customerControlsAssetAsCreated: false,
      noAlternativeUse: false, enforceableRightToPayment: false,
    });
    expect(res).toHaveProperty('result');
    expect(res).toHaveProperty('inputs');
    expect(res).toHaveProperty('explanation');
  });

  it('throws on missing contractId', () => {
    expect(() => evaluateRecognitionCriteria({
      contractId: '', performanceObligationId: 'Y',
      customerReceivesBenefitSimultaneously: false,
      customerControlsAssetAsCreated: false,
      noAlternativeUse: false, enforceableRightToPayment: false,
    })).toThrow('contractId is required');
  });
});
