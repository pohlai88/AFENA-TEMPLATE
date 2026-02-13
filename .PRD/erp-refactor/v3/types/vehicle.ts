import { z } from 'zod';

export const VehicleSchema = z.object({
  id: z.string(),
  owner: z.string().optional(),
  creation: z.string().optional(),
  modified: z.string().optional(),
  modified_by: z.string().optional(),
  license_plate: z.string(),
  make: z.string(),
  model: z.string(),
  company: z.string().optional(),
  last_odometer: z.number().int(),
  acquisition_date: z.string().optional(),
  location: z.string().optional(),
  chassis_no: z.string().optional(),
  vehicle_value: z.number().optional(),
  employee: z.string().optional(),
  insurance_company: z.string().optional(),
  policy_no: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  fuel_type: z.enum(['Petrol', 'Diesel', 'Natural Gas', 'Electric']),
  uom: z.string(),
  carbon_check_date: z.string().optional(),
  color: z.string().optional(),
  wheels: z.number().int().optional(),
  doors: z.number().int().optional(),
  amended_from: z.string().optional(),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

export const VehicleInsertSchema = VehicleSchema.omit({ id: true, owner: true, creation: true, modified: true, modified_by: true });
export type VehicleInsert = z.infer<typeof VehicleInsertSchema>;
