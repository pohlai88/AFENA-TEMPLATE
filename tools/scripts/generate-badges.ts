#!/usr/bin/env tsx
/**
 * Generate Quality Badges for README
 *
 * This script generates shields.io-compatible badges for quality metrics
 * and automatically updates README.md files.
 *
 * @module generate-badges
 * @since Sprint 6
 */

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

// --- Types ---

interface BadgeConfig {
  label: string;
  value: string | number;
  color: string;
  icon?: string;
  style?: 'flat' | 'flat-square' | 'plastic' | 'for-the-badge';
}

interface QualityMetrics {
  coverage: number;
  buildTime: number;
  testsPassed: number;
  testsTotal: number;
  typeErrors: number;
  lintErrors: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  qualityScore?: number;
}

// --- Helpers ---

function getColorForCoverage(coverage: number): string {
  if (coverage >= 90) return 'brightgreen';
  if (coverage >= 80) return 'green';
  if (coverage >= 70) return 'yellow';
  if (coverage >= 60) return 'orange';
  return 'red';
}

function getColorForBuildTime(buildTime: number): string {
  if (buildTime < 30) return 'brightgreen';
  if (buildTime < 60) return 'green';
  if (buildTime < 120) return 'yellow';
  if (buildTime < 180) return 'orange';
  return 'red';
}

function getColorForVulnerabilities(vulns: QualityMetrics['vulnerabilities']): string {
  if (vulns.critical > 0) return 'critical';
  if (vulns.high > 0) return 'orange';
  if (vulns.medium > 0) return 'yellow';
  return 'brightgreen';
}

function getColorForErrors(errors: number): string {
  if (errors === 0) return 'brightgreen';
  if (errors < 5) return 'yellow';
  if (errors < 10) return 'orange';
  return 'red';
}

function getColorForQualityScore(score: number): string {
  if (score >= 90) return 'brightgreen';
  if (score >= 80) return 'green';
  if (score >= 70) return 'yellow';
  if (score >= 60) return 'orange';
  return 'red';
}

function generateBadgeUrl(config: BadgeConfig): string {
  const { label, value, color, icon, style = 'flat' } = config;

  // Encode label and value for URL
  const encodedLabel = encodeURIComponent(label);
  const encodedValue = encodeURIComponent(String(value));
  const encodedColor = encodeURIComponent(color);

  let url = `https://img.shields.io/badge/${encodedLabel}-${encodedValue}-${encodedColor}`;

  // Add optional parameters
  const params: string[] = [];

  if (style && style !== 'flat') {
    params.push(`style=${style}`);
  }

  if (icon) {
    params.push(`logo=${encodeURIComponent(icon)}`);
  }

  if (params.length > 0) {
    url += `?${params.join('&')}`;
  }

  return url;
}

function generateMarkdownBadge(config: BadgeConfig, link?: string): string {
  const url = generateBadgeUrl(config);
  const badge = `![${config.label}](${url})`;

  return link ? `[${badge}](${link})` : badge;
}

function generateAllBadges(
  metrics: QualityMetrics,
  style: BadgeConfig['style'] = 'flat',
): string[] {
  const badges: string[] = [];

  // Coverage badge
  badges.push(
    generateMarkdownBadge({
      label: 'Coverage',
      value: `${metrics.coverage.toFixed(1)}%`,
      color: getColorForCoverage(metrics.coverage),
      style,
    }),
  );

  // Build time badge
  badges.push(
    generateMarkdownBadge({
      label: 'Build',
      value: `${metrics.buildTime.toFixed(1)}s`,
      color: getColorForBuildTime(metrics.buildTime),
      style,
    }),
  );

  // Tests badge
  const testPassRate = ((metrics.testsPassed / metrics.testsTotal) * 100).toFixed(0);
  badges.push(
    generateMarkdownBadge({
      label: 'Tests',
      value: `${metrics.testsPassed}/${metrics.testsTotal}`,
      color: testPassRate === '100' ? 'brightgreen' : metrics.testsPassed > 0 ? 'yellow' : 'red',
      style,
    }),
  );

  // Type errors badge
  badges.push(
    generateMarkdownBadge({
      label: 'Type Errors',
      value: metrics.typeErrors,
      color: getColorForErrors(metrics.typeErrors),
      style,
    }),
  );

  // Lint errors badge
  badges.push(
    generateMarkdownBadge({
      label: 'Lint Errors',
      value: metrics.lintErrors,
      color: getColorForErrors(metrics.lintErrors),
      style,
    }),
  );

  // Security vulnerabilities badge
  const totalVulns =
    metrics.vulnerabilities.critical +
    metrics.vulnerabilities.high +
    metrics.vulnerabilities.medium +
    metrics.vulnerabilities.low;

  badges.push(
    generateMarkdownBadge({
      label: 'Vulnerabilities',
      value: totalVulns,
      color: getColorForVulnerabilities(metrics.vulnerabilities),
      icon: 'security',
      style,
    }),
  );

  // Quality score badge (if available)
  if (metrics.qualityScore !== undefined) {
    badges.push(
      generateMarkdownBadge({
        label: 'Quality Score',
        value: `${metrics.qualityScore}/100`,
        color: getColorForQualityScore(metrics.qualityScore),
        style,
      }),
    );
  }

  return badges;
}

async function updateReadmeBadges(
  readmePath: string,
  badges: string[],
  markerStart = '<!-- QUALITY-BADGES:START -->',
  markerEnd = '<!-- QUALITY-BADGES:END -->',
): Promise<void> {
  try {
    const content = await readFile(readmePath, 'utf8');

    const badgeSection = `${markerStart}\n${badges.join(' ')}\n${markerEnd}`;

    let updatedContent: string;

    if (content.includes(markerStart) && content.includes(markerEnd)) {
      // Replace existing badge section
      const regex = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`, 'g');
      updatedContent = content.replace(regex, badgeSection);
      console.log('✅ Updated existing badge section');
    } else {
      // Insert badges after first heading
      const lines = content.split('\n');
      const firstHeadingIndex = lines.findIndex((line) => line.startsWith('# '));

      if (firstHeadingIndex !== -1) {
        lines.splice(firstHeadingIndex + 1, 0, '', badgeSection, '');
        updatedContent = lines.join('\n');
        console.log('✅ Inserted new badge section after heading');
      } else {
        // Insert at beginning
        updatedContent = `${badgeSection}\n\n${content}`;
        console.log('✅ Inserted new badge section at beginning');
      }
    }

    await writeFile(readmePath, updatedContent, 'utf8');
    console.log(`📝 Updated: ${readmePath}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.error(`❌ README not found: ${readmePath}`);
    } else {
      throw error;
    }
  }
}

function calculateQualityScore(metrics: QualityMetrics): number {
  // Quality score algorithm:
  // - Coverage: 40% weight
  // - Build performance: 20% weight
  // - Test pass rate: 20% weight
  // - Errors: 10% weight
  // - Security: 10% weight

  const coverageScore = metrics.coverage;

  const buildScore = Math.max(0, 100 - (metrics.buildTime / 60) * 100);

  const testPassRate = (metrics.testsPassed / metrics.testsTotal) * 100;

  const errorsScore = Math.max(0, 100 - (metrics.typeErrors * 5 + metrics.lintErrors * 2));

  const vulnScore = Math.max(
    0,
    100 -
      (metrics.vulnerabilities.critical * 25 +
        metrics.vulnerabilities.high * 10 +
        metrics.vulnerabilities.medium * 5 +
        metrics.vulnerabilities.low * 1),
  );

  const weightedScore =
    coverageScore * 0.4 +
    buildScore * 0.2 +
    testPassRate * 0.2 +
    errorsScore * 0.1 +
    vulnScore * 0.1;

  return Math.round(Math.min(100, Math.max(0, weightedScore)));
}

// --- Main ---

async function main() {
  const { values } = parseArgs({
    options: {
      readme: { type: 'string', short: 'r', default: 'README.md' },
      style: {
        type: 'string',
        short: 's',
        default: 'flat',
      },
      update: { type: 'boolean', short: 'u', default: false },
      help: { type: 'boolean', short: 'h', default: false },
    },
  });

  if (values.help) {
    console.log(`
Usage: generate-badges.ts [options]

Options:
  -r, --readme <file>   README file to update (default: README.md)
  -s, --style <style>   Badge style: flat, flat-square, plastic, for-the-badge (default: flat)
  -u, --update          Update README file with badges
  -h, --help            Show this help message

Examples:
  # Generate badges
  tsx tools/scripts/generate-badges.ts

  # Update README.md
  tsx tools/scripts/generate-badges.ts --update

  # Custom style
  tsx tools/scripts/generate-badges.ts --style=for-the-badge --update
    `);
    process.exit(0);
  }

  const readmePath = resolve(process.cwd(), values.readme!);
  const style = values.style as BadgeConfig['style'];
  const shouldUpdate = values.update;

  console.log('🔍 Fetching quality metrics...');

  // TODO: Fetch actual metrics from database
  // For now, use mock data

  const metrics: QualityMetrics = {
    coverage: 87.5,
    buildTime: 42.3,
    testsPassed: 234,
    testsTotal: 234,
    typeErrors: 0,
    lintErrors: 2,
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 3,
    },
  };

  // Calculate quality score
  metrics.qualityScore = calculateQualityScore(metrics);

  console.log('\n📊 Current Metrics:');
  console.log(`  Coverage: ${metrics.coverage.toFixed(1)}%`);
  console.log(`  Build Time: ${metrics.buildTime.toFixed(1)}s`);
  console.log(`  Tests: ${metrics.testsPassed}/${metrics.testsTotal}`);
  console.log(`  Type Errors: ${metrics.typeErrors}`);
  console.log(`  Lint Errors: ${metrics.lintErrors}`);
  console.log(
    `  Vulnerabilities: ${metrics.vulnerabilities.critical}C/${metrics.vulnerabilities.high}H/${metrics.vulnerabilities.medium}M/${metrics.vulnerabilities.low}L`,
  );
  console.log(`  Quality Score: ${metrics.qualityScore}/100`);

  console.log('\n🎨 Generating badges...');
  const badges = generateAllBadges(metrics, style);

  console.log('\n✅ Generated badges:');
  badges.forEach((badge) => console.log(`  ${badge}`));

  if (shouldUpdate) {
    console.log('\n📝 Updating README...');
    await updateReadmeBadges(readmePath, badges);
  } else {
    console.log('\n💡 Tip: Use --update to automatically update README.md');
    console.log('\nAdd these markers to your README.md:');
    console.log('  <!-- QUALITY-BADGES:START -->');
    console.log('  <!-- QUALITY-BADGES:END -->');
  }

  console.log('\n✅ Done!');
}

main().catch((error) => {
  console.error('❌ Error generating badges:', error);
  process.exit(1);
});
