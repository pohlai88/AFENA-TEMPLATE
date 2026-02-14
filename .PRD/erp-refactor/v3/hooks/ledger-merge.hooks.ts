// TanStack Query hooks for Ledger Merge
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LedgerMerge } from '../types/ledger-merge.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LedgerMergeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Ledger Merge records.
 */
export function useLedgerMergeList(
  params: LedgerMergeListParams = {},
  options?: Omit<UseQueryOptions<LedgerMerge[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.ledgerMerge.list(params),
    queryFn: () => apiGet<LedgerMerge[]>(`/ledger-merge${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Ledger Merge by ID.
 */
export function useLedgerMerge(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LedgerMerge | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.ledgerMerge.detail(id ?? ''),
    queryFn: () => apiGet<LedgerMerge | null>(`/ledger-merge/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Ledger Merge.
 * Automatically invalidates list queries on success.
 */
export function useCreateLedgerMerge(
  options?: UseMutationOptions<LedgerMerge, Error, Partial<LedgerMerge>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LedgerMerge>) => apiPost<LedgerMerge>('/ledger-merge', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerMerge.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Ledger Merge.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLedgerMerge(
  options?: UseMutationOptions<LedgerMerge, Error, { id: string; data: Partial<LedgerMerge> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LedgerMerge> }) =>
      apiPut<LedgerMerge>(`/ledger-merge/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerMerge.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerMerge.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Ledger Merge by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLedgerMerge(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/ledger-merge/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerMerge.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
