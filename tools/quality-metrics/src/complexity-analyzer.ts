/**
 * Complexity Analyzer
 *
 * Analyzes package complexity metrics:
 * - Cyclomatic complexity
 * - Cognitive complexity
 * - Lines of code
 * - Maintainability index
 *
 * @module complexity-analyzer
 * @since Sprint 6
 */

import { readFile, readdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

// --- Types ---

export interface ComplexityMetrics {
  package: string;
  cyclomaticComplexity: number;
  cognitiveComplexity: number;
  linesOfCode: number;
  maintainabilityIndex: number;
  files: FileComplexity[];
}

export interface FileComplexity {
  file: string;
  complexity: number;
  lines: number;
  functions: number;
}

// --- Helpers ---

function calculateCyclomaticComplexity(content: string): number {
  let complexity = 1; // Base complexity

  // Decision points
  const decisionPoints = [
    /\bif\b/g,
    /\belse\s+if\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bcase\b/g,
    /\bcatch\b/g,
    /\b&&\b/g,
    /\b\|\|\b/g,
    /\?\./g, // Optional chaining
  ];

  for (const pattern of decisionPoints) {
    const matches = content.match(pattern);
    complexity += matches?.length || 0;
  }

  return complexity;
}

function calculateCognitiveComplexity(content: string): number {
  let complexity = 0;
  let nestingLevel = 0;

  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Increase nesting
    if (/{$/.test(trimmed)) {
      nestingLevel++;
    }

    // Decrease nesting
    if (/^}/.test(trimmed)) {
      nestingLevel = Math.max(0, nestingLevel - 1);
    }

    // Add complexity for control structures (weighted by nesting)
    if (/\b(if|for|while|switch|catch)\b/.test(trimmed)) {
      complexity += nestingLevel + 1;
    }

    // Add complexity for logical operators
    const logicalOps = (trimmed.match(/&&|\|\|/g) || []).length;
    complexity += logicalOps;
  }

  return complexity;
}

function countLinesOfCode(content: string): number {
  const lines = content.split('\n');

  return lines.filter((line) => {
    const trimmed = line.trim();
    // Exclude empty lines and comments
    return (
      trimmed.length > 0 &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('/*') &&
      !trimmed.startsWith('*')
    );
  }).length;
}

function countFunctions(content: string): number {
  const patterns = [
    /\bfunction\s+\w+/g,
    /\bconst\s+\w+\s*=\s*(async\s+)?\(/g,
    /\blet\s+\w+\s*=\s*(async\s+)?\(/g,
    /\w+\s*=\s*\(.*\)\s*=>/g,
  ];

  let count = 0;

  for (const pattern of patterns) {
    const matches = content.match(pattern);
    count += matches?.length || 0;
  }

  return count;
}

function calculateMaintainabilityIndex(cyclomaticComplexity: number, linesOfCode: number): number {
  // Simplified maintainability index formula
  // MI = 171 - 5.2 * ln(V) - 0.23 * CC - 16.2 * ln(LOC)
  // Where V = Halstead Volume (approximated as LOC)

  const volume = Math.max(1, linesOfCode);
  const cc = Math.max(1, cyclomaticComplexity);
  const loc = Math.max(1, linesOfCode);

  const mi = 171 - 5.2 * Math.log(volume) - 0.23 * cc - 16.2 * Math.log(loc);

  // Normalize to 0-100 scale
  return Math.max(0, Math.min(100, mi));
}

async function analyzeFile(filePath: string): Promise<FileComplexity> {
  const content = await readFile(filePath, 'utf8');

  const complexity = calculateCyclomaticComplexity(content);
  const lines = countLinesOfCode(content);
  const functions = countFunctions(content);

  return {
    file: filePath,
    complexity,
    lines,
    functions,
  };
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
          entry.name !== 'build' &&
          entry.name !== 'coverage'
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

// --- Public API ---

export async function analyzePackageComplexity(
  packagePath: string,
  packageName: string,
): Promise<ComplexityMetrics> {
  console.log(`🔍 Analyzing complexity for package: ${packageName}`);

  const extensions = ['.ts', '.tsx', '.js', '.jsx'];
  const srcDir = resolve(packagePath, 'src');
  const files = await scanDirectory(srcDir, extensions);

  const fileComplexities: FileComplexity[] = [];
  let totalCyclomaticComplexity = 0;
  let totalCognitiveComplexity = 0;
  let totalLinesOfCode = 0;

  for (const file of files) {
    try {
      const fileMetrics = await analyzeFile(file);
      fileComplexities.push(fileMetrics);

      const content = await readFile(file, 'utf8');
      totalCyclomaticComplexity += calculateCyclomaticComplexity(content);
      totalCognitiveComplexity += calculateCognitiveComplexity(content);
      totalLinesOfCode += countLinesOfCode(content);
    } catch (error) {
      console.warn(`⚠️  Failed to analyze ${file}:`, error);
    }
  }

  const maintainabilityIndex = calculateMaintainabilityIndex(
    totalCyclomaticComplexity,
    totalLinesOfCode,
  );

  return {
    package: packageName,
    cyclomaticComplexity: totalCyclomaticComplexity,
    cognitiveComplexity: totalCognitiveComplexity,
    linesOfCode: totalLinesOfCode,
    maintainabilityIndex,
    files: fileComplexities,
  };
}

export async function analyzeAllPackages(packagesDir: string): Promise<ComplexityMetrics[]> {
  console.log('🔍 Analyzing complexity for all packages...');

  const packages: ComplexityMetrics[] = [];

  try {
    const entries = await readdir(packagesDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        const packagePath = resolve(packagesDir, entry.name);
        const metrics = await analyzePackageComplexity(packagePath, entry.name);
        packages.push(metrics);
      }
    }
  } catch (error) {
    console.error(`❌ Failed to analyze packages:`, error);
  }

  console.log(`✅ Analyzed ${packages.length} packages`);

  return packages;
}

export function getComplexityRecommendations(metrics: ComplexityMetrics): string[] {
  const recommendations: string[] = [];

  // High cyclomatic complexity
  if (metrics.cyclomaticComplexity > 100) {
    recommendations.push(
      `High cyclomatic complexity (${metrics.cyclomaticComplexity}) - consider breaking down complex logic`,
    );
  }

  // High cognitive complexity
  if (metrics.cognitiveComplexity > 50) {
    recommendations.push(
      `High cognitive complexity (${metrics.cognitiveComplexity}) - reduce nesting and simplify control flow`,
    );
  }

  // Low maintainability index
  if (metrics.maintainabilityIndex < 40) {
    recommendations.push(
      `Low maintainability index (${metrics.maintainabilityIndex.toFixed(1)}) - refactor to improve code quality`,
    );
  }

  // Large files
  const largeFiles = metrics.files.filter((f) => f.lines > 300);
  if (largeFiles.length > 0) {
    recommendations.push(
      `${largeFiles.length} file(s) exceed 300 lines - consider splitting into smaller modules`,
    );
  }

  // Complex files
  const complexFiles = metrics.files.filter((f) => f.complexity > 20);
  if (complexFiles.length > 0) {
    recommendations.push(
      `${complexFiles.length} file(s) have complexity >20 - simplify or refactor`,
    );
  }

  return recommendations;
}
