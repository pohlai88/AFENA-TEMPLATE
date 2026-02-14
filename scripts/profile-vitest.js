#!/usr/bin/env node
/* eslint-disable no-undef */

/**
 * Vitest Performance Profiling Script
 * 
 * Usage:
 *   node scripts/profile-vitest.js        # Profile test runner
 *   node scripts/profile-vitest.js main   # Profile main thread
 *   node scripts/profile-vitest.js cpu    # Profile both
 */

import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import pino from 'pino';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '..');

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
  },
});

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    logger.info(`Running: ${command} ${args.join(' ')}`);

    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: workspaceRoot,
      ...options,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

async function profileTestRunner() {
  logger.info('🔍 Profiling test runner...');

  await runCommand('pnpm', [
    'vitest',
    'run',
    '--no-file-parallelism',
    '--reporter=verbose'
  ], {
    env: {
      ...global.process.env,
      NODE_OPTIONS: [
        '--cpu-prof',
        '--cpu-prof-dir=./profiles/test-runner',
        '--heap-prof',
        '--heap-prof-dir=./profiles/test-runner'
      ].join(' ')
    }
  });

  logger.info('✅ Test runner profiles saved to ./profiles/test-runner/');
}

async function profileMainThread() {
  logger.info('🔍 Profiling main thread...');

  await runCommand('node', [
    '--cpu-prof',
    '--cpu-prof-dir=./profiles/main-thread',
    './node_modules/vitest/vitest.mjs',
    'run',
    '--no-file-parallelism'
  ]);

  logger.info('✅ Main thread profile saved to ./profiles/main-thread/');
}

async function profileFileTransforms() {
  logger.info('🔍 Profiling file transforms...');

  await runCommand('pnpm', [
    'vitest',
    'run',
    '--no-file-parallelism'
  ], {
    env: {
      ...global.process.env,
      VITEST_DEBUG_DUMP: 'true'
    }
  });

  logger.info('✅ Transform dumps saved to ./.vitest-dump/');
}

async function profileCoverage() {
  logger.info('🔍 Profiling coverage generation...');

  await runCommand('pnpm', [
    'vitest',
    'run',
    '--coverage',
    '--no-file-parallelism'
  ], {
    env: {
      ...global.process.env,
      DEBUG: 'vitest:coverage'
    }
  });

  logger.info('✅ Coverage profiling completed');
}

async function main() {
  logger.info('🚀 Starting Vitest performance profiling...');

  // Ensure profiles directory exists
  const profilesDir = resolve(workspaceRoot, 'profiles');
  if (!existsSync(profilesDir)) {
    mkdirSync(profilesDir, { recursive: true });
  }

  const mode = global.process.argv[2] || 'cpu';

  switch (mode) {
    case 'test-runner':
    case 'runner':
      await profileTestRunner();
      break;

    case 'main':
    case 'main-thread':
      await profileMainThread();
      break;

    case 'transform':
    case 'transforms':
      await profileFileTransforms();
      break;

    case 'coverage':
      await profileCoverage();
      break;

    case 'cpu':
    default:
      logger.info('🔍 Running comprehensive CPU profiling...');
      await profileTestRunner();
      await profileMainThread();
      break;
  }

  logger.info('✨ Profiling complete!');
  logger.info('📊 To view profiles:');
  logger.info('  1. Open Chrome DevTools');
  logger.info('  2. Go to the Performance tab');
  logger.info('  3. Load the .cpuprofile files');
  logger.info('  4. For heap profiles, use the Memory tab');
}

main().catch((error) => {
  logger.error(error);
  global.process.exit(1);
});
