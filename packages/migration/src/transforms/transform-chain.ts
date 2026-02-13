/**
 * DET-05: Transform steps execute in monotonic order, coercion last.
 *
 * Steps have an explicit `order` field. TransformChain sorts by order
 * on every addStep() call so insertion order doesn't matter.
 */

export type DataType =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'integer'
  | 'decimal'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'json'
  | 'uuid';

export interface TransformContext {
  entityType: string;
  orgId: string;
  locale?: string;
}

export interface TransformStep {
  readonly name: string;
  readonly order: number;
  transform(value: unknown, context: TransformContext): unknown;
  canHandle(fieldName: string, dataType: DataType): boolean;
}

export class TransformChain {
  private steps: TransformStep[] = [];

  addStep(step: TransformStep): this {
    this.steps.push(step);
    this.steps.sort((a, b) => a.order - b.order);
    return this;
  }

  getSteps(): readonly TransformStep[] {
    return this.steps;
  }

  async transform(
    value: unknown,
    fieldName: string,
    dataType: DataType,
    context: TransformContext
  ): Promise<unknown> {
    let result = value;
    for (const step of this.steps) {
      if (step.canHandle(fieldName, dataType)) {
        result = step.transform(result, context);
      }
    }
    return result;
  }
}

// ── Concrete steps ──────────────────────────────────────────

export class TrimWhitespaceStep implements TransformStep {
  readonly name = 'trim_whitespace';
  readonly order = 10;

  canHandle(_fieldName: string, dataType: DataType): boolean {
    return dataType === 'short_text' || dataType === 'long_text' || dataType === 'email';
  }

  transform(value: unknown): unknown {
    return typeof value === 'string' ? value.trim() : value;
  }
}

export class NormalizeWhitespaceStep implements TransformStep {
  readonly name = 'normalize_whitespace';
  readonly order = 20;

  canHandle(_fieldName: string, dataType: DataType): boolean {
    return dataType === 'short_text' || dataType === 'long_text';
  }

  transform(value: unknown): unknown {
    return typeof value === 'string' ? value.replace(/\s+/g, ' ') : value;
  }
}

export class PhoneNormalizeStep implements TransformStep {
  readonly name = 'phone_normalize';
  readonly order = 30;

  canHandle(_fieldName: string, dataType: DataType): boolean {
    return dataType === 'phone';
  }

  transform(value: unknown): unknown {
    if (typeof value !== 'string') return value;
    return value.replace(/[\s\-().]/g, '');
  }
}

export class EmailNormalizeStep implements TransformStep {
  readonly name = 'email_normalize';
  readonly order = 40;

  canHandle(_fieldName: string, dataType: DataType): boolean {
    return dataType === 'email';
  }

  transform(value: unknown): unknown {
    return typeof value === 'string' ? value.toLowerCase().trim() : value;
  }
}

export class TypeCoercionStep implements TransformStep {
  readonly name = 'type_coercion';
  readonly order = 100; // ALWAYS LAST

  canHandle(): boolean {
    return true;
  }

  transform(value: unknown, _context: TransformContext): unknown {
    // Type coercion is a pass-through in the skeleton.
    // Concrete implementations coerce based on target schema.
    return value;
  }
}

// ── Factory ─────────────────────────────────────────────────

export function buildStandardTransformChain(): TransformChain {
  return new TransformChain()
    .addStep(new TrimWhitespaceStep())
    .addStep(new NormalizeWhitespaceStep())
    .addStep(new PhoneNormalizeStep())
    .addStep(new EmailNormalizeStep())
    .addStep(new TypeCoercionStep());
}
