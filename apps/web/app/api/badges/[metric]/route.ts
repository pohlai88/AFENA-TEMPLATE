/**
 * Badge API Endpoint
 *
 * Generates dynamic SVG badges for quality metrics.
 * Serves as self-hosted alternative to shields.io.
 *
 * @route GET /api/badges/[metric]
 * @since Sprint 6
 */

import { NextRequest, NextResponse } from 'next/server';

// --- Types ---

interface BadgeParams {
  metric: string;
}

interface BadgeConfig {
  label: string;
  value: string;
  color: string;
  width?: number;
}

// --- Helper Functions ---

function getColorForCoverage(coverage: number): string {
  if (coverage >= 90) return '#4c1';
  if (coverage >= 80) return '#97ca00';
  if (coverage >= 70) return '#dfb317';
  if (coverage >= 60) return '#fe7d37';
  return '#e05d44';
}

function getColorForBuildTime(buildTime: number): string {
  if (buildTime < 30) return '#4c1';
  if (buildTime < 60) return '#97ca00';
  if (buildTime < 120) return '#dfb317';
  if (buildTime < 180) return '#fe7d37';
  return '#e05d44';
}

function getColorForScore(score: number): string {
  if (score >= 90) return '#4c1';
  if (score >= 80) return '#97ca00';
  if (score >= 70) return '#dfb317';
  if (score >= 60) return '#fe7d37';
  return '#e05d44';
}

function getColorForVulnerabilities(count: number): string {
  if (count === 0) return '#4c1';
  if (count < 3) return '#dfb317';
  if (count < 5) return '#fe7d37';
  return '#e05d44';
}

function generateSVGBadge(config: BadgeConfig): string {
  const { label, value, color } = config;

  const labelWidth = label.length * 7 + 10;
  const valueWidth = value.length * 7 + 10;
  const totalWidth = labelWidth + valueWidth;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text aria-hidden="true" x="${(labelWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(label.length * 70).toString()}">${label}</text>
    <text x="${(labelWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(label.length * 70).toString()}">${label}</text>
    <text aria-hidden="true" x="${(labelWidth + valueWidth / 2) * 10}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(value.length * 70).toString()}">${value}</text>
    <text x="${(labelWidth + valueWidth / 2) * 10}" y="140" transform="scale(.1)" fill="#fff" textLength="${(value.length * 70).toString()}">${value}</text>
  </g>
</svg>`;
}

async function getLatestMetrics(): Promise<Record<string, any>> {
  // TODO: Fetch from database
  // For now, return mock data
  return {
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
    qualityScore: 92,
  };
}

// --- Route Handler ---

export async function GET(_request: NextRequest, { params }: { params: BadgeParams }) {
  const { metric } = params;

  try {
    const metrics = await getLatestMetrics();

    let badgeConfig: BadgeConfig;

    switch (metric) {
      case 'coverage':
        badgeConfig = {
          label: 'coverage',
          value: `${metrics.coverage.toFixed(1)}%`,
          color: getColorForCoverage(metrics.coverage),
        };
        break;

      case 'build-time':
      case 'build':
        badgeConfig = {
          label: 'build',
          value: `${metrics.buildTime.toFixed(1)}s`,
          color: getColorForBuildTime(metrics.buildTime),
        };
        break;

      case 'tests':
        const testPassRate = (metrics.testsPassed / metrics.testsTotal) * 100;
        badgeConfig = {
          label: 'tests',
          value: `${metrics.testsPassed}/${metrics.testsTotal}`,
          color: testPassRate === 100 ? '#4c1' : metrics.testsPassed > 0 ? '#dfb317' : '#e05d44',
        };
        break;

      case 'type-errors':
        badgeConfig = {
          label: 'type errors',
          value: metrics.typeErrors.toString(),
          color: metrics.typeErrors === 0 ? '#4c1' : metrics.typeErrors < 5 ? '#dfb317' : '#e05d44',
        };
        break;

      case 'lint-errors':
        badgeConfig = {
          label: 'lint errors',
          value: metrics.lintErrors.toString(),
          color: metrics.lintErrors === 0 ? '#4c1' : metrics.lintErrors < 5 ? '#dfb317' : '#e05d44',
        };
        break;

      case 'vulnerabilities':
      case 'security':
        const totalVulns =
          metrics.vulnerabilities.critical +
          metrics.vulnerabilities.high +
          metrics.vulnerabilities.medium +
          metrics.vulnerabilities.low;
        badgeConfig = {
          label: 'vulnerabilities',
          value: totalVulns.toString(),
          color: getColorForVulnerabilities(totalVulns),
        };
        break;

      case 'quality-score':
      case 'quality':
        badgeConfig = {
          label: 'quality',
          value: `${metrics.qualityScore}/100`,
          color: getColorForScore(metrics.qualityScore),
        };
        break;

      default:
        return NextResponse.json({ error: `Unknown metric: ${metric}` }, { status: 404 });
    }

    const svg = generateSVGBadge(badgeConfig);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min client, 10 min CDN
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Badge generation error:', error);
    return NextResponse.json({ error: 'Failed to generate badge' }, { status: 500 });
  }
}

// --- API Documentation ---

/**
 * Available badge endpoints:
 *
 * GET /api/badges/coverage         - Test coverage percentage
 * GET /api/badges/build-time       - Build time in seconds
 * GET /api/badges/tests            - Test pass rate
 * GET /api/badges/type-errors      - TypeScript errors
 * GET /api/badges/lint-errors      - ESLint errors
 * GET /api/badges/vulnerabilities  - Security vulnerabilities
 * GET /api/badges/quality-score    - Overall quality score
 *
 * Example usage in README.md:
 *
 * ![Coverage](https://your-app.vercel.app/api/badges/coverage)
 * ![Build](https://your-app.vercel.app/api/badges/build-time)
 * ![Quality](https://your-app.vercel.app/api/badges/quality-score)
 */
