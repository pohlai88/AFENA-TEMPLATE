import { existsSync, readFileSync } from 'node:fs';

import { z } from 'zod';

import { safeReadFile } from './fs-safe';
import { absolutePathToSegments, resolveWithin } from './path-validation';

export function parseJson<T extends z.ZodTypeAny>(
  raw: string,
  schema: T,
): z.infer<T> {
  const data: unknown = JSON.parse(raw);
  return schema.parse(data) as z.infer<T>;
}

/** Read and parse JSON from a path within root. 1-liner for typed call sites. */
export function safeReadJson<T extends z.ZodTypeAny>(
  root: string,
  segments: string[],
  schema: T,
): z.infer<T> {
  const raw = safeReadFile(root, ...segments);
  return parseJson(raw, schema);
}

/** Read and parse JSON from an absolute path within root. Use with fast-glob absolute paths. */
export function safeReadJsonAbsolute<T extends z.ZodTypeAny>(
  root: string,
  absolutePath: string,
  schema: T,
): z.infer<T> {
  const segments = absolutePathToSegments(root, absolutePath);
  return safeReadJson(root, segments, schema);
}

/** Read and parse JSON if file exists; returns null otherwise. */
export function safeReadJsonIfExists<T extends z.ZodTypeAny>(
  root: string,
  segments: string[],
  schema: T,
): z.infer<T> | null {
  const p = resolveWithin(root, ...segments);
  if (!existsSync(p)) return null;
  return parseJson(readFileSync(p, 'utf-8'), schema);
}

/** package.json schema — passthrough for unknown extras. */
export const PackageJsonSchema = z
  .object({
    name: z.string().optional(),
    version: z.string().optional(),
    description: z.string().optional(),
    private: z.boolean().optional(),
    dependencies: z.record(z.string(), z.string()).optional(),
    devDependencies: z.record(z.string(), z.string()).optional(),
    peerDependencies: z.record(z.string(), z.string()).optional(),
    scripts: z.record(z.string(), z.string()).optional(),
    bin: z.union([z.string(), z.record(z.string(), z.string())]).optional(),
    exports: z.unknown().optional(),
    main: z.string().optional(),
    types: z.string().optional(),
    module: z.string().optional(),
  })
  .passthrough();

export type PackageJson = z.infer<typeof PackageJsonSchema>;
