// TanStack Query hooks for Production Plan
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProductionPlan } from '../types/production-plan.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProductionPlanListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Production Plan records.
 */
export function useProductionPlanList(
  params: ProductionPlanListParams = {},
  options?: Omit<UseQueryOptions<ProductionPlan[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.productionPlan.list(params),
    queryFn: () => apiGet<ProductionPlan[]>(`/production-plan${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Production Plan by ID.
 */
export function useProductionPlan(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProductionPlan | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.productionPlan.detail(id ?? ''),
    queryFn: () => apiGet<ProductionPlan | null>(`/production-plan/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Production Plan.
 * Automatically invalidates list queries on success.
 */
export function useCreateProductionPlan(
  options?: UseMutationOptions<ProductionPlan, Error, Partial<ProductionPlan>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductionPlan>) => apiPost<ProductionPlan>('/production-plan', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlan.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Production Plan.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProductionPlan(
  options?: UseMutationOptions<ProductionPlan, Error, { id: string; data: Partial<ProductionPlan> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductionPlan> }) =>
      apiPut<ProductionPlan>(`/production-plan/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlan.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlan.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Production Plan by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProductionPlan(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/production-plan/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlan.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Production Plan (set docstatus = 1).
 */
export function useSubmitProductionPlan(
  options?: UseMutationOptions<ProductionPlan, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProductionPlan>(`/production-plan/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlan.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlan.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Production Plan (set docstatus = 2).
 */
export function useCancelProductionPlan(
  options?: UseMutationOptions<ProductionPlan, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ProductionPlan>(`/production-plan/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlan.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlan.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
