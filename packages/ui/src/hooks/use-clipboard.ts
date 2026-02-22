'use client';

import * as React from 'react';

interface UseClipboardOptions {
  /** Duration in ms before `copied` resets to `false`. Default: 2000 */
  timeout?: number;
}

interface UseClipboardReturn {
  /** Copy text to the clipboard. */
  copy: (text: string) => Promise<void>;
  /** Whether the last copy operation succeeded (resets after timeout). */
  copied: boolean;
  /** Error from the last copy attempt, if any. */
  error: Error | null;
}

/**
 * Provides a simple clipboard API with a transient `copied` status indicator.
 *
 * @param options.timeout - How long `copied` stays `true` (default 2000ms).
 * @returns `{ copy, copied, error }`
 *
 * @example
 * ```tsx
 * const { copy, copied } = useClipboard({ timeout: 3000 });
 *
 * return (
 *   <Button onClick={() => copy("Hello!")}>
 *     {copied ? "Copied!" : "Copy"}
 *   </Button>
 * );
 * ```
 */
export function useClipboard(
  options: UseClipboardOptions = {},
): UseClipboardReturn {
  const { timeout = 2000 } = options;
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = React.useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        setError(new Error('Clipboard API not available'));
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), timeout);
      } catch (err) {
        setCopied(false);
        setError(
          err instanceof Error ? err : new Error('Failed to copy to clipboard'),
        );
      }
    },
    [timeout],
  );

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { copy, copied, error };
}
