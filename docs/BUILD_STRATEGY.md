# Build Strategy

This document explains the build configuration strategy for packages in the AFENDA-NEXUS monorepo. Understanding when to compile vs. export source is critical for maintaining fast development cycles while ensuring production-ready outputs.

## Table of Contents

- [Overview](#overview)
- [Build Approaches](#build-approaches)
- [Package Categories](#package-categories)
- [Configuration Details](#configuration-details)
- [Development Workflow](#development-workflow)
- [Publishing Workflow](#publishing-workflow)
- [Migration Guide](#migration-guide)

---

## Overview

The monorepo uses a **hybrid build strategy**:

- **Compiled packages** → Built with `tsup` to `dist/` (CJS + ESM)
- **Source packages** → Export `src/index.ts` directly
- **Config packages** → Re-export as-is (JSON, JS)

This hybrid approach balances:

- ✅ **Fast iteration** - Source packages skip build steps
- ✅ **External compatibility** - Compiled packages work outside monorepo
- ✅ **Type safety** - Both approaches preserve TypeScript types
- ✅ **Flexibility** - Choose the right tool for each package

---

## Build Approaches

### Compiled Packages

**When to use**:

- Package may be consumed outside the monorepo
- Package is published to npm
- Package contains non-TypeScript assets (CSS, images)
- Package needs tree-shaking optimization

**Characteristics**:

- Built with `tsup` (or similar)
- Outputs to `dist/` directory
- Generates `.js`, `.mjs`, `.d.ts` files
- `package.json` points to `dist/` for main/module/types
- Slower iteration (requires build step)

**Example**: `canon`, `ui`, `migration`

---

### Source Packages

**When to use**:

- Package is internal-only (consumed only within monorepo)
- Consumers have TypeScript compilation (apps, tools)
- Fast development iteration is priority
- Package is simple (TypeScript only, no assets)

**Characteristics**:

- No build step required
- `package.json` points to `src/index.ts`
- TypeScript compilation happens at consumer level
- Faster development (no rebuild on change)
- Requires consumers to handle TypeScript

**Example**: `crud`, `workflow`, `database`, `accounting`, `inventory`

---

### Configuration Packages

**When to use**:

- Package exports config for tools (ESLint, TypeScript)
- Consumers load config directly

**Characteristics**:

- No build step
- Export `.js` or `.json` files
- Consumed by tooling, not code

**Example**: `eslint-config`, `typescript-config`

---

## Package Categories

### Layer 0: Configuration

**Build Approach**: Config (re-export as-is)

| Package             | Main Entry  | Rationale                |
| ------------------- | ----------- | ------------------------ |
| `eslint-config`     | `base.js`   | ESLint loads JS directly |
| `typescript-config` | `base.json` | TypeScript extends JSON  |

---

### Layer 1: Foundation

| Package    | Build Approach | Main Entry      | Rationale                                                              |
| ---------- | -------------- | --------------- | ---------------------------------------------------------------------- |
| `canon`    | **Compiled**   | `dist/index.js` | External consumption (types may be imported by ERPNext adapter, tools) |
| `database` | **Source**     | `src/index.ts`  | Internal only; apps compile at build time                              |
| `logger`   | **Source**     | `src/index.ts`  | Internal only; simple TypeScript module                                |
| `ui`       | **Compiled**   | `dist/index.js` | React components; may publish to npm; has CSS/assets                   |

---

### Layer 2: Domain Services

| Package        | Build Approach | Main Entry      | Rationale                        |
| -------------- | -------------- | --------------- | -------------------------------- |
| `workflow`     | **Source**     | `src/index.ts`  | Internal only; consumed by CRUD  |
| `advisory`     | **Source**     | `src/index.ts`  | Internal only; analytics engine  |
| `search`       | **Source**     | `src/index.ts`  | Internal only; search indexer    |
| `migration`    | **Compiled**   | `dist/index.js` | CLI tool; may be used standalone |
| `accounting`   | **Source**     | `src/index.ts`  | Internal only; domain services   |
| `inventory`    | **Source**     | `src/index.ts`  | Internal only; domain services   |
| `crm`          | **Source**     | `src/index.ts`  | Internal only; domain services   |
| `intercompany` | **Source**     | `src/index.ts`  | Internal only; domain services   |

---

### Layer 3: Application

| Package | Build Approach | Main Entry     | Rationale                              |
| ------- | -------------- | -------------- | -------------------------------------- |
| `crud`  | **Source**     | `src/index.ts` | Internal only; consumed by Next.js app |

---

## Configuration Details

### Compiled Package Configuration

**package.json**:

```json
{
  "name": "afenda-canon",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch"
  },
  "devDependencies": {
    "tsup": "catalog:"
  }
}
```

**tsconfig.json**:

```json
{
  "extends": "@afenda/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

**tsconfig.build.json** (for build-time compilation):

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true
  },
  "exclude": ["**/*.test.ts", "**/*.spec.ts", "vitest.config.ts"]
}
```

**tsup.config.ts**:

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true, // Generate .d.ts files
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
});
```

---

### Source Package Configuration

**package.json**:

```json
{
  "name": "afenda-crud",
  "version": "0.1.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx"
  }
}
```

**tsconfig.json**:

```json
{
  "extends": "@afenda/typescript-config/base.json",
  "compilerOptions": {
    "rootDir": "./src",
    "noEmit": true // Source packages don't emit
  },
  "include": ["src/**/*"]
}
```

**Note**: No `tsup.config.ts` or `tsconfig.build.json` needed.

---

## Development Workflow

### For Compiled Packages

**Initial setup**:

```bash
cd packages/canon
pnpm install
pnpm build
```

**During development**:

```bash
pnpm dev    # tsup --watch (rebuilds on change)
```

**Before commit**:

```bash
pnpm build
pnpm type-check
pnpm lint
```

---

### For Source Packages

**Initial setup**:

```bash
cd packages/crud
pnpm install
# No build step needed!
```

**During development**:

```typescript
// Edit src/index.ts
// Changes are immediately available to consumers
```

**Before commit**:

```bash
pnpm type-check
pnpm lint
```

---

### Workspace-Level Build

**Build all compiled packages**:

```bash
pnpm build    # From monorepo root
```

This runs `turbo run build`, which:

1. Detects packages with `build` script
2. Builds in dependency order
3. Caches outputs for speed

**Turbo configuration** (`turbo.json`):

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

---

## Publishing Workflow

### Internal Packages (Not Published)

Source packages remain internal:

- `crud`, `workflow`, `accounting`, `inventory`, `crm`, `intercompany`, `database`, `logger`

**Never published to npm**. Consumed only within monorepo via `workspace:*` protocol.

---

### External Packages (May be Published)

Compiled packages can be published:

- `canon` - Type definitions for external adapters
- `ui` - Component library for other projects
- `migration` - Standalone CLI tool

**Publishing checklist**:

1. Update version in `package.json`
2. Run `pnpm build` to generate `dist/`
3. Test in isolation: `npm pack` → Install tarball elsewhere
4. Publish: `npm publish` (or `pnpm publish`)
5. Tag release in git

**Example**:

```bash
cd packages/canon
pnpm version patch    # 0.1.0 → 0.1.1
pnpm build
pnpm publish --access public
git tag canon-v0.1.1
git push --tags
```

---

## Migration Guide

### Converting Source Package to Compiled

If a source package needs to be published:

1. **Add build configuration**:

   ```bash
   cd packages/my-package
   touch tsup.config.ts tsconfig.build.json
   ```

2. **Update tsup.config.ts**:

   ```typescript
   import { defineConfig } from 'tsup';

   export default defineConfig({
     entry: ['src/index.ts'],
     format: ['cjs', 'esm'],
     dts: true,
     sourcemap: true,
     clean: true,
   });
   ```

3. **Update package.json**:

   ```json
   {
     "main": "./dist/index.js",
     "module": "./dist/index.mjs",
     "types": "./dist/index.d.ts",
     "exports": {
       ".": {
         "types": "./dist/index.d.ts",
         "import": "./dist/index.mjs",
         "require": "./dist/index.js"
       }
     },
     "scripts": {
       "build": "tsup",
       "dev": "tsup --watch"
     }
   }
   ```

4. **Add tsup to devDependencies**:

   ```bash
   pnpm add -D tsup
   ```

5. **Build and test**:

   ```bash
   pnpm build
   ls dist/    # Verify outputs
   ```

6. **Update consumers** (if needed):
   - Consumers using TypeScript: No changes needed
   - Consumers using CommonJS: Update imports

---

### Converting Compiled Package to Source

If an internal-only package doesn't need compilation:

1. **Update package.json**:

   ```json
   {
     "main": "./src/index.ts",
     "types": "./src/index.ts"
   }
   ```

2. **Remove build scripts**:

   ```bash
   rm tsup.config.ts tsconfig.build.json
   ```

3. **Update tsconfig.json**:

   ```json
   {
     "compilerOptions": {
       "noEmit": true
     }
   }
   ```

4. **Remove dist/ from git**:

   ```bash
   git rm -r dist/
   echo "dist/" >> .gitignore
   ```

5. **Verify consumers still work**:
   ```bash
   cd ../../apps/web
   pnpm type-check    # Should pass
   ```

---

## Performance Considerations

### Build Times

**Compiled packages** (2-5s per package):

- `canon`: ~2s (types only, no heavy logic)
- `ui`: ~5s (React components, tree-shaking)
- `migration`: ~3s (CLI tools)

**Source packages** (0s):

- Instant availability
- Compilation happens at app build time (Next.js)

**Trade-off**: Faster package iteration vs. slower app builds

---

### App Build

**Next.js app** (`apps/web`):

- Compiles all source packages at build time
- Next.js handles TypeScript transpilation
- Tree-shaking works with both compiled and source packages

**Initial build**: ~30s (TypeScript compilation)
**Incremental build**: ~5s (only changed files)

---

## Troubleshooting

### "Cannot find module" errors

**Problem**: Importing from compiled package before it's built

**Solution**:

```bash
pnpm build    # Build all packages
# OR
cd packages/canon && pnpm build    # Build specific package
```

---

### Type errors in consuming packages

**Problem**: Source package changes aren't reflected in app

**Solution**: Restart TypeScript server in IDE:

- VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
- IntelliJ: `Cmd+Shift+A` → "Restart TypeScript Service"

---

### Slow development iteration

**Problem**: Compiled package rebuilds on every change

**Solution 1**: Use watch mode:

```bash
pnpm dev    # tsup --watch
```

**Solution 2**: Temporarily switch to source exports during development:

```json
// package.json (temporary)
"main": "./src/index.ts"
```

Remember to switch back before committing!

---

### Turbo output disappears in CI/local debugging

**Problem**: When running `pnpm build`, `pnpm test`, or other Turbo commands, the output disappears after completion, making it difficult to debug failures in CI or capture logs.

**Cause**: Turbo's TUI (Text User Interface) mode uses the terminal's **alternate buffer**. This is a separate screen buffer that gets cleared when the command completes, leaving no trace in your scrollback history.

**Benefits of TUI**:

- ✅ Clean terminal history
- ✅ Better local development experience
- ✅ Real-time task visualization

**Drawbacks of TUI**:

- ❌ Output not captured in CI logs
- ❌ Can't scroll back to see errors
- ❌ Harder to debug build failures

**Solution 1 - CI environments** (recommended, already configured):
All CI workflows automatically set `TURBO_UI=stream` to disable the alternate buffer:

```yaml
env:
  TURBO_UI: stream # Ensures output is captured
```

**Solution 2 - Local debugging**:
Override the UI mode when you need to capture output:

```bash
# Disable TUI for this run
TURBO_UI=stream pnpm build

# Or use --output-logs flag
pnpm build --output-logs=full

# On Windows PowerShell
$env:TURBO_UI="stream"; pnpm build
```

**Solution 3 - Permanent local change** (not recommended):
Edit `turbo.json` to change the default UI mode:

```json
{
  "ui": "stream" // or "tui" (default)
}
```

**Note**: The monorepo uses `"ui": "tui"` by default for better local DX. CI workflows override this automatically.

---

## Summary

| Aspect              | Compiled Packages         | Source Packages            |
| ------------------- | ------------------------- | -------------------------- |
| **Build step**      | Required (tsup)           | None                       |
| **Main entry**      | `dist/index.js`           | `src/index.ts`             |
| **Iteration speed** | Slower (requires rebuild) | Instant                    |
| **External use**    | ✅ Yes (publishable)      | ❌ No (monorepo only)      |
| **Tree-shaking**    | ✅ Pre-optimized          | ✅ Consumer handles        |
| **Type safety**     | ✅ .d.ts files            | ✅ Source .ts files        |
| **Examples**        | canon, ui, migration      | crud, workflow, accounting |

---

## Related Documentation

- [Architecture Guide](../ARCHITECTURE.md)
- [Package Governance](../packages/GOVERNANCE.md)
- [Coding Standards](CODING_STANDARDS.md)

---

**Last Updated**: February 17, 2026
