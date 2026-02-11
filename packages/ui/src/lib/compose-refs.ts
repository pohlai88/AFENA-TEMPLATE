import * as React from 'react';

type PossibleRef<T> = React.Ref<T> | undefined;

/**
 * Assigns a value to a React ref, handling both callback refs and ref objects.
 */
function setRef<T>(ref: PossibleRef<T>, value: T): void {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref !== null && ref !== undefined) {
    (ref as React.MutableRefObject<T>).current = value;
  }
}

/**
 * Composes multiple React refs into a single callback ref.
 * Follows the Radix UI pattern for merging refs from multiple sources
 * (e.g. internal ref + forwarded ref + third-party library ref).
 *
 * @param refs - Any number of refs (callback, object, or undefined).
 * @returns A single callback ref that updates all provided refs.
 *
 * @example
 * ```tsx
 * const internalRef = useRef<HTMLDivElement>(null);
 *
 * function MyComponent({ ref }: { ref?: React.Ref<HTMLDivElement> }) {
 *   return <div ref={composeRefs(internalRef, ref)} />;
 * }
 * ```
 */
export function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      setRef(ref, node);
    }
  };
}

/**
 * Hook version of `composeRefs` — memoized to avoid unnecessary re-renders.
 *
 * @example
 * ```tsx
 * const composedRef = useComposedRefs(internalRef, forwardedRef);
 * return <div ref={composedRef} />;
 * ```
 */
export function useComposedRefs<T>(
  ...refs: PossibleRef<T>[]
): React.RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(composeRefs(...refs), refs);
}
