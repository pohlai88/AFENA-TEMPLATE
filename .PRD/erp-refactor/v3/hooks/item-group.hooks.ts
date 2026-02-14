// TanStack Query hooks for Item Group
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemGroup } from '../types/item-group.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemGroupListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Group records.
 */
export function useItemGroupList(
  params: ItemGroupListParams = {},
  options?: Omit<UseQueryOptions<ItemGroup[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemGroup.list(params),
    queryFn: () => apiGet<ItemGroup[]>(`/item-group${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Group by ID.
 */
export function useItemGroup(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemGroup | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemGroup.detail(id ?? ''),
    queryFn: () => apiGet<ItemGroup | null>(`/item-group/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Group.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemGroup(
  options?: UseMutationOptions<ItemGroup, Error, Partial<ItemGroup>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemGroup>) => apiPost<ItemGroup>('/item-group', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Group.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemGroup(
  options?: UseMutationOptions<ItemGroup, Error, { id: string; data: Partial<ItemGroup> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemGroup> }) =>
      apiPut<ItemGroup>(`/item-group/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemGroup.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemGroup.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Group by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemGroup(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-group/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
