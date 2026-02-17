#!/usr/bin/env node
/**
 * Automated Changelog Generator
 *
 * Generates changelog from git commits using conventional commit format:
 * - feat: New features → Features section
 * - fix: Bug fixes → Bug Fixes section
 * - docs: Documentation → Documentation section
 * - perf: Performance → Performance section
 * - refactor: Refactoring → Refactoring section
 * - test: Tests → Tests section
 * - chore: Chores → Chores section
 *
 * Usage:
 *   pnpm tsx tools/scripts/generate-changelog.ts [version] [since]
 *   pnpm tsx tools/scripts/generate-changelog.ts 2.1.0 v2.0.0
 *   pnpm tsx tools/scripts/generate-changelog.ts Unreleased main
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

interface Commit {
  sha: string;
  message: string;
  author: string;
  date: string;
  breaking: boolean;
}

interface ChangelogSection {
  title: string;
  commits: Commit[];
}

const CONVENTIONAL_COMMIT_TYPES: Record<string, string> = {
  feat: '### ✨ Features',
  fix: '### 🐛 Bug Fixes',
  docs: '### 📚 Documentation',
  perf: '### ⚡ Performance',
  refactor: '### ♻️ Refactoring',
  test: '### ✅ Tests',
  chore: '### 🔧 Chores',
  style: '### 💄 Styles',
  ci: '### 👷 CI/CD',
  build: '### 📦 Build',
  revert: '### ⏪ Reverts',
};

/**
 * Get commits since a specific ref (tag, branch, commit)
 */
function getCommitsSince(since: string): Commit[] {
  try {
    const output = execSync(`git log ${since}..HEAD --format="%H|%s|%an|%ad|%b" --date=short`, {
      encoding: 'utf-8',
    }).toString();

    if (!output.trim()) {
      console.log(`ℹ️  No commits found since ${since}`);
      return [];
    }

    const commits: Commit[] = [];
    const commitBlocks = output.split('\n\n').filter(Boolean);

    commitBlocks.forEach((block) => {
      const lines = block.split('\n');
      const [sha, message, author, date] = lines[0].split('|');
      const body = lines.slice(1).join('\n');

      commits.push({
        sha,
        message,
        author,
        date,
        breaking: body.includes('BREAKING CHANGE') || message.includes('!:'),
      });
    });

    return commits;
  } catch (error) {
    console.error(`❌ Failed to get commits since ${since}:`, (error as Error).message);
    console.error('   Make sure the ref exists and you have git history.');
    process.exit(1);
  }
}

/**
 * Categorize commit based on conventional commit format
 */
function categorizeCommit(message: string): string {
  // Remove scope if present: "feat(api): ..." → "feat"
  const match = message.match(/^([a-z]+)(?:\([^)]+\))?(!)?:/);

  if (match) {
    const type = match[1];
    return CONVENTIONAL_COMMIT_TYPES[type] || '### 📝 Other';
  }

  return '### 📝 Other';
}

/**
 * Extract scope from commit message if present
 */
function extractScope(message: string): string | null {
  const match = message.match(/^[a-z]+\(([^)]+)\):/);
  return match ? match[1] : null;
}

/**
 * Clean commit message by removing type prefix
 */
function cleanMessage(message: string): string {
  return message
    .replace(/^([a-z]+)(?:\([^)]+\))?(!)?:\s*/, '') // Remove type prefix
    .replace(/\s*\(#\d+\)$/, '') // Remove PR numbers
    .trim();
}

/**
 * Generate markdown changelog
 */
function generateChangelog(version: string, since: string): string {
  console.log(`📝 Generating changelog for ${version} (since ${since})...\n`);

  const commits = getCommitsSince(since);

  if (commits.length === 0) {
    console.log('ℹ️  No commits to include in changelog.');
    return '';
  }

  console.log(`Found ${commits.length} commits\n`);

  // Group commits by category
  const categorized: Record<string, Commit[]> = {};
  const breaking: Commit[] = [];

  commits.forEach((commit) => {
    if (commit.breaking) {
      breaking.push(commit);
    }

    const category = categorizeCommit(commit.message);
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(commit);
  });

  // Build changelog
  const date = new Date().toISOString().split('T')[0];
  let changelog = `## [${version}] - ${date}\n\n`;

  // Breaking changes first (if any)
  if (breaking.length > 0) {
    changelog += `### ⚠️ BREAKING CHANGES\n\n`;
    breaking.forEach((commit) => {
      const cleanMsg = cleanMessage(commit.message);
      const scope = extractScope(commit.message);
      const scopeText = scope ? `**${scope}**: ` : '';
      changelog += `- ${scopeText}${cleanMsg} ([${commit.sha.slice(0, 7)}](../../commit/${commit.sha}))\n`;
    });
    changelog += '\n';
  }

  // Other sections in order
  const sectionOrder = [
    '### ✨ Features',
    '### 🐛 Bug Fixes',
    '### ⚡ Performance',
    '### ♻️ Refactoring',
    '### 📚 Documentation',
    '### ✅ Tests',
    '### 📦 Build',
    '### 👷 CI/CD',
    '### 💄 Styles',
    '### 🔧 Chores',
    '### ⏪ Reverts',
    '### 📝 Other',
  ];

  sectionOrder.forEach((section) => {
    const sectionCommits = categorized[section];
    if (!sectionCommits || sectionCommits.length === 0) return;

    changelog += `${section}\n\n`;

    sectionCommits.forEach((commit) => {
      const cleanMsg = cleanMessage(commit.message);
      const scope = extractScope(commit.message);
      const scopeText = scope ? `**${scope}**: ` : '';
      const breakingMarker = commit.breaking ? ' ⚠️' : '';

      changelog += `- ${scopeText}${cleanMsg}${breakingMarker} ([${commit.sha.slice(0, 7)}](../../commit/${commit.sha}))\n`;
    });

    changelog += '\n';
  });

  // Contributors
  const contributors = [...new Set(commits.map((c) => c.author))].sort();
  if (contributors.length > 0) {
    changelog += `### 👥 Contributors\n\n`;
    changelog += `This release includes contributions from:\n\n`;
    contributors.forEach((name) => {
      changelog += `- ${name}\n`;
    });
    changelog += '\n';
  }

  return changelog;
}

/**
 * Update CHANGELOG.md or create new file
 */
function updateChangelogFile(newEntry: string, workspaceRoot: string) {
  const changelogPath = path.join(workspaceRoot, 'CHANGELOG.md');

  if (!fs.existsSync(changelogPath)) {
    console.log('📄 Creating new CHANGELOG.md...');
    const header = `# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
    fs.writeFileSync(changelogPath, header + newEntry);
  } else {
    console.log('📝 Updating existing CHANGELOG.md...');
    const existing = fs.readFileSync(changelogPath, 'utf-8');

    // Find where to insert (after header, before first version)
    const unreleasedPattern = /## \[Unreleased\][\s\S]*?(?=## \[|$)/;
    const firstVersionPattern = /(?<=\n)(## \[)/;

    let updated: string;
    if (unreleasedPattern.test(existing)) {
      // Replace Unreleased section
      updated = existing.replace(unreleasedPattern, newEntry);
    } else if (firstVersionPattern.test(existing)) {
      // Insert before first version
      updated = existing.replace(firstVersionPattern, newEntry + '$1');
    } else {
      // Append to end
      updated = existing + '\n' + newEntry;
    }

    fs.writeFileSync(changelogPath, updated);
  }

  console.log(`✅ Changelog updated: ${changelogPath}\n`);
}

/**
 * Main execution
 */
function main() {
  console.log('📋 Automated Changelog Generator\n');

  const args = process.argv.slice(2);
  const version = args[0] || 'Unreleased';
  const since = args[1] || 'HEAD~10'; // Last 10 commits by default

  console.log(`Configuration:`);
  console.log(`  Version: ${version}`);
  console.log(`  Since: ${since}\n`);

  const changelog = generateChangelog(version, since);

  if (!changelog) {
    console.log('ℹ️  No changelog generated (no commits found).');
    return;
  }

  // Output to console
  console.log('Generated Changelog:');
  console.log('═══════════════════════════════════════════════════════');
  console.log(changelog);
  console.log('═══════════════════════════════════════════════════════\n');

  // Save to file
  const workspaceRoot = path.resolve(process.cwd(), '../..');
  const outputPath = path.join(workspaceRoot, 'CHANGELOG-GENERATED.md');
  fs.writeFileSync(outputPath, changelog);
  console.log(`💾 Saved to: ${outputPath}\n`);

  // Ask user if they want to update CHANGELOG.md
  const updateMain = process.env.UPDATE_CHANGELOG === 'true' || args.includes('--update');

  if (updateMain) {
    updateChangelogFile(changelog, workspaceRoot);
  } else {
    console.log('ℹ️  To automatically update CHANGELOG.md, run with --update flag:');
    console.log(`   pnpm tsx tools/scripts/generate-changelog.ts ${version} ${since} --update\n`);
  }

  console.log('✅ Changelog generation complete!\n');
}

// Execute
try {
  main();
} catch (error) {
  console.error('❌ Changelog generation failed:', error);
  process.exit(1);
}
