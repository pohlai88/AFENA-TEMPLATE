'use client';

import * as React from 'react';

/**
 * Returns `true` after the component has mounted on the client.
 * Useful for guarding browser-only code in SSR/RSC environments.
 *
 * @example
 * ```tsx
 * const mounted = useMounted();
 * if (!mounted) return <Skeleton />;
 * return <ClientOnlyWidget />;
 * ```
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
