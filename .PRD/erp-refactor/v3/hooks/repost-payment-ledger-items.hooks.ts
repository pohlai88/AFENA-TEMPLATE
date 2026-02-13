// TanStack Query hooks for Repost Payment Ledger Items
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RepostPaymentLedgerItems } from '../types/repost-payment-ledger-items.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RepostPaymentLedgerItemsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Repost Payment Ledger Items records.
 */
export function useRepostPaymentLedgerItemsList(
  params: RepostPaymentLedgerItemsListParams = {},
  options?: Omit<UseQueryOptions<RepostPaymentLedgerItems[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.repostPaymentLedgerItems.list(params),
    queryFn: () => apiGet<RepostPaymentLedgerItems[]>(`/repost-payment-ledger-items${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Repost Payment Ledger Items by ID.
 */
export function useRepostPaymentLedgerItems(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RepostPaymentLedgerItems | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.repostPaymentLedgerItems.detail(id ?? ''),
    queryFn: () => apiGet<RepostPaymentLedgerItems | null>(`/repost-payment-ledger-items/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Repost Payment Ledger Items.
 * Automatically invalidates list queries on success.
 */
export function useCreateRepostPaymentLedgerItems(
  options?: UseMutationOptions<RepostPaymentLedgerItems, Error, Partial<RepostPaymentLedgerItems>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RepostPaymentLedgerItems>) => apiPost<RepostPaymentLedgerItems>('/repost-payment-ledger-items', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedgerItems.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Repost Payment Ledger Items.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRepostPaymentLedgerItems(
  options?: UseMutationOptions<RepostPaymentLedgerItems, Error, { id: string; data: Partial<RepostPaymentLedgerItems> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RepostPaymentLedgerItems> }) =>
      apiPut<RepostPaymentLedgerItems>(`/repost-payment-ledger-items/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedgerItems.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedgerItems.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Repost Payment Ledger Items by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRepostPaymentLedgerItems(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/repost-payment-ledger-items/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedgerItems.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
