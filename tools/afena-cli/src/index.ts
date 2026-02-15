import { Command } from 'commander';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { log } from './utils/logger';
import { findRepoRoot } from './utils/paths';
import { commandExists } from './utils/exec';
import { runRegistryCommand } from './executor/runner';
import { registerDiscovered } from './register';
import { runReadmeCommand } from './generator/readme-engine';
import { registerMetaCommand } from './meta';
import { RegistrySchema, AfenaConfigSchema } from './types';
import type { Registry, AfenaConfig } from './types';
import semver from 'semver';

const pkg = { name: '@afena/cli', version: '0.1.0' };

function loadRegistry(repoRoot: string): Registry {
  const registryPath = join(repoRoot, 'afena.registry.json');
  if (!existsSync(registryPath)) {
    return RegistrySchema.parse({ commands: {} });
  }
  try {
    const raw = readFileSync(registryPath, 'utf-8');
    return RegistrySchema.parse(JSON.parse(raw));
  } catch (err: any) {
    log.warn(`Failed to load registry: ${err.message}`);
    return RegistrySchema.parse({ commands: {} });
  }
}

function loadConfig(repoRoot: string): AfenaConfig {
  const configPath = join(repoRoot, '.afenarc.json');
  if (!existsSync(configPath)) {
    return AfenaConfigSchema.parse({});
  }
  try {
    const raw = readFileSync(configPath, 'utf-8');
    return AfenaConfigSchema.parse(JSON.parse(raw));
  } catch (err: any) {
    log.warn(`Failed to load config: ${err.message}`);
    return AfenaConfigSchema.parse({});
  }
}

const program = new Command();

program
  .name('afena')
  .description('Afena monorepo CLI — unified command interface')
  .version(pkg.version);

// --- Dynamic commands from registry ---

program
  .command('types [subcommand]')
  .description('Type generation commands')
  .allowUnknownOption(true)
  .action(async (subcommand: string | undefined, opts: any, cmd: Command) => {
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
  .action(async (subcommand: string | undefined, opts: any, cmd: Command) => {
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
  .action(async (subcommand: string | undefined, opts: any, cmd: Command) => {
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
  .action(async (subcommand: string | undefined, opts: any, cmd: Command) => {
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
  .action(async (app: string | undefined, opts: any, cmd: Command) => {
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
  .action(async (target: string | undefined, opts: any, cmd: Command) => {
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
      log.warn('No commands registered. Create afena.registry.json or run --register.');
      return;
    }

    log.bold('Registered commands:\n');
    for (const group of Object.keys(commands).sort()) {
      const cmd = commands[group];
      if (cmd.default) {
        const def = typeof cmd.default === 'string' ? cmd.default : `${(cmd.default as any).cmd} ${((cmd.default as any).args ?? []).join(' ')}`;
        log.info(`  ${group} → ${def}`);
      }
      const subs = cmd.subcommands ?? {};
      for (const sub of Object.keys(subs).sort()) {
        const entry = subs[sub];
        const display = typeof entry === 'string' ? entry : `${(entry as any).cmd} ${((entry as any).args ?? []).join(' ')}`;
        log.info(`  ${group}:${sub} → ${display}`);
      }
    }
  });

program
  .command('doctor')
  .description('Check environment (node, pnpm, turbo, git)')
  .action(async () => {
    log.bold('Afena Doctor\n');

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
    const registryExists = existsSync(join(repoRoot, 'afena.registry.json'));
    log.info(`  Registry: ${registryExists ? '✅' : '⚠️  afena.registry.json not found'}`);

    // Config
    const configExists = existsSync(join(repoRoot, '.afenarc.json'));
    log.info(`  Config: ${configExists ? '✅' : '⚠️  .afenarc.json not found (using defaults)'}`);

    log.info('');
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
  .action(async (opts: any) => {
    const repoRoot = findRepoRoot();
    const config = loadConfig(repoRoot);
    const packages = opts.package ? [opts.package] : opts.dir ? [opts.dir] : undefined;
    const result = await runReadmeCommand({
      mode: 'gen',
      repoRoot,
      config,
      ...(packages ? { packages } : {}),
      dryRun: opts.dryRun,
    });
    if (result.failures.length > 0) process.exitCode = 1;
  });

readmeCmd
  .command('sync')
  .description('Update autogen blocks for existing READMEs only')
  .option('--dry-run', 'Preview output without writing files')
  .action(async (opts: any) => {
    const repoRoot = findRepoRoot();
    const config = loadConfig(repoRoot);
    await runReadmeCommand({
      mode: 'sync',
      repoRoot,
      config,
      dryRun: opts.dryRun,
    });
  });

readmeCmd
  .command('check')
  .description('Validate READMEs against Definition of Done (non-zero exit on failure)')
  .action(async () => {
    const repoRoot = findRepoRoot();
    const config = loadConfig(repoRoot);
    const result = await runReadmeCommand({
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
  .option('--fix-readmes', 'Generate missing READMEs (DEPRECATED: use afena readme gen)')
  .option('--since <ref>', 'Only check changes since git ref')
  .action(async (opts: any) => {
    const { execSync } = require('child_process');
    const repoRoot = findRepoRoot();

    // Run discovery
    if (opts.json) {
      const discoveryPath = join(repoRoot, '.afena', 'discovery.json');
      if (existsSync(discoveryPath)) {
        console.log(readFileSync(discoveryPath, 'utf-8'));
      } else {
        log.warn('No discovery.json found. Running discovery first...');
        execSync('node ' + join(__dirname, 'discover.js'), {
          cwd: repoRoot,
          stdio: 'inherit',
          env: { ...process.env, AFENA_VERBOSE: '1' },
        });
        if (existsSync(discoveryPath)) {
          console.log(readFileSync(discoveryPath, 'utf-8'));
        }
      }
    } else {
      execSync('node ' + join(__dirname, 'discover.js'), {
        cwd: repoRoot,
        stdio: 'inherit',
        env: { ...process.env, AFENA_VERBOSE: '1' },
      });
    }

    // --fix-readmes: deprecated compatibility shim
    if (opts.fixReadmes) {
      log.dim('DEPRECATED: --fix-readmes will be removed in a future release. Use: afena readme gen');
      try {
        const config = loadConfig(repoRoot);
        await runReadmeCommand({ mode: 'gen', repoRoot, config });
      } catch (err: any) {
        log.warn(`README generation failed (best-effort): ${err.message}`);
      }
    }
  });

// --- Register command ---

// --- Meta commands (Capability Truth Ledger) ---
registerMetaCommand(program);

program
  .option('--register', 'Register discovered scripts into registry')
  .option('--register-dry-run', 'Preview register changes without applying')
  .option('--apply', 'Also update package.json scripts');

// Handle --register as a global option
program.hook('preAction', async (thisCommand) => {
  const opts = thisCommand.opts();
  if (opts.register) {
    const repoRoot = findRepoRoot();
    await registerDiscovered(repoRoot, {
      dryRun: opts.registerDryRun,
      apply: opts.apply,
    });
    process.exit(0);
  }
});

program.parse(process.argv);
