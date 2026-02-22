# pnpm Catalog Enforcement Guide

## Overview

This monorepo enforces strict catalog usage for all dependencies to ensure version consistency, reduce merge conflicts, and simplify dependency management across all packages.

## What is pnpm Catalog?

pnpm catalogs provide centralized version management where you define dependency versions once in `pnpm-workspace.yaml` and reference them using the `catalog:` protocol in package.json files.

### Benefits

✅ **Single source of truth** - All versions defined in one place  
✅ **Prevent version drift** - No accidental version mismatches  
✅ **Easier upgrades** - Update one file instead of many  
✅ **Fewer merge conflicts** - Changes localized to workspace file  
✅ **Better security** - Centralized audit and updates

## Configuration

### 1. `.npmrc` - Strict Enforcement

```ini
# Strict mode: Fail if dependency not in catalog
catalog-mode=strict

# Clean up unused catalog entries on install
cleanup-unused-catalogs=true
```

**`catalog-mode=strict`** prevents adding any dependency that doesn't exist in the catalog. This is the key enforcement mechanism.

### 2. `pnpm-workspace.yaml` - Catalog Definition

```yaml
catalog:
  react: ~19.2.4
  typescript: ~5.9.3
  zod: ~4.3.6
  # ... more dependencies
```

### 3. `package.json` - Catalog Usage

```json
{
  "dependencies": {
    "react": "catalog:",
    "typescript": "catalog:",
    "zod": "catalog:"
  }
}
```

## Allowed Exceptions

### Workspace Packages

Internal packages MUST use `workspace:*` protocol:

```json
{
  "dependencies": {
    "afenda-canon": "workspace:*",
    "afenda-crud": "workspace:*"
  }
}
```

### Peer Dependencies

Peer dependencies define compatibility ranges and are allowed to have explicit versions:

```json
{
  "peerDependencies": {
    "react": "^19.2.3",
    "typescript": "^5.0.0"
  }
}
```

### Pinned Beta Versions

Some packages require specific beta versions:

```json
{
  "dependencies": {
    "@neondatabase/auth": "0.2.0-beta.1",
    "@neondatabase/neon-js": "0.2.0-beta.1"
  }
}
```

## Scripts

### Validate Catalog Usage

Check all packages for non-catalog dependencies:

```bash
pnpm validate:catalog
```

This script:

- Scans all package.json files
- Reports dependencies not using `catalog:` or `workspace:` protocol
- Exits with error code 1 if violations found

### Migrate to Catalog

Automatically convert explicit versions to catalog protocol:

```bash
pnpm migrate:catalog
```

This script:

- Loads catalog from pnpm-workspace.yaml
- Updates all package.json files
- Converts matching dependencies to `catalog:`
- Preserves allowed exceptions

### CI Integration

Add to your CI pipeline:

```yaml
# .github/workflows/ci.yml
- name: Validate Catalog
  run: pnpm validate:catalog
```

## Adding New Dependencies

### Step 1: Add to Catalog

Edit `pnpm-workspace.yaml`:

```yaml
catalog:
  lodash: ~4.17.21 # Add new dependency here
```

### Step 2: Use in Package

Edit `package.json`:

```json
{
  "dependencies": {
    "lodash": "catalog:" // Reference catalog entry
  }
}
```

### Step 3: Install

```bash
pnpm install
```

## Upgrading Dependencies

### Single Dependency

1. Update version in `pnpm-workspace.yaml`
2. Run `pnpm install`
3. Test across all packages

### Multiple Dependencies

Use pnpm's update command:

```bash
# Update all dependencies to latest within ranges
pnpm update -r

# Update specific dependency
pnpm update lodash -r
```

## Troubleshooting

### Error: "Dependency not in catalog"

**Cause:** Trying to add a dependency not defined in catalog with `catalog-mode=strict`

**Solution:**

1. Add dependency to `pnpm-workspace.yaml` catalog
2. Run `pnpm install`

### Error: "Version mismatch"

**Cause:** Local package.json has explicit version, catalog has different version

**Solution:**

1. Run `pnpm migrate:catalog` to auto-fix
2. Or manually change to `catalog:` in package.json

### Error: "Workspace package not found"

**Cause:** Internal package not using `workspace:*` protocol

**Solution:**
Change from `"afenda-canon": "^0.1.0"` to `"afenda-canon": "workspace:*"`

## Best Practices

### ✅ DO

- Always add dependencies to catalog first
- Use `catalog:` for all external dependencies
- Use `workspace:*` for internal packages
- Keep catalog organized with comments
- Use semantic versioning ranges (`~` for patch, `^` for minor)

### ❌ DON'T

- Add dependencies directly to package.json without catalog entry
- Use explicit versions (except allowed exceptions)
- Mix catalog and non-catalog dependencies
- Bypass validation in CI

## Version Range Strategy

We use **tilde (`~`) ranges** for most dependencies:

```yaml
catalog:
  react: ~19.2.4 # Allows 19.2.x (patch updates only)
  typescript: ~5.9.3 # Allows 5.9.x (patch updates only)
```

**Why tilde?**

- More conservative than caret (`^`)
- Reduces risk of breaking changes
- Aligns with TypeScript's strict mode
- Better for monorepo stability

## Migration Checklist

If migrating an existing monorepo to catalog enforcement:

- [ ] Add all dependencies to `pnpm-workspace.yaml` catalog
- [ ] Run `pnpm migrate:catalog` to auto-convert packages
- [ ] Add `catalog-mode=strict` to `.npmrc`
- [ ] Run `pnpm validate:catalog` to verify
- [ ] Run `pnpm install` to update lockfile
- [ ] Test builds: `pnpm build`
- [ ] Add validation to CI pipeline
- [ ] Document exceptions in this file

## Resources

- [pnpm Catalogs Documentation](https://pnpm.io/catalogs)
- [pnpm Workspace Configuration](https://pnpm.io/pnpm-workspace_yaml)
- [Monorepo Management Skill](.agents/skills/monorepo-management)
- [pnpm Skill](.agents/skills/pnpm)

## Support

For questions or issues:

1. Check this documentation
2. Review pnpm skill: `.agents/skills/pnpm/references/workspaces.md`
3. Run `pnpm validate:catalog` for diagnostics
4. Check CI logs for validation errors
