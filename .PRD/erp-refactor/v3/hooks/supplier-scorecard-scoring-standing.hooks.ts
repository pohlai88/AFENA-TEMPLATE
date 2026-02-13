// TanStack Query hooks for Supplier Scorecard Scoring Standing
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierScorecardScoringStanding } from '../types/supplier-scorecard-scoring-standing.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierScorecardScoringStandingListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Scorecard Scoring Standing records.
 */
export function useSupplierScorecardScoringStandingList(
  params: SupplierScorecardScoringStandingListParams = {},
  options?: Omit<UseQueryOptions<SupplierScorecardScoringStanding[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierScorecardScoringStanding.list(params),
    queryFn: () => apiGet<SupplierScorecardScoringStanding[]>(`/supplier-scorecard-scoring-standing${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Scorecard Scoring Standing by ID.
 */
export function useSupplierScorecardScoringStanding(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierScorecardScoringStanding | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierScorecardScoringStanding.detail(id ?? ''),
    queryFn: () => apiGet<SupplierScorecardScoringStanding | null>(`/supplier-scorecard-scoring-standing/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Scorecard Scoring Standing.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierScorecardScoringStanding(
  options?: UseMutationOptions<SupplierScorecardScoringStanding, Error, Partial<SupplierScorecardScoringStanding>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierScorecardScoringStanding>) => apiPost<SupplierScorecardScoringStanding>('/supplier-scorecard-scoring-standing', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringStanding.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Scorecard Scoring Standing.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierScorecardScoringStanding(
  options?: UseMutationOptions<SupplierScorecardScoringStanding, Error, { id: string; data: Partial<SupplierScorecardScoringStanding> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierScorecardScoringStanding> }) =>
      apiPut<SupplierScorecardScoringStanding>(`/supplier-scorecard-scoring-standing/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringStanding.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringStanding.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Scorecard Scoring Standing by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierScorecardScoringStanding(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-scorecard-scoring-standing/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringStanding.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
