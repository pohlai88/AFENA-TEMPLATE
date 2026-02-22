import { z } from 'zod';
import { createEnumKit, createSubset, type BaseEnumMetadata } from './_enum-kit';

export const CHANNELS = [
  'web_ui',
  'api',
  'server_action',
  'cli',
  'background_job',
  'cron',
  'workflow',
] as const;
export type Channel = (typeof CHANNELS)[number];
export const channelSchema = z.enum(CHANNELS);

// ============================================================================
// Metadata (SSOT)
// ============================================================================

export interface ChannelMetadata extends BaseEnumMetadata {
  automated: boolean;
}

export const CHANNEL_METADATA = {
  web_ui: {
    label: 'Web UI',
    description: 'User-initiated web browser action',
    tone: 'info',
    automated: false,
    sortOrder: 1,
  },
  api: {
    label: 'API',
    description: 'External API request',
    tone: 'info',
    automated: false,
    sortOrder: 2,
  },
  server_action: {
    label: 'Server Action',
    description: 'Server-side action invocation',
    tone: 'neutral',
    automated: false,
    sortOrder: 3,
  },
  cli: {
    label: 'CLI',
    description: 'Command-line interface',
    tone: 'neutral',
    automated: false,
    sortOrder: 4,
  },
  background_job: {
    label: 'Background Job',
    description: 'System-initiated background process',
    tone: 'neutral',
    automated: true,
    sortOrder: 5,
  },
  cron: {
    label: 'Cron',
    description: 'Scheduled cron job',
    tone: 'neutral',
    automated: true,
    sortOrder: 6,
  },
  workflow: {
    label: 'Workflow',
    description: 'Workflow engine execution',
    tone: 'success',
    automated: true,
    sortOrder: 7,
  },
} as const satisfies Record<Channel, ChannelMetadata>;

// ============================================================================
// Enum Kit
// ============================================================================

export const channelKit = createEnumKit(CHANNELS, channelSchema, CHANNEL_METADATA);

export const {
  isValid: isValidChannel,
  assert: assertChannel,
  getLabel: getChannelLabel,
  getMeta: getChannelMeta,
  labels: CHANNEL_LABELS,
} = channelKit;

// ============================================================================
// Semantic Subsets
// ============================================================================

export const SYSTEM_CHANNELS = createSubset(['background_job', 'cron', 'workflow'] as const);
export const USER_CHANNELS = createSubset(['web_ui', 'api', 'server_action', 'cli'] as const);

export type SystemChannel = 'background_job' | 'cron' | 'workflow';

// ============================================================================
// Semantic Predicates
// ============================================================================

export const isSystemChannel = (ch: Channel): ch is SystemChannel => SYSTEM_CHANNELS.has(ch);
export const isUserChannel = (ch: Channel) => USER_CHANNELS.has(ch);
export const isAutomatedChannel = (ch: Channel) => CHANNEL_METADATA[ch].automated;
