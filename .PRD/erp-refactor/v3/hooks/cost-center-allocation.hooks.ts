// TanStack Query hooks for Cost Center Allocation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CostCenterAllocation } from '../types/cost-center-allocation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CostCenterAllocationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Cost Center Allocation records.
 */
export function useCostCenterAllocationList(
  params: CostCenterAllocationListParams = {},
  options?: Omit<UseQueryOptions<CostCenterAllocation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.costCenterAllocation.list(params),
    queryFn: () => apiGet<CostCenterAllocation[]>(`/cost-center-allocation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Cost Center Allocation by ID.
 */
export function useCostCenterAllocation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CostCenterAllocation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.costCenterAllocation.detail(id ?? ''),
    queryFn: () => apiGet<CostCenterAllocation | null>(`/cost-center-allocation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Cost Center Allocation.
 * Automatically invalidates list queries on success.
 */
export function useCreateCostCenterAllocation(
  options?: UseMutationOptions<CostCenterAllocation, Error, Partial<CostCenterAllocation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CostCenterAllocation>) => apiPost<CostCenterAllocation>('/cost-center-allocation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Cost Center Allocation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCostCenterAllocation(
  options?: UseMutationOptions<CostCenterAllocation, Error, { id: string; data: Partial<CostCenterAllocation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CostCenterAllocation> }) =>
      apiPut<CostCenterAllocation>(`/cost-center-allocation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Cost Center Allocation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCostCenterAllocation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/cost-center-allocation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Cost Center Allocation (set docstatus = 1).
 */
export function useSubmitCostCenterAllocation(
  options?: UseMutationOptions<CostCenterAllocation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<CostCenterAllocation>(`/cost-center-allocation/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Cost Center Allocation (set docstatus = 2).
 */
export function useCancelCostCenterAllocation(
  options?: UseMutationOptions<CostCenterAllocation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<CostCenterAllocation>(`/cost-center-allocation/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.costCenterAllocation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
