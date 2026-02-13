import { describe, it, expect } from 'vitest';
import { PhoneNormalizeStep } from '../../transforms/transform-chain.js';

describe('ACC-01: E.164 phone normalization', () => {
  const step = new PhoneNormalizeStep('MY');

  it('should normalize Malaysian local number to E.164', () => {
    expect(step.transform('012-3456789', {} as never)).toBe('+60123456789');
  });

  it('should be idempotent for already-E.164 numbers', () => {
    expect(step.transform('+60123456789', {} as never)).toBe('+60123456789');
  });

  it('should normalize Malaysian number with spaces', () => {
    expect(step.transform('012 345 6789', {} as never)).toBe('+60123456789');
  });

  it('should normalize Malaysian number with parentheses', () => {
    expect(step.transform('(012) 3456789', {} as never)).toBe('+60123456789');
  });

  it('should return null for invalid phone numbers', () => {
    expect(step.transform('not-a-phone', {} as never)).toBeNull();
  });

  it('should return null for too-short numbers', () => {
    expect(step.transform('123', {} as never)).toBeNull();
  });

  it('should pass through non-string values', () => {
    expect(step.transform(42, {} as never)).toBe(42);
    expect(step.transform(null, {} as never)).toBeNull();
    expect(step.transform(undefined, {} as never)).toBeUndefined();
  });

  it('should pass through empty strings', () => {
    expect(step.transform('', {} as never)).toBe('');
    expect(step.transform('   ', {} as never)).toBe('   ');
  });

  it('should respect custom default region', () => {
    const usStep = new PhoneNormalizeStep('US');
    expect(usStep.transform('(213) 373-4253', {} as never)).toBe('+12133734253');
  });

  it('should only handle phone data type', () => {
    expect(step.canHandle('phone', 'phone')).toBe(true);
    expect(step.canHandle('phone', 'short_text')).toBe(false);
    expect(step.canHandle('phone', 'email')).toBe(false);
  });
});
