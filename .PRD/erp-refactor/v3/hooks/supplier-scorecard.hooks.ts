// TanStack Query hooks for Supplier Scorecard
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SupplierScorecard } from '../types/supplier-scorecard.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SupplierScorecardListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Supplier Scorecard records.
 */
export function useSupplierScorecardList(
  params: SupplierScorecardListParams = {},
  options?: Omit<UseQueryOptions<SupplierScorecard[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.supplierScorecard.list(params),
    queryFn: () => apiGet<SupplierScorecard[]>(`/supplier-scorecard${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Supplier Scorecard by ID.
 */
export function useSupplierScorecard(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SupplierScorecard | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.supplierScorecard.detail(id ?? ''),
    queryFn: () => apiGet<SupplierScorecard | null>(`/supplier-scorecard/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Supplier Scorecard.
 * Automatically invalidates list queries on success.
 */
export function useCreateSupplierScorecard(
  options?: UseMutationOptions<SupplierScorecard, Error, Partial<SupplierScorecard>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SupplierScorecard>) => apiPost<SupplierScorecard>('/supplier-scorecard', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecard.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Supplier Scorecard.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSupplierScorecard(
  options?: UseMutationOptions<SupplierScorecard, Error, { id: string; data: Partial<SupplierScorecard> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SupplierScorecard> }) =>
      apiPut<SupplierScorecard>(`/supplier-scorecard/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecard.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecard.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Supplier Scorecard by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSupplierScorecard(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/supplier-scorecard/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.supplierScorecard.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
