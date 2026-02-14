// TanStack Query hooks for Supplier Scorecard Scoring Criteria
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierScorecardScoringCriteria } from '../types/supplier-scorecard-scoring-criteria.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierScorecardScoringCriteriaListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Scorecard Scoring Criteria records.
 */
export function useSupplierScorecardScoringCriteriaList(
  params: SupplierScorecardScoringCriteriaListParams = {},
  options?: Omit<UseQueryOptions<SupplierScorecardScoringCriteria[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierScorecardScoringCriteria.list(params),
    queryFn: () => apiGet<SupplierScorecardScoringCriteria[]>(`/supplier-scorecard-scoring-criteria${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Scorecard Scoring Criteria by ID.
 */
export function useSupplierScorecardScoringCriteria(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierScorecardScoringCriteria | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierScorecardScoringCriteria.detail(id ?? ''),
    queryFn: () => apiGet<SupplierScorecardScoringCriteria | null>(`/supplier-scorecard-scoring-criteria/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Scorecard Scoring Criteria.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierScorecardScoringCriteria(
  options?: UseMutationOptions<SupplierScorecardScoringCriteria, Error, Partial<SupplierScorecardScoringCriteria>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierScorecardScoringCriteria>) => apiPost<SupplierScorecardScoringCriteria>('/supplier-scorecard-scoring-criteria', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringCriteria.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Scorecard Scoring Criteria.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierScorecardScoringCriteria(
  options?: UseMutationOptions<SupplierScorecardScoringCriteria, Error, { id: string; data: Partial<SupplierScorecardScoringCriteria> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierScorecardScoringCriteria> }) =>
      apiPut<SupplierScorecardScoringCriteria>(`/supplier-scorecard-scoring-criteria/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringCriteria.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringCriteria.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Scorecard Scoring Criteria by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierScorecardScoringCriteria(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-scorecard-scoring-criteria/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringCriteria.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
