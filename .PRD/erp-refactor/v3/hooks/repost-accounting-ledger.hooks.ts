// TanStack Query hooks for Repost Accounting Ledger
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RepostAccountingLedger } from '../types/repost-accounting-ledger.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RepostAccountingLedgerListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Repost Accounting Ledger records.
 */
export function useRepostAccountingLedgerList(
  params: RepostAccountingLedgerListParams = {},
  options?: Omit<UseQueryOptions<RepostAccountingLedger[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.repostAccountingLedger.list(params),
    queryFn: () => apiGet<RepostAccountingLedger[]>(`/repost-accounting-ledger${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Repost Accounting Ledger by ID.
 */
export function useRepostAccountingLedger(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RepostAccountingLedger | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.repostAccountingLedger.detail(id ?? ''),
    queryFn: () => apiGet<RepostAccountingLedger | null>(`/repost-accounting-ledger/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Repost Accounting Ledger.
 * Automatically invalidates list queries on success.
 */
export function useCreateRepostAccountingLedger(
  options?: UseMutationOptions<RepostAccountingLedger, Error, Partial<RepostAccountingLedger>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RepostAccountingLedger>) => apiPost<RepostAccountingLedger>('/repost-accounting-ledger', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedger.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Repost Accounting Ledger.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRepostAccountingLedger(
  options?: UseMutationOptions<RepostAccountingLedger, Error, { id: string; data: Partial<RepostAccountingLedger> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RepostAccountingLedger> }) =>
      apiPut<RepostAccountingLedger>(`/repost-accounting-ledger/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedger.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedger.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Repost Accounting Ledger by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRepostAccountingLedger(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/repost-accounting-ledger/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedger.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Repost Accounting Ledger (set docstatus = 1).
 */
export function useSubmitRepostAccountingLedger(
  options?: UseMutationOptions<RepostAccountingLedger, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<RepostAccountingLedger>(`/repost-accounting-ledger/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedger.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedger.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Repost Accounting Ledger (set docstatus = 2).
 */
export function useCancelRepostAccountingLedger(
  options?: UseMutationOptions<RepostAccountingLedger, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<RepostAccountingLedger>(`/repost-accounting-ledger/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedger.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostAccountingLedger.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
