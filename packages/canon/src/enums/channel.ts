import { z } from 'zod';

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

export const SYSTEM_CHANNELS: readonly Channel[] = [
  'background_job',
  'cron',
  'workflow',
] as const;
export type SystemChannel = 'background_job' | 'cron' | 'workflow';

export function isSystemChannel(ch: Channel): ch is SystemChannel {
  return SYSTEM_CHANNELS.includes(ch);
}
