import { describe, it, expect } from 'vitest';
import { EmailNormalizeStep } from '../../transforms/transform-chain.js';

describe('ACC-02: Smart email normalization', () => {
  const step = new EmailNormalizeStep();

  // Gmail dot stripping
  it('should strip dots from Gmail local part', () => {
    expect(step.transform('john.doe@gmail.com', {} as never)).toBe('johndoe@gmail.com');
  });

  it('should strip dots from googlemail.com local part', () => {
    expect(step.transform('john.doe@googlemail.com', {} as never)).toBe('johndoe@googlemail.com');
  });

  // Gmail plus alias stripping
  it('should strip + alias from Gmail', () => {
    expect(step.transform('john+tag@gmail.com', {} as never)).toBe('john@gmail.com');
  });

  it('should strip dots AND + alias from Gmail', () => {
    expect(step.transform('j.o.h.n+newsletter@gmail.com', {} as never)).toBe('john@gmail.com');
  });

  // Non-Gmail: unchanged (except lowercase)
  it('should NOT strip dots from non-Gmail domains', () => {
    expect(step.transform('john.doe@company.com', {} as never)).toBe('john.doe@company.com');
  });

  it('should NOT strip + alias from non-Gmail domains', () => {
    expect(step.transform('john+tag@company.com', {} as never)).toBe('john+tag@company.com');
  });

  // Case normalization
  it('should always lowercase', () => {
    expect(step.transform('John.Doe@Gmail.COM', {} as never)).toBe('johndoe@gmail.com');
  });

  it('should lowercase non-Gmail emails', () => {
    expect(step.transform('ADMIN@Company.COM', {} as never)).toBe('admin@company.com');
  });

  // Trim
  it('should trim whitespace', () => {
    expect(step.transform('  john@gmail.com  ', {} as never)).toBe('john@gmail.com');
  });

  // Edge cases
  it('should handle email without @ sign', () => {
    expect(step.transform('noemail', {} as never)).toBe('noemail');
  });

  it('should pass through non-string values', () => {
    expect(step.transform(42, {} as never)).toBe(42);
    expect(step.transform(null, {} as never)).toBeNull();
  });

  it('should only handle email data type', () => {
    expect(step.canHandle('email', 'email')).toBe(true);
    expect(step.canHandle('email', 'phone')).toBe(false);
    expect(step.canHandle('email', 'short_text')).toBe(false);
  });
});
