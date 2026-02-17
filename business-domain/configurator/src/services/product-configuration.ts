import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const ConfigureProductParams = z.object({
  productId: z.string(),
  options: z.record(z.string(), z.any()),
  customerId: z.string(),
});
export interface ProductConfiguration {
  configurationId: string;
  productId: string;
  totalOptions: number;
  isValid: boolean;
}
export async function configureProduct(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ConfigureProductParams>,
): Promise<Result<ProductConfiguration>> {
  const validated = ConfigureProductParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({
    configurationId: 'config-1',
    productId: validated.data.productId,
    totalOptions: Object.keys(validated.data.options).length,
    isValid: true,
  });
}

const ValidateConfigurationParams = z.object({ configurationId: z.string() });
export interface ConfigurationValidation {
  configurationId: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
export async function validateConfiguration(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ValidateConfigurationParams>,
): Promise<Result<ConfigurationValidation>> {
  const validated = ValidateConfigurationParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });
  return ok({
    configurationId: validated.data.configurationId,
    isValid: true,
    errors: [],
    warnings: ['High cost option selected'],
  });
}
