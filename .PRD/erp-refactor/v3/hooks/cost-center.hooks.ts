// TanStack Query hooks for Cost Center
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CostCenter } from '../types/cost-center.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CostCenterListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Cost Center records.
 */
export function useCostCenterList(
  params: CostCenterListParams = {},
  options?: Omit<UseQueryOptions<CostCenter[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.costCenter.list(params),
    queryFn: () => apiGet<CostCenter[]>(`/cost-center${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Cost Center by ID.
 */
export function useCostCenter(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CostCenter | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.costCenter.detail(id ?? ''),
    queryFn: () => apiGet<CostCenter | null>(`/cost-center/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Cost Center.
 * Automatically invalidates list queries on success.
 */
export function useCreateCostCenter(
  options?: UseMutationOptions<CostCenter, Error, Partial<CostCenter>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CostCenter>) => apiPost<CostCenter>('/cost-center', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Cost Center.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCostCenter(
  options?: UseMutationOptions<CostCenter, Error, { id: string; data: Partial<CostCenter> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CostCenter> }) =>
      apiPut<CostCenter>(`/cost-center/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenter.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenter.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Cost Center by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCostCenter(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/cost-center/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
