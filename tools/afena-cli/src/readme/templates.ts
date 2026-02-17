/**
 * Template version — bump to force regen of all READMEs.
 * Included in signature hash.
 */
export const TEMPLATE_VERSION = '1';

/**
 * Autogen block markers.
 */
export const AUTOGEN_START = '<!-- AUTOGEN:START -->';
export const AUTOGEN_END = '<!-- AUTOGEN:END -->';

// --- Base sections (shared across all types) ---

function headerSection(name: string, description: string): string {
  const lines = [`# ${name}`, ''];
  if (description) {
    lines.push(description, '');
  }
  return lines.join('\n');
}

function installSection(
  name: string,
  workspace: boolean,
  peerDeps: string[]
): string {
  const lines = ['## Installation', '', '```bash'];
  if (workspace) {
    lines.push(`pnpm -w add ${name}`);
  } else {
    lines.push(`pnpm add ${name}`);
  }
  lines.push('```', '');

  if (peerDeps.length > 0) {
    lines.push('### Peer Dependencies', '', 'This package requires the following peer dependencies:', '');
    for (const dep of peerDeps) {
      lines.push(`- \`${dep}\``);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function scriptsSection(scripts: Record<string, string>): string {
  const keys = Object.keys(scripts).sort();
  if (keys.length === 0) return '';

  const lines = ['## Scripts', '', '| Script | Command |', '|---|---|'];
  for (const key of keys) {
    lines.push(`| \`${key}\` | \`${scripts[key]}\` |`);
  }
  lines.push('');
  return lines.join('\n');
}

function depsSection(
  deps: Record<string, string>,
  title: string
): string {
  const keys = Object.keys(deps).sort();
  if (keys.length === 0) return '';

  const lines = [`## ${title}`, '', '| Package | Version |', '|---|---|'];
  for (const key of keys) {
    lines.push(`| \`${key}\` | \`${deps[key]}\` |`);
  }
  lines.push('');
  return lines.join('\n');
}

function relatedSection(relatedPackages: string[]): string {
  if (relatedPackages.length === 0) return '';

  const lines = ['## Related Packages', ''];
  for (const pkg of relatedPackages) {
    lines.push(`- \`${pkg}\``);
  }
  lines.push('');
  return lines.join('\n');
}

function packageOverviewSection(
  structure?: {
    hasTests: boolean;
    hasDocs: boolean;
    subdirectories: string[];
    mainModules: string[];
    isEmpty: boolean;
  },
  keyExports?: string[]
): string {
  if (!structure) return '';

  const lines = ['## Package Overview', ''];

  // Show status badges
  const badges: string[] = [];
  if (structure.isEmpty) {
    badges.push('⚠️ **Empty Package** - No source files detected');
  } else {
    if (structure.hasTests) badges.push('✅ Has Tests');
    if (structure.hasDocs) badges.push('📚 Has Documentation');
    if (structure.subdirectories.length > 0) {
      badges.push(`📁 ${structure.subdirectories.length} Subdirectories`);
    }
  }

  if (badges.length > 0) {
    lines.push(badges.join(' • '), '');
  }

  // Show what's inside
  if (!structure.isEmpty) {
    if (keyExports && keyExports.length > 0) {
      lines.push('### What\'s Inside', '');
      for (const exp of keyExports) {
        lines.push(`- ${exp}`);
      }
      lines.push('');
    }

    if (structure.subdirectories.length > 0) {
      lines.push('### Directory Structure', '');
      lines.push('```');
      lines.push('src/');
      for (let i = 0; i < structure.subdirectories.length; i++) {
        const dir = structure.subdirectories[i];
        const prefix = i === structure.subdirectories.length - 1 ? '└──' : '├──';
        lines.push(`${prefix} ${dir}/`);
      }
      lines.push('```', '');
    }

    if (structure.mainModules.length > 0) {
      lines.push('### Entry Points', '');
      for (const mod of structure.mainModules) {
        lines.push(`- \`${mod}/index.ts\``);
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

function architectureSection(packageType: string, sourceFiles: string[]): string {
  const lines = ['## Architecture', ''];

  if (packageType === 'library') {
    const hasSrc = sourceFiles.some(f => f.startsWith('src/'));
    const hasTypes = sourceFiles.some(f => f.includes('/types/'));
    const hasUtils = sourceFiles.some(f => f.includes('/utils/'));
    const hasServices = sourceFiles.some(f => f.includes('/services/'));

    if (hasSrc) {
      lines.push('```');
      lines.push('src/');
      if (hasTypes) lines.push('├── types/      # Type definitions');
      if (hasUtils) lines.push('├── utils/      # Utility functions');
      if (hasServices) lines.push('├── services/   # Business logic');
      lines.push('└── index.ts    # Public API');
      lines.push('```', '');
    }
  } else if (packageType === 'app') {
    lines.push('Next.js 16 application with App Router.', '');
  } else if (packageType === 'tool') {
    lines.push('CLI tool built with Commander.js.', '');
  }

  return lines.join('\n');
}

function testingSection(scripts: Record<string, string>, _packageType: string): string {
  const hasTest = scripts['test'] || scripts['test:watch'] || scripts['test:coverage'];
  if (!hasTest) return '';

  const lines = ['## Testing', ''];

  if (scripts['test']) {
    lines.push('Run tests:', '', '```bash', 'pnpm test', '```', '');
  }

  if (scripts['test:watch']) {
    lines.push('Watch mode:', '', '```bash', 'pnpm test:watch', '```', '');
  }

  if (scripts['test:coverage']) {
    lines.push('Coverage report:', '', '```bash', 'pnpm test:coverage', '```', '');
  }

  return lines.join('\n');
}

function contributingSection(packageType: string): string {
  const lines = ['## Contributing', ''];

  lines.push('### Development Workflow', '');
  lines.push('1. Make changes to source files');
  lines.push('2. Run `pnpm lint:fix` to fix linting issues');
  lines.push('3. Run `pnpm type-check` to verify types');

  if (packageType === 'library') {
    lines.push('4. Run `pnpm test` to verify tests pass');
    lines.push('5. Run `pnpm build` to verify build succeeds');
  }

  lines.push('');
  lines.push('### Code Quality', '');
  lines.push('- All code must pass ESLint checks');
  lines.push('- All code must pass TypeScript type checking');
  if (packageType === 'library') {
    lines.push('- All tests must pass');
    lines.push('- Maintain or improve test coverage');
  }
  lines.push('');

  return lines.join('\n');
}

// --- Type-specific sections ---

function toPascalCase(s: string): string {
  return s
    .split(/[-_/]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function uiUsageSection(name: string, sourceFiles: string[]): string {
  const components = sourceFiles
    .filter((f) => f.startsWith('src/') && (f.endsWith('.tsx') || f.endsWith('.jsx')))
    .filter((f) => !f.includes('index'))
    .map((f) => toPascalCase(f.replace(/^src\//, '').replace(/\.(tsx|jsx)$/, '')));

  const lines = ['## Usage', '', '```tsx', `import { ${components[0] ?? 'Component'} } from '${name}';`, '```', ''];

  if (components.length > 0) {
    lines.push('## Components', '');
    for (const comp of components) {
      lines.push(`- **${comp}**`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function configUsageSection(
  name: string,
  exports: Array<{ subpath: string; conditions: Record<string, string> }>
): string {
  const lines = ['## Usage', ''];

  if (exports.length > 0) {
    lines.push('### Available Configurations', '', '| Export | Path |', '|---|---|');
    for (const exp of exports) {
      const file = exp.conditions['default'] ?? exp.conditions['types'] ?? Object.values(exp.conditions)[0] ?? '';
      lines.push(`| \`${exp.subpath}\` | \`${file}\` |`);
    }
    lines.push('');
  }

  const mainExport = exports.find((e) => e.subpath === '.');
  if (mainExport) {
    const file = mainExport.conditions['default'] ?? '';
    if (name.includes('eslint')) {
      lines.push('```js', `const config = require('${name}');`, '', 'module.exports = [...config];', '```', '');
    } else if (name.includes('typescript')) {
      lines.push('```json', '{', `  "extends": "${name}/${file.replace('./', '')}"`, '}', '```', '');
    }
  }

  return lines.join('\n');
}

function libraryUsageSection(name: string): string {
  return [
    '## Usage',
    '',
    '```ts',
    `import { /* ... */ } from '${name}';`,
    '```',
    '',
    '## API',
    '',
    'See source files for available exports.',
    '',
  ].join('\n');
}

function appUsageSection(scripts: Record<string, string>): string {
  const lines = ['## Getting Started', ''];

  if (scripts['dev']) {
    lines.push('### Development', '', '```bash', `pnpm dev`, '```', '');
  }
  if (scripts['build']) {
    lines.push('### Build', '', '```bash', `pnpm build`, '```', '');
  }
  if (scripts['start']) {
    lines.push('### Start', '', '```bash', `pnpm start`, '```', '');
  }

  return lines.join('\n');
}

function toolUsageSection(name: string, binNames: string[], scripts: Record<string, string>): string {
  const lines = ['## Usage', ''];

  const binName = binNames[0] ?? name.replace(/^@.*\//, '');
  lines.push('```bash', `pnpm ${binName}`, '```', '');

  if (scripts['build']) {
    lines.push('### Build', '', '```bash', `pnpm build`, '```', '');
  }
  if (scripts['dev']) {
    lines.push('### Development', '', '```bash', `pnpm dev`, '```', '');
  }

  return lines.join('\n');
}

// --- Exports section for all types ---

function exportsSection(
  exports: Array<{ subpath: string; conditions: Record<string, string> }>
): string {
  if (exports.length === 0) return '';

  const lines = ['## Exports', '', '| Subpath | Conditions |', '|---|---|'];
  for (const exp of exports) {
    const conds = Object.entries(exp.conditions)
      .map(([k, v]) => `${k}: \`${v}\``)
      .join(', ');
    lines.push(`| \`${exp.subpath}\` | ${conds} |`);
  }
  lines.push('');
  return lines.join('\n');
}

// --- Root README template ---

export interface RootReadmeInput {
  name: string;
  packages: Array<{
    dir: string;
    name: string;
    description: string;
    packageType: string;
  }>;
  scripts: Record<string, string>;
  signature: string;
}

/**
 * Render the root monorepo README autogen block.
 */
export function renderRootReadme(input: RootReadmeInput): string {
  const parts: string[] = [
    `<!-- Generated by afena readme gen — DO NOT EDIT inside this block -->`,
    `<!-- Signature: ${input.signature} -->`,
    '',
    `# ${input.name}`,
    '',
  ];

  // Group packages by category
  const apps = input.packages.filter((p) => p.dir.startsWith('apps/'));
  const pkgs = input.packages.filter((p) => p.dir.startsWith('packages/'));
  const tools = input.packages.filter((p) => p.dir.startsWith('tools/'));

  // Structure tree
  const treeLines = ['## Structure', '', '```'];
  treeLines.push(`${input.name}/`);
  if (apps.length > 0) {
    treeLines.push('├── apps/');
    for (let i = 0; i < apps.length; i++) {
      const a = apps[i];
      const prefix = i === apps.length - 1 && pkgs.length === 0 && tools.length === 0 ? '└' : '├';
      const dirName = a.dir.replace('apps/', '');
      const desc = a.description ? `  # ${a.description}` : '';
      treeLines.push(`│   ${prefix}── ${dirName}/${desc}`);
    }
  }
  if (pkgs.length > 0) {
    treeLines.push('├── packages/');
    for (let i = 0; i < pkgs.length; i++) {
      const p = pkgs[i];
      const prefix = i === pkgs.length - 1 ? '└' : '├';
      const dirName = p.dir.replace('packages/', '');
      const desc = p.description ? `  # ${p.description}` : '';
      treeLines.push(`│   ${prefix}── ${dirName}/${desc}`);
    }
  }
  if (tools.length > 0) {
    treeLines.push('├── tools/');
    for (let i = 0; i < tools.length; i++) {
      const t = tools[i];
      const prefix = i === tools.length - 1 ? '└' : '├';
      const dirName = t.dir.replace('tools/', '');
      const desc = t.description ? `  # ${t.description}` : '';
      treeLines.push(`│   ${prefix}── ${dirName}/${desc}`);
    }
  }
  treeLines.push('├── turbo.json');
  treeLines.push('├── pnpm-workspace.yaml');
  treeLines.push('└── package.json');
  treeLines.push('```', '');
  parts.push(treeLines.join('\n'));

  // Packages table
  const tableLines = ['## Packages', '', '| Package | Path | Type | Description |', '|---|---|---|---|'];
  for (const p of input.packages) {
    tableLines.push(`| \`${p.name}\` | \`${p.dir}\` | ${p.packageType} | ${p.description} |`);
  }
  tableLines.push('');
  parts.push(tableLines.join('\n'));

  // Scripts
  const scriptKeys = Object.keys(input.scripts).sort();
  if (scriptKeys.length > 0) {
    const scriptLines = ['## Scripts', '', '| Script | Command |', '|---|---|'];
    for (const key of scriptKeys) {
      scriptLines.push(`| \`pnpm ${key}\` | \`${input.scripts[key]}\` |`);
    }
    scriptLines.push('');
    parts.push(scriptLines.join('\n'));
  }

  return parts.filter((p) => p.length > 0).join('\n');
}

// --- Template assembly ---

export interface TemplateInput {
  name: string;
  description: string;
  packageType: 'ui' | 'config' | 'library' | 'app' | 'tool';
  workspace: boolean;
  peerDeps: string[];
  binNames: string[];
  exports: Array<{ subpath: string; conditions: Record<string, string> }>;
  sourceFiles: string[];
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  relatedPackages: string[];
  structure?: {
    hasTests: boolean;
    hasDocs: boolean;
    subdirectories: string[];
    mainModules: string[];
    isEmpty: boolean;
  };
  keyExports: string[];
  signature: string;
}

/**
 * Select and render the appropriate template for a package type.
 * Returns the full autogen block content (without the markers themselves).
 */
export function renderTemplate(input: TemplateInput): string {
  const parts: string[] = [
    `<!-- Generated by afena readme gen — DO NOT EDIT inside this block -->`,
    `<!-- Signature: ${input.signature} -->`,
    '',
    headerSection(input.name, input.description),
  ];

  // Add package overview section first (shows what's inside)
  parts.push(packageOverviewSection(input.structure, input.keyExports));

  switch (input.packageType) {
    case 'ui':
      parts.push(uiUsageSection(input.name, input.sourceFiles));
      parts.push(installSection(input.name, input.workspace, input.peerDeps));
      break;
    case 'config':
      parts.push(configUsageSection(input.name, input.exports));
      parts.push(installSection(input.name, input.workspace, input.peerDeps));
      break;
    case 'app':
      parts.push(appUsageSection(input.scripts));
      break;
    case 'tool':
      parts.push(toolUsageSection(input.name, input.binNames, input.scripts));
      break;
    case 'library':
    default:
      parts.push(libraryUsageSection(input.name));
      parts.push(installSection(input.name, input.workspace, input.peerDeps));
      break;
  }

  // Config and app types already show exports in their usage section
  if (input.packageType !== 'config' && input.packageType !== 'app') {
    parts.push(exportsSection(input.exports));
  }
  parts.push(scriptsSection(input.scripts));
  parts.push(architectureSection(input.packageType, input.sourceFiles));
  parts.push(testingSection(input.scripts, input.packageType));
  parts.push(depsSection(input.dependencies, 'Dependencies'));
  parts.push(depsSection(input.peerDependencies, 'Peer Dependencies'));
  parts.push(relatedSection(input.relatedPackages));
  parts.push(contributingSection(input.packageType));

  return parts.filter((p) => p.length > 0).join('\n');
}
