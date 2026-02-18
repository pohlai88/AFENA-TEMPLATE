'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export type ThemeProviderProps = React.PropsWithChildren<
  React.ComponentPropsWithoutRef<typeof NextThemesProvider>
>;

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
function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Type assertion needed: next-themes v0.4.x types don't include children in ThemeProviderProps
  const Provider = NextThemesProvider as React.ComponentType<ThemeProviderProps>;
  
  return (
    <Provider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </Provider>
  );
}

export { ThemeProvider };

