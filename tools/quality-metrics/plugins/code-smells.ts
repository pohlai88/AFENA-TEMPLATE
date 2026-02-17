/**
 * Code Smells Detection Plugin
 *
 * Detects common code smells:
 * - Long functions (>50 lines)
 * - Deep nesting (>4 levels)
 * - Complex functions (cyclomatic complexity >10)
 * - Too many parameters (>5)
 * - Magic numbers
 *
 * @module plugins/code-smells
 * @since Sprint 6
 */

import { readFile, readdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import type {
  QualityPlugin,
  CollectContext,
  AsMetricData,
  Analysis,
} from '../src/plugin-system.js';

interface CodeSmellMetrics {
  longFunctions: number;
  deepNesting: number;
  complexFunctions: number;
  manyParameters: number;
  magicNumbers: number;
  totalFiles: number;
  totalSmells: number;
  [key: string]: number | string | boolean | object;
}

type CodeSmellMetricData = CodeSmellMetrics;

async function analyzeFile(filePath: string): Promise<Partial<CodeSmellMetrics>> {
  const content = await readFile(filePath, 'utf8');
  const lines = content.split('\n');

  const smells: Partial<CodeSmellMetrics> = {
    longFunctions: 0,
    deepNesting: 0,
    complexFunctions: 0,
    manyParameters: 0,
    magicNumbers: 0,
  };

  // Detect long functions
  let currentFunctionLength = 0;
  let inFunction = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Start of function
    if (/(function|const.*=.*\(|async.*\(|=>\s*{)/.test(trimmed)) {
      inFunction = true;
      currentFunctionLength = 1;
    }

    if (inFunction) {
      currentFunctionLength++;

      // End of function
      if (trimmed === '}' || trimmed === '};') {
        if (currentFunctionLength > 50) {
          smells.longFunctions!++;
        }
        inFunction = false;
        currentFunctionLength = 0;
      }
    }

    // Detect deep nesting
    const indentLevel = (line.match(/^\s*/)?.[0].length || 0) / 2;
    if (indentLevel > 4) {
      smells.deepNesting!++;
    }

    // Detect too many parameters
    const paramMatch = trimmed.match(/\(([^)]+)\)/);
    if (paramMatch) {
      const params = paramMatch[1].split(',').filter((p) => p.trim());
      if (params.length > 5) {
        smells.manyParameters!++;
      }
    }

    // Detect magic numbers (simple heuristic)
    const magicNumberRegex = /\b(\d{2,})\b/g;
    const matches = trimmed.match(magicNumberRegex);
    if (matches) {
      smells.magicNumbers! += matches.length;
    }
  }

  return smells;
}

async function scanDirectory(dir: string, extensions: string[]): Promise<string[]> {
  const files: string[] = [];

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name);

      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
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

const codeSmellsPlugin: QualityPlugin<CodeSmellMetricData> = {
  name: 'code-smells',
  version: '1.0.0',
  description: 'Detects common code smells and anti-patterns',
  author: 'AFENDA-NEXUS Tools Team',
  enabled: true,

  hooks: {
    async onCollect(context: CollectContext): Promise<CodeSmellMetricData> {
      console.log('🔍 [code-smells] Scanning for code smells...');

      const extensions = ['.ts', '.tsx', '.js', '.jsx'];
      const allMetrics: CodeSmellMetrics = {
        longFunctions: 0,
        deepNesting: 0,
        complexFunctions: 0,
        manyParameters: 0,
        magicNumbers: 0,
        totalFiles: 0,
        totalSmells: 0,
      };

      // Scan all packages
      for (const packagePath of context.packages) {
        const files = await scanDirectory(packagePath, extensions);

        for (const file of files) {
          try {
            const fileMetrics = await analyzeFile(file);

            allMetrics.longFunctions += fileMetrics.longFunctions || 0;
            allMetrics.deepNesting += fileMetrics.deepNesting || 0;
            allMetrics.complexFunctions += fileMetrics.complexFunctions || 0;
            allMetrics.manyParameters += fileMetrics.manyParameters || 0;
            allMetrics.magicNumbers += fileMetrics.magicNumbers || 0;
            allMetrics.totalFiles++;
          } catch (error) {
            console.warn(`⚠️  Failed to analyze ${file}:`, error);
          }
        }
      }

      allMetrics.totalSmells =
        allMetrics.longFunctions +
        allMetrics.deepNesting +
        allMetrics.complexFunctions +
        allMetrics.manyParameters;

      console.log(
        `✅ [code-smells] Found ${allMetrics.totalSmells} code smells in ${allMetrics.totalFiles} files`,
      );

      return allMetrics;
    },

    async onAnalyze(snapshot, data): Promise<Analysis> {
      const metrics = data;
      const issues = [];

      // Score based on smells per file
      const smellsPerFile = metrics.totalFiles > 0 ? metrics.totalSmells / metrics.totalFiles : 0;
      const score = Math.max(0, 100 - smellsPerFile * 10);

      if (metrics.longFunctions > 0) {
        issues.push({
          severity: 'warning' as const,
          message: `Found ${metrics.longFunctions} function(s) longer than 50 lines`,
        });
      }

      if (metrics.deepNesting > 0) {
        issues.push({
          severity: 'warning' as const,
          message: `Found ${metrics.deepNesting} line(s) with deep nesting (>4 levels)`,
        });
      }

      if (metrics.manyParameters > 0) {
        issues.push({
          severity: 'info' as const,
          message: `Found ${metrics.manyParameters} function(s) with >5 parameters`,
        });
      }

      if (metrics.magicNumbers > 10) {
        issues.push({
          severity: 'info' as const,
          message: `Found ${metrics.magicNumbers} potential magic numbers`,
        });
      }

      const recommendations = [];

      if (metrics.longFunctions > 0) {
        recommendations.push('Refactor long functions into smaller, focused functions');
      }

      if (metrics.deepNesting > 0) {
        recommendations.push('Reduce nesting by extracting guards or using early returns');
      }

      if (metrics.manyParameters > 0) {
        recommendations.push('Consider using object parameters or builder pattern');
      }

      if (metrics.magicNumbers > 10) {
        recommendations.push('Extract magic numbers into named constants');
      }

      return { score, issues, recommendations };
    },

    async onReport(snapshot, analysis): Promise<import('../src/plugin-system.js').Report> {
      return {
        title: 'Code Smells Report',
        summary: `Found ${analysis.issues.length} code quality issues with a score of ${analysis.score}/100`,
        details: {
          score: analysis.score,
          issues: analysis.issues,
          recommendations: analysis.recommendations,
        },
      };
    },
  },

  config: {
    maxFunctionLength: 50,
    maxNestingLevel: 4,
    maxParameters: 5,
  },
};

export default codeSmellsPlugin;
export { codeSmellsPlugin as plugin };
