import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { cosmiconfig } from 'cosmiconfig';

import { canonicalize } from '../capability/canonicalize';
import { hasContentChanged, hasNewWarnings, loadPreviousDiscovery, loadPreviousSignature } from '../capability/diff';
import { scanScripts } from '../capability/script-scanner';
import { computeSignature } from '../capability/signature';
import { scanStandaloneScripts, scanTools } from '../capability/tool-scanner';
import { isVerbose, log } from '../core/logger';
import { safeReadJson } from '../core/parse-json';
import { findRepoRoot } from '../core/paths';
import { scanReadmes } from '../readme/scanner';
import { afendaConfigSchema, RegistrySchema } from '../types';

import type { afendaConfig, DiscoveryOutput, Registry } from '../types';

/**
 * Discovery scanner entry point.
 * Runs on postinstall. Always exits 0. Never breaks installs.
 */
async function main(): Promise<void> {
  try {
    const repoRoot = findRepoRoot();
    const afendaDir = join(repoRoot, '.afenda');

    // Ensure .afenda directory exists
    if (!existsSync(afendaDir)) {
      mkdirSync(afendaDir, { recursive: true });
    }

    // Load config
    const config = await loadConfig(repoRoot);

    // Load registry
    const registry = loadRegistry(repoRoot);

    // Compute signature and check cache
    const currentSignature = computeSignature(repoRoot);
    const previousSignature = loadPreviousSignature(repoRoot);

    if (currentSignature === previousSignature && !isVerbose) {
      log.debug('Signature unchanged, skipping discovery.');
      return;
    }

    // Run scanners
    const { ungrouped: scriptUngrouped } = scanScripts(repoRoot, registry, config);
    const toolUngrouped = scanTools(repoRoot, registry);
    const standaloneUngrouped = scanStandaloneScripts(repoRoot, registry);
    const { missing: missingReadmes, stale: staleReadmes } = scanReadmes(repoRoot, config);

    // Merge + deterministic sort
    const ungrouped = [...scriptUngrouped, ...toolUngrouped, ...standaloneUngrouped].sort(
      (a, b) => a.source.localeCompare(b.source)
    );
    const missingSorted = [...missingReadmes].sort((a, b) => a.localeCompare(b));
    const staleSorted = [...staleReadmes].sort((a, b) => a.localeCompare(b));

    const output: DiscoveryOutput = {
      generatedAt: new Date().toISOString(),
      signature: currentSignature,
      contentHash: '',
      ungrouped,
      missingReadmes: missingSorted,
      staleReadmes: staleSorted,
    };

    // Canonicalize (deterministic sort + compute contentHash)
    const canonical = canonicalize(output);

    // Check if content actually changed
    const previous = loadPreviousDiscovery(repoRoot);
    const contentChanged = hasContentChanged(canonical, previous);
    const newWarnings = hasNewWarnings(canonical, previous);

    // Write discovery.json only if content changed
    if (contentChanged) {
      writeFileSync(
        join(afendaDir, 'discovery.json'),
        `${JSON.stringify(canonical, null, 2)  }\n`
      );
    }

    // Always update signature
    writeFileSync(join(afendaDir, 'last-signature'), currentSignature);

    // Print report only if new warnings or verbose
    if (newWarnings || isVerbose) {
      printReport(canonical, registry);
    }
  } catch (err: unknown) {
    // Never break installs — write error and exit 0
    const msg = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    try {
      const repoRoot = findRepoRoot();
      const afendaDir = join(repoRoot, '.afenda');
      if (!existsSync(afendaDir)) {
        mkdirSync(afendaDir, { recursive: true });
      }
      writeFileSync(
        join(afendaDir, 'discovery.error.json'),
        `${JSON.stringify({ error: msg, stack, timestamp: new Date().toISOString() }, null, 2)}\n`
      );
    } catch {
      // If we can't even write the error, just silently exit
    }
    log.debug(`Discovery failed: ${msg}`);
  }
}

async function loadConfig(repoRoot: string): Promise<afendaConfig> {
  try {
    const explorer = cosmiconfig('afenda');
    const result = await explorer.search(repoRoot);
    if (result?.config) {
      return afendaConfigSchema.parse(result.config);
    }
  } catch (err: unknown) {
    log.debug(`Config load error: ${err instanceof Error ? err.message : String(err)}`);
  }
  return afendaConfigSchema.parse({});
}

function loadRegistry(repoRoot: string): Registry {
  if (!existsSync(join(repoRoot, 'afenda.registry.json'))) {
    return RegistrySchema.parse({ commands: {} });
  }
  try {
    return safeReadJson(repoRoot, ['afenda.registry.json'], RegistrySchema);
  } catch (err: unknown) {
    log.debug(`Registry load error: ${err instanceof Error ? err.message : String(err)}`);
    return RegistrySchema.parse({ commands: {} });
  }
}

function printReport(discovery: DiscoveryOutput, registry: Registry): void {
  const registeredCount = countRegistered(registry);
  const ungroupedCount = discovery.ungrouped.length;
  const missingCount = discovery.missingReadmes.length;

  const lines: string[] = [
    `🔍 afenda CLI Discovery Report`,
    ``,
    `✅ Registered: ${registeredCount}    ⚠️  Ungrouped: ${ungroupedCount}   📄 No README: ${missingCount}`,
  ];

  if (ungroupedCount > 0) {
    lines.push(``);
    lines.push(`Ungrouped:`);
    for (const u of discovery.ungrouped) {
      const scriptInfo = u.currentScript ? ` (${u.currentScript})` : '';
      lines.push(` • ${u.source}${scriptInfo} → ${u.suggestedCommand}`);
    }
  }

  if (missingCount > 0) {
    lines.push(``);
    lines.push(`Missing READMEs:`);
    for (const m of discovery.missingReadmes) {
      lines.push(` • ${m}`);
    }
  }

  if (discovery.staleReadmes.length > 0) {
    lines.push(``);
    lines.push(`Stale READMEs:`);
    for (const s of discovery.staleReadmes) {
      lines.push(` • ${s}`);
    }
  }

  if (ungroupedCount > 0 || missingCount > 0) {
    lines.push(``);
    if (missingCount > 0) lines.push(`pnpm afenda discover --fix-readmes`);
    if (ungroupedCount > 0) lines.push(`pnpm afenda --register --dry-run`);
  }

  log.box(lines);
}

function countRegistered(registry: Registry): number {
  let count = 0;
  const commands = registry.commands;
  for (const key of Object.keys(commands).sort()) {
    const cmd = commands[key];
    if (!cmd) continue;
    if (cmd.default) count++;
    const subs = cmd.subcommands ?? {};
    count += Object.keys(subs).length;
  }
  return count;
}

void main();
