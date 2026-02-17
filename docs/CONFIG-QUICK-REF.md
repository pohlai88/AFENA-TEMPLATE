# Configuration Quick Reference

Fast lookup guide for common configuration patterns in AFENDA NEXUS monorepo.

## TypeScript Config Patterns

### Standard Package

```json
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": { "tsBuildInfoFile": "./dist/.tsbuildinfo" },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.*"]
}
```

### React Library

```json
{
  "extends": "afenda-typescript-config/react-library.json",
  "compilerOptions": { "tsBuildInfoFile": "./dist/.tsbuildinfo" },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.*"]
}
```

### Next.js App

```json
{
  "extends": "afenda-typescript-config/nextjs.json",
  "compilerOptions": {
    "tsBuildInfoFile": ".next/cache/tsconfig.tsbuildinfo",
    "baseUrl": ".",
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

### Type-check Only (No Build)

```json
{
  "extends": "afenda-typescript-config/base.json",
  "compilerOptions": { "noEmit": true },
  "include": ["src/**/*"]
}
```

## Package.json Patterns

### Minimal Package

```json
{
  "name": "afenda-my-package",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "scripts": {
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx --cache",
    "lint:fix": "eslint . --ext .ts,.tsx --cache --fix"
  },
  "devDependencies": {
    "afenda-typescript-config": "workspace:*",
    "afenda-eslint-config": "workspace:^"
  }
}
```

### With Build Step

```json
{
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --dts --watch",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx --cache"
  }
}
```

### With Tests

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage"
  }
}
```

## Dependency Patterns

### Workspace Dependencies

```json
{
  "dependencies": {
    "afenda-canon": "workspace:*",
    "afenda-database": "workspace:*",
    "afenda-logger": "workspace:*"
  }
}
```

### Catalog Dependencies

```json
{
  "devDependencies": {
    "@types/node": "catalog:",
    "typescript": "catalog:",
    "eslint": "catalog:"
  }
}
```

## Common Commands

### Validation

```bash
pnpm type-check          # Check TypeScript in current package
pnpm lint               # Lint current package
pnpm test               # Test current package

pnpm -r type-check      # All packages
turbo run lint          # All packages with cache
```

### Adding Dependencies

```bash
pnpm add <pkg>                        # Add to current package
pnpm add <pkg> --filter my-package    # Add to specific package
pnpm add -D <pkg> -w                  # Add to root (dev dependency)
```

### Workspace Operations

```bash
pnpm install                    # Install all dependencies
pnpm -r update                  # Update all packages
pnpm --filter web dev           # Run dev in specific package
turbo run build                 # Build all with caching
```

## File Structure Template

```
packages/my-package/
├── src/
│   ├── index.ts           # Main entry point
│   ├── types.ts           # Type definitions
│   └── utils.ts           # Utilities
├── package.json           # Package manifest
├── tsconfig.json          # TypeScript config
└── README.md              # Documentation
```

## Preset Selection Guide

| Package Type     | Preset             | Example               |
| ---------------- | ------------------ | --------------------- |
| Business logic   | base.json          | accounting, inventory |
| Database service | base.json          | database, migration   |
| Utilities        | base.json          | canon, logger, search |
| React components | react-library.json | ui                    |
| Next.js app      | nextjs.json        | apps/web              |
| CLI tool         | base.json          | afena-cli             |
| Type-check only  | base.json + noEmit | business-domain/\*    |

## Script Naming Standards

| Purpose       | Script Name     | Example                                    |
| ------------- | --------------- | ------------------------------------------ |
| Type checking | `type-check`    | `tsc --noEmit`                             |
| Linting       | `lint`          | `eslint . --cache`                         |
| Lint fix      | `lint:fix`      | `eslint . --cache --fix`                   |
| CI linting    | `lint:ci`       | `eslint . --rule 'import/no-cycle: error'` |
| Building      | `build`         | `tsup src/index.ts`                        |
| Development   | `dev`           | `tsup --watch`                             |
| Testing       | `test`          | `vitest`                                   |
| Test watch    | `test:watch`    | `vitest --watch`                           |
| Coverage      | `test:coverage` | `vitest --coverage`                        |

## Troubleshooting Quick Fixes

| Issue                            | Quick Fix                                |
| -------------------------------- | ---------------------------------------- |
| "Cannot find module 'afenda-\*'" | `pnpm install` from root                 |
| Duplicate export errors          | Check `src/index.ts` for duplicates      |
| Circular dependencies            | Run `pnpm lint:ci`, check GOVERNANCE.md  |
| Stale TypeScript cache           | `rm -rf dist/.tsbuildinfo && pnpm build` |
| Stale ESLint cache               | `rm .eslintcache && pnpm lint`           |
| Stale Turbo cache                | `turbo run build --force`                |

## Layer Restrictions

| Layer                 | Can Import From | Cannot Import From |
| --------------------- | --------------- | ------------------ |
| Layer 0 (Config)      | npm packages    | Workspace packages |
| Layer 1 (Foundation)  | Layer 0, npm    | Layer 2, 3         |
| Layer 2 (Domain)      | Layer 0, 1, npm | Layer 3            |
| Layer 3 (Application) | All layers      | -                  |

## Reference Documentation

- Full Guide: [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md)
- Package Template: [PACKAGE_TEMPLATE.md](../packages/PACKAGE_TEMPLATE.md)
- Governance Rules: [GOVERNANCE.md](../packages/GOVERNANCE.md)
- Sync Report: [CONFIG-SYNC-REPORT.md](CONFIG-SYNC-REPORT.md)
