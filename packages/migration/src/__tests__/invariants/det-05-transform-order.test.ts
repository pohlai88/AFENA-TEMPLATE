import { describe, it, expect } from 'vitest';
import {
  TransformChain,
  TrimWhitespaceStep,
  NormalizeWhitespaceStep,
  PhoneNormalizeStep,
  EmailNormalizeStep,
  TypeCoercionStep,
  buildStandardTransformChain,
} from '../../transforms/transform-chain.js';

/**
 * DET-05: Transform steps execute in monotonic order, coercion last.
 */
describe('DET-05: Transform steps execute in monotonic order', () => {
  it('should sort steps by order on addStep', () => {
    const chain = new TransformChain();

    chain.addStep(new TypeCoercionStep());     // order: 100
    chain.addStep(new TrimWhitespaceStep());   // order: 10
    chain.addStep(new PhoneNormalizeStep());    // order: 30

    const steps = chain.getSteps();

    expect(steps[0]!.order).toBe(10);
    expect(steps[1]!.order).toBe(30);
    expect(steps[2]!.order).toBe(100);
  });

  it('should always run coercion last in standard chain', () => {
    const chain = buildStandardTransformChain();
    const steps = chain.getSteps();

    const lastStep = steps[steps.length - 1]!;
    expect(lastStep.name).toBe('type_coercion');
    expect(lastStep.order).toBe(100);
  });

  it('should maintain order even when steps added out of order', () => {
    const chain = new TransformChain();

    chain.addStep(new TypeCoercionStep());         // 100
    chain.addStep(new EmailNormalizeStep());        // 40
    chain.addStep(new TrimWhitespaceStep());        // 10
    chain.addStep(new NormalizeWhitespaceStep());   // 20
    chain.addStep(new PhoneNormalizeStep());         // 30

    const steps = chain.getSteps();
    const orders = steps.map((s) => s.order);

    expect(orders).toEqual([10, 20, 30, 40, 100]);
  });

  it('should apply transforms in order', async () => {
    const chain = buildStandardTransformChain();

    // Email with leading/trailing whitespace
    const result = await chain.transform(
      '  Test@Example.COM  ',
      'email',
      'email',
      { entityType: 'contacts', orgId: 'org-1' }
    );

    // TrimWhitespace(10) → 'Test@Example.COM'
    // EmailNormalize(40) → 'test@example.com'
    expect(result).toBe('test@example.com');
  });

  it('should normalize phone numbers', async () => {
    const chain = buildStandardTransformChain();

    const result = await chain.transform(
      ' +60 (12) 345-6789 ',
      'phone',
      'phone',
      { entityType: 'contacts', orgId: 'org-1' }
    );

    // TrimWhitespace(10) → '+60 (12) 345-6789'
    // PhoneNormalize(30) → '+60123456789'
    expect(result).toBe('+60123456789');
  });
});
