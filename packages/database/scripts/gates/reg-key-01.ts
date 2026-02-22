/**
 * REG-KEY-01: Registry Key Must Match SQL Table Name
 * 
 * Ensures TABLE_REGISTRY keys match SQL table names exactly (snake_case).
 * This prevents gates/discovery from breaking due to naming mismatches.
 * 
 * CRITICAL: Registry keys must match SQL table names for automated tooling.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const REGISTRY_PATH = join(process.cwd(), 'src/schema/_registry.ts');

interface ValidationResult {
  passed: boolean;
  violations: Array<{
    registryKey: string;
    issue: string;
  }>;
}

export function validateRegKeyGate(): ValidationResult {
  const content = readFileSync(REGISTRY_PATH, 'utf-8');
  const violations: Array<{ registryKey: string; issue: string }> = [];

  // Extract TABLE_REGISTRY entries
  const registryMatch = content.match(/export const TABLE_REGISTRY:\s*Record<string,\s*TableMetadata>\s*=\s*\{([\s\S]*?)\};/);
  if (!registryMatch) {
    return {
      passed: false,
      violations: [{ registryKey: 'TABLE_REGISTRY', issue: 'TABLE_REGISTRY not found in _registry.ts' }],
    };
  }

  const registryContent = registryMatch[1];

  // Find all registry keys (lines starting with quotes)
  const keyMatches = registryContent.matchAll(/['"]([^'"]+)['"]\s*:\s*\{/g);

  for (const match of keyMatches) {
    const key = match[1];

    // Check if key uses kebab-case (incorrect)
    if (key.includes('-')) {
      violations.push({
        registryKey: key,
        issue: `Uses kebab-case instead of snake_case (should be '${key.replace(/-/g, '_')}')`,
      });
    }

    // Check if key uses camelCase (incorrect)
    if (/[a-z][A-Z]/.test(key)) {
      violations.push({
        registryKey: key,
        issue: `Uses camelCase instead of snake_case`,
      });
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

export function getGateInfo() {
  return {
    id: 'REG-KEY-01',
    name: 'Registry Key Must Match SQL Table Name',
    description: 'Ensures TABLE_REGISTRY keys use snake_case matching SQL table names',
    severity: 'medium',
    rationale: 'Prevents gates/discovery from breaking due to naming mismatches',
  };
}
