'use client';

import * as React from 'react';

/**
 * Subscribes to a CSS media query and returns whether it currently matches.
 * SSR-safe — returns `false` on the server and hydrates correctly on the client.
 *
 * @param query - A valid CSS media query string, e.g. `"(min-width: 768px)"`.
 * @returns `true` if the media query matches, `false` otherwise.
 *
 * @example
 * ```tsx
 * const isDesktop = useMediaQuery("(min-width: 1024px)");
 * const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
 * const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);

    const onChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Set initial value
    setMatches(mql.matches);

    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
