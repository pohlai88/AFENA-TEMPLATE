import { readFileSync } from 'fs';
import fg from 'fast-glob';
import { toPosix, toRelativePosix } from '../utils/paths';
import type { AfenaConfig, Registry, UngroupedScript, PackageInfo } from '../types';

/**
 * Scan all workspace package.json files and find scripts not registered in the registry.
 */
export function scanScripts(
  repoRoot: string,
  registry: Registry,
  config: AfenaConfig
): { ungrouped: UngroupedScript[]; packages: PackageInfo[] } {
  const { commonScripts, customPrefixes, scanPaths } = config.discovery;
  const ignoreScripts = new Set(registry.ignore.scripts);

  // Collect all registered script targets
  const registeredScripts = collectRegisteredScripts(registry);

  // Find all package.json files
  const pkgGlobs = scanPaths.filter((p: string) => p.endsWith('package.json'));
  const pkgPaths: string[] = fg.sync(pkgGlobs, { cwd: repoRoot, absolute: true });

  const ungrouped: UngroupedScript[] = [];
  const packages: PackageInfo[] = [];

  for (const pkgPath of pkgPaths.sort()) {
    let pkg: Record<string, any>;
    try {
      const raw = readFileSync(pkgPath, 'utf-8');
      pkg = JSON.parse(raw);
    } catch {
      continue;
    }
    const relPath = toRelativePosix(pkgPath, repoRoot);
    const pkgDir = toPosix(relPath.replace('/package.json', ''));

    const info: PackageInfo = {
      name: pkg.name ?? pkgDir,
      path: pkgDir,
      scripts: pkg.scripts ?? {},
      dependencies: pkg.dependencies ?? {},
      devDependencies: pkg.devDependencies ?? {},
      peerDependencies: pkg.peerDependencies ?? {},
    };
    packages.push(info);

    for (const [scriptName, scriptCmd] of Object.entries(info.scripts)) {
      // Skip ignored scripts
      if (ignoreScripts.has(scriptName)) continue;

      // Skip common scripts (build, dev, test, etc.)
      if (commonScripts.includes(scriptName)) continue;

      // Skip lifecycle scripts
      if (scriptName.startsWith('pre') || scriptName.startsWith('post')) continue;

      // Check if this script is already registered
      if (registeredScripts.has(scriptName)) continue;
      if (registeredScripts.has(`pnpm run ${scriptName}`)) continue;

      // Determine if it looks like a custom script
      const isCustom = customPrefixes.some((prefix: string) => scriptName.startsWith(prefix));
      const isUnknown = !commonScripts.includes(scriptName);

      if (isCustom || isUnknown) {
        const suggested = suggestCommand(scriptName);
        ungrouped.push({
          source: relPath,
          currentScript: scriptName,
          suggestedCommand: suggested,
          reason: isCustom
            ? `Custom-prefixed script in ${pkgDir}`
            : `Unregistered script in ${pkgDir}`,
        });
      }
    }
  }

  return { ungrouped, packages };
}

/**
 * Collect all script names/commands that are already registered.
 */
function collectRegisteredScripts(registry: Registry): Set<string> {
  const scripts = new Set<string>();

  const commands = registry.commands;
  for (const key of Object.keys(commands).sort()) {
    const cmd = commands[key];
    if (cmd.default) {
      if (typeof cmd.default === 'string') {
        scripts.add(cmd.default);
        const match = cmd.default.match(/pnpm\s+run\s+(\S+)/);
        if (match) scripts.add(match[1]);
      }
    }
    const subs = cmd.subcommands ?? {};
    for (const subKey of Object.keys(subs).sort()) {
      const sub = subs[subKey]!
      if (typeof sub === 'string') {
        scripts.add(sub);
        const match = sub.match(/pnpm\s+run\s+(\S+)/);
        if (match) scripts.add(match[1]);
      } else {
        const fullCmd = [sub.cmd, ...(sub.args ?? [])].join(' ');
        scripts.add(fullCmd);
      }
    }
  }

  return scripts;
}

/**
 * Suggest an afena command name based on script name patterns.
 */
function suggestCommand(scriptName: string): string {
  if (scriptName.startsWith('type-') || scriptName.startsWith('type:')) return 'afena types';
  if (scriptName.startsWith('docs:') || scriptName.startsWith('doc:')) return 'afena docs';
  if (scriptName.startsWith('gen:') || scriptName.startsWith('generate')) return 'afena types';
  if (scriptName.startsWith('sync:')) return 'afena types';
  if (scriptName.startsWith('guard:')) return 'afena guard';
  if (scriptName.includes('clean')) return 'afena clean';
  if (scriptName.includes('watch')) return 'afena dev';
  return `afena (unclassified: ${scriptName})`;
}
