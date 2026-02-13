// TanStack Query hooks for Item Attribute Value
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemAttributeValue } from '../types/item-attribute-value.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemAttributeValueListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Attribute Value records.
 */
export function useItemAttributeValueList(
  params: ItemAttributeValueListParams = {},
  options?: Omit<UseQueryOptions<ItemAttributeValue[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemAttributeValue.list(params),
    queryFn: () => apiGet<ItemAttributeValue[]>(`/item-attribute-value${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Attribute Value by ID.
 */
export function useItemAttributeValue(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemAttributeValue | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemAttributeValue.detail(id ?? ''),
    queryFn: () => apiGet<ItemAttributeValue | null>(`/item-attribute-value/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Attribute Value.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemAttributeValue(
  options?: UseMutationOptions<ItemAttributeValue, Error, Partial<ItemAttributeValue>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemAttributeValue>) => apiPost<ItemAttributeValue>('/item-attribute-value', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAttributeValue.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Attribute Value.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemAttributeValue(
  options?: UseMutationOptions<ItemAttributeValue, Error, { id: string; data: Partial<ItemAttributeValue> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemAttributeValue> }) =>
      apiPut<ItemAttributeValue>(`/item-attribute-value/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAttributeValue.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAttributeValue.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Attribute Value by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemAttributeValue(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-attribute-value/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAttributeValue.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
