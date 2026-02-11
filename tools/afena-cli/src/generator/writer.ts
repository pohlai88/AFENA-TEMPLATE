import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { AUTOGEN_START, AUTOGEN_END } from './templates';

/**
 * Result of a write operation.
 */
export interface WriteResult {
  action: 'created' | 'updated' | 'skipped';
  error?: string;
}

/**
 * Count occurrences of a substring in a string.
 */
function countOccurrences(text: string, search: string): number {
  let count = 0;
  let pos = 0;
  while ((pos = text.indexOf(search, pos)) !== -1) {
    count++;
    pos += search.length;
  }
  return count;
}

/**
 * Write or update a README.md file with autogen block content.
 *
 * - New file: write full README with autogen block.
 * - Existing file with markers: replace only the first AUTOGEN block.
 * - Existing file without markers: prepend autogen block at top.
 * - Multiple marker blocks: fail (ambiguous).
 */
export function writeReadme(
  pkgDir: string,
  repoRoot: string,
  content: string
): WriteResult {
  const readmePath = join(repoRoot, pkgDir, 'README.md');
  const autogenBlock = `${AUTOGEN_START}\n${content}\n${AUTOGEN_END}`;

  if (!existsSync(readmePath)) {
    writeFileSync(readmePath, autogenBlock + '\n', 'utf-8');
    return { action: 'created' };
  }

  const existing = readFileSync(readmePath, 'utf-8');

  // Check for multiple autogen blocks (ambiguous — fail)
  const startCount = countOccurrences(existing, AUTOGEN_START);
  const endCount = countOccurrences(existing, AUTOGEN_END);

  if (startCount > 1 || endCount > 1) {
    return {
      action: 'skipped',
      error: `Multiple AUTOGEN blocks found in ${pkgDir}/README.md — ambiguous, skipping`,
    };
  }

  if (startCount === 1 && endCount === 1) {
    // Replace existing autogen block (strict, non-greedy)
    const startIdx = existing.indexOf(AUTOGEN_START);
    const endIdx = existing.indexOf(AUTOGEN_END);

    if (startIdx >= 0 && endIdx > startIdx) {
      const before = existing.substring(0, startIdx);
      const after = existing.substring(endIdx + AUTOGEN_END.length);
      const updated = before + autogenBlock + after;
      writeFileSync(readmePath, updated, 'utf-8');
      return { action: 'updated' };
    }
  }

  // No markers — prepend autogen block at top, preserve existing content
  const updated = autogenBlock + '\n\n' + existing;
  writeFileSync(readmePath, updated, 'utf-8');
  return { action: 'updated' };
}

/**
 * Validate a README for the check command.
 * Returns a list of failure reasons (empty = pass).
 */
export function validateReadme(
  pkgDir: string,
  repoRoot: string,
  expectedSignature: string,
  expectedName: string
): string[] {
  const failures: string[] = [];
  const readmePath = join(repoRoot, pkgDir, 'README.md');

  if (!existsSync(readmePath)) {
    failures.push('README.md does not exist');
    return failures;
  }

  const content = readFileSync(readmePath, 'utf-8');

  // Has exactly one autogen block
  const startCount = countOccurrences(content, AUTOGEN_START);
  const endCount = countOccurrences(content, AUTOGEN_END);

  if (startCount === 0 || endCount === 0) {
    failures.push('Missing AUTOGEN markers');
  } else if (startCount > 1 || endCount > 1) {
    failures.push('Multiple AUTOGEN blocks (ambiguous)');
  }

  // Signature matches
  const sigMatch = content.match(/<!-- Signature: (sha256:[a-f0-9]{64}) -->/);
  if (!sigMatch) {
    failures.push('No signature found in AUTOGEN block');
  } else if (sigMatch[1] !== expectedSignature) {
    failures.push('Signature mismatch — README is stale');
  }

  // Package name matches
  if (!content.includes(`# ${expectedName}`)) {
    failures.push(`Package name "${expectedName}" not found in README heading`);
  }

  // No absolute paths
  const absPathPatterns = [
    /[A-Z]:\\/,
    /\/Users\//,
    /\/home\//,
    /file:\/\/\//,
  ];
  for (const pattern of absPathPatterns) {
    if (pattern.test(content)) {
      failures.push(`Absolute path detected (${pattern.source})`);
      break;
    }
  }

  // Workspace install policy (only for non-app packages)
  if (!pkgDir.startsWith('apps/')) {
    if (content.includes('## Installation') && !content.includes('pnpm -w add')) {
      failures.push('Install section does not use workspace policy (pnpm -w add)');
    }
  }

  return failures;
}
