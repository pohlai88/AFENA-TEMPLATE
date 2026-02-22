#!/usr/bin/env node
/**
 * Run Quality Plugins with Database Integration
 *
 * CLI tool to execute quality plugins and save results to database.
 *
 * Usage:
 *   pnpm quality:plugins                    # Run all plugins
 *   pnpm quality:plugins --plugin=code-smells  # Run specific plugin
 *   pnpm quality:plugins --no-db            # Skip database save
 *
 * @since Sprint 6
 */

import { parseArgs } from 'node:util';
import { execSync } from 'node:child_process';
import { createPluginManager } from '../quality-metrics/src/plugin-system.js';
import { createPluginDatabase, savePluginResults } from '../quality-metrics/src/plugin-database.js';

// --- CLI Arguments ---

const { values } = parseArgs({
  options: {
    plugin: { type: 'string', short: 'p' },
    config: { type: 'string', short: 'c' },
    'no-db': { type: 'boolean', default: false },
    verbose: { type: 'boolean', short: 'v', default: false },
  },
});

// --- Helper Functions ---

function getGitInfo(): { sha: string; branch: string } {
  try {
    const sha = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
    return { sha, branch };
  } catch (error) {
    console.warn('⚠️  Failed to get git info, using defaults');
    return { sha: 'unknown', branch: 'unknown' };
  }
}

// --- Main Execution ---

async function main() {
  console.log('🔌 Quality Metrics Plugin Runner\n');

  // Initialize plugin manager
  const manager = createPluginManager();

  // Load configuration
  await manager.loadConfig(values.config);

  // Discover plugins
  await manager.discover();

  const plugins = values.plugin ? [manager.get(values.plugin)].filter(Boolean) : manager.getAll();

  if (plugins.length === 0) {
    console.error('❌ No plugins found');
    process.exit(1);
  }

  console.log(`\n📊 Running ${plugins.length} plugin(s)...\n`);

  // Initialize database (if enabled)
  let pluginDb = null;
  if (!values['no-db']) {
    pluginDb = await createPluginDatabase();
  }

  // Get git context
  const { sha, branch } = getGitInfo();
  const timestamp = new Date().toISOString();

  const context = {
    workspaceRoot: process.cwd(),
    packages: [], // TODO: Auto-detect packages
    gitBranch: branch,
    gitSha: sha,
    timestamp,
  };

  // Execute plugins
  for (const plugin of plugins) {
    console.log(`\n🔍 Running plugin: ${plugin.name}@${plugin.version}`);
    console.log(`   ${plugin.description || 'No description'}\n`);

    try {
      // Collect metrics
      const collectHook = plugin.hooks?.onCollect;
      if (!collectHook) {
        console.log('   ⏭️  No onCollect hook, skipping');
        continue;
      }

      const metricData = await collectHook(context);

      if (values.verbose) {
        console.log('   Metric Data:', JSON.stringify(metricData, null, 2));
      }

      // Analyze metrics
      let analysis = null;
      const analyzeHook = plugin.hooks?.onAnalyze;
      if (analyzeHook) {
        // Create minimal snapshot for analysis
        const snapshot = {
          timestamp,
          gitSha: sha,
          gitBranch: branch,
          metrics: metricData,
        };

        analysis = await analyzeHook(snapshot as any, metricData);

        console.log(`   📈 Analysis Score: ${analysis.score}/100`);
        console.log(`   🔍 Issues Found: ${analysis.issues.length}`);

        if (values.verbose && analysis.issues.length > 0) {
          console.log('\n   Issues:');
          for (const issue of analysis.issues.slice(0, 5)) {
            console.log(`     - [${issue.severity}] ${issue.message}`);
          }
          if (analysis.issues.length > 5) {
            console.log(`     ... and ${analysis.issues.length - 5} more`);
          }
        }

        if (analysis.recommendations.length > 0) {
          console.log('\n   Recommendations:');
          for (const rec of analysis.recommendations.slice(0, 3)) {
            console.log(`     • ${rec}`);
          }
        }
      }

      // Save to database
      if (pluginDb) {
        await savePluginResults(pluginDb, plugin.name, metricData, analysis, {
          gitSha: sha,
          gitBranch: branch,
          timestamp,
        });
      }

      console.log(`   ✅ Plugin completed successfully`);
    } catch (error) {
      console.error(`   ❌ Plugin failed:`, error);
    }
  }

  console.log('\n✅ All plugins completed\n');
}

// Execute
main().catch((error) => {
  console.error('❌ Plugin runner failed:', error);
  process.exit(1);
});
