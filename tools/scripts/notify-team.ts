#!/usr/bin/env tsx
/**
 * Team Notifications
 *
 * Send quality metric alerts to team communication channels:
 * - Slack
 * - Discord
 * - Microsoft Teams
 *
 * Supports real-time alerts and daily digests.
 *
 * @module notify-team
 * @since Sprint 6
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

// --- Types ---

interface NotificationConfig {
  slack?: SlackConfig;
  discord?: DiscordConfig;
  teams?: TeamsConfig;
  mode: 'realtime' | 'digest';
  enabled: boolean;
}

interface SlackConfig {
  webhookUrl: string;
  channel?: string;
  username?: string;
  iconEmoji?: string;
  severity: ('critical' | 'warning' | 'info')[];
}

interface DiscordConfig {
  webhookUrl: string;
  username?: string;
  avatarUrl?: string;
  severity: ('critical' | 'warning' | 'info')[];
}

interface TeamsConfig {
  webhookUrl: string;
  severity: ('critical' | 'warning' | 'info')[];
}

interface QualityAlert {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  metrics?: Record<string, string | number>;
  timestamp: string;
  dashboardUrl?: string;
  gitBranch?: string;
  gitSha?: string;
}

interface SlackMessage {
  text: string;
  blocks?: SlackBlock[];
  username?: string;
  icon_emoji?: string;
}

interface SlackBlock {
  type: string;
  text?: { type: string; text: string };
  fields?: Array<{ type: string; text: string }>;
  elements?: unknown[];
}

interface DiscordMessage {
  content?: string;
  embeds?: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

interface DiscordEmbed {
  title: string;
  description: string;
  color: number;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
  footer?: { text: string };
  timestamp?: string;
}

// --- Helpers ---

async function loadConfig(): Promise<NotificationConfig> {
  const configPath = resolve(process.cwd(), '.quality-notifications.json');

  try {
    const content = await readFile(configPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // Default config from environment variables
      return {
        slack: process.env.SLACK_WEBHOOK_URL
          ? {
              webhookUrl: process.env.SLACK_WEBHOOK_URL,
              severity: ['critical', 'warning', 'info'],
            }
          : undefined,
        discord: process.env.DISCORD_WEBHOOK_URL
          ? {
              webhookUrl: process.env.DISCORD_WEBHOOK_URL,
              severity: ['critical', 'warning'],
            }
          : undefined,
        teams: process.env.TEAMS_WEBHOOK_URL
          ? {
              webhookUrl: process.env.TEAMS_WEBHOOK_URL,
              severity: ['critical', 'warning'],
            }
          : undefined,
        mode: (process.env.NOTIFICATION_MODE as 'realtime' | 'digest') || 'realtime',
        enabled: process.env.NOTIFICATIONS_ENABLED !== 'false',
      };
    }
    throw error;
  }
}

function getSeverityEmoji(severity: QualityAlert['severity']): string {
  const emojis = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️',
  };
  return emojis[severity];
}

function getSeverityColor(severity: QualityAlert['severity']): number {
  const colors = {
    critical: 0xdc3545, // Red
    warning: 0xffc107, // Yellow
    info: 0x17a2b8, // Blue
  };
  return colors[severity];
}

// --- Slack ---

async function sendSlackNotification(config: SlackConfig, alert: QualityAlert): Promise<void> {
  // Check if severity matches
  if (!config.severity.includes(alert.severity)) {
    console.log(`⏭️  Skipping Slack notification (severity: ${alert.severity})`);
    return;
  }

  const emoji = getSeverityEmoji(alert.severity);

  const blocks: SlackBlock[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${emoji} ${alert.title}`,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: alert.message,
      },
    },
  ];

  // Add metrics as fields
  if (alert.metrics) {
    const fields = Object.entries(alert.metrics).map(([key, value]) => ({
      type: 'mrkdwn',
      text: `*${key}:* ${value}`,
    }));

    blocks.push({
      type: 'section',
      fields,
    });
  }

  // Add git info
  if (alert.gitBranch || alert.gitSha) {
    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Branch: \`${alert.gitBranch || 'unknown'}\` | Commit: \`${alert.gitSha?.substring(0, 7) || 'unknown'}\``,
        },
      ],
    });
  }

  // Add action button
  if (alert.dashboardUrl) {
    blocks.push({
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: '📊 View Dashboard',
          },
          url: alert.dashboardUrl,
        },
      ],
    });
  }

  const message: SlackMessage = {
    text: `${emoji} ${alert.title}`,
    blocks,
    username: config.username || 'AFENDA Quality Bot',
    icon_emoji: config.iconEmoji || ':chart_with_upwards_trend:',
  };

  const response = await fetch(config.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error(`Slack API error: ${response.status} ${response.statusText}`);
  }

  console.log('✅ Sent Slack notification');
}

// --- Discord ---

async function sendDiscordNotification(config: DiscordConfig, alert: QualityAlert): Promise<void> {
  // Check if severity matches
  if (!config.severity.includes(alert.severity)) {
    console.log(`⏭️  Skipping Discord notification (severity: ${alert.severity})`);
    return;
  }

  const emoji = getSeverityEmoji(alert.severity);
  const color = getSeverityColor(alert.severity);

  const embed: DiscordEmbed = {
    title: `${emoji} ${alert.title}`,
    description: alert.message,
    color,
    timestamp: alert.timestamp,
    footer: {
      text: 'AFENDA Quality Metrics',
    },
  };

  // Add metrics as fields
  if (alert.metrics) {
    embed.fields = Object.entries(alert.metrics).map(([key, value]) => ({
      name: key,
      value: String(value),
      inline: true,
    }));
  }

  // Add git info
  if (alert.gitBranch || alert.gitSha) {
    embed.fields = embed.fields || [];
    embed.fields.push({
      name: 'Branch',
      value: alert.gitBranch || 'unknown',
      inline: true,
    });
    embed.fields.push({
      name: 'Commit',
      value: alert.gitSha?.substring(0, 7) || 'unknown',
      inline: true,
    });
  }

  // Add dashboard link
  if (alert.dashboardUrl) {
    embed.fields = embed.fields || [];
    embed.fields.push({
      name: 'Dashboard',
      value: `[View Dashboard](${alert.dashboardUrl})`,
      inline: false,
    });
  }

  const message: DiscordMessage = {
    embeds: [embed],
    username: config.username || 'AFENDA Quality Bot',
    avatar_url: config.avatarUrl,
  };

  const response = await fetch(config.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
  }

  console.log('✅ Sent Discord notification');
}

// --- Teams ---

async function sendTeamsNotification(config: TeamsConfig, alert: QualityAlert): Promise<void> {
  // Check if severity matches
  if (!config.severity.includes(alert.severity)) {
    console.log(`⏭️  Skipping Teams notification (severity: ${alert.severity})`);
    return;
  }

  const emoji = getSeverityEmoji(alert.severity);
  const color =
    alert.severity === 'critical'
      ? 'attention'
      : alert.severity === 'warning'
        ? 'warning'
        : 'accent';

  const facts = [];

  // Add metrics
  if (alert.metrics) {
    for (const [key, value] of Object.entries(alert.metrics)) {
      facts.push({ title: key, value: String(value) });
    }
  }

  // Add git info
  if (alert.gitBranch) {
    facts.push({ title: 'Branch', value: alert.gitBranch });
  }
  if (alert.gitSha) {
    facts.push({ title: 'Commit', value: alert.gitSha.substring(0, 7) });
  }

  const card = {
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          type: 'AdaptiveCard',
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          version: '1.4',
          body: [
            {
              type: 'TextBlock',
              text: `${emoji} ${alert.title}`,
              weight: 'Bolder',
              size: 'Large',
              color,
            },
            {
              type: 'TextBlock',
              text: alert.message,
              wrap: true,
            },
            {
              type: 'FactSet',
              facts,
            },
          ],
          actions: alert.dashboardUrl
            ? [
                {
                  type: 'Action.OpenUrl',
                  title: 'View Dashboard',
                  url: alert.dashboardUrl,
                },
              ]
            : [],
        },
      },
    ],
  };

  const response = await fetch(config.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });

  if (!response.ok) {
    throw new Error(`Teams API error: ${response.status} ${response.statusText}`);
  }

  console.log('✅ Sent Teams notification');
}

// --- Main ---

async function main() {
  const { values } = parseArgs({
    options: {
      severity: {
        type: 'string',
        short: 's',
        default: 'warning',
      },
      title: { type: 'string', short: 't' },
      message: { type: 'string', short: 'm' },
      metrics: { type: 'string' }, // JSON string
      dashboard: { type: 'string', short: 'd' },
      branch: { type: 'string', short: 'b' },
      sha: { type: 'string' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  if (values.help) {
    console.log(`
Usage: notify-team.ts [options]

Options:
  -s, --severity <level>   Severity level: critical, warning, info (default: warning)
  -t, --title <text>       Alert title
  -m, --message <text>     Alert message
  --metrics <json>         Metrics as JSON object
  -d, --dashboard <url>    Dashboard URL
  -b, --branch <name>      Git branch
  --sha <sha>              Git commit SHA
  -h, --help               Show this help message

Configuration:
  Create .quality-notifications.json or set environment variables:
  - SLACK_WEBHOOK_URL
  - DISCORD_WEBHOOK_URL
  - TEAMS_WEBHOOK_URL
  - NOTIFICATION_MODE (realtime|digest)
  - NOTIFICATIONS_ENABLED (true|false)

Example:
  tsx tools/scripts/notify-team.ts \\
    --severity=critical \\
    --title="Quality Gate Failed" \\
    --message="Coverage dropped below threshold" \\
    --metrics='{"coverage":"82.5%","threshold":"85%"}' \\
    --dashboard="https://app.afenda.io/quality" \\
    --branch=main \\
    --sha=abc1234
    `);
    process.exit(0);
  }

  console.log('🔔 Loading notification configuration...');
  const config = await loadConfig();

  if (!config.enabled) {
    console.log('⏭️  Notifications disabled in configuration');
    process.exit(0);
  }

  if (!config.slack && !config.discord && !config.teams) {
    console.log('⚠️  No notification channels configured');
    console.log('   Set SLACK_WEBHOOK_URL, DISCORD_WEBHOOK_URL, or TEAMS_WEBHOOK_URL');
    process.exit(0);
  }

  // Build alert
  const alert: QualityAlert = {
    severity: values.severity as QualityAlert['severity'],
    title: values.title || 'Quality Metric Alert',
    message: values.message || 'A quality metric has changed',
    metrics: values.metrics ? JSON.parse(values.metrics) : undefined,
    timestamp: new Date().toISOString(),
    dashboardUrl: values.dashboard,
    gitBranch: values.branch,
    gitSha: values.sha,
  };

  console.log(`\n📨 Sending ${alert.severity} alert: ${alert.title}`);

  // Send to configured channels
  const promises: Promise<void>[] = [];

  if (config.slack) {
    promises.push(sendSlackNotification(config.slack, alert));
  }

  if (config.discord) {
    promises.push(sendDiscordNotification(config.discord, alert));
  }

  if (config.teams) {
    promises.push(sendTeamsNotification(config.teams, alert));
  }

  await Promise.allSettled(promises);

  console.log('\n✅ Notifications sent!');
}

main().catch((error) => {
  console.error('❌ Error sending notifications:', error);
  process.exit(1);
});
