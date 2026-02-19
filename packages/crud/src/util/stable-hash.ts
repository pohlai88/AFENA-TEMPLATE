/**
 * Deterministic 16-character hash for dedup keys.
 *
 * Used for outbox `intent_key` — prevents duplicate outbox rows when a
 * mutation is retried. The hash is stable: same inputs always produce
 * the same output. Uses the Web Crypto API (available in Node 16+ and
 * all modern browsers / edge runtimes).
 *
 * Note: NOT for security use — no salt, no resistance to pre-image attacks.
 * Purely for dedup identity.
 */
export async function stableHash(...parts: string[]): Promise<string> {
  const input = parts.join('\x00'); // null-byte separator avoids collision with concatenation
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32); // 128-bit prefix — collision probability negligible for dedup
}

/**
 * Synchronous variant using a djb2-style hash. Use only when
 * async is not available (e.g. inside a synchronous context or test).
 * Less collision-resistant than stableHash — prefer the async version.
 */
export function stableHashSync(...parts: string[]): string {
  const input = parts.join('\x00');
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}
