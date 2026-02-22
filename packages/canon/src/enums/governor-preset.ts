import { z } from 'zod';
import { createEnumKit, type BaseEnumMetadata } from './_enum-kit';

export const GOVERNOR_PRESETS = [
  'interactive',
  'background',
  'reporting',
] as const;
export type GovernorPreset = (typeof GOVERNOR_PRESETS)[number];
export const governorPresetSchema = z.enum(GOVERNOR_PRESETS);

export const GOVERNOR_PRESET_METADATA = {
  interactive: {
    label: 'Interactive',
    description: 'User-facing interactive operations with strict limits',
    tone: 'info',
    sortOrder: 1,
  },
  background: {
    label: 'Background',
    description: 'Background processing with relaxed limits',
    tone: 'neutral',
    sortOrder: 2,
  },
  reporting: {
    label: 'Reporting',
    description: 'Reporting operations with extended limits',
    tone: 'success',
    sortOrder: 3,
  },
} as const satisfies Record<GovernorPreset, BaseEnumMetadata>;

export const governorPresetKit = createEnumKit(
  GOVERNOR_PRESETS,
  governorPresetSchema,
  GOVERNOR_PRESET_METADATA
);

export const {
  isValid: isValidGovernorPreset,
  assert: assertGovernorPreset,
  getLabel: getGovernorPresetLabel,
  getMeta: getGovernorPresetMeta,
  labels: GOVERNOR_PRESET_LABELS,
} = governorPresetKit;
