/**
 * Automatic Report Builder
 * Builds reports from task results using constants - no manual construction needed
 */

import { writeFileSync } from 'fs';
import { join } from 'path';

import { getReportConfig } from './report-config';
import { generateReport, generateMarkdownReport, createTimer, getTimestamp } from './reporter';

import type { CommandReport, ReportSection } from './reporter';

export interface TaskResult {
  success: boolean;
  message: string;
  count?: number;
  details?: string[];
}

export interface AutoReportOptions {
  command: string;
  taskResults: Record<string, TaskResult>;
  dryRun?: boolean;
  saveMarkdown?: boolean;
  outputDir?: string;
}

/**
 * Automatically build and generate reports from task results
 * Uses constants from report-config.ts - no manual construction needed
 */
export class ReportBuilder {
  private command: string;
  private timer: ReturnType<typeof createTimer>;
  private startTime: string;
  private taskResults: Record<string, TaskResult> = {};
  private dryRun: boolean;
  private saveMarkdown: boolean;
  private outputDir: string;

  constructor(command: string, options: { dryRun?: boolean; saveMarkdown?: boolean; outputDir?: string } = {}) {
    this.command = command;
    this.timer = createTimer();
    this.startTime = getTimestamp();
    this.dryRun = options.dryRun ?? false;
    this.saveMarkdown = options.saveMarkdown ?? false;
    this.outputDir = options.outputDir ?? '.afenda/reports';
  }

  /**
   * Add a task result
   */
  addTask(taskKey: string, result: TaskResult): void {
    this.taskResults[taskKey] = result;
  }

  /**
   * Build and output the report automatically
   */
  generate(): void {
    const report = this.buildReport();
    
    // Output CLI report
    const cliOutput = generateReport(report);
    process.stdout.write(cliOutput);

    // Save Markdown report if requested
    if (this.saveMarkdown) {
      this.saveMarkdownReport(report);
    }
  }

  /**
   * Build the report from task results using constants
   */
  private buildReport(): CommandReport {
    const config = getReportConfig(this.command);
    if (!config) {
      throw new Error(`No report configuration found for command: ${this.command}`);
    }

    const sections: ReportSection[] = [];
    const details: string[] = [];
    const recommendations: string[] = [];

    let totalTasks = 0;
    let successTasks = 0;
    let failedTasks = 0;

    // Automatically build sections from task results using constants
    for (const taskConfig of config.tasks) {
      const result = this.taskResults[taskConfig.key];
      if (!result) continue;

      totalTasks++;
      if (result.success) {
        successTasks++;
      } else {
        failedTasks++;
      }

      // Build section from constant configuration
      sections.push({
        title: taskConfig.title,
        items: [
          {
            label: 'Status',
            value: result.message,
            status: result.success ? 'success' : 'error',
          },
          ...(result.count !== undefined
            ? [{ label: 'Count', value: result.count, status: 'info' as const }]
            : []),
        ],
      });

      // Add task details if provided
      if (result.details) {
        details.push(...result.details.map(d => `[${taskConfig.title}] ${d}`));
      }
    }

    // Auto-generate details
    if (this.dryRun) {
      details.push('Dry-run mode: No files were modified');
    }

    // Auto-generate recommendations
    if (!this.isSuccess()) {
      recommendations.push('Review failed tasks and address errors before committing');
      recommendations.push(`Run individual commands for detailed error messages: pnpm afenda ${this.command} --help`);
    } else if (this.dryRun) {
      recommendations.push('Run without --dry-run to apply changes');
    } else if (totalTasks > 0) {
      recommendations.push('All tasks completed successfully - changes are ready to commit');
    }

    return {
      command: this.command,
      timestamp: this.startTime,
      duration: this.timer.elapsed(),
      status: this.getStatus(totalTasks, successTasks, failedTasks),
      summary: this.buildSummary(config.displayName, totalTasks, successTasks, failedTasks),
      metrics: {
        total: totalTasks,
        success: successTasks,
        warnings: 0,
        errors: failedTasks,
      },
      sections,
      details: details.length > 0 ? details : undefined,
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  /**
   * Determine overall status
   */
  private getStatus(total: number, success: number, failed: number): 'success' | 'partial' | 'failed' {
    if (failed === 0) return 'success';
    if (success > 0) return 'partial';
    return 'failed';
  }

  /**
   * Build summary message
   */
  private buildSummary(displayName: string, total: number, success: number, failed: number): string {
    if (failed === 0) {
      return `${displayName}: Successfully completed all ${total} task${total !== 1 ? 's' : ''}`;
    }
    return `${displayName}: Completed ${success}/${total} task${total !== 1 ? 's' : ''} with ${failed} failure${failed !== 1 ? 's' : ''}`;
  }

  /**
   * Check if all tasks succeeded
   */
  private isSuccess(): boolean {
    return Object.values(this.taskResults).every(r => r.success);
  }

  /**
   * Save Markdown report to file
   */
  private saveMarkdownReport(report: CommandReport): void {
    try {
      const markdown = generateMarkdownReport(report);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = `${this.command}-${timestamp}.md`;
      const filepath = join(this.outputDir, filename);
      
      writeFileSync(filepath, markdown, 'utf-8');
      process.stdout.write(`\n📄 Markdown report saved: ${filepath}\n`);
    } catch (error: unknown) {
      // Silently fail if unable to save - don't break the command
      process.stderr.write(`\n⚠️  Could not save Markdown report: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }
}

/**
 * Quick helper to auto-generate a report
 */
export function autoReport(options: AutoReportOptions): void {
  const builder = new ReportBuilder(options.command, {
    dryRun: options.dryRun,
    saveMarkdown: options.saveMarkdown,
    outputDir: options.outputDir,
  });

  for (const [taskKey, result] of Object.entries(options.taskResults)) {
    builder.addTask(taskKey, result);
  }

  builder.generate();
}
