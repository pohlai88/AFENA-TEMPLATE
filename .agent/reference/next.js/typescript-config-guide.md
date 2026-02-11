# Next.js TypeScript Configuration Guide
@doc-version: 16.1.6
@last-updated: 2026-02-10

## Recommended tsconfig.json for Next.js

### Complete Configuration

```json filename="tsconfig.json"
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    
    /* Modules */
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    
    /* Emit */
    "noEmit": true,
    "incremental": true,
    
    /* Interop Constraints */
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    
    /* Type Checking */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    
    /* Completeness */
    "skipLibCheck": true,
    
    /* Next.js Specific */
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

## Configuration Options Explained

### Language and Environment

#### `target`
```json
"target": "ES2017"
```
- **What it does:** Specifies ECMAScript target version
- **Why ES2017:** Next.js supports modern browsers; ES2017 includes async/await
- **Alternative:** `"ES2022"` for newer features (your current setting is fine)

#### `lib`
```json
"lib": ["dom", "dom.iterable", "esnext"]
```
- **What it does:** Specifies library files to include in compilation
- **dom:** Browser DOM APIs (document, window, etc.)
- **dom.iterable:** Iteration over DOM collections
- **esnext:** Latest ECMAScript features
- **Missing in yours:** `"dom.iterable"` - needed for iterating over NodeList, etc.

#### `jsx`
```json
"jsx": "preserve"
```
- **What it does:** Controls JSX transformation
- **preserve:** Keeps JSX as-is for Next.js to transform
- **⚠️ MISSING IN YOUR CONFIG** - Required for React/Next.js

### Modules

#### `moduleResolution`
```json
"moduleResolution": "bundler"
```
- **What it does:** How TypeScript resolves module imports
- **bundler:** Optimized for modern bundlers (Turbopack/Webpack)
- **✅ You have this** - Good choice for Next.js

#### `resolveJsonModule`
```json
"resolveJsonModule": true
```
- **What it does:** Allows importing JSON files
- **Example:** `import config from './config.json'`
- **⚠️ MISSING IN YOUR CONFIG** - Useful for Next.js

### Emit Options

#### `incremental`
```json
"incremental": true
```
- **What it does:** Enables incremental compilation
- **Benefit:** Faster subsequent builds by caching
- **⚠️ MISSING IN YOUR CONFIG** - Recommended for large projects

### Type Checking (Strict Mode)

#### `noUnusedLocals` & `noUnusedParameters`
```json
"noUnusedLocals": true,
"noUnusedParameters": true
```
- **What it does:** Errors on unused variables/parameters
- **Benefit:** Cleaner code, catches dead code
- **⚠️ MISSING IN YOUR CONFIG** - Highly recommended

#### `noUncheckedIndexedAccess`
```json
"noUncheckedIndexedAccess": true
```
- **What it does:** Makes array/object access return `T | undefined`
- **Example:**
```ts
const arr = [1, 2, 3];
const item = arr[10]; // Type: number | undefined (not just number)
```
- **⚠️ MISSING IN YOUR CONFIG** - Prevents runtime errors

### Next.js Specific

#### TypeScript Plugin
```json
"plugins": [{ "name": "next" }]
```
- **What it does:** Enables Next.js TypeScript plugin
- **Features:**
  - Type-checks route segments
  - Validates metadata exports
  - Warns about invalid config options
- **⚠️ MISSING IN YOUR CONFIG** - Essential for Next.js

#### Path Aliases
```json
"paths": {
  "@/*": ["./*"]
}
```
- **What it does:** Creates import aliases
- **Example:** `import Button from '@/components/Button'`
- **⚠️ MISSING IN YOUR CONFIG** - Very useful for clean imports

#### Include Array
```json
"include": [
  "next-env.d.ts",
  "**/*.ts",
  "**/*.tsx",
  ".next/types/**/*.ts"
]
```
- **next-env.d.ts:** Next.js type definitions
- **.next/types/\*\*/*.ts:** Generated types (route types, etc.)
- **⚠️ MISSING IN YOUR CONFIG** - Required for Next.js types

## Your Config vs Recommended

### ✅ What You Have Right

```json
{
  "strict": true,                          // ✅ Excellent
  "noEmit": true,                          // ✅ Correct for Next.js
  "isolatedModules": true,                 // ✅ Required for fast refresh
  "skipLibCheck": true,                    // ✅ Faster builds
  "forceConsistentCasingInFileNames": true,// ✅ Prevents cross-platform issues
  "moduleResolution": "Bundler"            // ✅ Good for Next.js
}
```

### ⚠️ What You're Missing

```json
{
  "jsx": "preserve",                       // ❌ CRITICAL - Required for React
  "lib": ["dom", "dom.iterable", "esnext"],// ❌ Missing dom.iterable
  "resolveJsonModule": true,               // ❌ Useful for JSON imports
  "incremental": true,                     // ❌ Faster builds
  "noUnusedLocals": true,                  // ❌ Code quality
  "noUnusedParameters": true,              // ❌ Code quality
  "noUncheckedIndexedAccess": true,        // ❌ Runtime safety
  "plugins": [{ "name": "next" }],         // ❌ CRITICAL - Next.js features
  "paths": { "@/*": ["./*"] },             // ❌ Clean imports
  "include": [                             // ❌ CRITICAL - Missing Next.js types
    "next-env.d.ts",
    ".next/types/**/*.ts"
  ]
}
```

## Recommended Config for Your Project

```json filename="tsconfig.json"
{
  "compilerOptions": {
    /* Language and Environment */
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    
    /* Modules */
    "module": "ESNext",
    "moduleDetection": "force",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "allowJs": true,
    
    /* Emit */
    "noEmit": true,
    "incremental": true,
    "verbatimModuleSyntax": true,
    
    /* Interop Constraints */
    "isolatedModules": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    
    /* Type Checking */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "preserveConstEnums": true,
    
    /* Completeness */
    "skipLibCheck": true,
    
    /* Next.js Specific */
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

## Advanced Configurations

### For Monorepos

```json filename="apps/web/tsconfig.json"
{
  "extends": "@afanda/typescript-config/nextjs.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": ["node_modules"]
}
```

### Shared Base Config

```json filename="packages/typescript-config/base.json"
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,
    "esModuleInterop": true
  }
}
```

```json filename="packages/typescript-config/nextjs.json"
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "jsx": "preserve",
    "noEmit": true,
    "incremental": true,
    "resolveJsonModule": true,
    "allowJs": true
  }
}
```

## Common Issues and Solutions

### Issue: "Cannot find module 'next'"

**Solution:** Add Next.js types to include:
```json
"include": ["next-env.d.ts", ".next/types/**/*.ts"]
```

### Issue: JSX syntax errors

**Solution:** Add JSX configuration:
```json
"jsx": "preserve"
```

### Issue: Import aliases not working

**Solution:** Configure paths:
```json
"paths": {
  "@/*": ["./*"]
}
```

### Issue: Slow type checking

**Solutions:**
```json
{
  "skipLibCheck": true,      // Skip checking node_modules
  "incremental": true,       // Enable incremental compilation
  "isolatedModules": true    // Faster transpilation
}
```

## Best Practices

### 1. Use Strict Mode
```json
"strict": true
```
Enables all strict type checking options at once.

### 2. Enable Incremental Builds
```json
"incremental": true
```
Significantly faster for large projects.

### 3. Catch Unused Code
```json
"noUnusedLocals": true,
"noUnusedParameters": true
```
Helps maintain clean codebase.

### 4. Safe Array Access
```json
"noUncheckedIndexedAccess": true
```
Prevents common runtime errors.

### 5. Use Path Aliases
```json
"paths": {
  "@/*": ["./*"],
  "@/components/*": ["./components/*"],
  "@/lib/*": ["./lib/*"]
}
```
Cleaner imports and easier refactoring.

## TypeScript with Next.js Features

### Typed Routes (Next.js 15+)

Enable in `next.config.ts`:
```ts
const nextConfig = {
  typedRoutes: true,
};
```

Then TypeScript will validate route strings:
```tsx
import Link from 'next/link';

// ✅ Valid route
<Link href="/about">About</Link>

// ❌ TypeScript error - route doesn't exist
<Link href="/invalid">Invalid</Link>
```

### Server Components Types

```tsx
// Automatically typed by Next.js
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  return <div>{slug}</div>;
}
```

### Metadata Types

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Page',
  description: 'Page description',
};
```

## Resources

- [Next.js TypeScript Documentation](https://nextjs.org/docs/app/getting-started/typescript)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [Next.js TypeScript Plugin](https://nextjs.org/docs/app/api-reference/config/typescript)

---

For an overview of all available documentation, see [/docs/llms.txt](/docs/llms.txt)
