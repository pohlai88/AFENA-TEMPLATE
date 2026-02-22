/**
 * Cursor types for pagination across different dialects
 */
export type Cursor =
  | { type: 'offset'; offset: number }
  | { type: 'id'; lastId: string }
  | { type: 'composite'; lastUpdatedAt: string; lastId: string }
  | { type: 'token'; nextToken: string }
  | null;
