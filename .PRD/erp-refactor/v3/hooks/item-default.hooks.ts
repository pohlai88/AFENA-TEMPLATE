// TanStack Query hooks for Item Default
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemDefault } from '../types/item-default.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemDefaultListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Default records.
 */
export function useItemDefaultList(
  params: ItemDefaultListParams = {},
  options?: Omit<UseQueryOptions<ItemDefault[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemDefault.list(params),
    queryFn: () => apiGet<ItemDefault[]>(`/item-default${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Default by ID.
 */
export function useItemDefault(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemDefault | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemDefault.detail(id ?? ''),
    queryFn: () => apiGet<ItemDefault | null>(`/item-default/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Default.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemDefault(
  options?: UseMutationOptions<ItemDefault, Error, Partial<ItemDefault>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemDefault>) => apiPost<ItemDefault>('/item-default', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemDefault.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Default.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemDefault(
  options?: UseMutationOptions<ItemDefault, Error, { id: string; data: Partial<ItemDefault> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemDefault> }) =>
      apiPut<ItemDefault>(`/item-default/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemDefault.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemDefault.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Default by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemDefault(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-default/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemDefault.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
