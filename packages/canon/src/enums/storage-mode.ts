import { z } from 'zod';

export const STORAGE_MODES = ['jsonb_only', 'indexed'] as const;
export type StorageMode = (typeof STORAGE_MODES)[number];
export const storageModeSchema = z.enum(STORAGE_MODES);
