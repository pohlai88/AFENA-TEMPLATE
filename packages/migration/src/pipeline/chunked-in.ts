import { inArray, or } from 'drizzle-orm';

import type { Column, SQL } from 'drizzle-orm';

/**
 * SPD-04: Chunked IN lists.
 *
 * Postgres has a practical limit of ~32K parameters per query.
 * This utility splits large value arrays into chunks and combines
 * them with OR, keeping each chunk under the limit.
 */
const DEFAULT_CHUNK_SIZE = 5000;

export function chunkedInArray<T>(
  column: Column,
  values: T[],
  chunkSize: number = DEFAULT_CHUNK_SIZE,
): SQL | undefined {
  if (values.length === 0) return undefined;
  if (values.length <= chunkSize) return inArray(column, values);

  const conditions: SQL[] = [];
  for (let i = 0; i < values.length; i += chunkSize) {
    const chunk = values.slice(i, i + chunkSize);
    conditions.push(inArray(column, chunk));
  }

  return or(...conditions);
}
