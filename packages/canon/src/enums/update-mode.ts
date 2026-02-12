import { z } from 'zod';

export const UPDATE_MODES = ['edit', 'correct', 'amend', 'adjust', 'reassign'] as const;
export type UpdateMode = (typeof UPDATE_MODES)[number];
export const updateModeSchema = z.enum(UPDATE_MODES);
