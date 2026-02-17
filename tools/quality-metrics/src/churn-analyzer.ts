/**
 * Code Churn Analyzer
 *
 * Analyzes git commit history to identify:
 * - High-churn files (frequently changed)
 * - Hotspots (high churn + high complexity)
 * - Volatility (change frequency)
 * - Author distribution
 *
 * @module churn-analyzer
 * @since Sprint 6
 */

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

// --- Types ---

export interface ChurnMetrics {
  topChurnedFiles: ChurnedFile[];
  volatility: number; // Average changes per file
  hotspots: Hotspot[];
  totalChanges: number;
  totalFiles: number;
  dateRange: {
    from: string;
    to: string;
  };
}

export interface ChurnedFile {
  file: string;
  changes: number;
  additions: number;
  deletions: number;
  authors: string[];
  lastModified: string;
}

export interface Hotspot {
  file: string;
  churn: number;
  complexity: number;
  risk: 'high' | 'medium' | 'low';
}

// --- Helpers ---

async function getGitLog(workspaceRoot: string, days: number): Promise<string> {
  const since = `${days}.days.ago`;

  try {
    const { stdout } = await execAsync(
      `git log --since="${since}" --pretty=format:"%H|%an|%ad" --date=iso --numstat`,
      { cwd: workspaceRoot },
    );
    return stdout;
  } catch (error) {
    console.error('❌ Failed to get git log:', error);
    return '';
  }
}

function parseGitLog(log: string): Map<string, ChurnedFile> {
  const fileMap = new Map<string, ChurnedFile>();

  if (!log) return fileMap;

  const commits = log.split('\n\n');

  for (const commit of commits) {
    const lines = commit.split('\n').filter(Boolean);

    if (lines.length === 0) continue;

    // First line: commit|author|date
    const [commitLine, ...fileLines] = lines;

    if (!commitLine) continue;

    const [, author, date] = commitLine.split('|');

    if (!author || !date) continue;

    // Parse file changes
    for (const fileLine of fileLines) {
      const match = fileLine.match(/^(\d+|-)\s+(\d+|-)\s+(.+)$/);

      if (!match) continue;

      const [, additionsStr, deletionsStr, file] = match;

      if (!additionsStr || !deletionsStr || !file) continue;

      // Skip non-TS/JS files
      if (!/\.(ts|tsx|js|jsx)$/.test(file)) continue;

      const additions = additionsStr === '-' ? 0 : parseInt(additionsStr, 10);
      const deletions = deletionsStr === '-' ? 0 : parseInt(deletionsStr, 10);

      const existing = fileMap.get(file);

      if (existing) {
        existing.changes++;
        existing.additions += additions;
        existing.deletions += deletions;

        if (!existing.authors.includes(author)) {
          existing.authors.push(author);
        }

        if (date > existing.lastModified) {
          existing.lastModified = date;
        }
      } else {
        fileMap.set(file, {
          file,
          changes: 1,
          additions,
          deletions,
          authors: [author],
          lastModified: date,
        });
      }
    }
  }

  return fileMap;
}

function identifyHotspots(
  churnedFiles: ChurnedFile[],
  complexityMap: Map<string, number>,
): Hotspot[] {
  const hotspots: Hotspot[] = [];

  for (const file of churnedFiles) {
    const complexity = complexityMap.get(file.file) || 0;
    const churn = file.changes;

    // Hotspot criteria: high churn + high complexity
    if (churn > 5 && complexity > 10) {
      const risk =
        churn > 20 && complexity > 20 ? 'high' : churn > 10 && complexity > 15 ? 'medium' : 'low';

      hotspots.push({
        file: file.file,
        churn,
        complexity,
        risk,
      });
    }
  }

  // Sort by risk and churn
  hotspots.sort((a, b) => {
    const riskOrder = { high: 3, medium: 2, low: 1 };
    const riskDiff = riskOrder[b.risk] - riskOrder[a.risk];

    return riskDiff !== 0 ? riskDiff : b.churn - a.churn;
  });

  return hotspots;
}

// --- Public API ---

export async function analyzeCodeChurn(
  workspaceRoot: string,
  days: number = 90,
  complexityMap: Map<string, number> = new Map(),
): Promise<ChurnMetrics> {
  console.log(`🔍 Analyzing code churn for the last ${days} days...`);

  const log = await getGitLog(workspaceRoot, days);
  const fileMap = parseGitLog(log);

  const churnedFiles = Array.from(fileMap.values()).sort((a, b) => b.changes - a.changes);

  const totalChanges = churnedFiles.reduce((sum, f) => sum + f.changes, 0);
  const totalFiles = churnedFiles.length;
  const volatility = totalFiles > 0 ? totalChanges / totalFiles : 0;

  const hotspots = identifyHotspots(churnedFiles, complexityMap);

  const now = new Date();
  const fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  console.log(`✅ Analyzed ${totalFiles} files with ${totalChanges} total changes`);
  console.log(`   Volatility: ${volatility.toFixed(2)} changes/file`);
  console.log(`   Hotspots: ${hotspots.length}`);

  return {
    topChurnedFiles: churnedFiles.slice(0, 20), // Top 20
    volatility,
    hotspots,
    totalChanges,
    totalFiles,
    dateRange: {
      from: fromDate.toISOString().split('T')[0] ?? '',
      to: now.toISOString().split('T')[0] ?? '',
    },
  };
}

export function getChurnRecommendations(metrics: ChurnMetrics): string[] {
  const recommendations: string[] = [];

  // High volatility
  if (metrics.volatility > 10) {
    recommendations.push(
      `High volatility (${metrics.volatility.toFixed(1)} changes/file) - consider stabilizing frequently changed code`,
    );
  }

  // Hotspots
  const highRiskHotspots = metrics.hotspots.filter((h) => h.risk === 'high');
  if (highRiskHotspots.length > 0) {
    recommendations.push(
      `${highRiskHotspots.length} high-risk hotspot(s) detected - prioritize refactoring these files`,
    );

    highRiskHotspots.slice(0, 3).forEach((h) => {
      recommendations.push(`  - ${h.file} (${h.churn} changes, complexity ${h.complexity})`);
    });
  }

  // Top churned files
  const topChurned = metrics.topChurnedFiles.slice(0, 5);
  const topFile = topChurned[0];
  if (topChurned.length > 0 && topFile && topFile.changes > 15) {
    recommendations.push(
      `Top churned file: ${topFile.file} (${topFile.changes} changes) - investigate for stability issues`,
    );
  }

  return recommendations;
}
