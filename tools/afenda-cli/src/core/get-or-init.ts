/**
 * Get existing array from map or initialize with empty array.
 * Use instead of map.get(key)!.push(...) to avoid non-null assertions.
 */
export function getOrInit<K, V>(map: Map<K, V[]>, key: K): V[] {
  let arr = map.get(key);
  if (!arr) {
    arr = [];
    map.set(key, arr);
  }
  return arr;
}
