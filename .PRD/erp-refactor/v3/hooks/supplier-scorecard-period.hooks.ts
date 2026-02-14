// TanStack Query hooks for Supplier Scorecard Period
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierScorecardPeriod } from '../types/supplier-scorecard-period.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierScorecardPeriodListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Scorecard Period records.
 */
export function useSupplierScorecardPeriodList(
  params: SupplierScorecardPeriodListParams = {},
  options?: Omit<UseQueryOptions<SupplierScorecardPeriod[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierScorecardPeriod.list(params),
    queryFn: () => apiGet<SupplierScorecardPeriod[]>(`/supplier-scorecard-period${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Scorecard Period by ID.
 */
export function useSupplierScorecardPeriod(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierScorecardPeriod | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierScorecardPeriod.detail(id ?? ''),
    queryFn: () => apiGet<SupplierScorecardPeriod | null>(`/supplier-scorecard-period/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Scorecard Period.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierScorecardPeriod(
  options?: UseMutationOptions<SupplierScorecardPeriod, Error, Partial<SupplierScorecardPeriod>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierScorecardPeriod>) => apiPost<SupplierScorecardPeriod>('/supplier-scorecard-period', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardPeriod.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Scorecard Period.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierScorecardPeriod(
  options?: UseMutationOptions<SupplierScorecardPeriod, Error, { id: string; data: Partial<SupplierScorecardPeriod> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierScorecardPeriod> }) =>
      apiPut<SupplierScorecardPeriod>(`/supplier-scorecard-period/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardPeriod.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardPeriod.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Scorecard Period by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierScorecardPeriod(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-scorecard-period/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardPeriod.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Supplier Scorecard Period (set docstatus = 1).
 */
export function useSubmitSupplierScorecardPeriod(
  options?: UseMutationOptions<SupplierScorecardPeriod, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SupplierScorecardPeriod>(`/supplier-scorecard-period/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardPeriod.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardPeriod.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Supplier Scorecard Period (set docstatus = 2).
 */
export function useCancelSupplierScorecardPeriod(
  options?: UseMutationOptions<SupplierScorecardPeriod, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SupplierScorecardPeriod>(`/supplier-scorecard-period/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardPeriod.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardPeriod.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
