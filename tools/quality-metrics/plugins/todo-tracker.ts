/**
 * TODO Tracker Plugin
 *
 * Tracks and categorizes TODO comments:
 * - TODO: General tasks
 * - FIXME: Bugs that need fixing
 * - HACK: Temporary workarounds
 * - XXX: Critical issues
 * - NOTE: Important notes
 *
 * @module plugins/todo-tracker
 * @since Sprint 6
 */

import { readFile, readdir } from 'node:fs/promises';
import { resolve, extname, relative } from 'node:path';
import type {
  QualityPlugin,
  CollectContext,
  AsMetricData,
  Analysis,
  Issue,
} from '../src/plugin-system.js';

interface TodoItem {
  type: 'TODO' | 'FIXME' | 'HACK' | 'XXX' | 'NOTE';
  message: string;
  file: string;
  line: number;
  priority: 'high' | 'medium' | 'low';
}

interface TodoMetrics {
  todos: number;
  fixmes: number;
  hacks: number;
  xxxs: number;
  notes: number;
  totalDebt: number;
  items: TodoItem[];
  [key: string]: number | string | boolean | object | TodoItem[];
}

type TodoMetricData = TodoMetrics;

async function extractTodos(filePath: string, workspaceRoot: string): Promise<TodoItem[]> {
  const content = await readFile(filePath, 'utf8');
  const lines = content.split('\n');
  const items: TodoItem[] = [];

  const patterns = [
    { regex: /\/\/\s*TODO:?\s*(.+)/i, type: 'TODO' as const, priority: 'low' as const },
    { regex: /\/\/\s*FIXME:?\s*(.+)/i, type: 'FIXME' as const, priority: 'medium' as const },
    { regex: /\/\/\s*HACK:?\s*(.+)/i, type: 'HACK' as const, priority: 'high' as const },
    { regex: /\/\/\s*XXX:?\s*(.+)/i, type: 'XXX' as const, priority: 'high' as const },
    { regex: /\/\/\s*NOTE:?\s*(.+)/i, type: 'NOTE' as const, priority: 'low' as const },
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    for (const pattern of patterns) {
      const match = line.match(pattern.regex);

      if (match) {
        items.push({
          type: pattern.type,
          message: match[1].trim(),
          file: relative(workspaceRoot, filePath),
          line: i + 1,
          priority: pattern.priority,
        });
      }
    }
  }

  return items;
}

async function scanDirectory(dir: string, extensions: string[]): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name);

      if (entry.isDirectory()) {
        if (
          !entry.name.startsWith('.') &&
          entry.name !== 'node_modules' &&
          entry.name !== 'dist' &&
          entry.name !== 'build'
        ) {
          files.push(...(await scanDirectory(fullPath, extensions)));
        }
      } else if (entry.isFile()) {
        if (extensions.includes(extname(entry.name))) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Failed to scan directory ${dir}:`, error);
  }

  return files;
}

const todoTrackerPlugin: QualityPlugin<TodoMetricData> = {
  name: 'todo-tracker',
  version: '1.0.0',
  description: 'Tracks TODO, FIXME, HACK, and other technical debt comments',
  author: 'AFENDA-NEXUS Tools Team',
  enabled: true,

  hooks: {
    async onCollect(context: CollectContext): Promise<TodoMetricData> {
      console.log('🔍 [todo-tracker] Scanning for TODO comments...');

      const extensions = ['.ts', '.tsx', '.js', '.jsx', '.md'];
      const allItems: TodoItem[] = [];

      // Scan all packages
      for (const packagePath of context.packages) {
        const files = await scanDirectory(packagePath, extensions);

        for (const file of files) {
          try {
            const items = await extractTodos(file, context.workspaceRoot);
            allItems.push(...items);
          } catch (error) {
            console.warn(`⚠️  Failed to extract TODOs from ${file}:`, error);
          }
        }
      }

      const metrics: TodoMetrics = {
        todos: allItems.filter((i) => i.type === 'TODO').length,
        fixmes: allItems.filter((i) => i.type === 'FIXME').length,
        hacks: allItems.filter((i) => i.type === 'HACK').length,
        xxxs: allItems.filter((i) => i.type === 'XXX').length,
        notes: allItems.filter((i) => i.type === 'NOTE').length,
        totalDebt: allItems.length,
        items: allItems,
      };

      console.log(`✅ [todo-tracker] Found ${metrics.totalDebt} technical debt items`);
      console.log(`   - TODO: ${metrics.todos}`);
      console.log(`   - FIXME: ${metrics.fixmes}`);
      console.log(`   - HACK: ${metrics.hacks}`);
      console.log(`   - XXX: ${metrics.xxxs}`);
      console.log(`   - NOTE: ${metrics.notes}`);

      return metrics;
    },

    async onAnalyze(snapshot, data): Promise<Analysis> {
      const metrics = data;
      const issues: Issue[] = [];

      // Score based on technical debt density
      const totalDebt = metrics.totalDebt;
      const criticalDebt = metrics.xxxs + metrics.hacks;
      const score = Math.max(0, 100 - totalDebt - criticalDebt * 5);

      // Critical issues (XXX, HACK)
      if (metrics.xxxs > 0) {
        issues.push({
          severity: 'critical',
          message: `Found ${metrics.xxxs} XXX comment(s) indicating critical issues`,
        });
      }

      if (metrics.hacks > 0) {
        issues.push({
          severity: 'warning',
          message: `Found ${metrics.hacks} HACK comment(s) indicating temporary workarounds`,
        });
      }

      // Moderate issues (FIXME)
      if (metrics.fixmes > 0) {
        issues.push({
          severity: 'warning',
          message: `Found ${metrics.fixmes} FIXME comment(s) indicating bugs`,
        });
      }

      // Informational (TODO, NOTE)
      if (metrics.todos > 10) {
        issues.push({
          severity: 'info',
          message: `Found ${metrics.todos} TODO comment(s) - high task backlog`,
        });
      }

      // Top priority items
      const highPriority = metrics.items
        .filter((i) => i.priority === 'high')
        .sort((a, b) => a.file.localeCompare(b.file))
        .slice(0, 5);

      highPriority.forEach((item) => {
        issues.push({
          severity: 'warning',
          message: `${item.type}: ${item.message}`,
          file: item.file,
          line: item.line,
        });
      });

      const recommendations = [];

      if (criticalDebt > 0) {
        recommendations.push('Address critical XXX and HACK comments before next release');
      }

      if (metrics.fixmes > 5) {
        recommendations.push('Prioritize FIXME items in upcoming sprint');
      }

      if (metrics.todos > 20) {
        recommendations.push('Review TODO backlog and convert to tracked issues');
      }

      return { score, issues, recommendations };
    },

    async onReport(snapshot, analysis): Promise<import('../src/plugin-system.js').Report> {
      const criticalCount = analysis.issues.filter((i) => i.severity === 'critical').length;
      const warningCount = analysis.issues.filter((i) => i.severity === 'warning').length;

      return {
        title: 'Technical Debt Report',
        summary: `Found ${analysis.issues.length} technical debt items (${criticalCount} critical, ${warningCount} warnings) with a score of ${analysis.score}/100`,
        details: {
          score: analysis.score,
          issues: analysis.issues,
          recommendations: analysis.recommendations,
        },
      };
    },
  },

  config: {
    trackTypes: ['TODO', 'FIXME', 'HACK', 'XXX', 'NOTE'],
    excludePatterns: ['node_modules', 'dist', 'build', '.git'],
  },
};

export default todoTrackerPlugin;
export { todoTrackerPlugin as plugin };
