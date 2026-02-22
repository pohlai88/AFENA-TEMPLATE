import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

import { Command } from 'commander';
import semver from 'semver';

import { registerMetaCommand } from './capability';
import { generateManPage } from './man-pages';
import { commandExists } from './core/exec';
import { log } from './core/logger';
import { safeReadJson } from './core/parse-json';
import { findRepoRoot } from './core/paths';
import { runRegistryCommand } from './core/runner';
import { registerDiscovered } from './discovery/register';
import { printTsCheckResult, runTsCheck } from './doctor/ts-checker.js';
import { registerDomainCommand } from './domain/index.js';
import { runReadmeCommand } from './readme/readme-engine';
import { RegistrySchema, afendaConfigSchema } from './types';

import type { CommandEntry, Registry, afendaConfig } from './types';

function formatCommandEntry(entry: CommandEntry): string {
  return typeof entry === 'string' ? entry : `${entry.cmd} ${(entry.args ?? []).join(' ')}`;
}

/** Commander opts for commands that only use cmd.args */
type RegistryCommandOpts = Record<string, unknown>;

interface ReadmeGenOpts {
  package?: string;
  dir?: string;
  dryRun?: boolean;
  json?: boolean;
}

interface ReadmeSyncOpts {
  dryRun?: boolean;
}

interface DiscoverOpts {
  json?: boolean;
  fixReadmes?: boolean;
  since?: string;
}

interface BundleOpts {
  skipReadme?: boolean;
  skipMeta?: boolean;
  skipHousekeeping?: boolean;
  skipProposal?: boolean;
  skipProject?: boolean;
  dryRun?: boolean;
}

interface ToolsDocsOpts {
  format?: string;
}

interface HousekeepingOpts {
  json?: boolean;
  debug?: boolean;
  emitDocs?: boolean;
}

const pkg = { name: '@afenda/cli', version: '0.1.0' };

function loadRegistry(repoRoot: string): Registry {
  if (!existsSync(join(repoRoot, 'afenda.registry.json'))) {
    return RegistrySchema.parse({ commands: {} });
  }
  try {
    return safeReadJson(repoRoot, ['afenda.registry.json'], RegistrySchema);
  } catch (err: unknown) {
    log.warn(`Failed to load registry: ${err instanceof Error ? err.message : String(err)}`);
    return RegistrySchema.parse({ commands: {} });
  }
}

function loadConfig(repoRoot: string): afendaConfig {
  if (!existsSync(join(repoRoot, '.afendarc.json'))) {
    return afendaConfigSchema.parse({});
  }
  try {
    return safeReadJson(repoRoot, ['.afendarc.json'], afendaConfigSchema);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error(`.afendarc.json validation failed: ${msg}`);
    log.dim('See .afendarc.example.json for valid schema.');
    process.exitCode = 1;
    throw err;
  }
}

const program = new Command();

program
  .name('afenda')
  .description('afenda monorepo CLI — unified command interface')
  .version(pkg.version);

// --- Dynamic commands from registry ---

program
  .command('types [subcommand]')
  .description('Type generation commands')
  .allowUnknownOption(true)
  .action(async (subcommand: string | undefined, _opts: RegistryCommandOpts, cmd: Command) => {
    const repoRoot = findRepoRoot();
    const registry = loadRegistry(repoRoot);
    const commandPath = subcommand ? `types:${subcommand}` : 'types';
    const extraArgs = cmd.args.filter((a: string) => a !== subcommand);
    process.exitCode = await runRegistryCommand(commandPath, registry, repoRoot, extraArgs);
  });

program
  .command('docs [subcommand]')
  .description('Documentation commands')
  .allowUnknownOption(true)
  .action(async (subcommand: string | undefined, _opts: RegistryCommandOpts, cmd: Command) => {
    const repoRoot = findRepoRoot();
    const registry = loadRegistry(repoRoot);
    const commandPath = subcommand ? `docs:${subcommand}` : 'docs';
    const extraArgs = cmd.args.filter((a: string) => a !== subcommand);
    process.exitCode = await runRegistryCommand(commandPath, registry, repoRoot, extraArgs);
  });

program
  .command('guard [subcommand]')
  .description('Guardrail checks (non-blocking)')
  .allowUnknownOption(true)
  .action(async (subcommand: string | undefined, _opts: RegistryCommandOpts, cmd: Command) => {
    const repoRoot = findRepoRoot();
    const registry = loadRegistry(repoRoot);
    const commandPath = subcommand ? `guard:${subcommand}` : 'guard';
    const extraArgs = cmd.args.filter((a: string) => a !== subcommand);
    process.exitCode = await runRegistryCommand(commandPath, registry, repoRoot, extraArgs);
  });

program
  .command('clean [subcommand]')
  .description('Cleanup commands')
  .allowUnknownOption(true)
  .action(async (subcommand: string | undefined, _opts: RegistryCommandOpts, cmd: Command) => {
    const repoRoot = findRepoRoot();
    const registry = loadRegistry(repoRoot);
    const commandPath = subcommand ? `clean:${subcommand}` : 'clean';
    const extraArgs = cmd.args.filter((a: string) => a !== subcommand);
    process.exitCode = await runRegistryCommand(commandPath, registry, repoRoot, extraArgs);
  });

program
  .command('dev [app]')
  .description('Start development server(s)')
  .allowUnknownOption(true)
  .action(async (app: string | undefined, _opts: RegistryCommandOpts, cmd: Command) => {
    const repoRoot = findRepoRoot();
    const registry = loadRegistry(repoRoot);
    const commandPath = app ? `dev:${app}` : 'dev';
    const extraArgs = cmd.args.filter((a: string) => a !== app);
    process.exitCode = await runRegistryCommand(commandPath, registry, repoRoot, extraArgs);
  });

program
  .command('build [target]')
  .description('Build packages')
  .allowUnknownOption(true)
  .action(async (target: string | undefined, _opts: RegistryCommandOpts, cmd: Command) => {
    const repoRoot = findRepoRoot();
    const registry = loadRegistry(repoRoot);
    const commandPath = target ? `build:${target}` : 'build';
    const extraArgs = cmd.args.filter((a: string) => a !== target);
    process.exitCode = await runRegistryCommand(commandPath, registry, repoRoot, extraArgs);
  });

// --- Meta commands ---

program
  .command('list')
  .description('Show registered commands from registry')
  .action(() => {
    const repoRoot = findRepoRoot();
    const registry = loadRegistry(repoRoot);
    const commands = registry.commands;

    if (Object.keys(commands).length === 0) {
      log.warn('No commands registered. Create afenda.registry.json or run --register.');
      return;
    }

    log.bold('Registered commands:\n');
    for (const group of Object.keys(commands).sort()) {
      const cmd = commands[group];
      if (cmd.default) {
        const def = formatCommandEntry(cmd.default);
        log.info(`  ${group} → ${def}`);
      }
      const subs = cmd.subcommands ?? {};
      for (const sub of Object.keys(subs).sort()) {
        const entry = subs[sub];
        const display = formatCommandEntry(entry);
        log.info(`  ${group}:${sub} → ${display}`);
      }
    }
  });

const doctorCmd = program
  .command('doctor')
  .description('Check environment (node, pnpm, turbo, git) and audit configuration')
  .action(async () => {
    log.bold('afenda Doctor\n');

    // Node version
    const nodeVersion = process.version;
    const nodeOk = semver.gte(nodeVersion, '18.0.0');
    log.info(`  Node: ${nodeVersion} ${nodeOk ? '✅' : '❌ (need >=18)'}`);

    // pnpm
    const hasPnpm = await commandExists('pnpm');
    log.info(`  pnpm: ${hasPnpm ? '✅' : '❌ not found'}`);

    // turbo
    const hasTurbo = await commandExists('turbo');
    log.info(`  turbo: ${hasTurbo ? '✅' : '❌ not found'}`);

    // git
    const hasGit = await commandExists('git');
    log.info(`  git: ${hasGit ? '✅' : '⚠️  not found (--since HEAD won\'t work)'}`);

    // Registry
    const repoRoot = findRepoRoot();
    const registryExists = existsSync(join(repoRoot, 'afenda.registry.json'));
    log.info(`  Registry: ${registryExists ? '✅' : '⚠️  afenda.registry.json not found'}`);

    // Config
    const configExists = existsSync(join(repoRoot, '.afendarc.json'));
    log.info(`  Config: ${configExists ? '✅' : '⚠️  .afendarc.json not found (using defaults)'}`);

    // Environment
    log.bold('\n  Environment variables:');
    log.dim('    CI              — Disables ANSI colors (auto in CI)');
    log.dim('    afenda_VERBOSE  — Enables debug logging');
    log.dim('    AFENDA_TIMEOUT  — Override exec timeout in ms (default: 300000)');
    log.dim('    AFENDA_META_NO_CACHE — Bypass meta scan cache (force fresh scan)');

    log.info('');
  });

program
  .command('completion [shell]')
  .description('Generate shell completion script for bash, zsh, or fish')
  .action((shell: string | undefined) => {
    const commands = [
      'types', 'docs', 'guard', 'clean', 'dev', 'build', 'list', 'doctor',
      'readme', 'discover', 'bundle', 'housekeeping', 'meta', 'project', 'proposal', 'domain', 'tools-docs',
      'completion', 'man-pages',
    ];
    const subcommands: Record<string, string[]> = {
      readme: ['gen', 'sync', 'check'],
      meta: ['gen', 'check', 'matrix', 'manifest', 'fix'],
      project: ['gen', 'check'],
      proposal: ['gen', 'check'],
      doctor: ['ts'],
    };
    const defaultShell = process.env.SHELL?.includes('fish') ? 'fish' : process.env.SHELL?.includes('zsh') ? 'zsh' : 'bash';
    const sh = shell ?? defaultShell;
    if (sh === 'fish') {
      console.log(`complete -c afenda -a "${commands.join(' ')}"`);
      for (const [cmd, subs] of Object.entries(subcommands)) {
        console.log(`complete -c afenda -n "__fish_seen_subcommand_from ${cmd}" -a "${subs.join(' ')}"`);
      }
    } else if (sh === 'zsh') {
      console.log(`#compdef afenda\n_afenda() {\n  _values 'commands' ${commands.map(c => `'${c}'`).join(' ')}\n}\ncompdef _afenda afenda`);
    } else {
      console.log(`_afenda_completion() {\n  COMPREPLY=($(compgen -W "${commands.join(' ')}" -- "\${COMP_WORDS[COMP_CWORD]}"))\n}\ncomplete -F _afenda_completion afenda`);
    }
  });

program
  .command('man-pages')
  .description('Generate man pages from Commander help')
  .option('--output <path>', 'Output path (default: docs/man/afenda.1)')
  .action((opts: { output?: string }) => {
    const repoRoot = findRepoRoot();
    const outPath = opts.output ?? join(repoRoot, 'docs', 'man', 'afenda.1');
    generateManPage(program, outPath);
    log.success(`Wrote ${outPath}`);
  });

doctorCmd
  .command('ts')
  .description('Audit TypeScript & tsup configuration against governance rules (RULE-01 through RULE-06)')
  .action(() => {
    const repoRoot = findRepoRoot();
    const result = runTsCheck(repoRoot);
    printTsCheckResult(result, repoRoot);
    if (!result.ok) process.exitCode = 1;
  });

// --- README commands ---

const readmeCmd = program
  .command('readme')
  .description('README generation and validation');

readmeCmd
  .command('gen')
  .description('Generate missing READMEs and update stale ones')
  .option('--package <name>', 'Target a specific package by name')
  .option('--dir <path>', 'Target a specific package by directory')
  .option('--dry-run', 'Preview output without writing files')
  .option('--json', 'Output results as JSON')
  .action((opts: ReadmeGenOpts) => {
    const repoRoot = findRepoRoot();
    const config = loadConfig(repoRoot);
    const packages = opts.package ? [opts.package] : opts.dir ? [opts.dir] : undefined;
    const result = runReadmeCommand({
      mode: 'gen',
      repoRoot,
      config,
      ...(packages ? { packages } : {}),
      dryRun: opts.dryRun,
      json: opts.json,
    });
    if (opts.json) log.json(result);
    if (result.failures.length > 0) process.exitCode = 1;
  });

readmeCmd
  .command('sync')
  .description('Update autogen blocks for existing READMEs only')
  .option('--dry-run', 'Preview output without writing files')
  .action((opts: ReadmeSyncOpts) => {
    const repoRoot = findRepoRoot();
    const config = loadConfig(repoRoot);
    runReadmeCommand({
      mode: 'sync',
      repoRoot,
      config,
      dryRun: opts.dryRun,
    });
  });

readmeCmd
  .command('check')
  .description('Validate READMEs against Definition of Done (non-zero exit on failure)')
  .action(() => {
    const repoRoot = findRepoRoot();
    const config = loadConfig(repoRoot);
    const result = runReadmeCommand({
      mode: 'check',
      repoRoot,
      config,
    });
    if (!result.checkPassed) process.exitCode = 1;
  });

// --- Discover command ---

program
  .command('discover')
  .description('Run discovery scanner manually')
  .option('--json', 'Output as JSON')
  .option('--fix-readmes', 'Generate missing READMEs (DEPRECATED: use afenda readme gen)')
  .option('--since <ref>', 'Only check changes since git ref')
  .action((opts: DiscoverOpts) => {
    const repoRoot = findRepoRoot();

    // Run discovery
    if (opts.json) {
      const discoveryPath = join(repoRoot, '.afenda', 'discovery.json');
      if (existsSync(discoveryPath)) {
        console.log(readFileSync(discoveryPath, 'utf-8'));
      } else {
        log.warn('No discovery.json found. Running discovery first...');
        execSync(`node ${join(__dirname, 'discover.js')}`, {
          cwd: repoRoot,
          stdio: 'inherit',
          env: { ...process.env, afenda_VERBOSE: '1' },
        });
        if (existsSync(discoveryPath)) {
          console.log(readFileSync(discoveryPath, 'utf-8'));
        }
      }
    } else {
      execSync(`node ${join(__dirname, 'discover.js')}`, {
        cwd: repoRoot,
        stdio: 'inherit',
        env: { ...process.env, afenda_VERBOSE: '1' },
      });
    }

    // --fix-readmes: deprecated compatibility shim
    if (opts.fixReadmes) {
      log.dim('DEPRECATED: --fix-readmes will be removed in a future release. Use: afenda readme gen');
      try {
        const config = loadConfig(repoRoot);
        runReadmeCommand({ mode: 'gen', repoRoot, config });
      } catch (err: unknown) {
        log.warn(`README generation failed (best-effort): ${err instanceof Error ? err.message : String(err)}`);
      }
    }
  });

// --- Bundle command (run all maintenance tasks) ---

program
  .command('bundle')
  .description('Run all maintenance tasks: readme → meta → housekeeping → proposal → project')
  .option('--skip-readme', 'Skip README generation')
  .option('--skip-meta', 'Skip metadata checks')
  .option('--skip-housekeeping', 'Skip housekeeping checks')
  .option('--skip-proposal', 'Skip PROPOSAL.md generation')
  .option('--skip-project', 'Skip PROJECT.md generation')
  .option('--dry-run', 'Preview changes without writing')
  .action(async (opts: BundleOpts) => {
    const { runBundle } = await import('./bundle/command');
    const repoRoot = findRepoRoot();
    const config = loadConfig(repoRoot);
    const result = await runBundle({
      repoRoot,
      config,
      skipReadme: opts.skipReadme,
      skipMeta: opts.skipMeta,
      skipHousekeeping: opts.skipHousekeeping,
      skipProposal: opts.skipProposal,
      skipProject: opts.skipProject,
      dryRun: opts.dryRun,
    });
    if (!result.success) process.exitCode = 1;
  });

// --- Housekeeping commands ---

program
  .command('housekeeping')
  .description('Run housekeeping checks')
  .option('--json', 'Output as JSON')
  .option('--debug', 'Enable debug output')
  .option('--emit-docs', 'Regenerate PROPOSAL.md and PROJECT.md after housekeeping')
  .action(async (opts: HousekeepingOpts) => {
    const { runInvariants } = await import('./checks');
    const repoRoot = findRepoRoot();
    const result = await runInvariants({
      repoRoot,
      json: opts.json,
      debug: opts.debug,
    });
    if (!result.ok) process.exitCode = 1;
    if (opts.emitDocs) {
      const { runProposalGen } = await import('./proposal');
      const { runProjectGen } = await import('./project');
      await runProposalGen({ repoRoot, skipValidate: true });
      await runProjectGen({ repoRoot, skipValidate: true });
    }
  });

// --- Register command ---

// --- Meta commands (Capability Truth Ledger) ---
registerMetaCommand(program);

// --- Project commands ---
import { registerProjectCommand } from './project';
registerProjectCommand(program);

// --- Proposal commands ---
import { registerProposalCommand } from './proposal';
registerProposalCommand(program);

// --- Domain commands ---
registerDomainCommand(program);


// --- Tools-docs command (Auto-generate tools documentation) ---
program
  .command('tools-docs')
  .description('Generate tools directory documentation')
  .option('--format <type>', 'Output format: markdown or both', 'both')
  .action(async (opts: ToolsDocsOpts) => {
    const { generateToolsDocs } = await import('./docs/tools-docs');
    const repoRoot = findRepoRoot();

    generateToolsDocs({
      repoRoot,
      format: opts.format === 'markdown' ? 'markdown' : 'both',
    });

    log.success(`\n✅ Generated tools documentation in tools/\n`);
  });

program
  .option('--register', 'Register discovered scripts into registry')
  .option('--register-dry-run', 'Preview register changes without applying')
  .option('--apply', 'Also update package.json scripts');

// Handle --register as a global option
program.hook('preAction', (thisCommand) => {
  const opts = thisCommand.opts();
  if (opts.register) {
    const repoRoot = findRepoRoot();
    registerDiscovered(repoRoot, {
      dryRun: opts.registerDryRun === true,
      apply: opts.apply === true,
    });
    process.exit(0);
  }
});

program.parse(process.argv);
