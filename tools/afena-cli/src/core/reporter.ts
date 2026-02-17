/**
 * Auto-generated Report System
 * Provides standardized, clear, and clean reports for all afenda-cli commands
 */

import pc from 'picocolors';

export interface ReportSection {
  title: string;
  items: Array<{
    label: string;
    value: string | number;
    status?: 'success' | 'warning' | 'error' | 'info';
  }>;
}

export interface ReportMetrics {
  total: number;
  success: number;
  warnings: number;
  errors: number;
  skipped?: number;
}

export interface CommandReport {
  command: string;
  timestamp: string;
  duration: number;
  status: 'success' | 'partial' | 'failed';
  summary: string;
  metrics?: ReportMetrics;
  sections: ReportSection[];
  details?: string[];
  recommendations?: string[];
}

/**
 * Generate a standardized command report
 */
export function generateReport(report: CommandReport): string {
  const lines: string[] = [];

  // Header
  lines.push('');
  lines.push(pc.bold('═'.repeat(80)));
  lines.push(pc.bold(`  afenda CLI REPORT: ${report.command.toUpperCase()}`));
  lines.push(pc.bold('═'.repeat(80)));
  lines.push('');

  // Metadata
  lines.push(pc.dim(`  Timestamp: ${report.timestamp}`));
  lines.push(pc.dim(`  Duration:  ${formatDuration(report.duration)}`));
  lines.push(pc.dim(`  Status:    ${formatStatus(report.status)}`));
  lines.push('');

  // Summary
  const divider = '─'.repeat(78);
  lines.push(pc.bold('  SUMMARY'));
  lines.push(pc.bold(`  ${divider}`));
  lines.push(`  ${report.summary}`);
  lines.push('');

  // Metrics (if provided)
  if (report.metrics) {
    lines.push(pc.bold('  METRICS'));
    lines.push(pc.bold(`  ${divider}`));
    lines.push(`  Total:    ${pc.cyan(report.metrics.total.toString())}`);
    lines.push(`  Success:  ${pc.green(report.metrics.success.toString())}`);
    if (report.metrics.warnings > 0) {
      lines.push(`  Warnings: ${pc.yellow(report.metrics.warnings.toString())}`);
    }
    if (report.metrics.errors > 0) {
      lines.push(`  Errors:   ${pc.red(report.metrics.errors.toString())}`);
    }
    if (report.metrics.skipped !== undefined && report.metrics.skipped > 0) {
      lines.push(`  Skipped:  ${pc.dim(report.metrics.skipped.toString())}`);
    }
    lines.push('');
  }

  // Sections
  for (const section of report.sections) {
    lines.push(pc.bold(`  ${section.title.toUpperCase()}`));
    lines.push(pc.bold(`  ${divider}`));

    for (const item of section.items) {
      const statusIcon = getStatusIcon(item.status);
      const valueStr = typeof item.value === 'number'
        ? pc.cyan(item.value.toString())
        : item.value;
      lines.push(`  ${statusIcon} ${item.label.padEnd(30)} ${valueStr}`);
    }
    lines.push('');
  }

  // Details (if provided)
  if (report.details && report.details.length > 0) {
    lines.push(pc.bold('  DETAILS'));
    lines.push(pc.bold(`  ${divider}`));
    for (const detail of report.details) {
      lines.push(`  • ${detail}`);
    }
    lines.push('');
  }

  // Recommendations (if provided)
  if (report.recommendations && report.recommendations.length > 0) {
    lines.push(pc.bold('  RECOMMENDATIONS'));
    lines.push(pc.bold(`  ${divider}`));
    for (const rec of report.recommendations) {
      lines.push(`  💡 ${rec}`);
    }
    lines.push('');
  }

  // Footer
  lines.push(pc.bold('═'.repeat(80)));
  lines.push('');

  return lines.join('\n');
}

/**
 * Format duration in human-readable format
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}m ${seconds}s`;
}

/**
 * Format status with color
 */
function formatStatus(status: 'success' | 'partial' | 'failed'): string {
  switch (status) {
    case 'success':
      return pc.green('✓ SUCCESS');
    case 'partial':
      return pc.yellow('⚠ PARTIAL SUCCESS');
    case 'failed':
      return pc.red('✗ FAILED');
  }
}

/**
 * Get status icon
 */
function getStatusIcon(status?: 'success' | 'warning' | 'error' | 'info'): string {
  switch (status) {
    case 'success':
      return pc.green('✓');
    case 'warning':
      return pc.yellow('⚠');
    case 'error':
      return pc.red('✗');
    case 'info':
      return pc.blue('ℹ');
    default:
      return pc.dim('•');
  }
}

/**
 * Create a simple timer for measuring command duration
 */
export function createTimer() {
  const start = Date.now();
  return {
    elapsed: () => Date.now() - start,
    stop: () => Date.now() - start,
  };
}

/**
 * Get current timestamp in readable format
 */
export function getTimestamp(): string {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
}

/**
 * Generate Markdown report
 */
export function generateMarkdownReport(report: CommandReport): string {
  const lines: string[] = [];

  // Header
  lines.push(`# ${report.command.toUpperCase()} Report`);
  lines.push('');
  lines.push(`**Timestamp:** ${report.timestamp}`);
  lines.push(`**Duration:** ${formatDuration(report.duration)}`);
  lines.push(`**Status:** ${report.status.toUpperCase()}`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push(report.summary);
  lines.push('');

  // Metrics
  if (report.metrics) {
    lines.push('## Metrics');
    lines.push('');
    lines.push('| Metric | Count |');
    lines.push('|--------|-------|');
    lines.push(`| Total | ${report.metrics.total} |`);
    lines.push(`| Success | ${report.metrics.success} |`);
    if (report.metrics.warnings > 0) {
      lines.push(`| Warnings | ${report.metrics.warnings} |`);
    }
    if (report.metrics.errors > 0) {
      lines.push(`| Errors | ${report.metrics.errors} |`);
    }
    if (report.metrics.skipped !== undefined && report.metrics.skipped > 0) {
      lines.push(`| Skipped | ${report.metrics.skipped} |`);
    }
    lines.push('');
  }

  // Sections
  for (const section of report.sections) {
    lines.push(`## ${section.title}`);
    lines.push('');

    if (section.items.length > 0) {
      lines.push('| Item | Value | Status |');
      lines.push('|------|-------|--------|');

      for (const item of section.items) {
        const statusEmoji = getMarkdownStatusIcon(item.status);
        lines.push(`| ${item.label} | ${item.value} | ${statusEmoji} |`);
      }
      lines.push('');
    }
  }

  // Details
  if (report.details && report.details.length > 0) {
    lines.push('## Details');
    lines.push('');
    for (const detail of report.details) {
      lines.push(`- ${detail}`);
    }
    lines.push('');
  }

  // Recommendations
  if (report.recommendations && report.recommendations.length > 0) {
    lines.push('## Recommendations');
    lines.push('');
    for (const rec of report.recommendations) {
      lines.push(`💡 ${rec}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push(`*Generated by afenda-cli at ${report.timestamp}*`);
  lines.push('');

  return lines.join('\n');
}

/**
 * Get Markdown status icon
 */
function getMarkdownStatusIcon(status?: 'success' | 'warning' | 'error' | 'info'): string {
  switch (status) {
    case 'success':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'error':
      return '❌';
    case 'info':
      return 'ℹ️';
    default:
      return '•';
  }
}
