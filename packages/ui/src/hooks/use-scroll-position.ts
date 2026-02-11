'use client';

import * as React from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Tracks the current scroll position of the window or a scrollable element.
 * Uses passive event listeners for optimal scroll performance.
 *
 * @param target - A ref to a scrollable element. Defaults to `window`.
 * @returns `{ x, y }` — the current scroll offsets.
 *
 * @example
 * ```tsx
 * const { y } = useScrollPosition();
 * const isScrolled = y > 64;
 *
 * return <header className={isScrolled ? "shadow-md" : ""}>...</header>;
 * ```
 */
export function useScrollPosition(
  target?: React.RefObject<HTMLElement | null>,
): ScrollPosition {
  const [position, setPosition] = React.useState<ScrollPosition>({
    x: 0,
    y: 0,
  });

  React.useEffect(() => {
    const el = target?.current;

    const getPosition = (): ScrollPosition => {
      if (el) {
        return { x: el.scrollLeft, y: el.scrollTop };
      }
      return { x: window.scrollX, y: window.scrollY };
    };

    const handleScroll = () => {
      const next = getPosition();
      setPosition((prev) => {
        if (prev.x === next.x && prev.y === next.y) return prev;
        return next;
      });
    };

    // Set initial position
    handleScroll();

    const listenTarget = el ?? window;
    listenTarget.addEventListener('scroll', handleScroll, { passive: true });
    return () => listenTarget.removeEventListener('scroll', handleScroll);
  }, [target]);

  return position;
}
