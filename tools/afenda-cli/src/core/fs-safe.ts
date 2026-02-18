import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path, { dirname } from 'node:path';

import { resolveWithin } from './path-validation';

export function safeExists(root: string, ...segments: string[]): boolean {
  const p = resolveWithin(root, ...segments);
   
  return existsSync(p);
}

export function safeReadFile(root: string, ...segments: string[]): string {
  const p = resolveWithin(root, ...segments);
   
  return readFileSync(p, 'utf-8');
}

export function safeWriteFile(
  root: string,
  content: string,
  ...segments: string[]
): void {
  const p = resolveWithin(root, ...segments);
   
  writeFileSync(p, content, 'utf-8');
}

export function safeWriteFileBinary(
  root: string,
  content: Buffer | string,
  ...segments: string[]
): void {
  const p = resolveWithin(root, ...segments);
   
  writeFileSync(p, content);
}

export function safeMkdir(root: string, ...segments: string[]): void {
  const p = resolveWithin(root, ...segments);
   
  mkdirSync(p, { recursive: true });
}

export function safeMkdirForFile(root: string, ...fileSegments: string[]): void {
  const p = resolveWithin(root, ...fileSegments);
  const dir = dirname(p);
   
  mkdirSync(dir, { recursive: true });
}

export function safeReadDir(root: string, ...segments: string[]): string[] {
  const p = resolveWithin(root, ...segments);
   
  return readdirSync(p);
}

export function safeStat(root: string, ...segments: string[]): ReturnType<typeof statSync> {
  const p = resolveWithin(root, ...segments);
   
  return statSync(p);
}

/**
 * Stat a path that must be within root. Use when you have an absolute path from e.g. fast-glob.
 */
export function safeStatAbsolute(root: string, absolutePath: string): ReturnType<typeof statSync> {
  const rootAbs = path.resolve(root);
  const targetAbs = path.resolve(absolutePath);
  const rel = path.relative(rootAbs, targetAbs);
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Path escape detected: ${targetAbs}`);
  }
  return statSync(targetAbs);
}
