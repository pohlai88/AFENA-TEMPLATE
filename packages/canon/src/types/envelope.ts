import type { KernelError } from './errors';
import type { Receipt } from './receipt';

/**
 * Canonical API response envelope.
 * Every mutation and read operation returns this shape.
 */
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T | undefined;
  error?: KernelError | undefined;
  meta: {
    requestId: string;
    receipt?: Receipt | undefined;
    totalCount?: number;
    nextCursor?: string;
  };
}
