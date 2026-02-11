'use client';

import * as React from 'react';

import { ThemeProvider } from './theme-provider';
import { ToasterProvider } from './toaster-provider';
import { GlobalTooltipProvider } from './tooltip-provider';

/**
 * Unified providers wrapper for Afena UI.
 *
 * Composes all required root-level providers in the correct nesting order:
 * 1. **ThemeProvider** — `next-themes` (must be outermost so Toaster reads theme)
 * 2. **GlobalTooltipProvider** — Radix shared tooltip delay
 * 3. **ToasterProvider** — Sonner toast mount (must be inside ThemeProvider)
 *
 * @example
 * ```tsx
 * // apps/web/app/layout.tsx
 * import { Providers } from 'afena-ui/providers';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html lang="en" suppressHydrationWarning>
 *       <body>
 *         <Providers>{children}</Providers>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <GlobalTooltipProvider>
        {children}
        <ToasterProvider />
      </GlobalTooltipProvider>
    </ThemeProvider>
  );
}

export { Providers };
export { ThemeProvider } from './theme-provider';
export { ToasterProvider } from './toaster-provider';
export { GlobalTooltipProvider } from './tooltip-provider';
