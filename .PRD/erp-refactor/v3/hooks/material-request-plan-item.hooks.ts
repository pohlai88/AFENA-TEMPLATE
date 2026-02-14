// TanStack Query hooks for Material Request Plan Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MaterialRequestPlanItem } from '../types/material-request-plan-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MaterialRequestPlanItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Material Request Plan Item records.
 */
export function useMaterialRequestPlanItemList(
  params: MaterialRequestPlanItemListParams = {},
  options?: Omit<UseQueryOptions<MaterialRequestPlanItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.materialRequestPlanItem.list(params),
    queryFn: () => apiGet<MaterialRequestPlanItem[]>(`/material-request-plan-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Material Request Plan Item by ID.
 */
export function useMaterialRequestPlanItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MaterialRequestPlanItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.materialRequestPlanItem.detail(id ?? ''),
    queryFn: () => apiGet<MaterialRequestPlanItem | null>(`/material-request-plan-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Material Request Plan Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateMaterialRequestPlanItem(
  options?: UseMutationOptions<MaterialRequestPlanItem, Error, Partial<MaterialRequestPlanItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MaterialRequestPlanItem>) => apiPost<MaterialRequestPlanItem>('/material-request-plan-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequestPlanItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Material Request Plan Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMaterialRequestPlanItem(
  options?: UseMutationOptions<MaterialRequestPlanItem, Error, { id: string; data: Partial<MaterialRequestPlanItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaterialRequestPlanItem> }) =>
      apiPut<MaterialRequestPlanItem>(`/material-request-plan-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequestPlanItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequestPlanItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Material Request Plan Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMaterialRequestPlanItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/material-request-plan-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequestPlanItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
