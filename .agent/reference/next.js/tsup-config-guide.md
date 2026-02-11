# TSUP Configuration Guide
@doc-version: 8.3.5
@last-updated: 2026-02-10

## What is TSUP?

TSUP is a zero-config TypeScript bundler powered by esbuild. It's designed to bundle TypeScript libraries quickly with minimal configuration. Perfect for building shared packages in monorepos.

## Basic Configuration

### Simple Setup

```ts filename="tsup.config.ts"
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
})
```

This creates:
- `dist/index.js` (ESM)
- `dist/index.cjs` (CommonJS)
- `dist/index.d.ts` (TypeScript definitions)

## Configuration Options Explained

### Entry Points

```ts
entry: {
  lib: 'src/index.ts',
  plugin: 'src/plugin.ts',
  colors: 'src/compat/colors.ts',
}
```

**What it does:** Defines input files to bundle
**Output:** Creates separate bundles for each entry
- `dist/lib.js`, `dist/lib.d.ts`
- `dist/plugin.js`, `dist/plugin.d.ts`
- `dist/colors.js`, `dist/colors.d.ts`

**Use case:** Multiple entry points for different features

### Format

```ts
format: ['esm', 'cjs']
```

**Options:**
- `'esm'` - ES Modules (modern, tree-shakeable)
- `'cjs'` - CommonJS (Node.js compatibility)
- `'iife'` - Immediately Invoked Function Expression (browser)

**Why both ESM and CJS?**
- ESM: Modern bundlers (Vite, Next.js, Webpack 5+)
- CJS: Legacy Node.js, older tools

### DTS (Declaration Files)

```ts
dts: true
```

**What it does:** Generates TypeScript declaration files (`.d.ts`)
**Why important:** Enables TypeScript autocomplete and type checking for consumers

**Advanced options:**
```ts
dts: {
  resolve: true,  // Resolve external types
  entry: 'src/index.ts',  // Specific entry for types
  compilerOptions: {
    // Override tsconfig.json
  }
}
```

### Minify

```ts
minify: true
```

**What it does:** Minifies output using esbuild
**Result:** Smaller bundle size, faster downloads
**Trade-off:** Harder to debug (use source maps)

### Clean

```ts
clean: true
```

**What it does:** Removes `dist` folder before building
**Why useful:** Prevents stale files from previous builds

### Define

```ts
define: {
  'process.env.NODE_ENV': JSON.stringify('production'),
  'process.env.FEATURES_ENV': JSON.stringify('insiders'),
}
```

**What it does:** Replaces variables at build time
**Example:**
```ts
// Source code
if (process.env.FEATURES_ENV === 'insiders') {
  enableBetaFeatures()
}

// After build (dead code eliminated)
if (true) {
  enableBetaFeatures()
}
```

### External

```ts
external: ['react', 'react-dom', 'next']
```

**What it does:** Excludes packages from bundle
**Why:** Peer dependencies shouldn't be bundled
**Result:** Smaller bundle, avoids duplicate dependencies

### Source Maps

```ts
sourcemap: true
```

**Options:**
- `true` - Generate source maps
- `'inline'` - Inline source maps in bundle
- `false` - No source maps

**Why useful:** Debug minified code in production

### Target

```ts
target: 'es2020'
```

**What it does:** Sets JavaScript target version
**Options:** `'es2015'`, `'es2020'`, `'esnext'`, `'node16'`

### Platform

```ts
platform: 'node'
```

**Options:**
- `'node'` - Node.js environment
- `'browser'` - Browser environment
- `'neutral'` - Universal code

## Example Configuration Explained

Let's break down the configuration you shared:

```ts
import { defineConfig } from 'tsup'

export default defineConfig([
  // ESM Build
  {
    format: ['esm'],
    minify: true,
    dts: true,
    entry: {
      lib: 'src/index.ts',
      plugin: 'src/plugin.ts',
      colors: 'src/compat/colors.ts',
      'default-theme': 'src/compat/default-theme.ts',
      'flatten-color-palette': 'src/compat/flatten-color-palette.ts',
    },
    define: {
      'process.env.FEATURES_ENV': JSON.stringify(process.env.FEATURES_ENV ?? 'insiders'),
    },
  },
  // CommonJS Build
  {
    format: ['cjs'],
    minify: true,
    dts: true,
    entry: {
      plugin: 'src/plugin.cts',
      lib: 'src/index.cts',
      colors: 'src/compat/colors.cts',
      'default-theme': 'src/compat/default-theme.cts',
      'flatten-color-palette': 'src/compat/flatten-color-palette.cts',
    },
    define: {
      'process.env.FEATURES_ENV': JSON.stringify(process.env.FEATURES_ENV ?? 'insiders'),
    },
  },
])
```

### Why Two Separate Configs?

**Dual Package Hazard Prevention:**
- Separate `.ts` files for ESM
- Separate `.cts` files for CJS
- Ensures correct module resolution

**Output Structure:**
```
dist/
├── lib.js          # ESM
├── lib.cjs         # CommonJS
├── lib.d.ts        # Types
├── plugin.js       # ESM
├── plugin.cjs      # CommonJS
├── plugin.d.ts     # Types
└── ...
```

### Entry Points Explained

1. **`lib`** - Main library entry point
2. **`plugin`** - Plugin system (e.g., Tailwind plugin)
3. **`colors`** - Color utilities (backward compatibility)
4. **`default-theme`** - Default theme configuration
5. **`flatten-color-palette`** - Color palette utilities

### Define Usage

```ts
define: {
  'process.env.FEATURES_ENV': JSON.stringify(process.env.FEATURES_ENV ?? 'insiders'),
}
```

**Purpose:** Feature flags for different builds
- `'insiders'` - Beta features enabled
- `'stable'` - Only stable features

**Usage in code:**
```ts
if (process.env.FEATURES_ENV === 'insiders') {
  // Beta feature
}
```

## Common Patterns

### Library Package

```ts filename="packages/ui/tsup.config.ts"
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  minify: true,
  external: ['react', 'react-dom'],
  sourcemap: true,
})
```

### CLI Tool

```ts filename="packages/cli/tsup.config.ts"
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  minify: true,
  platform: 'node',
  target: 'node18',
  shims: true, // Add Node.js shims
})
```

### Multiple Entry Points

```ts filename="packages/utils/tsup.config.ts"
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'string-utils': 'src/string-utils.ts',
    'date-utils': 'src/date-utils.ts',
    'array-utils': 'src/array-utils.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  splitting: true, // Code splitting
  treeshake: true, // Remove unused code
})
```

### React Component Library

```ts filename="packages/components/tsup.config.ts"
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
```

## Advanced Features

### Code Splitting

```ts
splitting: true
```

**What it does:** Splits shared code into separate chunks
**Benefit:** Better caching, smaller initial bundle
**Note:** Only works with ESM format

### Tree Shaking

```ts
treeshake: true
```

**What it does:** Removes unused exports
**Benefit:** Smaller bundle size
**Requirement:** ESM format

### Banner/Footer

```ts
banner: {
  js: '/* My Library v1.0.0 */',
},
footer: {
  js: '/* Built with tsup */',
}
```

**What it does:** Adds text to top/bottom of bundle
**Use case:** License headers, version info

### Shims

```ts
shims: true
```

**What it does:** Adds Node.js compatibility shims
**Adds:** `import.meta.url`, `__dirname`, `__filename`
**Use case:** Node.js tools targeting ESM

### Watch Mode

```ts
watch: true
```

**What it does:** Rebuilds on file changes
**Usage:** `tsup --watch`

### OnSuccess Hook

```ts
onSuccess: async () => {
  console.log('Build completed!')
  // Run post-build scripts
}
```

**What it does:** Runs after successful build
**Use case:** Copy files, generate docs, notify

## Package.json Integration

### Exports Field

```json filename="package.json"
{
  "name": "@myorg/utils",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.cjs"
      }
    },
    "./colors": {
      "import": "./dist/colors.js",
      "require": "./dist/colors.cjs",
      "types": "./dist/colors.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "clean": "rm -rf dist"
  }
}
```

### Scripts

```json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "build:prod": "NODE_ENV=production tsup",
    "prepublishOnly": "pnpm build"
  }
}
```

## Monorepo Setup

### Shared Config

```ts filename="packages/tsup-config/index.ts"
import { defineConfig, Options } from 'tsup'

export function createConfig(options: Options = {}) {
  return defineConfig({
    clean: true,
    dts: true,
    format: ['esm', 'cjs'],
    minify: true,
    sourcemap: true,
    ...options,
  })
}
```

### Package Usage

```ts filename="packages/utils/tsup.config.ts"
import { createConfig } from '@afanda/tsup-config'

export default createConfig({
  entry: ['src/index.ts'],
  external: ['react'],
})
```

## Best Practices

### 1. Always Generate Types

```ts
dts: true
```

Essential for TypeScript consumers.

### 2. Use External for Peer Dependencies

```ts
external: ['react', 'react-dom', 'next']
```

Prevents bundling dependencies that consumers already have.

### 3. Enable Source Maps

```ts
sourcemap: true
```

Helps debug production issues.

### 4. Clean Before Build

```ts
clean: true
```

Prevents stale files.

### 5. Use Proper Entry Extensions

- `.ts` for ESM source
- `.cts` for CJS source
- `.mts` for explicit ESM

### 6. Optimize for Tree Shaking

```ts
format: ['esm'],
splitting: true,
treeshake: true,
```

### 7. Set Correct Platform

```ts
platform: 'node'  // For Node.js packages
platform: 'browser'  // For browser packages
```

## Troubleshooting

### Issue: Types not generated

**Solution:**
```ts
dts: {
  resolve: true,
}
```

### Issue: Large bundle size

**Solutions:**
```ts
external: ['heavy-dependency'],
minify: true,
treeshake: true,
```

### Issue: Module resolution errors

**Solution:** Check `package.json` exports:
```json
{
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

### Issue: Slow builds

**Solutions:**
```ts
// Disable source maps in dev
sourcemap: process.env.NODE_ENV === 'production',

// Skip type checking (use tsc separately)
dts: false,
```

## Comparison with Other Bundlers

| Feature | TSUP | Rollup | Webpack | esbuild |
|---------|------|--------|---------|---------|
| Speed | ⚡⚡⚡ | ⚡⚡ | ⚡ | ⚡⚡⚡ |
| Config | Simple | Medium | Complex | Simple |
| Types | ✅ | Plugin | Plugin | ❌ |
| Tree Shaking | ✅ | ✅ | ✅ | ✅ |
| Code Splitting | ✅ | ✅ | ✅ | ✅ |
| Use Case | Libraries | Libraries | Apps | Apps/Libs |

## Resources

- [TSUP Documentation](https://tsup.egoist.dev/)
- [esbuild Documentation](https://esbuild.github.io/)
- [Package.json Exports](https://nodejs.org/api/packages.html#exports)
- [Dual Package Hazard](https://nodejs.org/api/packages.html#dual-package-hazard)

---

For an overview of all available documentation, see [/docs/llms.txt](/docs/llms.txt)
