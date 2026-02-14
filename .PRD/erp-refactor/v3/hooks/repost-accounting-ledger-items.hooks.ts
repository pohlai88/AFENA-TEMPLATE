// TanStack Query hooks for Repost Accounting Ledger Items
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RepostAccountingLedgerItems } from '../types/repost-accounting-ledger-items.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RepostAccountingLedgerItemsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Repost Accounting Ledger Items records.
 */
export function useRepostAccountingLedgerItemsList(
  params: RepostAccountingLedgerItemsListParams = {},
  options?: Omit<UseQueryOptions<RepostAccountingLedgerItems[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.repostAccountingLedgerItems.list(params),
    queryFn: () => apiGet<RepostAccountingLedgerItems[]>(`/repost-accounting-ledger-items${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Repost Accounting Ledger Items by ID.
 */
export function useRepostAccountingLedgerItems(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RepostAccountingLedgerItems | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.repostAccountingLedgerItems.detail(id ?? ''),
    queryFn: () => apiGet<RepostAccountingLedgerItems | null>(`/repost-accounting-ledger-items/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Repost Accounting Ledger Items.
 * Automatically invalidates list queries on success.
 */
export function useCreateRepostAccountingLedgerItems(
  options?: UseMutationOptions<RepostAccountingLedgerItems, Error, Partial<RepostAccountingLedgerItems>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RepostAccountingLedgerItems>) => apiPost<RepostAccountingLedgerItems>('/repost-accounting-ledger-items', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedgerItems.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Repost Accounting Ledger Items.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRepostAccountingLedgerItems(
  options?: UseMutationOptions<RepostAccountingLedgerItems, Error, { id: string; data: Partial<RepostAccountingLedgerItems> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RepostAccountingLedgerItems> }) =>
      apiPut<RepostAccountingLedgerItems>(`/repost-accounting-ledger-items/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedgerItems.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedgerItems.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Repost Accounting Ledger Items by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRepostAccountingLedgerItems(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/repost-accounting-ledger-items/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedgerItems.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
