#!/usr/bin/env tsx
/**
 * Analyze Package Complexity
 *
 * CLI tool for analyzing package complexity metrics.
 *
 * @since Sprint 6
 */

import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
  analyzeAllPackages,
  getComplexityRecommendations,
} from '../quality-metrics/src/complexity-analyzer.js';

async function main() {
  const { values } = parseArgs({
    options: {
      packages: { type: 'string', short: 'p', default: 'packages' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  if (values.help) {
    console.log(`
Usage: analyze-complexity.ts [options]

Options:
  -p, --packages <dir>   Packages directory (default: packages)
  -h, --help             Show this help message

Example:
  tsx tools/scripts/analyze-complexity.ts
    `);
    process.exit(0);
  }

  const packagesDir = resolve(process.cwd(), values.packages!);

  console.log('📊 Analyzing package complexity...\n');

  const results = await analyzeAllPackages(packagesDir);

  // Display results
  console.log('\n📈 Complexity Analysis Results:\n');
  console.log('─'.repeat(100));
  console.log(
    `${'Package'.padEnd(20)} ${'CC'.padEnd(8)} ${'Cog.C'.padEnd(8)} ${'LOC'.padEnd(10)} ${'MI'.padEnd(8)}`,
  );
  console.log('─'.repeat(100));

  for (const pkg of results) {
    console.log(
      `${pkg.package.padEnd(20)} ${pkg.cyclomaticComplexity.toString().padEnd(8)} ${pkg.cognitiveComplexity.toString().padEnd(8)} ${pkg.linesOfCode.toString().padEnd(10)} ${pkg.maintainabilityIndex.toFixed(1).padEnd(8)}`,
    );
  }

  console.log('─'.repeat(100));

  // Show recommendations
  console.log('\n💡 Recommendations:\n');

  for (const pkg of results) {
    const recommendations = getComplexityRecommendations(pkg);

    if (recommendations.length > 0) {
      console.log(`📦 ${pkg.package}:`);
      recommendations.forEach((rec) => console.log(`   - ${rec}`));
      console.log('');
    }
  }

  console.log('✅ Analysis complete!\n');
}

main().catch((error) => {
  console.error('❌ Error analyzing complexity:', error);
  process.exit(1);
});
