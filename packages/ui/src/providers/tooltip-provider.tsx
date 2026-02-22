'use client';

import * as React from 'react';

import { TooltipProvider as RadixTooltipProvider } from '../components/tooltip';

/**
 * Global Tooltip provider wrapping Radix's `TooltipProvider`.
 *
 * Placed at the root so all `<Tooltip>` instances share a single
 * delay timer — hovering from one tooltip to another skips the delay.
 *
 * @example
 * ```tsx
 * <GlobalTooltipProvider>
 *   <App />
 * </GlobalTooltipProvider>
 * ```
 */
function GlobalTooltipProvider({
  children,
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof RadixTooltipProvider>) {
  return (
    <RadixTooltipProvider delayDuration={delayDuration} {...props}>
      {children}
    </RadixTooltipProvider>
  );
}

export { GlobalTooltipProvider };
