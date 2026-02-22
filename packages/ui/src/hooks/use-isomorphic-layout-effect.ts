'use client';

import * as React from 'react';

/**
 * SSR-safe replacement for `useLayoutEffect`.
 * Falls back to `useEffect` on the server to avoid React warnings.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
