/**
 * Auto-generated Tools Directory Documentation
 * Replaces manual README.md and RESTRUCTURING.md with dynamic generation
 */

import { safeWriteFile } from '../core/fs-safe';

export interface ToolsDocsOptions {
  repoRoot: string;
  format: 'markdown' | 'both';
}

/**
 * Generate tools directory documentation
 */
export function generateToolsDocs(options: ToolsDocsOptions): void {
  const { repoRoot, format } = options;

  // Generate README.md
  const readme = generateReadme();
  safeWriteFile(repoRoot, readme, 'tools', 'README.md');

  // Generate GUIDE.md (replaces RESTRUCTURING.md)
  if (format === 'both') {
    const guide = generateGuide();
    safeWriteFile(repoRoot, guide, 'tools', 'GUIDE.md');
  }
}

/**
 * Generate README.md content
 */
function generateReadme(): string {
  const lines: string[] = [];

  lines.push('# Tools Directory');
  lines.push('');
  lines.push('> **Auto-generated documentation** - Run `pnpm afena docs` to regenerate');
  lines.push('');
  lines.push('Unified development and maintenance utilities for the Afena monorepo.');
  lines.push('');

  // Quick Start
  lines.push('## Quick Start');
  lines.push('');
  lines.push('```bash');
  lines.push('# Run all maintenance tasks');
  lines.push('pnpm bundle');
  lines.push('');
  lines.push('# Preview changes (dry-run)');
  lines.push('pnpm bundle:dry');
  lines.push('');
  lines.push('# Generate READMEs');
  lines.push('pnpm afena readme gen');
  lines.push('');
  lines.push('# Run housekeeping checks');
  lines.push('pnpm afena housekeeping');
  lines.push('```');
  lines.push('');

  // Structure
  lines.push('## Structure');
  lines.push('');
  lines.push('```');
  lines.push('tools/');
  lines.push('└── afena-cli/                    # Unified CLI tool');
  lines.push('    ├── src/');
  lines.push('    │   ├── cli.ts                 # Main CLI entry point');
  lines.push('    │   ├── types.ts               # All Zod schemas & types');
  lines.push('    │   │');
  lines.push('    │   ├── core/                  # Core utilities (shared)');
  lines.push('    │   │   ├── exec.ts            # Command execution');
  lines.push('    │   │   ├── logger.ts          # Logging');
  lines.push('    │   │   ├── paths.ts           # Path utilities');
  lines.push('    │   │   ├── runner.ts          # Registry command runner');
  lines.push('    │   │   ├── reporter.ts        # Report generation');
  lines.push('    │   │   ├── report-builder.ts  # Auto report builder');
  lines.push('    │   │   └── report-config.ts   # Report constants');
  lines.push('    │   │');
  lines.push('    │   ├── readme/                # README generation');
  lines.push('    │   │   ├── readme-engine.ts   # Main engine');
  lines.push('    │   │   ├── analyzer.ts        # Package analysis');
  lines.push('    │   │   ├── templates.ts       # README templates');
  lines.push('    │   │   └── renderer.ts        # Markdown rendering');
  lines.push('    │   │');
  lines.push('    │   ├── capability/            # Capability Truth Ledger');
  lines.push('    │   │   ├── collectors/        # Data collectors');
  lines.push('    │   │   ├── checks/            # VIS-00 through VIS-04');
  lines.push('    │   │   ├── emitters/          # Ledger generation');
  lines.push('    │   │   └── adapter/           # ERP adapter pipeline');
  lines.push('    │   │');
  lines.push('    │   ├── checks/                # All invariant checks');
  lines.push('    │   │   └── invariants.ts      # E1-E7, H00-H02');
  lines.push('    │   │');
  lines.push('    │   ├── bundle/                # Bundle all tasks');
  lines.push('    │   │   └── command.ts         # Run all maintenance');
  lines.push('    │   │');
  lines.push('    │   ├── discovery/             # Package/script discovery');
  lines.push('    │   │   ├── scan.ts            # Scan workspace');
  lines.push('    │   │   └── register.ts        # Register to registry');
  lines.push('    │   │');
  lines.push('    │   └── docs/                  # Documentation generation');
  lines.push('    │       └── tools-docs.ts      # This file');
  lines.push('    │');
  lines.push('    ├── bin/afena                  # Binary');
  lines.push('    └── package.json');
  lines.push('```');
  lines.push('');

  // Commands
  lines.push('## Commands');
  lines.push('');
  lines.push('### Bundle');
  lines.push('');
  lines.push('Run all maintenance tasks in sequence:');
  lines.push('');
  lines.push('```bash');
  lines.push('pnpm bundle              # Run all tasks');
  lines.push('pnpm bundle:dry          # Preview changes');
  lines.push('pnpm afena bundle --skip-readme');
  lines.push('pnpm afena bundle --skip-meta');
  lines.push('pnpm afena bundle --skip-housekeeping');
  lines.push('```');
  lines.push('');
  lines.push('**Tasks:**');
  lines.push('1. 📝 README Generation - Generate and update package READMEs');
  lines.push('2. 🔍 Metadata Checks - Validate capability metadata');
  lines.push('3. 🧹 Housekeeping - Run invariant checks (E1-E7, H00-H02)');
  lines.push('');

  lines.push('### README Generation');
  lines.push('');
  lines.push('```bash');
  lines.push('pnpm afena readme gen           # Generate all READMEs');
  lines.push('pnpm afena readme gen --dry-run # Preview changes');
  lines.push('pnpm afena readme validate      # Validate existing READMEs');
  lines.push('```');
  lines.push('');

  lines.push('### Housekeeping');
  lines.push('');
  lines.push('```bash');
  lines.push('pnpm afena housekeeping         # Run all checks');
  lines.push('pnpm afena housekeeping --json  # JSON output');
  lines.push('```');
  lines.push('');

  lines.push('### Metadata');
  lines.push('');
  lines.push('```bash');
  lines.push('pnpm afena meta check           # Validate metadata');
  lines.push('pnpm afena meta scan            # Scan for capabilities');
  lines.push('```');
  lines.push('');

  // Reports
  lines.push('## Auto-Generated Reports');
  lines.push('');
  lines.push('All commands generate standardized reports with:');
  lines.push('');
  lines.push('- ⏱️  **Timestamp & Duration** - When and how long');
  lines.push('- 📊 **Metrics** - Total/Success/Warnings/Errors');
  lines.push('- ✓ **Task Status** - Color-coded results');
  lines.push('- 💡 **Recommendations** - Smart next steps');
  lines.push('- 📄 **Markdown Export** - Optional file output');
  lines.push('');

  // Features
  lines.push('## Key Features');
  lines.push('');
  lines.push('### Package Discovery');
  lines.push('- Auto-detects package structure');
  lines.push('- Identifies key exports (types, utils, components, etc.)');
  lines.push('- Shows directory structure and entry points');
  lines.push('- Flags empty packages');
  lines.push('');

  lines.push('### README Generation');
  lines.push('- Auto-generates package overviews');
  lines.push('- Creates architecture documentation');
  lines.push('- Maintains consistent format');
  lines.push('- Preserves custom content outside autogen blocks');
  lines.push('');

  lines.push('### Invariant Checks');
  lines.push('- E1-E7: Code quality checks');
  lines.push('- H00-H02: Handler registry validation');
  lines.push('- Automated enforcement');
  lines.push('- Clear error reporting');
  lines.push('');

  // Footer
  lines.push('---');
  lines.push('');
  lines.push('*Auto-generated by `pnpm afena docs` - Do not edit manually*');
  lines.push('');

  return lines.join('\n');
}

/**
 * Generate GUIDE.md content (replaces RESTRUCTURING.md)
 */
function generateGuide(): string {
  const lines: string[] = [];

  lines.push('# Tools Directory Guide');
  lines.push('');
  lines.push('> **Auto-generated documentation** - Run `pnpm afena docs` to regenerate');
  lines.push('');

  lines.push('## Architecture Principles');
  lines.push('');
  lines.push('### Flat, Feature-Based Structure');
  lines.push('');
  lines.push('The tools directory uses a **flat, feature-based organization**:');
  lines.push('');
  lines.push('- **Max 2 levels deep** - Easy navigation');
  lines.push('- **Clear purpose** - Each folder has one job');
  lines.push('- **No unnecessary nesting** - Avoid `utils/helpers/common/`');
  lines.push('- **Feature modules** - Group by what it does, not what it is');
  lines.push('');

  lines.push('### Directory Naming');
  lines.push('');
  lines.push('| Directory | Purpose | Examples |');
  lines.push('|-----------|---------|----------|');
  lines.push('| `core/` | Shared utilities | logger, paths, exec |');
  lines.push('| `readme/` | README generation | analyzer, templates, renderer |');
  lines.push('| `capability/` | Capability system | collectors, emitters, checks |');
  lines.push('| `checks/` | Invariant checks | E1-E7, H00-H02 |');
  lines.push('| `bundle/` | Bundle command | orchestration |');
  lines.push('| `discovery/` | Package discovery | scan, register |');
  lines.push('| `docs/` | Documentation | auto-generation |');
  lines.push('');

  lines.push('## Report System');
  lines.push('');
  lines.push('### Constants-Based Configuration');
  lines.push('');
  lines.push('All reports are defined in `core/report-config.ts`:');
  lines.push('');
  lines.push('```typescript');
  lines.push('export const REPORT_CONFIGS = {');
  lines.push('  bundle: {');
  lines.push('    command: \'bundle\',');
  lines.push('    displayName: \'Bundle\',');
  lines.push('    tasks: [');
  lines.push('      { key: \'readme\', title: \'README Generation\', icon: \'📝\' },');
  lines.push('      { key: \'meta\', title: \'Metadata Checks\', icon: \'🔍\' },');
  lines.push('      { key: \'housekeeping\', title: \'Housekeeping\', icon: \'🧹\' },');
  lines.push('    ],');
  lines.push('  },');
  lines.push('  // ... other commands');
  lines.push('};');
  lines.push('```');
  lines.push('');

  lines.push('### Automatic Report Generation');
  lines.push('');
  lines.push('Use `ReportBuilder` for automatic reports:');
  lines.push('');
  lines.push('```typescript');
  lines.push('const reportBuilder = new ReportBuilder(\'bundle\', { dryRun });');
  lines.push('');
  lines.push('// Add tasks - builder handles everything else');
  lines.push('reportBuilder.addTask(\'readme\', {');
  lines.push('  success: true,');
  lines.push('  message: \'Generated 5 READMEs\',');
  lines.push('  count: 5,');
  lines.push('});');
  lines.push('');
  lines.push('// Auto-generates CLI + optional Markdown');
  lines.push('reportBuilder.generate();');
  lines.push('```');
  lines.push('');

  lines.push('## Adding New Commands');
  lines.push('');
  lines.push('### 1. Add Report Configuration');
  lines.push('');
  lines.push('Update `core/report-config.ts`:');
  lines.push('');
  lines.push('```typescript');
  lines.push('export const REPORT_CONFIGS = {');
  lines.push('  // ... existing configs');
  lines.push('  mycommand: {');
  lines.push('    command: \'mycommand\',');
  lines.push('    displayName: \'My Command\',');
  lines.push('    description: \'Does something useful\',');
  lines.push('    tasks: [');
  lines.push('      { key: \'task1\', title: \'Task 1\', icon: \'✓\', description: \'...\' },');
  lines.push('    ],');
  lines.push('  },');
  lines.push('};');
  lines.push('```');
  lines.push('');

  lines.push('### 2. Create Command Implementation');
  lines.push('');
  lines.push('Create `src/mycommand/command.ts`:');
  lines.push('');
  lines.push('```typescript');
  lines.push('import { ReportBuilder } from \'../core/report-builder\';');
  lines.push('');
  lines.push('export async function runMyCommand(options: MyOptions) {');
  lines.push('  const reportBuilder = new ReportBuilder(\'mycommand\', {');
  lines.push('    dryRun: options.dryRun,');
  lines.push('  });');
  lines.push('');
  lines.push('  // Do work...');
  lines.push('  const result = await doSomething();');
  lines.push('');
  lines.push('  // Add to report');
  lines.push('  reportBuilder.addTask(\'task1\', {');
  lines.push('    success: result.ok,');
  lines.push('    message: result.message,');
  lines.push('  });');
  lines.push('');
  lines.push('  // Auto-generate report');
  lines.push('  reportBuilder.generate();');
  lines.push('}');
  lines.push('```');
  lines.push('');

  lines.push('### 3. Register in CLI');
  lines.push('');
  lines.push('Add to `src/cli.ts`:');
  lines.push('');
  lines.push('```typescript');
  lines.push('program');
  lines.push('  .command(\'mycommand\')');
  lines.push('  .description(\'Does something useful\')');
  lines.push('  .option(\'--dry-run\', \'Preview changes\')');
  lines.push('  .action(async (opts) => {');
  lines.push('    const { runMyCommand } = await import(\'./mycommand/command\');');
  lines.push('    await runMyCommand({ dryRun: opts.dryRun });');
  lines.push('  });');
  lines.push('```');
  lines.push('');

  lines.push('## Best Practices');
  lines.push('');
  lines.push('### Code Organization');
  lines.push('');
  lines.push('1. **One feature per directory** - Don\'t mix concerns');
  lines.push('2. **Flat structure** - Avoid deep nesting');
  lines.push('3. **Clear naming** - Name by purpose, not type');
  lines.push('4. **Shared code in core/** - Common utilities only');
  lines.push('');

  lines.push('### Report Generation');
  lines.push('');
  lines.push('1. **Use constants** - Define in `report-config.ts`');
  lines.push('2. **Use ReportBuilder** - No manual construction');
  lines.push('3. **Add task results** - Builder handles formatting');
  lines.push('4. **Let it auto-generate** - CLI + Markdown automatic');
  lines.push('');

  lines.push('### Documentation');
  lines.push('');
  lines.push('1. **Auto-generate** - Use `pnpm afena docs`');
  lines.push('2. **Don\'t edit manually** - Changes will be overwritten');
  lines.push('3. **Update constants** - Modify source, regenerate');
  lines.push('4. **Keep it current** - Regenerate after changes');
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('*Auto-generated by `pnpm afena docs` - Do not edit manually*');
  lines.push('');

  return lines.join('\n');
}
