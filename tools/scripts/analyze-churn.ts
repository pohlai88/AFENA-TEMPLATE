#!/usr/bin/env tsx
/**
 * Analyze Code Churn
 *
 * CLI tool for analyzing code churn and identifying hotspots.
 *
 * @since Sprint 6
 */

import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import {
  analyzeCodeChurn,
  getChurnRecommendations,
} from '../quality-metrics/src/churn-analyzer.js';

async function main() {
  const { values } = parseArgs({
    options: {
      days: { type: 'string', short: 'd', default: '90' },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  if (values.help) {
    console.log(`
Usage: analyze-churn.ts [options]

Options:
  -d, --days <number>    Number of days to analyze (default: 90)
  -h, --help             Show this help message

Example:
  tsx tools/scripts/analyze-churn.ts --days=30
    `);
    process.exit(0);
  }

  const days = parseInt(values.days!, 10);
  const workspaceRoot = process.cwd();

  console.log(`📊 Analyzing code churn for the last ${days} days...\n`);

  const results = await analyzeCodeChurn(workspaceRoot, days);

  // Display summary
  console.log('\n📈 Code Churn Analysis:\n');
  console.log(`Total Files: ${results.totalFiles}`);
  console.log(`Total Changes: ${results.totalChanges}`);
  console.log(`Volatility: ${results.volatility.toFixed(2)} changes/file`);
  console.log(`Date Range: ${results.dateRange.from} to ${results.dateRange.to}`);

  // Top churned files
  console.log('\n🔥 Top 10 Churned Files:\n');
  console.log('─'.repeat(100));
  console.log(`${'File'.padEnd(60)} ${'Changes'.padEnd(10)} ${'Authors'.padEnd(10)}`);
  console.log('─'.repeat(100));

  for (const file of results.topChurnedFiles.slice(0, 10)) {
    console.log(
      `${file.file.padEnd(60)} ${file.changes.toString().padEnd(10)} ${file.authors.length.toString().padEnd(10)}`,
    );
  }

  console.log('─'.repeat(100));

  // Hotspots
  if (results.hotspots.length > 0) {
    console.log('\n🚨 Hotspots (High Churn + High Complexity):\n');
    console.log('─'.repeat(100));
    console.log(
      `${'File'.padEnd(50)} ${'Churn'.padEnd(10)} ${'Complex'.padEnd(10)} ${'Risk'.padEnd(10)}`,
    );
    console.log('─'.repeat(100));

    for (const hotspot of results.hotspots) {
      console.log(
        `${hotspot.file.padEnd(50)} ${hotspot.churn.toString().padEnd(10)} ${hotspot.complexity.toString().padEnd(10)} ${hotspot.risk.toUpperCase().padEnd(10)}`,
      );
    }

    console.log('─'.repeat(100));
  }

  // Recommendations
  console.log('\n💡 Recommendations:\n');
  const recommendations = getChurnRecommendations(results);

  recommendations.forEach((rec) => console.log(`   - ${rec}`));

  console.log('\n✅ Analysis complete!\n');
}

main().catch((error) => {
  console.error('❌ Error analyzing churn:', error);
  process.exit(1);
});
