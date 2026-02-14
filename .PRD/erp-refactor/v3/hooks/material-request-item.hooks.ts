// TanStack Query hooks for Material Request Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MaterialRequestItem } from '../types/material-request-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MaterialRequestItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Material Request Item records.
 */
export function useMaterialRequestItemList(
  params: MaterialRequestItemListParams = {},
  options?: Omit<UseQueryOptions<MaterialRequestItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.materialRequestItem.list(params),
    queryFn: () => apiGet<MaterialRequestItem[]>(`/material-request-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Material Request Item by ID.
 */
export function useMaterialRequestItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MaterialRequestItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.materialRequestItem.detail(id ?? ''),
    queryFn: () => apiGet<MaterialRequestItem | null>(`/material-request-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Material Request Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateMaterialRequestItem(
  options?: UseMutationOptions<MaterialRequestItem, Error, Partial<MaterialRequestItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MaterialRequestItem>) => apiPost<MaterialRequestItem>('/material-request-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequestItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Material Request Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMaterialRequestItem(
  options?: UseMutationOptions<MaterialRequestItem, Error, { id: string; data: Partial<MaterialRequestItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaterialRequestItem> }) =>
      apiPut<MaterialRequestItem>(`/material-request-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequestItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequestItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Material Request Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMaterialRequestItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/material-request-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequestItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
