// TanStack Query hooks for Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Item } from '../types/item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item records.
 */
export function useItemList(
  params: ItemListParams = {},
  options?: Omit<UseQueryOptions<Item[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.item.list(params),
    queryFn: () => apiGet<Item[]>(`/item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item by ID.
 */
export function useItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Item | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.item.detail(id ?? ''),
    queryFn: () => apiGet<Item | null>(`/item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateItem(
  options?: UseMutationOptions<Item, Error, Partial<Item>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Item>) => apiPost<Item>('/item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.item.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItem(
  options?: UseMutationOptions<Item, Error, { id: string; data: Partial<Item> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Item> }) =>
      apiPut<Item>(`/item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.item.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.item.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.item.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
