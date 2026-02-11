import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import fg from 'fast-glob';
import { toPosix, toRelativePosix } from '../utils/paths';
import type { Registry, UngroupedScript } from '../types';

/**
 * Scan the tools/ directory for tool packages not wired into the registry.
 */
export function scanTools(
  repoRoot: string,
  registry: Registry
): UngroupedScript[] {
  const toolsDir = join(repoRoot, 'tools');
  if (!existsSync(toolsDir)) return [];

  const toolDirs: string[] = fg.sync(['tools/*/package.json', 'tools/*/index.ts', 'tools/*/index.js'], {
    cwd: repoRoot,
    absolute: false,
  });

  // Collect all registered cwd paths from the registry
  const registeredPaths = collectRegisteredPaths(registry);

  const ungrouped: UngroupedScript[] = [];
  const seen = new Set<string>();

  for (const toolFile of toolDirs.sort()) {
    const toolDir = toPosix(toolFile).replace(/\/[^/]+$/, '');
    if (seen.has(toolDir)) continue;
    seen.add(toolDir);

    // Skip the CLI tool itself
    if (toolDir === 'tools/afena-cli') continue;

    // Check if this tool is referenced in any registry command
    const isRegistered = registeredPaths.some((p: string) => p.includes(toolDir));
    if (isRegistered) continue;

    // Try to read tool name from package.json
    let toolName = toolDir;
    const pkgPath = join(repoRoot, toolDir, 'package.json');
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
        toolName = pkg.name || toolDir;
      } catch {
        // ignore parse errors
      }
    }

    ungrouped.push({
      source: toolDir,
      suggestedCommand: `afena (tool: ${toolName})`,
      reason: `Tool directory not wired into afena CLI`,
    });
  }

  return ungrouped;
}

/**
 * Scan the scripts/ directory for standalone scripts not referenced by any registry command.
 */
export function scanStandaloneScripts(
  repoRoot: string,
  registry: Registry
): UngroupedScript[] {
  const scriptsDir = join(repoRoot, 'scripts');
  if (!existsSync(scriptsDir)) return [];

  const scriptFiles: string[] = fg.sync(['scripts/*.ts', 'scripts/*.js'], {
    cwd: repoRoot,
    absolute: false,
  });

  const registeredPaths = collectRegisteredPaths(registry);
  const ungrouped: UngroupedScript[] = [];

  for (const scriptFile of scriptFiles.sort()) {
    const posixPath = toPosix(scriptFile);

    // Check if this script is referenced in any registry command
    const isRegistered = registeredPaths.some((p: string) => p.includes(posixPath));
    if (isRegistered) continue;

    ungrouped.push({
      source: posixPath,
      suggestedCommand: suggestFromFilename(posixPath),
      reason: `Standalone script not referenced by any afena command`,
    });
  }

  return ungrouped;
}

function collectRegisteredPaths(registry: Registry): string[] {
  const paths: string[] = [];
  const commands = registry.commands;
  for (const key of Object.keys(commands).sort()) {
    const cmd = commands[key];
    if (cmd.default) {
      paths.push(typeof cmd.default === 'string' ? cmd.default : JSON.stringify(cmd.default));
    }
    const subs = cmd.subcommands ?? {};
    for (const subKey of Object.keys(subs).sort()) {
      const sub = subs[subKey];
      paths.push(typeof sub === 'string' ? sub : JSON.stringify(sub));
    }
  }
  return paths;
}

function suggestFromFilename(filePath: string): string {
  const name = filePath.replace(/^scripts\//, '').replace(/\.(ts|js)$/, '');
  if (name.includes('type') || name.includes('generate')) return 'afena types';
  if (name.includes('doc') || name.includes('readme')) return 'afena docs';
  if (name.includes('guard') || name.includes('check')) return 'afena guard';
  if (name.includes('clean')) return 'afena clean';
  return `afena (script: ${name})`;
}
