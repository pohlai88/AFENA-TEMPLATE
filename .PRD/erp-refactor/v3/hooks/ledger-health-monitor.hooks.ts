// TanStack Query hooks for Ledger Health Monitor
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LedgerHealthMonitor } from '../types/ledger-health-monitor.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LedgerHealthMonitorListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Ledger Health Monitor records.
 */
export function useLedgerHealthMonitorList(
  params: LedgerHealthMonitorListParams = {},
  options?: Omit<UseQueryOptions<LedgerHealthMonitor[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.ledgerHealthMonitor.list(params),
    queryFn: () => apiGet<LedgerHealthMonitor[]>(`/ledger-health-monitor${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Ledger Health Monitor by ID.
 */
export function useLedgerHealthMonitor(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LedgerHealthMonitor | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.ledgerHealthMonitor.detail(id ?? ''),
    queryFn: () => apiGet<LedgerHealthMonitor | null>(`/ledger-health-monitor/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Ledger Health Monitor.
 * Automatically invalidates list queries on success.
 */
export function useCreateLedgerHealthMonitor(
  options?: UseMutationOptions<LedgerHealthMonitor, Error, Partial<LedgerHealthMonitor>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LedgerHealthMonitor>) => apiPost<LedgerHealthMonitor>('/ledger-health-monitor', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealthMonitor.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Ledger Health Monitor.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLedgerHealthMonitor(
  options?: UseMutationOptions<LedgerHealthMonitor, Error, { id: string; data: Partial<LedgerHealthMonitor> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LedgerHealthMonitor> }) =>
      apiPut<LedgerHealthMonitor>(`/ledger-health-monitor/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealthMonitor.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealthMonitor.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Ledger Health Monitor by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLedgerHealthMonitor(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/ledger-health-monitor/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealthMonitor.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
