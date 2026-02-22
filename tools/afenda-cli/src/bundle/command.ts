/**
 * Bundle script - Run all maintenance tasks in sequence
 *
 * Primitives run first, then aggregate docs. Order:
 * 1. README generation
 * 2. Meta (capability checks)
 * 3. Housekeeping invariants
 * 4. Proposal (PROPOSAL.md)
 * 5. Project (PROJECT.md) — last, aggregates all above
 */

import { runInvariants } from '../checks/invariants';
import { runMetaCheck } from '../capability/run-meta-check';
import { log } from '../core/logger';
import { ReportBuilder } from '../core/report-builder';
import { runProjectGen } from '../project';
import { runProposalGen } from '../proposal';
import { runReadmeCommand } from '../readme/readme-engine';

import type { afendaConfig } from '../types';

export interface BundleOptions {
  repoRoot: string;
  config: afendaConfig;
  skipReadme?: boolean;
  skipMeta?: boolean;
  skipHousekeeping?: boolean;
  /** Skip PROPOSAL.md generation (default: false) */
  skipProposal?: boolean;
  /** Skip PROJECT.md generation (default: false) */
  skipProject?: boolean;
  dryRun?: boolean;
}

export interface BundleResult {
  success: boolean;
  tasks: {
    readme?: { success: boolean; message: string };
    meta?: { success: boolean; message: string };
    housekeeping?: { success: boolean; message: string };
    proposal?: { success: boolean; message: string };
    project?: { success: boolean; message: string };
  };
}

/**
 * Run all maintenance tasks as a bundle
 */
export async function runBundle(options: BundleOptions): Promise<BundleResult> {
  const { repoRoot, config, skipReadme, skipMeta, skipHousekeeping, skipProposal, skipProject, dryRun } = options;

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
      const metaResult = await runMetaCheck(repoRoot);
      result.tasks.meta = {
        success: metaResult.ok,
        message: metaResult.message,
      };

      reportBuilder.addTask('meta', {
        success: metaResult.ok,
        message: result.tasks.meta.message,
      });

      if (!metaResult.ok) result.success = false;
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

  // Task 4: Proposal gen (runs before project; project aggregates)
  if (!skipProposal) {
    log.info('\n📜 Generating PROPOSAL.md...');
    try {
      const proposalResult = await runProposalGen({
        repoRoot,
        dryRun: dryRun ?? false,
        skipValidate: true,
      });
      result.tasks.proposal = {
        success: proposalResult.success,
        message: proposalResult.success ? 'PROPOSAL.md written' : 'PROPOSAL.md generation failed',
      };

      reportBuilder.addTask('proposal', {
        success: proposalResult.success,
        message: result.tasks.proposal.message,
      });

      if (!proposalResult.success) result.success = false;
    } catch (error: unknown) {
      result.tasks.proposal = {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
      result.success = false;
    }
  }

  // Task 5: Project gen (last — aggregates all primitives above)
  if (!skipProject) {
    log.info('\n📋 Generating PROJECT.md...');
    try {
      const projectResult = await runProjectGen({
        repoRoot,
        dryRun: dryRun ?? false,
        skipValidate: true,
      });
      result.tasks.project = {
        success: projectResult.success,
        message: projectResult.success ? 'PROJECT.md written' : 'PROJECT.md generation failed',
      };

      reportBuilder.addTask('project', {
        success: projectResult.success,
        message: result.tasks.project.message,
      });

      if (!projectResult.success) result.success = false;
    } catch (error: unknown) {
      result.tasks.project = {
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
