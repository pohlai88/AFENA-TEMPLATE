/**
 * L2 AST Scanner — ts-morph fallback for @capability JSDoc tags.
 *
 * Used when no `export const CAPABILITIES` is found in a surface file,
 * or when --deep flag is passed to the CLI.
 *
 * Scans for `@capability <key>` JSDoc tags on exported functions.
 */

import fg from 'fast-glob';
import { Project } from 'ts-morph';

export interface AstCapability {
  file: string;
  functionName: string;
  key: string;
}

const SURFACE_GLOBS = [
  'apps/web/app/actions/**/*.ts',
  'apps/web/app/api/**/route.ts',
  'packages/*/src/**/handlers/*.ts',
  'packages/*/src/engine.ts',
];

const CAPABILITY_TAG_REGEX = /@capability\s+([\w.]+)/;

/**
 * Scan surface files for @capability JSDoc tags using ts-morph AST.
 */
export async function scanAstCapabilities(
  repoRoot: string,
): Promise<AstCapability[]> {
  const results: AstCapability[] = [];

  const files = await fg(SURFACE_GLOBS, {
    cwd: repoRoot,
    absolute: true,
  });

  if (files.length === 0) return results;

  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    skipFileDependencyResolution: true,
    compilerOptions: {
      allowJs: true,
      noEmit: true,
    },
  });

  for (const absPath of files) {
    const sourceFile = project.addSourceFileAtPath(absPath);
    const relPath = absPath
      .replace(/\\/g, '/')
      .replace(`${repoRoot.replace(/\\/g, '/')  }/`, '');

    // Scan exported function declarations
    for (const fn of sourceFile.getFunctions()) {
      if (!fn.isExported()) continue;

      const jsDocs = fn.getJsDocs();
      for (const doc of jsDocs) {
        const text = doc.getFullText();
        const match = text.match(CAPABILITY_TAG_REGEX);
        if (match) {
          results.push({
            file: relPath,
            functionName: fn.getName() ?? '<anonymous>',
            key: match[1],
          });
        }
      }
    }

    // Scan exported variable declarations (arrow functions with JSDoc)
    for (const stmt of sourceFile.getVariableStatements()) {
      if (!stmt.isExported()) continue;

      const jsDocs = stmt.getJsDocs();
      for (const doc of jsDocs) {
        const text = doc.getFullText();
        const match = text.match(CAPABILITY_TAG_REGEX);
        if (match) {
          for (const decl of stmt.getDeclarations()) {
            results.push({
              file: relPath,
              functionName: decl.getName(),
              key: match[1],
            });
          }
        }
      }
    }

    // Clean up to avoid memory bloat
    project.removeSourceFile(sourceFile);
  }

  return results;
}
