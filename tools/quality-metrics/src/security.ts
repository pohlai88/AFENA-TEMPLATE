#!/usr/bin/env node
/**
 * Security Scanner
 *
 * Scans for security vulnerabilities using npm audit and optionally Snyk.
 * Generates a report and can fail CI if critical vulnerabilities are found.
 */

import { execSync } from 'node:child_process';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

interface SecurityConfig {
  failOnCritical: boolean;
  failOnHigh: boolean;
  failOnModerate: boolean;
  allowedVulnerabilities: string[]; // CVE IDs or package names to ignore
  outputFormat: 'json' | 'text' | 'markdown';
}

interface AuditResult {
  vulnerabilities: {
    critical: number;
    high: number;
    moderate: number;
    low: number;
    info: number;
  };
  metadata: {
    vulnerabilities: {
      critical: number;
      high: number;
      moderate: number;
      low: number;
      info: number;
      total: number;
    };
    dependencies: {
      prod: number;
      dev: number;
      optional: number;
      peer: number;
      total: number;
    };
  };
  advisories: Record<string, any>;
}

interface SecurityReport {
  timestamp: string;
  passed: boolean;
  npmAudit: {
    critical: number;
    high: number;
    moderate: number;
    low: number;
    info: number;
    total: number;
  };
  blockers: string[];
  warnings: string[];
  allowedVulnerabilities: string[];
}

async function runNpmAudit(): Promise<AuditResult | null> {
  try {
    console.log('🔍 Running npm audit...');
    const output = execSync('pnpm audit --json', {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: join(process.cwd(), '..', '..'),
    });

    return JSON.parse(output);
  } catch (error: any) {
    // npm audit returns non-zero exit code if vulnerabilities found
    if (error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch {
        console.warn('⚠️  Failed to parse npm audit output');
        return null;
      }
    }
    console.warn('⚠️  npm audit failed to run');
    return null;
  }
}

function analyzeSecurityReport(
  auditResult: AuditResult | null,
  config: SecurityConfig,
): SecurityReport {
  const report: SecurityReport = {
    timestamp: new Date().toISOString(),
    passed: true,
    npmAudit: {
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      info: 0,
      total: 0,
    },
    blockers: [],
    warnings: [],
    allowedVulnerabilities: config.allowedVulnerabilities,
  };

  if (!auditResult) {
    report.passed = false;
    report.blockers.push('Failed to run security audit');
    return report;
  }

  // Extract vulnerability counts
  const vulns = auditResult.metadata?.vulnerabilities || {};
  report.npmAudit = {
    critical: vulns.critical || 0,
    high: vulns.high || 0,
    moderate: vulns.moderate || 0,
    low: vulns.low || 0,
    info: vulns.info || 0,
    total: vulns.total || 0,
  };

  // Check thresholds
  if (config.failOnCritical && report.npmAudit.critical > 0) {
    report.passed = false;
    report.blockers.push(`${report.npmAudit.critical} critical vulnerabilities found`);
  }

  if (config.failOnHigh && report.npmAudit.high > 0) {
    report.passed = false;
    report.blockers.push(`${report.npmAudit.high} high severity vulnerabilities found`);
  }

  if (config.failOnModerate && report.npmAudit.moderate > 0) {
    report.passed = false;
    report.blockers.push(`${report.npmAudit.moderate} moderate severity vulnerabilities found`);
  }

  // Add warnings for lower severity issues
  if (report.npmAudit.moderate > 0 && !config.failOnModerate) {
    report.warnings.push(`${report.npmAudit.moderate} moderate severity vulnerabilities found`);
  }

  if (report.npmAudit.low > 0) {
    report.warnings.push(`${report.npmAudit.low} low severity vulnerabilities found`);
  }

  return report;
}

function formatReportMarkdown(report: SecurityReport): string {
  const lines: string[] = [];

  lines.push('# 🔒 Security Scan Report');
  lines.push('');
  lines.push(`**Timestamp**: ${report.timestamp}`);
  lines.push(`**Status**: ${report.passed ? '✅ PASSED' : '❌ FAILED'}`);
  lines.push('');

  lines.push('## 📊 Vulnerability Summary');
  lines.push('');
  lines.push('| Severity | Count |');
  lines.push('|----------|-------|');
  lines.push(`| 🔴 Critical | ${report.npmAudit.critical} |`);
  lines.push(`| 🟠 High | ${report.npmAudit.high} |`);
  lines.push(`| 🟡 Moderate | ${report.npmAudit.moderate} |`);
  lines.push(`| 🟢 Low | ${report.npmAudit.low} |`);
  lines.push(`| ℹ️  Info | ${report.npmAudit.info} |`);
  lines.push(`| **Total** | **${report.npmAudit.total}** |`);
  lines.push('');

  if (report.blockers.length > 0) {
    lines.push('## ❌ Blockers');
    lines.push('');
    report.blockers.forEach((blocker) => {
      lines.push(`- ${blocker}`);
    });
    lines.push('');
  }

  if (report.warnings.length > 0) {
    lines.push('## ⚠️  Warnings');
    lines.push('');
    report.warnings.forEach((warning) => {
      lines.push(`- ${warning}`);
    });
    lines.push('');
  }

  if (report.allowedVulnerabilities.length > 0) {
    lines.push('## 🔓 Allowed Vulnerabilities');
    lines.push('');
    report.allowedVulnerabilities.forEach((vuln) => {
      lines.push(`- ${vuln}`);
    });
    lines.push('');
  }

  lines.push('## 🛠️  Remediation');
  lines.push('');
  if (report.npmAudit.total > 0) {
    lines.push('Run the following commands to fix vulnerabilities:');
    lines.push('');
    lines.push('```bash');
    lines.push('# Review vulnerabilities');
    lines.push('pnpm audit');
    lines.push('');
    lines.push('# Auto-fix (caution: may break compatibility)');
    lines.push('pnpm audit --fix');
    lines.push('');
    lines.push('# Update dependencies with Renovate');
    lines.push('# or manually update package.json');
    lines.push('```');
  } else {
    lines.push('✅ No vulnerabilities found. Your dependencies are up to date!');
  }

  return lines.join('\n');
}

function formatReportText(report: SecurityReport): string {
  const lines: string[] = [];

  lines.push('════════════════════════════════════════');
  lines.push('       🔒 SECURITY SCAN REPORT          ');
  lines.push('════════════════════════════════════════');
  lines.push('');
  lines.push(`Status: ${report.passed ? '✅ PASSED' : '❌ FAILED'}`);
  lines.push(`Time: ${report.timestamp}`);
  lines.push('');
  lines.push('Vulnerabilities:');
  lines.push(`  🔴 Critical:  ${report.npmAudit.critical}`);
  lines.push(`  🟠 High:      ${report.npmAudit.high}`);
  lines.push(`  🟡 Moderate:  ${report.npmAudit.moderate}`);
  lines.push(`  🟢 Low:       ${report.npmAudit.low}`);
  lines.push(`  ℹ️  Info:      ${report.npmAudit.info}`);
  lines.push(`  ─────────────────────`);
  lines.push(`  Total:       ${report.npmAudit.total}`);
  lines.push('');

  if (report.blockers.length > 0) {
    lines.push('❌ Blockers:');
    report.blockers.forEach((blocker) => {
      lines.push(`  • ${blocker}`);
    });
    lines.push('');
  }

  if (report.warnings.length > 0) {
    lines.push('⚠️  Warnings:');
    report.warnings.forEach((warning) => {
      lines.push(`  • ${warning}`);
    });
    lines.push('');
  }

  lines.push('════════════════════════════════════════');

  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  const failOnCritical = !args.includes('--no-fail-critical');
  const failOnHigh = !args.includes('--no-fail-high');
  const failOnModerate = args.includes('--fail-moderate');
  const outputFormat =
    (args.find((a) => a.startsWith('--format='))?.split('=')[1] as 'json' | 'text' | 'markdown') ||
    'text';

  const config: SecurityConfig = {
    failOnCritical,
    failOnHigh,
    failOnModerate,
    allowedVulnerabilities: [],
    outputFormat,
  };

  console.log('🔐 Starting security scan...');
  console.log('');

  const auditResult = await runNpmAudit();
  const report = analyzeSecurityReport(auditResult, config);

  // Save report to file
  const workspaceRoot = join(process.cwd(), '..', '..');
  const metricsDir = join(workspaceRoot, '.quality-metrics');

  if (!existsSync(metricsDir)) {
    mkdirSync(metricsDir, { recursive: true });
  }

  const reportPath = join(metricsDir, 'security-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📝 Report saved to: ${reportPath}`);
  console.log('');

  // Output formatted report
  if (outputFormat === 'markdown') {
    const markdownPath = join(metricsDir, 'security-report.md');
    const markdown = formatReportMarkdown(report);
    writeFileSync(markdownPath, markdown);
    console.log(`📄 Markdown report saved to: ${markdownPath}`);
    console.log('');
    console.log(formatReportText(report));
  } else if (outputFormat === 'json') {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(formatReportText(report));
  }

  // Exit with appropriate code
  if (report.passed) {
    console.log('');
    console.log('✅ Security scan passed!');
    process.exit(0);
  } else {
    console.log('');
    console.log('❌ Security scan failed!');
    process.exit(1);
  }
}

main();
