// TanStack Query hooks for Ledger Health
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LedgerHealth } from '../types/ledger-health.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LedgerHealthListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Ledger Health records.
 */
export function useLedgerHealthList(
  params: LedgerHealthListParams = {},
  options?: Omit<UseQueryOptions<LedgerHealth[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.ledgerHealth.list(params),
    queryFn: () => apiGet<LedgerHealth[]>(`/ledger-health${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Ledger Health by ID.
 */
export function useLedgerHealth(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LedgerHealth | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.ledgerHealth.detail(id ?? ''),
    queryFn: () => apiGet<LedgerHealth | null>(`/ledger-health/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Ledger Health.
 * Automatically invalidates list queries on success.
 */
export function useCreateLedgerHealth(
  options?: UseMutationOptions<LedgerHealth, Error, Partial<LedgerHealth>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LedgerHealth>) => apiPost<LedgerHealth>('/ledger-health', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealth.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Ledger Health.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLedgerHealth(
  options?: UseMutationOptions<LedgerHealth, Error, { id: string; data: Partial<LedgerHealth> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LedgerHealth> }) =>
      apiPut<LedgerHealth>(`/ledger-health/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealth.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealth.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Ledger Health by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLedgerHealth(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/ledger-health/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealth.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
