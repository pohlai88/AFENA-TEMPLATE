// TanStack Query hooks for Production Plan Sub Assembly Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProductionPlanSubAssemblyItem } from '../types/production-plan-sub-assembly-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProductionPlanSubAssemblyItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Production Plan Sub Assembly Item records.
 */
export function useProductionPlanSubAssemblyItemList(
  params: ProductionPlanSubAssemblyItemListParams = {},
  options?: Omit<UseQueryOptions<ProductionPlanSubAssemblyItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.productionPlanSubAssemblyItem.list(params),
    queryFn: () => apiGet<ProductionPlanSubAssemblyItem[]>(`/production-plan-sub-assembly-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Production Plan Sub Assembly Item by ID.
 */
export function useProductionPlanSubAssemblyItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProductionPlanSubAssemblyItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.productionPlanSubAssemblyItem.detail(id ?? ''),
    queryFn: () => apiGet<ProductionPlanSubAssemblyItem | null>(`/production-plan-sub-assembly-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Production Plan Sub Assembly Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateProductionPlanSubAssemblyItem(
  options?: UseMutationOptions<ProductionPlanSubAssemblyItem, Error, Partial<ProductionPlanSubAssemblyItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductionPlanSubAssemblyItem>) => apiPost<ProductionPlanSubAssemblyItem>('/production-plan-sub-assembly-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanSubAssemblyItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Production Plan Sub Assembly Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProductionPlanSubAssemblyItem(
  options?: UseMutationOptions<ProductionPlanSubAssemblyItem, Error, { id: string; data: Partial<ProductionPlanSubAssemblyItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductionPlanSubAssemblyItem> }) =>
      apiPut<ProductionPlanSubAssemblyItem>(`/production-plan-sub-assembly-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanSubAssemblyItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanSubAssemblyItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Production Plan Sub Assembly Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProductionPlanSubAssemblyItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/production-plan-sub-assembly-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanSubAssemblyItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
