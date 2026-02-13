// TanStack Query hooks for Ledger Health Monitor Company
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LedgerHealthMonitorCompany } from '../types/ledger-health-monitor-company.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LedgerHealthMonitorCompanyListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Ledger Health Monitor Company records.
 */
export function useLedgerHealthMonitorCompanyList(
  params: LedgerHealthMonitorCompanyListParams = {},
  options?: Omit<UseQueryOptions<LedgerHealthMonitorCompany[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.ledgerHealthMonitorCompany.list(params),
    queryFn: () => apiGet<LedgerHealthMonitorCompany[]>(`/ledger-health-monitor-company${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Ledger Health Monitor Company by ID.
 */
export function useLedgerHealthMonitorCompany(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LedgerHealthMonitorCompany | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.ledgerHealthMonitorCompany.detail(id ?? ''),
    queryFn: () => apiGet<LedgerHealthMonitorCompany | null>(`/ledger-health-monitor-company/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Ledger Health Monitor Company.
 * Automatically invalidates list queries on success.
 */
export function useCreateLedgerHealthMonitorCompany(
  options?: UseMutationOptions<LedgerHealthMonitorCompany, Error, Partial<LedgerHealthMonitorCompany>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LedgerHealthMonitorCompany>) => apiPost<LedgerHealthMonitorCompany>('/ledger-health-monitor-company', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealthMonitorCompany.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Ledger Health Monitor Company.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLedgerHealthMonitorCompany(
  options?: UseMutationOptions<LedgerHealthMonitorCompany, Error, { id: string; data: Partial<LedgerHealthMonitorCompany> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LedgerHealthMonitorCompany> }) =>
      apiPut<LedgerHealthMonitorCompany>(`/ledger-health-monitor-company/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealthMonitorCompany.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealthMonitorCompany.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Ledger Health Monitor Company by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLedgerHealthMonitorCompany(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/ledger-health-monitor-company/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ledgerHealthMonitorCompany.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
