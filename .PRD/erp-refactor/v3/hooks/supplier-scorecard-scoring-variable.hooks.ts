// TanStack Query hooks for Supplier Scorecard Scoring Variable
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierScorecardScoringVariable } from '../types/supplier-scorecard-scoring-variable.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierScorecardScoringVariableListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Scorecard Scoring Variable records.
 */
export function useSupplierScorecardScoringVariableList(
  params: SupplierScorecardScoringVariableListParams = {},
  options?: Omit<UseQueryOptions<SupplierScorecardScoringVariable[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierScorecardScoringVariable.list(params),
    queryFn: () => apiGet<SupplierScorecardScoringVariable[]>(`/supplier-scorecard-scoring-variable${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Scorecard Scoring Variable by ID.
 */
export function useSupplierScorecardScoringVariable(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierScorecardScoringVariable | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierScorecardScoringVariable.detail(id ?? ''),
    queryFn: () => apiGet<SupplierScorecardScoringVariable | null>(`/supplier-scorecard-scoring-variable/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Scorecard Scoring Variable.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierScorecardScoringVariable(
  options?: UseMutationOptions<SupplierScorecardScoringVariable, Error, Partial<SupplierScorecardScoringVariable>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierScorecardScoringVariable>) => apiPost<SupplierScorecardScoringVariable>('/supplier-scorecard-scoring-variable', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringVariable.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Scorecard Scoring Variable.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierScorecardScoringVariable(
  options?: UseMutationOptions<SupplierScorecardScoringVariable, Error, { id: string; data: Partial<SupplierScorecardScoringVariable> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierScorecardScoringVariable> }) =>
      apiPut<SupplierScorecardScoringVariable>(`/supplier-scorecard-scoring-variable/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringVariable.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringVariable.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Scorecard Scoring Variable by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierScorecardScoringVariable(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-scorecard-scoring-variable/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardScoringVariable.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
