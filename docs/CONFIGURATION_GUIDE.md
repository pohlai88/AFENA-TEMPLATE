# Configuration Management Guide

This guide explains how to configure and maintain consistent configuration files across the AFENDA NEXUS monorepo, following best practices from installed skills (monorepo-management, pnpm, next-best-practices, nextjs-16-complete-guide).

## Table of Contents

- [Configuration Philosophy](#configuration-philosophy)
- [TypeScript Configuration](#typescript-configuration)
- [Package.json Standards](#packagejson-standards)
- [ESLint Configuration](#eslint-configuration)
- [Build Configuration](#build-configuration)
- [Maintenance Workflows](#maintenance-workflows)
- [Troubleshooting](#troubleshooting)

## Configuration Philosophy

### Core Principles

1. **Inheritance Over Duplication**
   - Use shared presets for common configuration
   - Package-specific configs should only contain overrides
   - Minimize configuration drift

2. **Convention Over Configuration**
   - Follow established patterns consistently
   - Use standard script names across all packages
   - Prefer defaults when they work

3. **Validation First**
   - All configs must be testable
   - Use type-check and lint to validate
   - Catch issues before they reach production

4. **Performance Optimized**
   - Enable incremental compilation
   - Use Turborepo caching effectively
   - Optimize for monorepo scale

## TypeScript Configuration

### Shared Preset Architecture

```
packages/typescript-config/
├── base.json              → Core config (10 packages, 48 domains, 2 tools)
├── nextjs.json            → Next.js apps (extends base)
└── react-library.json     → React libraries (extends base)
```

### When to Use Each Preset

#### base.json - Standard Packages

For most packages (business logic, utilities, services):

```json
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build", "**/*.test.*", "**/*.spec.*"]
}
```

**Use for:**

- ✅ Business domain packages (accounting, inventory, etc.)
- ✅ Service packages (database, logger, etc.)
- ✅ Utility packages (canon, search, etc.)
- ✅ CLI tools and scripts

#### react-library.json - React Component Libraries

For packages that export React components:

```json
{
  "extends": "afenda-typescript-config/react-library.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "build", "**/*.test.*", "**/*.spec.*"]
}
```

**Use for:**

- ✅ UI component libraries (afenda-ui)
- ✅ React hook libraries
- ✅ Context providers
- ❌ Not for Next.js apps (use nextjs.json)

#### nextjs.json - Next.js Applications

For Next.js app directories only:

```json
{
  "extends": "afenda-typescript-config/nextjs.json",
  "compilerOptions": {
    "tsBuildInfoFile": ".next/cache/tsconfig.tsbuildinfo",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@afenda/ui": ["../../packages/ui/src"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", "dist"]
}
```

**Use for:**

- ✅ apps/web (Next.js app)
- ✅ Any future Next.js applications
- ❌ Not for regular packages

### Configuration Best Practices

#### ✅ DO

```json
// Minimal config - rely on preset
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  },
  "include": ["src/**/*"]
}
```

#### ❌ DON'T

```json
// Over-configured - duplicates preset settings
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": {
    "strict": true, // Already in base
    "moduleResolution": "bundler", // Already in base
    "esModuleInterop": true, // Already in base
    "skipLibCheck": true, // Already in base
    "target": "ES2022", // Already in base
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  }
}
```

### Type-check Only Packages

For packages that don't build (type-check only):

```json
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": {
    "noEmit": true // Don't generate build output
  },
  "include": ["src/**/*"]
}
```

**Use for:**

- ✅ Business domain packages (48 packages in business-domain/)
- ✅ Packages consumed via direct imports
- ❌ Not for published libraries

## Package.json Standards

### Naming Convention

```json
{
  "name": "afenda-[package-name]", // Always use afenda- prefix
  "version": "0.1.0", // Semantic versioning
  "private": true // Internal packages are private
}
```

### Module Type

```json
{
  "type": "module" // Use ESM by default
}
```

**Exception:** CLI tools may use CommonJS if required by Node.js tooling.

### Entry Points

```json
{
  "main": "./src/index.ts", // Main entry
  "types": "./src/index.ts", // TypeScript types
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    },
    "./utils": {
      // Named exports (optional)
      "types": "./src/utils.ts",
      "default": "./src/utils.ts"
    }
  }
}
```

### Dependency Protocols

#### Workspace Dependencies

```json
{
  "dependencies": {
    "afenda-canon": "workspace:*", // Any version
    "afenda-database": "workspace:*", // Any version
    "afenda-logger": "workspace:*" // Any version
  },
  "devDependencies": {
    "afenda-eslint-config": "workspace:^", // Compatible
    "afenda-typescript-config": "workspace:*" // Any version
  }
}
```

**Workspace Protocol Reference:**

- `workspace:*` - Any version (recommended for most)
- `workspace:^` - Compatible version (for tools)
- `workspace:~` - Patch version

#### Catalog Dependencies

```json
{
  "devDependencies": {
    "@types/node": "catalog:", // Version managed in root
    "typescript": "catalog:", // Version managed in root
    "eslint": "catalog:", // Version managed in root
    "prettier": "catalog:" // Version managed in root
  }
}
```

**Benefits:**

- ✅ Single source of truth for versions
- ✅ Prevents version conflicts
- ✅ Easy upgrades (update catalog once)

### Standard Scripts

All packages should implement these scripts:

```json
{
  "scripts": {
    // Type Checking (Required)
    "type-check": "tsc --noEmit",

    // Linting (Required)
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx --cache --concurrency=auto",
    "lint:ci": "eslint . --ext .js,.jsx,.ts,.tsx --rule 'import/no-cycle: error'",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --cache --fix",

    // Building (If package builds artifacts)
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch",

    // Testing (If package has tests)
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

**Script Naming Standards:**

- Use kebab-case: `type-check`, not `typeCheck`
- Use consistent names across all packages
- Variants use `:` separator: `lint:fix`, `lint:ci`

## ESLint Configuration

### Default: Inherit from Shared Config

Most packages should NOT have their own ESLint config:

```
packages/my-package/
├── src/
├── package.json
└── tsconfig.json
```

ESLint will automatically resolve config from:

1. `afenda-eslint-config` (package dependency)
2. Root `.eslintrc.js` (fallback)

### Package-Specific Rules (Rare)

Only create `.eslintrc.js` if you need package-specific overrides:

```js
// packages/my-package/.eslintrc.js
module.exports = {
  extends: ['afenda-eslint-config'],
  rules: {
    // Package-specific overrides only
    'no-console': 'error', // Example: stricter console rules
  },
};
```

**When to use:**

- ❌ Don't create unless absolutely necessary
- ⚠️ Only for legitimate package-specific requirements
- ✅ Document why custom rules are needed

## Build Configuration

### Turborepo Pipeline

Defined in root `turbo.json`:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "lint": {
      "outputs": []
    }
  }
}
```

**Key Concepts:**

- `^build` - Build dependencies first (topological order)
- `outputs` - Files to cache for reuse
- `dependsOn` - Task dependencies

### Build Tools by Package Type

| Package Type  | Build Tool | Config Location        |
| ------------- | ---------- | ---------------------- |
| React Library | tsup       | package.json scripts   |
| Next.js App   | Next.js    | next.config.ts         |
| CLI Tool      | tsup       | package.json scripts   |
| Type-only     | tsc        | tsconfig.json (noEmit) |

## Maintenance Workflows

### Adding a New Package

1. **Copy template structure:**

   ```bash
   mkdir packages/my-new-package
   cd packages/my-new-package
   ```

2. **Create package.json:**

   ```json
   {
     "name": "afenda-my-new-package",
     "version": "0.1.0",
     "private": true,
     "type": "module",
     "main": "./src/index.ts",
     "types": "./src/index.ts",
     "scripts": {
       "type-check": "tsc --noEmit",
       "lint": "eslint . --ext .js,.jsx,.ts,.tsx --cache",
       "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix"
     },
     "dependencies": {},
     "devDependencies": {
       "afenda-typescript-config": "workspace:*",
       "afenda-eslint-config": "workspace:^"
     }
   }
   ```

3. **Create tsconfig.json:**

   ```json
   {
     "extends": "afenda-typescript-config/base.json",
     "compilerOptions": {
       "tsBuildInfoFile": "./dist/.tsbuildinfo"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "dist"]
   }
   ```

4. **Create src/index.ts:**

   ```typescript
   export * from './my-module';
   ```

5. **Create README.md:**
   - Use [PACKAGE_TEMPLATE.md](../packages/PACKAGE_TEMPLATE.md)

6. **Install dependencies:**

   ```bash
   pnpm install
   ```

7. **Validate:**
   ```bash
   pnpm type-check
   pnpm lint
   ```

### Updating Shared Configurations

When updating shared presets:

1. **Update preset file:**

   ```bash
   # Edit packages/typescript-config/base.json
   vim packages/typescript-config/base.json
   ```

2. **Test changes:**

   ```bash
   # Type-check all packages to catch issues
   pnpm -r type-check
   ```

3. **Document breaking changes:**
   - Update this guide if behavior changes
   - Add migration notes if needed

4. **Validate dependencies:**
   ```bash
   # Check for circular dependencies
   pnpm -r lint:ci
   ```

### Bulk Configuration Updates

Use automation for large-scale updates:

```powershell
# Example: Sync all business-domain configs
.\tools\scripts\sync-business-domain-tsconfigs.ps1
```

**Created scripts:**

- `sync-business-domain-tsconfigs.ps1` - Updates all 48 business domain packages

### Version Updates

#### TypeScript Version Upgrade

1. **Update catalog:**

   ```yaml
   # pnpm-workspace.yaml
   catalog:
     typescript: ~5.4.0 # Update version
   ```

2. **Install:**

   ```bash
   pnpm install
   ```

3. **Test all packages:**
   ```bash
   pnpm -r type-check
   ```

#### ESLint Version Upgrade

1. **Update in root package.json:**

   ```json
   {
     "devDependencies": {
       "eslint": "^9.0.0"
     }
   }
   ```

2. **Update shared config:**

   ```bash
   cd packages/eslint-config
   pnpm add -D eslint@^9.0.0
   ```

3. **Test:**
   ```bash
   pnpm -r lint
   ```

## Troubleshooting

### "Cannot find module 'afenda-typescript-config'"

**Cause:** Workspace dependencies not linked

**Solution:**

```bash
# From root
pnpm install
```

### "Module has already exported a member named X"

**Cause:** Duplicate exports in barrel files

**Solution:**

1. Check `src/index.ts` for duplicate re-exports
2. Review import/export structure
3. Use named exports instead of `export *` when needed

### Circular Dependency Warnings

**Cause:** Cross-package imports create cycles

**Solution:**

1. Check `pnpm lint:ci` output
2. Review [GOVERNANCE.md](../packages/GOVERNANCE.md) layer rules
3. Extract shared code to Layer 1 (Foundation)
4. Avoid importing from higher layers

### TypeScript Incremental Build Issues

**Cause:** Corrupt `.tsbuildinfo` files

**Solution:**

```bash
# Clean all incremental build files
pnpm -r exec -- rm -rf dist/.tsbuildinfo

# Rebuild
pnpm build
```

### ESLint Cache Issues

**Cause:** Stale cache after config changes

**Solution:**

```bash
# Clear ESLint cache
pnpm -r exec -- rm -rf .eslintcache

# Re-lint
pnpm -r lint
```

### Turborepo Cache Issues

**Cause:** Cache invalid after config changes

**Solution:**

```bash
# Force rebuild without cache
turbo run build --force

# Clear entire cache
rm -rf .turbo
pnpm build
```

## Validation Checklist

Before committing configuration changes:

- [ ] `pnpm install` succeeds without errors
- [ ] `pnpm -r type-check` passes for all packages
- [ ] `pnpm -r lint` passes for all packages
- [ ] `pnpm -r lint:ci` detects no circular dependencies
- [ ] `pnpm build` succeeds with caching
- [ ] Documentation updated (if needed)

## Reference Files

- [PACKAGE_TEMPLATE.md](../packages/PACKAGE_TEMPLATE.md) - Package README template with config examples
- [GOVERNANCE.md](../packages/GOVERNANCE.md) - Dependency layer rules
- [CONFIG-SYNC-REPORT.md](CONFIG-SYNC-REPORT.md) - Last configuration synchronization details
- [packages/typescript-config/](../packages/typescript-config/) - Shared TypeScript presets
- [packages/eslint-config/](../packages/eslint-config/) - Shared ESLint configuration

## Additional Resources

### Installed Skills

- **monorepo-management** - `.agents/skills/monorepo-management/`
- **pnpm** - `.agents/skills/pnpm/`
- **next-best-practices** - `.agents/skills/next-best-practices/`
- **nextjs-16-complete-guide** - `.agents/skills/nextjs-16-complete-guide/`
- **optimized-nextjs-typescript** - `.agents/skills/optimized-nextjs-typescript/`

### External References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
