// TanStack Query hooks for Supplier Scorecard Criteria
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierScorecardCriteria } from '../types/supplier-scorecard-criteria.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierScorecardCriteriaListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Scorecard Criteria records.
 */
export function useSupplierScorecardCriteriaList(
  params: SupplierScorecardCriteriaListParams = {},
  options?: Omit<UseQueryOptions<SupplierScorecardCriteria[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierScorecardCriteria.list(params),
    queryFn: () => apiGet<SupplierScorecardCriteria[]>(`/supplier-scorecard-criteria${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Scorecard Criteria by ID.
 */
export function useSupplierScorecardCriteria(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierScorecardCriteria | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierScorecardCriteria.detail(id ?? ''),
    queryFn: () => apiGet<SupplierScorecardCriteria | null>(`/supplier-scorecard-criteria/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Scorecard Criteria.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierScorecardCriteria(
  options?: UseMutationOptions<SupplierScorecardCriteria, Error, Partial<SupplierScorecardCriteria>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierScorecardCriteria>) => apiPost<SupplierScorecardCriteria>('/supplier-scorecard-criteria', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardCriteria.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Scorecard Criteria.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierScorecardCriteria(
  options?: UseMutationOptions<SupplierScorecardCriteria, Error, { id: string; data: Partial<SupplierScorecardCriteria> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierScorecardCriteria> }) =>
      apiPut<SupplierScorecardCriteria>(`/supplier-scorecard-criteria/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardCriteria.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardCriteria.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Scorecard Criteria by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierScorecardCriteria(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-scorecard-criteria/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardCriteria.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
