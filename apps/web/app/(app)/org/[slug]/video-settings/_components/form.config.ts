/**
 * Video Settings form config — derived from video-settings.spec.json.
 * Pilot: hand-written form matches spec fields.
 * Phase 4: FormConfigRenderer will consume this.
 */

export const videoSettingsFormConfig = {
  entityType: 'video-settings' as const,
  groups: [
    {
      id: 'default',
      label: 'Settings',
      fields: ['enable_youtube_tracking', 'api_key', 'frequency'],
    },
  ],
  order: ['enable_youtube_tracking', 'api_key', 'frequency'],
  fields: {
    enable_youtube_tracking: {
      type: 'boolean',
      label: 'Enable YouTube Tracking',
      required: false,
    },
    api_key: {
      type: 'string',
      label: 'API Key',
      required: false,
      dependsOn: 'enable_youtube_tracking',
    },
    frequency: {
      type: 'enum',
      label: 'Frequency',
      required: false,
      choices: ['30 mins', '1 hr', '6 hrs', 'Daily'],
      dependsOn: 'enable_youtube_tracking',
    },
  },
} as const;
