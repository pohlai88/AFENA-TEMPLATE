'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

/**
 * Theme provider wrapping `next-themes`.
 *
 * - `attribute="class"` — sets `.dark` on `<html>`, which the bridge CSS layer targets.
 * - `defaultTheme="system"` — respects OS preference out of the box.
 * - `enableSystem` — allows "system" as a valid theme value.
 * - `disableTransitionOnChange` — prevents FOUC flash during theme switch.
 *
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export { ThemeProvider };
