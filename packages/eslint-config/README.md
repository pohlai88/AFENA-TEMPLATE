# afenda-eslint-config

**Layer 0: Configuration** • **Role:** ESLint Rules & Standards

Shared ESLint configuration for AFENDA-NEXUS packages and applications.

---

## 📐 Architecture Role

**Layer 0** in the 4-layer architecture:

```
Layer 3: Application (crud, observability)
Layer 2: Domain Services (workflow, advisory, 116 business-domain packages)
Layer 1: Foundation (canon, database, logger, ui)
Layer 0: Configuration (eslint-config ← YOU ARE HERE, typescript-config)
```

**Purpose:**
- Provides ESLint rules for code quality
- Enforces architectural boundaries (import/no-cycle)
- Ensures consistent code style

**Zero Dependencies:** This package has ZERO workspace dependencies.

---

## ✅ What This Package Does

### 1. Base ESLint Config

```javascript
// eslint.config.js
const config = require('afenda-eslint-config');

module.exports = [...config];
```

### 2. React-Specific Config

```javascript
const reactConfig = require('afenda-eslint-config/react');

module.exports = [...reactConfig];
```

### 3. Next.js Config

```javascript
const nextConfig = require('afenda-eslint-config/next');

module.exports = [...nextConfig];
```

---

## ❌ What This Package NEVER Does

| ❌ Never Do This | ✅ Do This Instead |
|-----------------|-------------------|
| Import workspace packages | Only external npm |
| Implement business logic | Only linting rules |
| Depend on other layers | Layer 0 is isolated |

---

## 📦 What This Package Exports

### Configurations

- **Default (base.js):** TypeScript, import rules, security checks
- **react.js:** React + JSX + a11y rules
- **next.js:** Next.js-specific rules

### Key Rules

- `import/no-cycle` — Detects circular dependencies
- `@typescript-eslint/no-explicit-any` — Prevents `any` usage
- `pino/no-console` — Prevents `console.log` usage
- `security/detect-object-injection` — Security checks
- `react-hooks/rules-of-hooks` — React Hooks rules
- `jsx-a11y/alt-text` — Accessibility rules

---

## 📖 Usage Examples

### Base Config (TypeScript Package)

```javascript
// business-domain/accounting/eslint.config.js
const config = require('afenda-eslint-config');

module.exports = [...config];
```

### React Config (UI Package)

```javascript
// packages/ui/eslint.config.js
const reactConfig = require('afenda-eslint-config/react');

module.exports = [...reactConfig];
```

### Next.js Config (Web App)

```javascript
// apps/web/eslint.config.js
const nextConfig = require('afenda-eslint-config/next');

module.exports = [...nextConfig];
```

---

## 🔗 Dependencies

### Workspace Dependencies

**NONE** — Layer 0 has zero workspace dependencies.

### External Dependencies

- `@typescript-eslint/eslint-plugin` — TypeScript rules
- `@typescript-eslint/parser` — TypeScript parser
- `eslint-config-prettier` — Prettier compatibility
- `eslint-plugin-import` — Import rules
- `eslint-plugin-jsx-a11y` — Accessibility rules
- `eslint-plugin-pino` — Pino logger rules
- `eslint-plugin-react` — React rules
- `eslint-plugin-react-hooks` — React Hooks rules
- `eslint-plugin-security` — Security rules

### Who Depends on This Package

- ✅ ALL packages (Layers 1, 2, 3)
- ✅ ALL business-domain packages
- ✅ ALL apps

---

## 🚦 Dependency Rules

```
✅ ALLOWED:
  - External npm only

❌ FORBIDDEN:
  - Any workspace package
```

**Rule:** Layer 0 packages are completely isolated.

---

## ⚠️ PREVENT DRIFT - Critical Architecture Rules

### 🔒 Rule 1: NEVER Import Workspace Packages

**❌ WRONG:**

```javascript
// base.js
const { someHelper } = require('afenda-canon'); // FORBIDDEN!
```

**Why:** Layer 0 packages must have zero workspace dependencies.

**✅ CORRECT:**

```javascript
// base.js
module.exports = [
  { rules: { 'import/no-cycle': 'error' } },
];
```

---

### 🔒 Rule 2: Enforce Circular Dependency Detection

**Required Rule:**

```javascript
{
  rules: {
    'import/no-cycle': 'error', // REQUIRED!
  },
}
```

**Why:** Circular dependencies violate the 4-layer architecture.

---

### 🔒 Rule 3: Prevent console.log Usage

**Required Rule:**

```javascript
{
  rules: {
    'pino/no-console': 'warn', // Use logger instead
  },
}
```

**Why:** `console.log` is unstructured. Use `afenda-logger` instead.

---

### 🚨 Validation Commands

```bash
# Lint all packages
pnpm lint

# Check for circular dependencies
pnpm lint:ci
```

---

## 🔍 Quick Reference

| Question | Answer |
|----------|--------|
| **What layer?** | Layer 0 (Configuration) |
| **What does it export?** | ESLint configs (base, react, next) |
| **What does it import?** | Only external npm |
| **Who imports it?** | All packages and apps |
| **Can it import workspace packages?** | ❌ NO |
| **Key rules?** | import/no-cycle, no-console, no-any |

---

## 📚 Related Documentation

- [ARCHITECTURE.md](../../ARCHITECTURE.md) - Complete 4-layer architecture
- [ESLint Docs](https://eslint.org/docs/latest/) - Official ESLint docs

---

**Last Updated:** February 18, 2026  
**Architecture Version:** 2.0 (Clean State)
