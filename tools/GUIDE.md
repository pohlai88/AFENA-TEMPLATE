# 🏗️ Tools Development Guide

<div align="center">

![Enterprise](https://img.shields.io/badge/grade-enterprise-success?style=flat-square)
![TypeScript](https://img.shields.io/badge/language-TypeScript-blue?style=flat-square)
![Commander.js](https://img.shields.io/badge/cli-Commander.js-green?style=flat-square)
![Auto-Generated](https://img.shields.io/badge/docs-auto--generated-green?style=flat-square)

**Comprehensive development guide for AFENDA-NEXUS tools**

</div>

---

## 📋 Table of Contents

- Architecture Principles
- Report System
- Adding New Commands
- Code Organization Patterns
- Testing Strategy
- Best Practices
- Troubleshooting
- Advanced Topics
- Reference

---

## 🏛️ Architecture Principles

### Design Philosophy

The tools directory is built on these core principles:

#### 1. **Flat, Feature-Based Structure**

✅ **Max 2 levels deep** - Easy navigation and discovery\
✅ **Feature modules** - Group by what it does, not type\
✅ **Clear purpose** - Each folder has one responsibility\
✅ **No unnecessary nesting** - Avoid `utils/helpers/common/` anti-patterns

**Example Structure**:

```
src/
├── core/           # Shared utilities (exec, logger, paths)
├── readme/         # README generation feature
├── capability/     # Capability system feature
├── checks/         # Invariant checks feature
└── bundle/         # Bundle orchestration feature
```

❌ **Anti-Pattern (Deep Nesting)**:

```
src/
└── features/
    └── readme/
        └── utils/
            └── helpers/
                └── common/
                    └── string-utils.ts  # TOO DEEP!
```

#### 2. **Constants-Based Configuration**

**Single Source of Truth**: All report structures defined in
`core/report-config.ts`

**Benefits**:

- ✅ Consistency across CLI and Markdown output
- ✅ Easy to add new commands
- ✅ Automatic validation and type safety
- ✅ No manual report construction

#### 3. **Self-Contained Execution**

✅ **Zero external dependencies** - No API calls, no external services\
✅ **Local file-based storage** - All data in `.afenda/` or `.quality-metrics/`\
✅ **Portable reports** - Markdown/JSON/HTML work anywhere\
✅ **Fast execution** - Optimized for monorepo scale (38 packages, 83K+ LOC)

#### 4. **Auto-Generated Documentation**

✅ **Generated from code** - Documentation reflects reality\
✅ **Consistent format** - Same structure across all files\
✅ **Always current** - Updated via `pnpm afenda tools-docs`\
✅ **No manual maintenance** - Code is the source of truth

---

## 📊 Report System

### Overview

The report system provides **consistent, professional output** for all CLI
commands using a declarative configuration approach.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│ report-config.ts (Single Source of Truth)               │
│ - Command definitions                                   │
│ - Task structures                                       │
│ - Display formatting rules                             │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ ReportBuilder (Presentation Layer)                      │
│ - Ingests config + runtime data                        │
│ - Generates consistent CLI output                      │
│ - Optionally generates Markdown reports                │
└───────────────┬─────────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────────┐
│ Output Formats                                          │
│ - CLI: Colored console output with status indicators   │
│ - Markdown: Timestamped reports with tables/sections   │
│ - JSON: Machine-readable structured data               │
└─────────────────────────────────────────────────────────┘
```

### Report Configuration

#### Defining a Report

All reports are defined in `core/report-config.ts`:

```typescript
export const REPORT_CONFIGS = {
  bundle: {
    command: 'bundle',
    displayName: 'Bundle',
    description: 'Run all maintenance tasks',
    tasks: [
      {
        key: 'readme',
        title: 'README Generation',
        icon: '📝',
        description: 'Generate package READMEs',
      },
      {
        key: 'meta',
        title: 'Metadata Checks',
        icon: '🔍',
        description: 'Validate metadata quality',
      },
      {
        key: 'housekeeping',
        title: 'Housekeeping',
        icon: '🧹',
        description: 'Run invariant checks',
      },
    ],
  },
  // ... other commands
};
```

#### Configuration Properties

| Property      | Type   | Purpose                      | Example           |
| ------------- | ------ | ---------------------------- | ----------------- |
| `command`     | string | CLI command name             | `'bundle'`        |
| `displayName` | string | Human-readable name          | `'Bundle'`        |
| `description` | string | Command purpose              | `'Run all tasks'` |
| `tasks`       | Task[] | Sub-tasks in execution order | See below         |

#### Task Configuration

```typescript
interface Task {
  key: string; // Unique identifier
  title: string; // Display name
  icon: string; // Emoji/unicode icon
  description: string; // What this task does
}
```

### Using ReportBuilder

#### Basic Usage

```typescript
import { ReportBuilder } from '../core/report-builder';

export async function runMyCommand(options: { dryRun?: boolean }) {
  // 1. Create builder (references config in report-config.ts)
  const reportBuilder = new ReportBuilder('mycommand', {
    dryRun: options.dryRun,
  });

  try {
    // 2. Execute task
    const result = await doSomething();

    // 3. Report results
    reportBuilder.addTask('task1', {
      success: true,
      message: `Processed ${result.count} items`,
      count: result.count,
    });
  } catch (error) {
    // 4. Report failures
    reportBuilder.addTask('task1', {
      success: false,
      message: `Failed: ${error.message}`,
      error: error as Error,
    });
  }

  // 5. Generate output (CLI + optional Markdown)
  reportBuilder.generate();
}
```

#### Adding Task Results

```typescript
// Success with count
reportBuilder.addTask('readme', {
  success: true,
  message: 'Generated 38 READMEs',
  count: 38,
});

// Success with details
reportBuilder.addTask('meta', {
  success: true,
  message: 'All metadata valid',
  details: ['VIS-00: ✓', 'VIS-01: ✓', 'VIS-02: ✓'],
});

// Failure with error
reportBuilder.addTask('housekeeping', {
  success: false,
  message: 'Some checks failed',
  error: new Error('E1 failed'),
  details: ['E1: ✗ Missing exports', 'E2: ✓', 'E3: ✓'],
});

// Skipped task
reportBuilder.addTask('optional', {
  success: true,
  message: 'Skipped (dry-run)',
  skipped: true,
});
```

#### Output Formats

**CLI Output** (automatic):

```
┌────────────────────────────────────────────┐
│ 🔧 Bundle                                  │
├────────────────────────────────────────────┤
│ ✅ 📝 README Generation                    │
│    Generated 38 READMEs                    │
│ ✅ 🔍 Metadata Checks                      │
│    All metadata valid                      │
│ ⚠️  🧹 Housekeeping                        │
│    Some checks failed                      │
│    - E1: ✗ Missing exports                 │
│    - E2: ✓                                 │
└────────────────────────────────────────────┘
```

**Markdown Output** (if enabled):

```markdown
# Bundle Report

**Generated**: 2026-02-17 14:30:00 **Status**: Partial Success (2/3 tasks)

## Tasks

### ✅ 📝 README Generation

Generated 38 READMEs

### ✅ 🔍 Metadata Checks

All metadata valid

### ⚠️ 🧹 Housekeeping

Some checks failed

- E1: ✗ Missing exports
- E2: ✓
```

---

## 🚀 Adding New Commands

### Step-by-Step Guide

#### Step 1: Define Report Configuration

Update `src/core/report-config.ts`:

```typescript
export const REPORT_CONFIGS = {
  // ... existing configs ...

  'my-feature': {
    command: 'my-feature',
    displayName: 'My Feature',
    description: 'Does something useful for the monorepo',
    tasks: [
      {
        key: 'scan',
        title: 'Scan Packages',
        icon: '🔍',
        description: 'Scan all packages for issues',
      },
      {
        key: 'process',
        title: 'Process Results',
        icon: '⚙️',
        description: 'Process scanning results',
      },
      {
        key: 'report',
        title: 'Generate Report',
        icon: '📝',
        description: 'Generate final report',
      },
    ],
  },
};
```

#### Step 2: Create Feature Module

Create `src/features/my-feature/`:

```
src/features/my-feature/
├── index.ts           # Public API
├── command.ts         # Command implementation
├── scanner.ts         # Scanning logic
├── processor.ts       # Processing logic
└── types.ts           # Type definitions
```

**File: `command.ts`**:

```typescript
import { ReportBuilder } from '../../core/report-builder';
import { scanPackages } from './scanner';
import { processResults } from './processor';

export interface MyFeatureOptions {
  dryRun?: boolean;
  verbose?: boolean;
}

export async function runMyFeature(options: MyFeatureOptions = {}) {
  const reportBuilder = new ReportBuilder('my-feature', {
    dryRun: options.dryRun,
  });

  try {
    // Task 1: Scan
    const scanResults = await scanPackages();
    reportBuilder.addTask('scan', {
      success: true,
      message: `Scanned ${scanResults.length} packages`,
      count: scanResults.length,
    });

    // Task 2: Process
    const processed = await processResults(scanResults);
    reportBuilder.addTask('process', {
      success: processed.success,
      message: processed.message,
      details: processed.details,
    });

    // Task 3: Report
    if (!options.dryRun) {
      await generateReport(processed);
      reportBuilder.addTask('report', {
        success: true,
        message: 'Report generated at .afenda/my-feature-report.md',
      });
    } else {
      reportBuilder.addTask('report', {
        success: true,
        message: 'Skipped (dry-run)',
        skipped: true,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    reportBuilder.addTask('scan', {
      success: false,
      message: `Failed: ${(error as Error).message}`,
      error: error as Error,
    });
  }

  reportBuilder.generate();
}
```

**File: `index.ts`**:

```typescript
export { runMyFeature } from './command';
export type { MyFeatureOptions } from './command';
```

#### Step 3: Register CLI Command

Update `src/cli.ts` (or `bin/afenda.ts`):

```typescript
import { Command } from 'commander';

const program = new Command();

// ... existing commands ...

program
  .command('my-feature')
  .description('Does something useful for the monorepo')
  .option('--dry-run', 'Preview changes without writing')
  .option('--verbose', 'Show detailed output')
  .action(async (opts) => {
    const { runMyFeature } = await import('./features/my-feature');
    await runMyFeature({
      dryRun: opts.dryRun,
      verbose: opts.verbose,
    });
  });

program.parse();
```

#### Step 4: Test Your Command

```bash
# Test dry-run
pnpm afenda my-feature --dry-run

# Test actual execution
pnpm afenda my-feature

# Test with verbose output
pnpm afenda my-feature --verbose
```

#### Step 5: Add Tests

Create `src/features/my-feature/__tests__/command.test.ts`:

```typescript
import { describe, expect, it, vi } from 'vitest';
import { runMyFeature } from '../command';

describe('my-feature command', () => {
  it('should scan packages successfully', async () => {
    const consoleSpy = vi.spyOn(console, 'log');

    await runMyFeature({ dryRun: true });

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Scan Packages'));
  });

  it('should handle errors gracefully', async () => {
    // Test error handling
  });
});
```

#### Step 6: Update Documentation

```bash
# Regenerate tool documentation
pnpm afenda tools-docs
```

---

## 🗂️ Code Organization Patterns

### Directory Structure Best Practices

#### ✅ Good: Feature-Based

```
src/features/
├── readme/
│   ├── index.ts
│   ├── command.ts
│   ├── analyzer.ts
│   ├── renderer.ts
│   └── templates.ts
│
├── capability/
│   ├── index.ts
│   ├── command.ts
│   ├── collectors/
│   │   ├── index.ts
│   │   └── package-collector.ts
│   └── emitters/
│       ├── index.ts
│       └── ledger-emitter.ts
│
└── housekeeping/
    ├── index.ts
    ├── command.ts
    └── checks/
        ├── E1-exports.ts
        ├── E2-imports.ts
        └── H00-deps.ts
```

**Rationale**:

- ✅ Clear feature boundaries
- ✅ Easy to locate functionality
- ✅ Self-contained modules
- ✅ Minimal cross-dependencies

#### ❌ Bad: Type-Based

```
src/
├── commands/        # All commands mixed together
├── utils/           # Generic dumping ground
├── helpers/         # More generic dumping ground
├── services/        # Unclear responsibility
└── lib/             # Even more unclear
```

**Problems**:

- ❌ Feature code scattered across folders
- ❌ Unclear ownership
- ❌ High coupling
- ❌ Difficult to maintain

### Naming Conventions

| Type         | Convention         | Examples                             |
| ------------ | ------------------ | ------------------------------------ |
| **Commands** | `run{Feature}`     | `runBundle`, `runReadmeGen`          |
| **Options**  | `{Feature}Options` | `BundleOptions`, `ReadmeGenOptions`  |
| **Results**  | `{Feature}Result`  | `ScanResult`, `ProcessResult`        |
| **Errors**   | `{Feature}Error`   | `ValidationError`, `ScanError`       |
| **Files**    | kebab-case         | `report-builder.ts`, `path-utils.ts` |
| **Folders**  | kebab-case         | `my-feature/`, `core-utils/`         |

### Import Organization

```typescript
// 1. Node.js built-ins
import fs from 'node:fs/promises';
import path from 'node:path';

// 2. External dependencies
import { Command } from 'commander';
import chalk from 'chalk';

// 3. Internal core utilities
import { logger } from '../../core/logger';
import { exec } from '../../core/exec';

// 4. Internal feature imports
import { scanPackages } from './scanner';
import { processResults } from './processor';

// 5. Types
import type { MyFeatureOptions } from './types';
```

---

## 🧪 Testing Strategy

### Unit Tests

**Location**: `src/**/__tests__/*.test.ts`

**Framework**: Vitest

**Example**:

```typescript
import { describe, expect, it } from 'vitest';
import { processResults } from '../processor';

describe('processResults', () => {
  it('should process valid results', () => {
    const input = [{ name: 'pkg1', valid: true }];
    const result = processResults(input);

    expect(result.success).toBe(true);
    expect(result.processed).toBe(1);
  });

  it('should handle invalid results', () => {
    const input = [{ name: 'pkg1', valid: false }];
    const result = processResults(input);

    expect(result.success).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});
```

### Integration Tests

**Location**: `tools/afenda-cli/__tests__/integration/*.test.ts`

**Purpose**: Test full command execution

**Example**:

```typescript
import { describe, expect, it } from 'vitest';
import { exec } from '../src/core/exec';

describe('bundle command integration', () => {
  it('should run all tasks in dry-run mode', async () => {
    const result = await exec('pnpm afenda bundle --dry-run');

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('README Generation');
    expect(result.stdout).toContain('Metadata Checks');
    expect(result.stdout).toContain('Housekeeping');
  });
});
```

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/features/my-feature/__tests__/command.test.ts
```

---

## ✅ Best Practices

### 1. Code Organization

✅ **One feature per directory**

```
src/features/my-feature/  # All related code together
```

❌ **Don't mix concerns**

```
src/utils/my-feature-and-other-stuff/  # Too broad
```

---

✅ **Flat structure (max 2 levels)**

```
src/features/my-feature/
├── collectors/
│   └── scanner.ts
```

❌ **Avoid deep nesting**

```
src/features/my-feature/utils/helpers/common/scanner.ts  # Too deep
```

---

✅ **Clear naming (purpose, not type)**

```
src/features/readme-generator/
```

❌ **Generic naming**

```
src/features/generator/  # Generator of what?
```

### 2. Report Generation

✅ **Use constants configuration**

```typescript
// In report-config.ts
export const REPORT_CONFIGS = { mycommand: { ... } };

// In command.ts
const reportBuilder = new ReportBuilder('mycommand', options);
```

❌ **Don't construct reports manually**

```typescript
// Don't do this
console.log('┌────────────────┐');
console.log('│ My Report      │');
// ... manual formatting
```

---

✅ **Use ReportBuilder for consistency**

```typescript
reportBuilder.addTask('task1', {
  success: true,
  message: 'Completed successfully',
});
```

❌ **Don't print ad-hoc messages**

```typescript
console.log('✅ Task completed'); // Inconsistent formatting
```

### 3. Error Handling

✅ **Graceful degradation**

```typescript
try {
  const result = await doSomething();
  reportBuilder.addTask('task', {
    success: true,
    message: result.message,
  });
} catch (error) {
  reportBuilder.addTask('task', {
    success: false,
    message: `Failed: ${(error as Error).message}`,
    error: error as Error,
  });
}
```

❌ **Don't crash on errors**

```typescript
const result = await doSomething(); // Throws unhandled error
```

### 4. Documentation

✅ **Auto-generate from code**

```bash
pnpm afenda tools-docs  # Regenerates all documentation
```

❌ **Don't edit auto-generated files manually**

```markdown
<!-- Manual edit to README.md - will be overwritten! -->
```

---

✅ **Update constants, then regenerate**

```typescript
// 1. Update report-config.ts
// 2. Run: pnpm afenda tools-docs
```

❌ **Don't document in multiple places**

```typescript
// Don't duplicate docs in code comments AND markdown
```

### 5. Performance

✅ **Cache expensive operations**

```typescript
const packages = await discoverPackages(); // Called once
for (const pkg of packages) {
  await processPackage(pkg);
}
```

❌ **Don't repeat expensive operations**

```typescript
for (const pkg of await discoverPackages()) {
  // Called N times
  await processPackage(pkg);
}
```

---

✅ **Use parallel processing when possible**

```typescript
await Promise.all(packages.map((pkg) => processPackage(pkg)));
```

❌ **Don't process sequentially unnecessarily**

```typescript
for (const pkg of packages) {
  await processPackage(pkg); // Slow for independent tasks
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### Issue: `afenda` command not found

**Symptoms**:

```bash
$ pnpm afenda
Command 'afenda' not found
```

**Solution**:

```bash
# Reinstall dependencies to link CLI
pnpm install

# Verify installation
pnpm afenda --version
```

---

#### Issue: Generated files are empty

**Symptoms**:

```bash
$ pnpm afenda meta gen
✅ Generated capability.ledger.json (0 KB)
```

**Diagnosis**:

```bash
# Check for errors in console output
pnpm afenda meta gen --verbose

# Verify package.json metadata exists
cat packages/my-package/package.json | grep "afenda"
```

**Solution**:

- Ensure `package.json` files have required metadata
- Check file permissions for write access
- Verify workspace structure matches expectations

---

#### Issue: Tests failing after adding command

**Symptoms**:

```bash
$ pnpm test
FAIL src/features/my-feature/__tests__/command.test.ts
```

**Diagnosis**:

```bash
# Run specific test with verbose output
pnpm test src/features/my-feature/__tests__/command.test.ts --verbose
```

**Solution**:

- Check that report configuration exists in `report-config.ts`
- Verify imports are correct
- Ensure mocks are properly set up for external dependencies

---

#### Issue: ReportBuilder not showing tasks

**Symptoms**:

```bash
$ pnpm afenda my-command
┌────────────────┐
│ My Command     │
└────────────────┘
# No tasks shown
```

**Diagnosis**:

- Check if `addTask()` was called
- Verify task keys match configuration
- Check console for errors

**Solution**:

```typescript
// Ensure task key matches config
reportBuilder.addTask('task1', { ... });  // 'task1' must exist in REPORT_CONFIGS
```

---

### Debugging Tips

#### Enable Verbose Logging

```typescript
import { logger } from '../core/logger';

logger.setLevel('debug'); // Show all debug messages
```

#### Inspect Generated Reports

```bash
# Check generated files
ls -la .afenda/

# View report contents
cat .afenda/capability.ledger.json | jq '.'
```

#### Use Dry-Run Mode

```bash
# Test without writing files
pnpm afenda my-command --dry-run
```

---

## 🎓 Advanced Topics

### Custom Reporters

Create specialized output formats beyond CLI and Markdown:

```typescript
export class HTMLReporter {
  generate(report: Report): string {
    return `
      <!DOCTYPE html>
      <html>
        <head><title>${report.title}</title></head>
        <body>
          <h1>${report.title}</h1>
          ${report.tasks
            .map(
              (task) => `
            <div class="task ${task.success ? 'success' : 'error'}">
              <h2>${task.icon} ${task.title}</h2>
              <p>${task.message}</p>
            </div>
          `,
            )
            .join('')}
        </body>
      </html>
    `;
  }
}
```

### Complex Workflows

Orchestrate multiple commands with dependencies:

```typescript
export async function runComplexWorkflow() {
  // Step 1: Collect data
  await runMetaGen();

  // Step 2: Analyze (depends on step 1)
  await runMetaCheck();

  // Step 3: Generate reports (depends on step 2)
  await runReadmeGen();

  // Step 4: Final validation
  await runHousekeeping();
}
```

### Performance Optimization

Profile and optimize slow commands:

```typescript
import { performance } from 'node:perf_hooks';

export async function runOptimizedCommand() {
  const start = performance.now();

  // Use parallel processing
  const results = await Promise.all([scanPackages(), analyzeMetadata(), collectMetrics()]);

  const duration = performance.now() - start;
  console.log(`Completed in ${duration.toFixed(2)}ms`);
}
```

---

## 📚 Reference

### Core Utilities

| Utility           | Location                 | Purpose                   |
| ----------------- | ------------------------ | ------------------------- |
| **logger**        | `core/logger.ts`         | Structured logging        |
| **exec**          | `core/exec.ts`           | Shell command execution   |
| **paths**         | `core/paths.ts`          | Path resolution utilities |
| **runner**        | `core/runner.ts`         | Task orchestration        |
| **ReportBuilder** | `core/report-builder.ts` | Report generation         |

### Key Files

| File                    | Purpose                      |
| ----------------------- | ---------------------------- |
| `core/report-config.ts` | Report structure definitions |
| `cli.ts`                | CLI command registration     |
| `bin/afenda`            | CLI entry point              |
| `package.json`          | Package metadata             |

### Related Documentation

- Tools README - Complete tools overview
- START_HERE.md - Quick start guide
- afenda-cli README - CLI reference
- quality-metrics README - Metrics guide
- CONTRIBUTING.md - Contribution guidelines

---

<div align="center">

**📝 Auto-Generated Documentation**

This file is auto-generated via `pnpm afenda tools-docs`. Manual edits will be
overwritten.\
Last updated: Auto-generated on save

</div>
