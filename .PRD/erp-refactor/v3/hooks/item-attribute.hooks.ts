// TanStack Query hooks for Item Attribute
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemAttribute } from '../types/item-attribute.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemAttributeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Attribute records.
 */
export function useItemAttributeList(
  params: ItemAttributeListParams = {},
  options?: Omit<UseQueryOptions<ItemAttribute[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemAttribute.list(params),
    queryFn: () => apiGet<ItemAttribute[]>(`/item-attribute${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Attribute by ID.
 */
export function useItemAttribute(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemAttribute | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemAttribute.detail(id ?? ''),
    queryFn: () => apiGet<ItemAttribute | null>(`/item-attribute/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Attribute.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemAttribute(
  options?: UseMutationOptions<ItemAttribute, Error, Partial<ItemAttribute>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemAttribute>) => apiPost<ItemAttribute>('/item-attribute', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAttribute.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Attribute.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemAttribute(
  options?: UseMutationOptions<ItemAttribute, Error, { id: string; data: Partial<ItemAttribute> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemAttribute> }) =>
      apiPut<ItemAttribute>(`/item-attribute/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAttribute.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAttribute.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Attribute by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemAttribute(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-attribute/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAttribute.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
