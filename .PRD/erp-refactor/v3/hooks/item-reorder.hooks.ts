// TanStack Query hooks for Item Reorder
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemReorder } from '../types/item-reorder.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemReorderListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Reorder records.
 */
export function useItemReorderList(
  params: ItemReorderListParams = {},
  options?: Omit<UseQueryOptions<ItemReorder[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemReorder.list(params),
    queryFn: () => apiGet<ItemReorder[]>(`/item-reorder${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Reorder by ID.
 */
export function useItemReorder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemReorder | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemReorder.detail(id ?? ''),
    queryFn: () => apiGet<ItemReorder | null>(`/item-reorder/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Reorder.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemReorder(
  options?: UseMutationOptions<ItemReorder, Error, Partial<ItemReorder>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemReorder>) => apiPost<ItemReorder>('/item-reorder', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemReorder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Reorder.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemReorder(
  options?: UseMutationOptions<ItemReorder, Error, { id: string; data: Partial<ItemReorder> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemReorder> }) =>
      apiPut<ItemReorder>(`/item-reorder/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemReorder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemReorder.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Reorder by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemReorder(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-reorder/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemReorder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
