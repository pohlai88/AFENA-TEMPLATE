// TanStack Query hooks for Supplier Scorecard Standing
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierScorecardStanding } from '../types/supplier-scorecard-standing.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierScorecardStandingListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Scorecard Standing records.
 */
export function useSupplierScorecardStandingList(
  params: SupplierScorecardStandingListParams = {},
  options?: Omit<UseQueryOptions<SupplierScorecardStanding[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierScorecardStanding.list(params),
    queryFn: () => apiGet<SupplierScorecardStanding[]>(`/supplier-scorecard-standing${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Scorecard Standing by ID.
 */
export function useSupplierScorecardStanding(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierScorecardStanding | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierScorecardStanding.detail(id ?? ''),
    queryFn: () => apiGet<SupplierScorecardStanding | null>(`/supplier-scorecard-standing/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Scorecard Standing.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierScorecardStanding(
  options?: UseMutationOptions<SupplierScorecardStanding, Error, Partial<SupplierScorecardStanding>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierScorecardStanding>) => apiPost<SupplierScorecardStanding>('/supplier-scorecard-standing', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardStanding.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Scorecard Standing.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierScorecardStanding(
  options?: UseMutationOptions<SupplierScorecardStanding, Error, { id: string; data: Partial<SupplierScorecardStanding> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierScorecardStanding> }) =>
      apiPut<SupplierScorecardStanding>(`/supplier-scorecard-standing/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardStanding.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardStanding.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Scorecard Standing by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierScorecardStanding(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-scorecard-standing/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardStanding.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
