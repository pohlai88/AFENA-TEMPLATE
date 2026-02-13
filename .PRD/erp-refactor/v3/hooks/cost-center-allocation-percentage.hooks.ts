// TanStack Query hooks for Cost Center Allocation Percentage
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CostCenterAllocationPercentage } from '../types/cost-center-allocation-percentage.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CostCenterAllocationPercentageListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Cost Center Allocation Percentage records.
 */
export function useCostCenterAllocationPercentageList(
  params: CostCenterAllocationPercentageListParams = {},
  options?: Omit<UseQueryOptions<CostCenterAllocationPercentage[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.costCenterAllocationPercentage.list(params),
    queryFn: () => apiGet<CostCenterAllocationPercentage[]>(`/cost-center-allocation-percentage${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Cost Center Allocation Percentage by ID.
 */
export function useCostCenterAllocationPercentage(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CostCenterAllocationPercentage | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.costCenterAllocationPercentage.detail(id ?? ''),
    queryFn: () => apiGet<CostCenterAllocationPercentage | null>(`/cost-center-allocation-percentage/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Cost Center Allocation Percentage.
 * Automatically invalidates list queries on success.
 */
export function useCreateCostCenterAllocationPercentage(
  options?: UseMutationOptions<CostCenterAllocationPercentage, Error, Partial<CostCenterAllocationPercentage>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CostCenterAllocationPercentage>) => apiPost<CostCenterAllocationPercentage>('/cost-center-allocation-percentage', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocationPercentage.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Cost Center Allocation Percentage.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCostCenterAllocationPercentage(
  options?: UseMutationOptions<CostCenterAllocationPercentage, Error, { id: string; data: Partial<CostCenterAllocationPercentage> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CostCenterAllocationPercentage> }) =>
      apiPut<CostCenterAllocationPercentage>(`/cost-center-allocation-percentage/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocationPercentage.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocationPercentage.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Cost Center Allocation Percentage by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCostCenterAllocationPercentage(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/cost-center-allocation-percentage/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocationPercentage.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
