/**
 * Report Configuration Constants
 * Defines standard report structure and formatting for all afena-cli commands
 */

export interface ReportTaskConfig {
  key: string;
  title: string;
  icon: string;
  description: string;
}

export interface ReportCommandConfig {
  command: string;
  displayName: string;
  description: string;
  tasks: ReportTaskConfig[];
}

/**
 * Standard report configurations for all afena-cli commands
 */
export const REPORT_CONFIGS: Record<string, ReportCommandConfig> = {
  bundle: {
    command: 'bundle',
    displayName: 'Bundle',
    description: 'Run all maintenance tasks in sequence',
    tasks: [
      {
        key: 'readme',
        title: 'README Generation',
        icon: '📝',
        description: 'Generate and update package READMEs',
      },
      {
        key: 'meta',
        title: 'Metadata Checks',
        icon: '🔍',
        description: 'Validate capability metadata and ledger',
      },
      {
        key: 'housekeeping',
        title: 'Housekeeping Checks',
        icon: '🧹',
        description: 'Run invariant checks (E1-E7, H00-H02)',
      },
    ],
  },
  readme: {
    command: 'readme',
    displayName: 'README Generator',
    description: 'Generate and sync package documentation',
    tasks: [
      {
        key: 'scan',
        title: 'Package Scanning',
        icon: '🔎',
        description: 'Scan workspace for packages',
      },
      {
        key: 'generate',
        title: 'README Generation',
        icon: '📄',
        description: 'Generate README content',
      },
      {
        key: 'architecture',
        title: 'Architecture Docs',
        icon: '🏗️',
        description: 'Generate architecture documentation',
      },
    ],
  },
  housekeeping: {
    command: 'housekeeping',
    displayName: 'Housekeeping',
    description: 'Run codebase invariant checks',
    tasks: [
      {
        key: 'invariants',
        title: 'Invariant Checks',
        icon: '✓',
        description: 'Check E1-E7, H00-H02 invariants',
      },
    ],
  },
  meta: {
    command: 'meta',
    displayName: 'Metadata',
    description: 'Capability metadata operations',
    tasks: [
      {
        key: 'scan',
        title: 'Surface Scanning',
        icon: '🔍',
        description: 'Scan for CAPABILITIES and SURFACE annotations',
      },
      {
        key: 'validate',
        title: 'Validation',
        icon: '✓',
        description: 'Run VIS-00 through VIS-04 checks',
      },
      {
        key: 'generate',
        title: 'Ledger Generation',
        icon: '📊',
        description: 'Generate capability ledger and matrix',
      },
    ],
  },
};

/**
 * Report format constants
 */
export const REPORT_FORMATS = {
  CLI: {
    DIVIDER_HEAVY: '═'.repeat(80),
    DIVIDER_LIGHT: '─'.repeat(78),
    INDENT: '  ',
  },
  MARKDOWN: {
    HEADING_PREFIX: '##',
    DIVIDER: '---',
    CODE_FENCE: '```',
  },
} as const;

/**
 * Status icons and colors
 */
export const STATUS_CONFIG = {
  success: { icon: '✓', color: 'green', label: 'SUCCESS' },
  partial: { icon: '⚠', color: 'yellow', label: 'PARTIAL SUCCESS' },
  failed: { icon: '✗', color: 'red', label: 'FAILED' },
  warning: { icon: '⚠', color: 'yellow', label: 'WARNING' },
  error: { icon: '✗', color: 'red', label: 'ERROR' },
  info: { icon: 'ℹ', color: 'blue', label: 'INFO' },
} as const;

/**
 * Get report configuration for a command
 */
export function getReportConfig(command: string): ReportCommandConfig | undefined {
  return REPORT_CONFIGS[command];
}

/**
 * Get all task keys for a command
 */
export function getTaskKeys(command: string): string[] {
  const config = REPORT_CONFIGS[command];
  return config ? config.tasks.map(t => t.key) : [];
}

/**
 * Get task configuration by key
 */
export function getTaskConfig(command: string, taskKey: string): ReportTaskConfig | undefined {
  const config = REPORT_CONFIGS[command];
  return config?.tasks.find(t => t.key === taskKey);
}
