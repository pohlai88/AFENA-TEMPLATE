# ADR-002: Monorepo with Turborepo

**Status**: Accepted  
**Date**: 2025-11-15  
**Deciders**: Engineering Team  
**Technical Story**: Repository structure and build orchestration

## Context

We needed a repository structure that:

- Supports multiple packages with shared dependencies
- Enables code sharing across applications
- Provides fast, incremental builds
- Scales as the codebase grows
- Supports multiple deployment targets (web, API, workers)

Options considered:

1. **Polyrepo**: Separate repos for each package
2. **Monorepo with npm workspaces**: Basic monorepo without build orchestration
3. **Monorepo with Nx**: Advanced monorepo tooling
4. **Monorepo with Turborepo**: Fast, simple build orchestration

## Decision

We will use a **monorepo structure with Turborepo** for build orchestration and pnpm workspaces for package management.

### Structure

```
afenda-monorepo/
├── apps/
│   └── web/          # Next.js application
├── packages/
│   ├── database/     # Database schema and client
│   ├── logger/       # Structured logging
│   ├── observability/# OpenTelemetry & Sentry
│   ├── ui/           # Shared React components
│   ├── crud/         # CRUD utilities
│   ├── canon/        # Validation schemas
│   ├── workflow/     # Workflow engine
│   ├── advisory/     # Advisory system
│   ├── migration/    # Migration utilities
│   └── search/       # Search functionality
└── tools/
    └── afenda-cli/    # CLI tool for metadata generation
```

### Build Pipeline

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "cache": false
    },
    "lint": {
      "cache": false
    }
  }
}
```

## Consequences

### Positive

✅ **Code sharing**: Easy to share utilities across apps  
✅ **Dependency management**: Single lockfile, consistent versions  
✅ **Atomic changes**: Change multiple packages in one PR  
✅ **Build caching**: Turborepo caches build outputs (local + remote)  
✅ **Incremental builds**: Only rebuilds changed packages  
✅ **Type safety**: TypeScript project references across packages  
✅ **Faster CI**: Parallel builds, intelligent caching

### Negative

⚠️ **Repository size**: Grows larger over time  
⚠️ **Tooling complexity**: Need to learn Turborepo + pnpm  
⚠️ **CI configuration**: More complex than single-package repos  
⚠️ **Merge conflicts**: Higher chance on shared files (package.json, lockfile)

### Neutral

ℹ️ **Build times**: Initial builds slower, incremental builds much faster  
ℹ️ **Deployment**: Each app can be deployed independently

## Alternatives Considered

### Polyrepo (Multiple Repositories)

- ✅ Simple, isolated changes
- ❌ Difficult to share code
- ❌ Dependency version drift
- ❌ Complex to make atomic changes
- **Rejected**: Too much overhead for small team

### Nx

- ✅ More features (code generation, dependency graph visualization)
- ✅ Better task scheduling
- ❌ More complex configuration
- ❌ Larger learning curve
- ❌ Opinionated file structure
- **Rejected**: Overkill for our needs, Turborepo is simpler

### Lerna

- ✅ Mature, well-tested
- ❌ Primarily for publishing npm packages
- ❌ No build caching
- ❌ Slower than Turborepo
- **Rejected**: Not optimized for monorepo builds

### Rush

- ✅ Excellent at scale (Microsoft monorepos)
- ❌ Complex configuration
- ❌ Designed for very large monorepos
- **Rejected**: Too complex for our team size

## Implementation Notes

### Package Naming Convention

All packages use the `afenda-` prefix:

- `afenda-database`
- `afenda-logger`
- `afenda-observability`

### Dependency Management

Use workspace protocol for internal dependencies:

```json
{
  "dependencies": {
    "afenda-logger": "workspace:*",
    "afenda-database": "workspace:^"
  }
}
```

### Build Order

Turborepo automatically determines build order based on dependencies. No manual orchestration needed.

### Caching

- **Local caching**: `.turbo/` directory (gitignored)
- **Remote caching**: Vercel Remote Cache (optional, configured via environment variables)

### CI/CD

Use `turbo run build --filter=[origin/main...HEAD]` to build only changed packages in CI.

## References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Monorepo Best Practices](https://monorepo.tools/)
