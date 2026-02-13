# afena-vitest-config

Shared Vitest configuration for the Afena monorepo.

## Presets

### Unit (`afena-vitest-config/presets/unit`)

Fast unit tests with `afena-database` mocked automatically.

- `pool: 'threads'` — Worker threads, fastest for pure Node tests
- `isolate: false` — skip VM context reset per file
- `testTimeout: 5s`
- `setupFiles` — auto-mocks `afena-database` (no DATABASE_URL needed)

### Integration (`afena-vitest-config/presets/integration`)

DB integration tests with full isolation.

- `pool: 'forks'` — child processes, safe for native PG driver
- `isolate: true` — each test file gets clean state
- `testTimeout: 30s`
- Requires `DATABASE_URL` environment variable

## Usage

```ts
// packages/my-package/vitest.config.ts
import { defineProject, mergeConfig } from 'vitest/config';
import { unitPreset } from 'afena-vitest-config/presets/unit';

export default mergeConfig(
  unitPreset,
  defineProject({
    // package-specific overrides here
  }),
);
```

## Shared Setup Files

### `afena-vitest-config/setup/mock-database`

Mocks `afena-database` with a chainable Proxy so any `db.method().chain()` call
works without a real database connection. Included automatically in the unit preset.
