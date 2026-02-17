import { z } from 'zod';

// --- Execution Model DSL ---

export const CommandEntryObjectSchema = z
  .object({
    cmd: z.string().min(1),
    args: z.array(z.string()).default([]),
    cwd: z.string().default('.'),
    env: z.record(z.string(), z.string()).optional(),
    allowFail: z.boolean().default(false),

    // Resolve output -> { stdio, parseJson }
    output: z.enum(['inherit', 'piped', 'json']).default('inherit'),

    // For object form, allow explicit shell usage
    shell: z.boolean().default(false),
  })
  .strict();

export const CommandEntrySchema = z.union([z.string().min(1), CommandEntryObjectSchema]);

export type CommandEntryObject = z.infer<typeof CommandEntryObjectSchema>;
export type CommandEntry = z.infer<typeof CommandEntrySchema>;

// --- Registry Schema ---

const GuardName = z.enum(['deps', 'versions', 'size']);
const Key = z.string().regex(/^[a-z][a-z0-9-]*$/);

export const RegistryCommandSchema = z
  .object({
    default: CommandEntrySchema.optional(),
    subcommands: z.record(Key, CommandEntrySchema).optional(),
  })
  .strict();

export const RegistrySchema = z
  .object({
    $schema: z.string().optional(),
    commands: z.record(Key, RegistryCommandSchema),
    ignore: z
      .object({
        scripts: z.array(z.string()).default([]),
      })
      .strict()
      .default({ scripts: [] }),
  })
  .strict();

export type RegistryCommand = z.infer<typeof RegistryCommandSchema>;
export type Registry = z.infer<typeof RegistrySchema>;

// --- Config Schema (.afenarc.json) ---

export const AfenaConfigSchema = z
  .object({
    watchPatterns: z.record(z.string(), z.array(z.string())).default({}),
    guardrails: z
      .object({
        enabled: z.array(GuardName).default([]),
        warnOnly: z.boolean().default(true),
      })
      .strict()
      .default({ enabled: [], warnOnly: true }),

    discovery: z
      .object({
        scanPaths: z
          .array(z.string())
          .default([
            'apps/*/package.json',
            'packages/*/package.json',
            'tools/*',
            'scripts/*',
          ]),
        verbose: z.boolean().default(false),
        staleThresholdSeconds: z.number().int().min(1).default(60),
        commonScripts: z
          .array(z.string())
          .default([
            'test',
            'build',
            'dev',
            'clean',
            'start',
            'preinstall',
            'postinstall',
            'prepare',
          ]),
        customPrefixes: z
          .array(z.string())
          .default(['type-', 'docs:', 'gen:', 'sync:', 'guard:']),
      })
      .strict()
      .default({
        scanPaths: [
          'apps/*/package.json',
          'packages/*/package.json',
          'tools/*',
          'scripts/*',
        ],
        verbose: false,
        staleThresholdSeconds: 60,
        commonScripts: [
          'test',
          'build',
          'dev',
          'clean',
          'start',
          'preinstall',
          'postinstall',
          'prepare',
        ],
        customPrefixes: ['type-', 'docs:', 'gen:', 'sync:', 'guard:'],
      }),

    docs: z
      .object({
        readme: z
          .object({
            ignore: z.array(z.string()).default([]),
            required: z.array(z.string()).default([]),
          })
          .strict()
          .default({ ignore: [], required: [] }),
      })
      .strict()
      .default({ readme: { ignore: [], required: [] } }),
  })
  .strict();

export type AfenaConfig = z.infer<typeof AfenaConfigSchema>;

// --- Discovery Output Schema ---

export const UngroupedScriptSchema = z
  .object({
    source: z.string().min(1),
    currentScript: z.string().optional(),
    suggestedCommand: z.string().min(1),
    reason: z.string().min(1),
  })
  .strict();

export const DiscoveryOutputSchema = z
  .object({
    generatedAt: z.string().optional(),
    signature: z.string().min(8),
    contentHash: z.string().regex(/^sha256:[a-f0-9]{64}$/),
    ungrouped: z.array(UngroupedScriptSchema).default([]),
    missingReadmes: z.array(z.string()).default([]),
    staleReadmes: z.array(z.string()).default([]),
  })
  .strict();

export type UngroupedScript = z.infer<typeof UngroupedScriptSchema>;
export type DiscoveryOutput = z.infer<typeof DiscoveryOutputSchema>;

// --- Resolved Execution Params ---

export interface ResolvedExecParams {
  cmd: string;
  args: string[];
  cwd: string;
  env?: Record<string, string>;
  // keep your output mode; resolver maps it to execa stdio + parseJson
  output: 'inherit' | 'piped' | 'json';
  shell: boolean;
}

// --- Package Info ---

export interface PackageInfo {
  name: string;
  path: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
}

// --- README Canon Model ---

export const PackageType = z.enum(['ui', 'config', 'library', 'app', 'tool']);

export const ReadmeCanonExportSchema = z
  .object({
    subpath: z.string(),
    conditions: z.record(z.string(), z.string()).default({}),
  })
  .strict();

export const ReadmeCanonModelSchema = z
  .object({
    identity: z
      .object({
        name: z.string(),
        version: z.string().optional(),
        description: z.string().default(''),
        packageType: PackageType,
        private: z.boolean().default(true),
        relativePath: z.string(),
      })
      .strict(),
    install: z
      .object({
        workspace: z.boolean().default(true),
        peerDeps: z.array(z.string()).default([]),
      })
      .strict(),
    binNames: z.array(z.string()).default([]),
    exports: z.array(ReadmeCanonExportSchema).default([]),
    sourceFiles: z.array(z.string()).default([]),
    scripts: z.record(z.string(), z.string()).default({}),
    dependencies: z.record(z.string(), z.string()).default({}),
    devDependencies: z.record(z.string(), z.string()).default({}),
    peerDependencies: z.record(z.string(), z.string()).default({}),
    relatedPackages: z.array(z.string()).default([]),
    structure: z
      .object({
        hasTests: z.boolean(),
        hasDocs: z.boolean(),
        subdirectories: z.array(z.string()),
        mainModules: z.array(z.string()),
        isEmpty: z.boolean(),
      })
      .optional(),
    keyExports: z.array(z.string()).default([]),
  })
  .strict();

export type ReadmeCanonModel = z.infer<typeof ReadmeCanonModelSchema>;
export type ReadmeCanonExport = z.infer<typeof ReadmeCanonExportSchema>;
