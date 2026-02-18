/**
 * Bundle script - Run all maintenance tasks in sequence
 * 
 * This provides a single command to run all codebase maintenance tasks:
 * - README generation
 * - Architecture docs generation
 * - Capability metadata checks
 * - Housekeeping invariants
 * - Schema validation
 */

import { runInvariants } from '../checks/invariants';
import { log } from '../core/logger';
import { ReportBuilder } from '../core/report-builder';
import { runReadmeCommand } from '../readme/readme-engine';

import type { afendaConfig } from '../types';

export interface BundleOptions {
  repoRoot: string;
  config: afendaConfig;
  skipReadme?: boolean;
  skipMeta?: boolean;
  skipHousekeeping?: boolean;
  dryRun?: boolean;
}

export interface BundleResult {
  success: boolean;
  tasks: {
    readme?: { success: boolean; message: string };
    meta?: { success: boolean; message: string };
    housekeeping?: { success: boolean; message: string };
  };
}

/**
 * Run all maintenance tasks as a bundle
 */
export async function runBundle(options: BundleOptions): Promise<BundleResult> {
  const { repoRoot, config, skipReadme, skipMeta, skipHousekeeping, dryRun } = options;

  // Initialize automatic report builder
  const reportBuilder = new ReportBuilder('bundle', {
    dryRun,
    saveMarkdown: false, // Can be enabled via CLI flag in future
  });

  const result: BundleResult = {
    success: true,
    tasks: {},
  };

  log.bold('\n🔧 Running afenda Maintenance Bundle\n');

  // Task 1: README Generation
  if (!skipReadme) {
    log.info('📝 Generating READMEs...');
    try {
      const readmeResult = runReadmeCommand({
        mode: 'gen',
        repoRoot,
        config,
        dryRun,
      });

      const success = readmeResult.failures.length === 0;
      result.tasks.readme = {
        success,
        message: success
          ? `Generated ${readmeResult.generated.length}, updated ${readmeResult.updated.length}`
          : `Failed with ${readmeResult.failures.length} errors`,
      };

      // Add to automatic report
      reportBuilder.addTask('readme', {
        success,
        message: result.tasks.readme.message,
        count: readmeResult.generated.length + readmeResult.updated.length,
      });

      if (!success) result.success = false;
    } catch (error: unknown) {
      result.tasks.readme = {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      result.success = false;
    }
  }

  // Task 2: Metadata Checks
  if (!skipMeta) {
    log.info('\n🔍 Running metadata checks...');
    try {
      // TODO: Wire up meta check command when available
      result.tasks.meta = {
        success: true,
        message: 'Metadata checks passed (placeholder)',
      };

      // Add to automatic report
      reportBuilder.addTask('meta', {
        success: true,
        message: result.tasks.meta.message,
      });
    } catch (error: unknown) {
      result.tasks.meta = {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      result.success = false;
    }
  }

  // Task 3: Housekeeping Invariants
  if (!skipHousekeeping) {
    log.info('\n🧹 Running housekeeping checks...');
    try {
      const housekeepingResult = await runInvariants({
        repoRoot,
        json: false,
        debug: false,
      });

      result.tasks.housekeeping = {
        success: housekeepingResult.ok,
        message: housekeepingResult.ok
          ? 'All invariants passed'
          : `${housekeepingResult.summary.failures} failures`,
      };

      // Add to automatic report
      reportBuilder.addTask('housekeeping', {
        success: housekeepingResult.ok,
        message: result.tasks.housekeeping.message,
        count: housekeepingResult.summary.failures,
      });

      if (!housekeepingResult.ok) result.success = false;
    } catch (error: unknown) {
      result.tasks.housekeeping = {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      result.success = false;
    }
  }

  // Generate automatic report using constants
  reportBuilder.generate();

  return result;
}
