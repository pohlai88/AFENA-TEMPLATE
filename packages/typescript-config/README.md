# afenda-typescript-config

**Layer 0: Configuration** • **Role:** TypeScript Compiler Settings

Shared TypeScript configuration for AFENDA-NEXUS packages and applications.

---

## 📐 Architecture Role

**Layer 0** in the 4-layer architecture:

```
Layer 3: Application (crud, observability)
Layer 2: Domain Services (workflow, advisory, 116 business-domain packages)
Layer 1: Foundation (canon, database, logger, ui)
Layer 0: Configuration (eslint-config, typescript-config ← YOU ARE HERE)
```

**Purpose:**
- Provides strict TypeScript compiler settings
- Enforces type safety across all packages
- Ensures consistent compilation targets

**Zero Dependencies:** This package has ZERO workspace dependencies.

---

## ✅ What This Package Does

### 1. Provides Strict TypeScript Config

```json
{
  "extends": "afenda-typescript-config",
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

### 2. Enforces Type Safety

- `strict: true` — All strict checks enabled
- `noImplicitAny: true` — No implicit `any` types
- `strictNullChecks: true` — Null safety
- `exactOptionalPropertyTypes: true` — Exact optional types

### 3. Modern ES Target

- `target: "ES2022"` — Modern JavaScript features
- `module: "ESNext"` — ES modules
- `moduleResolution: "bundler"` — Bundler-compatible resolution

---

## ❌ What This Package NEVER Does

| ❌ Never Do This | ✅ Do This Instead |
|-----------------|-------------------|
| Import workspace packages | Only configuration |
| Implement business logic | Only compiler settings |
| Depend on other layers | Layer 0 is isolated |

---

## 📦 What This Package Exports

### Configuration File

- `index.json` — Base TypeScript config

### Key Settings

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

---

## 📖 Usage Examples

### Package TypeScript Config

```json
// business-domain/accounting/tsconfig.json
{
  "extends": "afenda-typescript-config",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### App TypeScript Config (Next.js)

```json
// apps/web/tsconfig.json
{
  "extends": "afenda-typescript-config",
  "compilerOptions": {
    "incremental": true,
    "plugins": [{"name": "next"}]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## 🔗 Dependencies

### Workspace Dependencies

**NONE** — Layer 0 has zero workspace dependencies.

### External Dependencies

**NONE** — Configuration only.

### Who Depends on This Package

- ✅ ALL packages (Layers 1, 2, 3)
- ✅ ALL business-domain packages
- ✅ ALL apps

---

## 🚦 Dependency Rules

```
✅ ALLOWED:
  - None (configuration only)

❌ FORBIDDEN:
  - Any workspace package
  - Any external npm package
```

**Rule:** Layer 0 packages are completely isolated.

---

## ⚠️ PREVENT DRIFT - Critical Architecture Rules

### 🔒 Rule 1: NEVER Disable Strict Mode

**❌ WRONG:**

```json
{
  "compilerOptions": {
    "strict": false  // ❌ FORBIDDEN!
  }
}
```

**Why:** Strict mode catches bugs at compile-time, not runtime.

**✅ CORRECT:**

```json
{
  "extends": "afenda-typescript-config",
  // strict: true inherited
}
```

---

### 🔒 Rule 2: NEVER Allow Implicit `any`

**❌ WRONG:**

```json
{
  "compilerOptions": {
    "noImplicitAny": false  // ❌ FORBIDDEN!
  }
}
```

**Why:** Implicit `any` defeats TypeScript's type safety.

---

### 🔒 Rule 3: NEVER Disable exactOptionalPropertyTypes

**❌ WRONG:**

```json
{
  "compilerOptions": {
    "exactOptionalPropertyTypes": false  // ❌ FORBIDDEN!
  }
}
```

**Why:** This prevents `undefined` from being assigned to optional properties.

**Example:**

```typescript
interface User {
  name: string;
  email?: string; // Can be absent, but NOT undefined
}

const user1: User = { name: 'Alice' }; // ✅ OK
const user2: User = { name: 'Bob', email: 'bob@example.com' }; // ✅ OK
const user3: User = { name: 'Charlie', email: undefined }; // ❌ Error with exactOptionalPropertyTypes
```

---

### 🚨 Validation Commands

```bash
# Type-check all packages
pnpm type-check

# Type-check specific package
cd business-domain/accounting
pnpm type-check
```

---

## 🔍 Quick Reference

| Question | Answer |
|----------|--------|
| **What layer?** | Layer 0 (Configuration) |
| **What does it export?** | TypeScript compiler config |
| **What does it import?** | Nothing |
| **Who imports it?** | All packages and apps |
| **Can I disable strict mode?** | ❌ NO |
| **Can I allow implicit any?** | ❌ NO |
| **Should I use exactOptionalPropertyTypes?** | ✅ YES |

---

## 📚 Related Documentation

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Complete 4-layer architecture
- [TypeScript Docs](https://www.typescriptlang.org/docs/) - Official TypeScript docs

---

**Last Updated:** February 18, 2026  
**Architecture Version:** 2.0 (Clean State)
