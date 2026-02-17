import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const ValidateCompatibilityParams = z.object({ componentIds: z.array(z.string()) });
export interface CompatibilityCheck { isCompatible: boolean; incompatibilities: Array<{ component1: string; component2: string; reason: string }> }
export async function validateCompatibility(db: DbInstance, orgId: string, params: z.infer<typeof ValidateCompatibilityParams>): Promise<Result<CompatibilityCheck>> {
  const validated = ValidateCompatibilityParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ isCompatible: true, incompatibilities: [] });
}

const CheckConstraintsParams = z.object({ configurationId: z.string() });
export interface ConstraintCheck { configurationId: string; constraintsMet: boolean; violations: string[] }
export async function checkConstraints(db: DbInstance, orgId: string, params: z.infer<typeof CheckConstraintsParams>): Promise<Result<ConstraintCheck>> {
  const validated = CheckConstraintsParams.safeParse(params);
  if (!validated.success) return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({ configurationId: validated.data.configurationId, constraintsMet: true, violations: [] });
}
