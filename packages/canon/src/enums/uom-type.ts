import { z } from 'zod';

export const UOM_TYPES = ['weight', 'volume', 'length', 'area', 'count', 'time', 'custom'] as const;
export type UomType = (typeof UOM_TYPES)[number];
export const uomTypeSchema = z.enum(UOM_TYPES);
