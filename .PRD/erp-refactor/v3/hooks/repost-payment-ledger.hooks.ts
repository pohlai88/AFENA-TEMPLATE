// TanStack Query hooks for Repost Payment Ledger
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RepostPaymentLedger } from '../types/repost-payment-ledger.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RepostPaymentLedgerListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Repost Payment Ledger records.
 */
export function useRepostPaymentLedgerList(
  params: RepostPaymentLedgerListParams = {},
  options?: Omit<UseQueryOptions<RepostPaymentLedger[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.repostPaymentLedger.list(params),
    queryFn: () => apiGet<RepostPaymentLedger[]>(`/repost-payment-ledger${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Repost Payment Ledger by ID.
 */
export function useRepostPaymentLedger(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RepostPaymentLedger | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.repostPaymentLedger.detail(id ?? ''),
    queryFn: () => apiGet<RepostPaymentLedger | null>(`/repost-payment-ledger/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Repost Payment Ledger.
 * Automatically invalidates list queries on success.
 */
export function useCreateRepostPaymentLedger(
  options?: UseMutationOptions<RepostPaymentLedger, Error, Partial<RepostPaymentLedger>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RepostPaymentLedger>) => apiPost<RepostPaymentLedger>('/repost-payment-ledger', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedger.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Repost Payment Ledger.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRepostPaymentLedger(
  options?: UseMutationOptions<RepostPaymentLedger, Error, { id: string; data: Partial<RepostPaymentLedger> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RepostPaymentLedger> }) =>
      apiPut<RepostPaymentLedger>(`/repost-payment-ledger/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedger.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedger.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Repost Payment Ledger by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRepostPaymentLedger(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/repost-payment-ledger/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedger.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Repost Payment Ledger (set docstatus = 1).
 */
export function useSubmitRepostPaymentLedger(
  options?: UseMutationOptions<RepostPaymentLedger, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<RepostPaymentLedger>(`/repost-payment-ledger/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedger.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedger.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Repost Payment Ledger (set docstatus = 2).
 */
export function useCancelRepostPaymentLedger(
  options?: UseMutationOptions<RepostPaymentLedger, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<RepostPaymentLedger>(`/repost-payment-ledger/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedger.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.repostPaymentLedger.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
