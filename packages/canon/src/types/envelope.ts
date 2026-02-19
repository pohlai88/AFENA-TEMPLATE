import type { KernelError } from './errors';
import type { MutationReceipt } from './receipt';

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
    receipt?: MutationReceipt | undefined;
  };
}
