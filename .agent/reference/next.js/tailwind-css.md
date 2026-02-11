# Tailwind CSS Configuration
@doc-version: 16.1.6
@last-updated: 2026-02-10

Tailwind CSS is a utility-first CSS framework that can be integrated with Next.js for rapid UI development. This guide covers setup, configuration, and best practices.

## Installation

### For Tailwind CSS v4 (Latest)

Install the required packages:

```bash
pnpm add -D tailwindcss@next @tailwindcss/postcss@next
```

```bash
npm install -D tailwindcss@next @tailwindcss/postcss@next
```

```bash
yarn add -D tailwindcss@next @tailwindcss/postcss@next
```

### For Tailwind CSS v3

```bash
pnpm add -D tailwindcss postcss autoprefixer
```

```bash
npm install -D tailwindcss postcss autoprefixer
```

```bash
yarn add -D tailwindcss postcss autoprefixer
```

## Configuration

### Tailwind CSS v4 Setup

#### 1. PostCSS Configuration

Create or update `postcss.config.mjs`:

```js filename="postcss.config.mjs"
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

#### 2. Global CSS File

Create or update `app/globals.css`:

```css filename="app/globals.css"
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans), system-ui, sans-serif;
}
```

#### 3. Import in Root Layout

```tsx filename="app/layout.tsx"
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Tailwind CSS v3 Setup

#### 1. Initialize Tailwind

```bash
npx tailwindcss init -p
```

#### 2. Configure Template Paths

Update `tailwind.config.js`:

```js filename="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
```

#### 3. Add Tailwind Directives

Create `app/globals.css`:

```css filename="app/globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

## Advanced Configuration

### Custom Theme with @theme (v4)

```css filename="app/globals.css"
@import "tailwindcss";

@theme inline {
  /* Colors */
  --color-primary: #3b82f6;
  --color-secondary: #8b5cf6;
  --color-accent: #f59e0b;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  /* Typography */
  --font-sans: var(--font-geist-sans), system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

### Extended Theme Configuration (v3)

```js filename="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          900: "#1e3a8a",
        },
        secondary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          500: "#8b5cf6",
          900: "#4c1d95",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      spacing: {
        128: "32rem",
        144: "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
```

## Using with Next.js Font Module

```tsx filename="app/layout.tsx"
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Then reference in CSS:

```css filename="app/globals.css"
@theme inline {
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
}
```

## Dark Mode Configuration

### Using CSS Variables (Recommended)

```css filename="app/globals.css"
@import "tailwindcss";

:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;
  --primary: 221 83% 53%;
  --primary-foreground: 210 40% 98%;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: 0 0% 4%;
    --foreground: 0 0% 93%;
    --card: 0 0% 4%;
    --card-foreground: 0 0% 93%;
    --primary: 217 91% 60%;
    --primary-foreground: 222 47% 11%;
  }
}

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
}
```

### Using Class-based Dark Mode (v3)

```js filename="tailwind.config.js"
module.exports = {
  darkMode: "class",
  // ... rest of config
};
```

```tsx filename="components/theme-provider.tsx"
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
```

## Plugins

### Official Tailwind Plugins

```bash
pnpm add -D @tailwindcss/typography @tailwindcss/forms @tailwindcss/aspect-ratio @tailwindcss/container-queries
```

```js filename="tailwind.config.js"
module.exports = {
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
};
```

## Best Practices

### 1. Use Semantic Class Names

```tsx
// Good
<button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
  Click me
</button>

// Better - Extract to component
function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
      {children}
    </button>
  );
}
```

### 2. Use @apply for Repeated Patterns

```css filename="app/globals.css"
@layer components {
  .btn-primary {
    @apply bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors;
  }
  
  .card {
    @apply bg-card text-card-foreground rounded-lg border shadow-sm p-6;
  }
}
```

### 3. Organize Utilities

```tsx
// Group related utilities
<div className="
  flex items-center justify-between
  px-4 py-2
  bg-white dark:bg-gray-800
  border border-gray-200 dark:border-gray-700
  rounded-lg shadow-sm
">
  Content
</div>
```

### 4. Use CSS Variables for Theming

```css
:root {
  --radius: 0.5rem;
}

@theme inline {
  --radius-sm: calc(var(--radius) - 0.125rem);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 0.125rem);
}
```

## Performance Optimization

### 1. Purge Unused Styles (v3)

Tailwind automatically purges unused styles in production based on your `content` configuration.

### 2. JIT Mode (Default in v3+)

Just-In-Time mode generates styles on-demand, reducing build times and file sizes.

### 3. Optimize for Production

```js filename="next.config.js"
module.exports = {
  experimental: {
    optimizeCss: true, // Enable CSS optimization
  },
};
```

## Troubleshooting

### Styles Not Applying

1. Check that `globals.css` is imported in your root layout
2. Verify PostCSS configuration is correct
3. Ensure content paths include all component files
4. Clear `.next` cache: `rm -rf .next`

### Dark Mode Not Working

1. Verify CSS variables are defined for both light and dark modes
2. Check `@media (prefers-color-scheme: dark)` syntax
3. For class-based dark mode, ensure `darkMode: "class"` is set

### Build Errors

1. Ensure all Tailwind packages are compatible versions
2. Check for syntax errors in `@theme` blocks (v4)
3. Verify PostCSS configuration is valid

## Migration from v3 to v4

### Key Changes

1. Replace `@tailwind` directives with `@import "tailwindcss"`
2. Use `@theme inline` instead of `tailwind.config.js` theme extension
3. Update PostCSS plugin from `tailwindcss` to `@tailwindcss/postcss`
4. CSS variables are now the primary theming mechanism

### Migration Steps

1. Update packages:
```bash
pnpm add -D tailwindcss@next @tailwindcss/postcss@next
```

2. Update PostCSS config:
```js filename="postcss.config.mjs"
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

3. Update CSS file:
```css filename="app/globals.css"
@import "tailwindcss";

@theme inline {
  /* Your theme customizations */
}
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js with Tailwind CSS](https://nextjs.org/docs/app/getting-started/css#tailwind-css)
- [Tailwind CSS v4 Beta](https://tailwindcss.com/blog/tailwindcss-v4-beta)
- [Tailwind UI Components](https://tailwindui.com/)

---

For an overview of all available documentation, see [/docs/llms.txt](/docs/llms.txt)
