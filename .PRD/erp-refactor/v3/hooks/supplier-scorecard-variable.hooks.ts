// TanStack Query hooks for Supplier Scorecard Variable
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierScorecardVariable } from '../types/supplier-scorecard-variable.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierScorecardVariableListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Scorecard Variable records.
 */
export function useSupplierScorecardVariableList(
  params: SupplierScorecardVariableListParams = {},
  options?: Omit<UseQueryOptions<SupplierScorecardVariable[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierScorecardVariable.list(params),
    queryFn: () => apiGet<SupplierScorecardVariable[]>(`/supplier-scorecard-variable${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Scorecard Variable by ID.
 */
export function useSupplierScorecardVariable(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierScorecardVariable | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierScorecardVariable.detail(id ?? ''),
    queryFn: () => apiGet<SupplierScorecardVariable | null>(`/supplier-scorecard-variable/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Scorecard Variable.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierScorecardVariable(
  options?: UseMutationOptions<SupplierScorecardVariable, Error, Partial<SupplierScorecardVariable>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierScorecardVariable>) => apiPost<SupplierScorecardVariable>('/supplier-scorecard-variable', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardVariable.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Scorecard Variable.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierScorecardVariable(
  options?: UseMutationOptions<SupplierScorecardVariable, Error, { id: string; data: Partial<SupplierScorecardVariable> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierScorecardVariable> }) =>
      apiPut<SupplierScorecardVariable>(`/supplier-scorecard-variable/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardVariable.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardVariable.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Scorecard Variable by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierScorecardVariable(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-scorecard-variable/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecardVariable.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
