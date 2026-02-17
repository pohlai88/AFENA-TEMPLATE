import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const GenerateCodeParams = z.object({
  codeType: z.enum(['sku', 'customer_id', 'supplier_id', 'gl_account', 'location_code']),
  template: z.string(),
  attributes: z.record(z.string(), z.any()),
});

export interface GeneratedCode {
  codeType: string;
  value: string;
  template: string;
  sequence: number;
  generatedAt: Date;
}

export async function generateCode(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GenerateCodeParams>,
): Promise<Result<GeneratedCode>> {
  const validated = GenerateCodeParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Generate code based on template and sequence
  // Template examples: "SKU-{category:3}-{year:2}-{seq:5}", "CUST-{region:2}-{seq:6}"
  const sequence = Math.floor(Math.random() * 10000);
  const value = `${validated.data.codeType.toUpperCase()}-${sequence.toString().padStart(6, '0')}`;

  return ok({
    codeType: validated.data.codeType,
    value,
    template: validated.data.template,
    sequence,
    generatedAt: new Date(),
  });
}

const CreateCodeTemplateParams = z.object({
  codeType: z.enum(['sku', 'customer_id', 'supplier_id', 'gl_account', 'location_code']),
  template: z.string(),
  description: z.string(),
  segments: z.array(
    z.object({
      name: z.string(),
      type: z.enum(['attribute', 'sequence', 'constant']),
      length: z.number().optional(),
      source: z.string().optional(),
    }),
  ),
});

export interface CodeTemplate {
  templateId: string;
  codeType: string;
  template: string;
  description: string;
  segments: Array<{
    name: string;
    type: string;
    length?: number;
    source?: string;
  }>;
  active: boolean;
}

export async function createCodeTemplate(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CreateCodeTemplateParams>,
): Promise<Result<CodeTemplate>> {
  const validated = CreateCodeTemplateParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Store code generation template
  return ok({
    templateId: `tmpl-${Date.now()}`,
    codeType: validated.data.codeType,
    template: validated.data.template,
    description: validated.data.description,
    segments: validated.data.segments,
    active: true,
  });
}

const ValidateCodeParams = z.object({
  codeType: z.enum(['sku', 'customer_id', 'supplier_id', 'gl_account', 'location_code']),
  value: z.string(),
});

export interface CodeValidation {
  isValid: boolean;
  codeType: string;
  value: string;
  errors: string[];
  warnings: string[];
}

export async function validateCode(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ValidateCodeParams>,
): Promise<Result<CodeValidation>> {
  const validated = ValidateCodeParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Validate code against template and check uniqueness
  const errors: string[] = [];
  const warnings: string[] = [];

  if (validated.data.value.length < 5) {
    errors.push('Code too short');
  }

  return ok({
    isValid: errors.length === 0,
    codeType: validated.data.codeType,
    value: validated.data.value,
    errors,
    warnings,
  });
}

const GetNextSequenceParams = z.object({
  codeType: z.enum(['sku', 'customer_id', 'supplier_id', 'gl_account', 'location_code']),
  prefix: z.string().optional(),
});

export interface SequenceInfo {
  codeType: string;
  prefix?: string;
  nextValue: number;
  currentValue: number;
  increment: number;
}

export async function getNextSequence(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetNextSequenceParams>,
): Promise<Result<SequenceInfo>> {
  const validated = GetNextSequenceParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Get and increment sequence counter
  return ok({
    codeType: validated.data.codeType,
    prefix: validated.data.prefix,
    nextValue: 1001,
    currentValue: 1000,
    increment: 1,
  });
}
