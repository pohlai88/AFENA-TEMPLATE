#!/usr/bin/env node
/**
 * Quality Gates CLI
 *
 * Command-line interface for checking quality gates
 */

import {
  checkQualityGates,
  formatGateResult,
  DEFAULT_CONFIG,
  type QualityGateConfig,
} from './gates';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

interface CLIArgs {
  sha?: string | undefined;
  baseBranch: string;
  configPath?: string | undefined;
}

function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const sha = args.find((a) => a.startsWith('--sha='))?.split('=')[1];
  const baseBranch = args.find((a) => a.startsWith('--base-branch='))?.split('=')[1] || 'main';
  const configPath = args.find((a) => a.startsWith('--config='))?.split('=')[1];

  return { sha, baseBranch, configPath };
}

function loadConfig(configPath?: string): QualityGateConfig {
  let config = { ...DEFAULT_CONFIG };

  // Try to load from custom path
  if (configPath && existsSync(configPath)) {
    try {
      const customConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
      config = { ...config, ...customConfig };
      console.log(`📋 Loaded config from: ${configPath}`);
    } catch (error) {
      console.warn(`⚠️  Failed to load config from ${configPath}, using defaults`);
    }
  } else {
    // Try to load from workspace root
    const workspaceRoot = join(process.cwd(), '..', '..');
    const defaultConfigPath = join(workspaceRoot, '.quality-gates.json');

    if (existsSync(defaultConfigPath)) {
      try {
        const customConfig = JSON.parse(readFileSync(defaultConfigPath, 'utf-8'));
        config = { ...config, ...customConfig };
        console.log(`📋 Loaded config from: ${defaultConfigPath}`);
      } catch (error) {
        console.warn(`⚠️  Failed to load config from ${defaultConfigPath}, using defaults`);
      }
    }
  }

  return config;
}

async function main() {
  const args = parseArgs();

  if (!args.sha) {
    console.error('❌ Missing --sha argument');
    console.error('');
    console.error('Usage:');
    console.error(
      '  pnpm --filter quality-metrics gates --sha=<commit-sha> [--base-branch=main] [--config=<path>]',
    );
    console.error('');
    console.error('Options:');
    console.error('  --sha=<sha>           Git commit SHA to check (required)');
    console.error('  --base-branch=<name>  Baseline branch for comparison (default: main)');
    console.error(
      '  --config=<path>       Path to custom config file (default: .quality-gates.json)',
    );
    console.error('');
    console.error('Example:');
    console.error('  pnpm --filter quality-metrics gates --sha=abc123 --base-branch=main');
    process.exit(1);
  }

  console.log('🚀 Running quality gates...');
  console.log(`   SHA: ${args.sha}`);
  console.log(`   Base branch: ${args.baseBranch}`);
  console.log('');

  try {
    const config = loadConfig(args.configPath);
    const result = await checkQualityGates(args.sha, args.baseBranch, config);

    console.log(formatGateResult(result));

    if (result.passed) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to check quality gates:');
    console.error(error);
    process.exit(1);
  }
}

main();
