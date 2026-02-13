// TanStack Query hooks for Production Plan Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProductionPlanItem } from '../types/production-plan-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProductionPlanItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Production Plan Item records.
 */
export function useProductionPlanItemList(
  params: ProductionPlanItemListParams = {},
  options?: Omit<UseQueryOptions<ProductionPlanItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.productionPlanItem.list(params),
    queryFn: () => apiGet<ProductionPlanItem[]>(`/production-plan-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Production Plan Item by ID.
 */
export function useProductionPlanItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProductionPlanItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.productionPlanItem.detail(id ?? ''),
    queryFn: () => apiGet<ProductionPlanItem | null>(`/production-plan-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Production Plan Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateProductionPlanItem(
  options?: UseMutationOptions<ProductionPlanItem, Error, Partial<ProductionPlanItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProductionPlanItem>) => apiPost<ProductionPlanItem>('/production-plan-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Production Plan Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProductionPlanItem(
  options?: UseMutationOptions<ProductionPlanItem, Error, { id: string; data: Partial<ProductionPlanItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductionPlanItem> }) =>
      apiPut<ProductionPlanItem>(`/production-plan-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Production Plan Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProductionPlanItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/production-plan-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.productionPlanItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
