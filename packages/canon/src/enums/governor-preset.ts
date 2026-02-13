import { z } from 'zod';

export const GOVERNOR_PRESETS = [
  'interactive',
  'background',
  'reporting',
] as const;
export type GovernorPreset = (typeof GOVERNOR_PRESETS)[number];
export const governorPresetSchema = z.enum(GOVERNOR_PRESETS);
