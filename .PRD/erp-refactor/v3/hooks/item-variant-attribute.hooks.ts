// TanStack Query hooks for Item Variant Attribute
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemVariantAttribute } from '../types/item-variant-attribute.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemVariantAttributeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Variant Attribute records.
 */
export function useItemVariantAttributeList(
  params: ItemVariantAttributeListParams = {},
  options?: Omit<UseQueryOptions<ItemVariantAttribute[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemVariantAttribute.list(params),
    queryFn: () => apiGet<ItemVariantAttribute[]>(`/item-variant-attribute${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Variant Attribute by ID.
 */
export function useItemVariantAttribute(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemVariantAttribute | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemVariantAttribute.detail(id ?? ''),
    queryFn: () => apiGet<ItemVariantAttribute | null>(`/item-variant-attribute/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Variant Attribute.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemVariantAttribute(
  options?: UseMutationOptions<ItemVariantAttribute, Error, Partial<ItemVariantAttribute>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemVariantAttribute>) => apiPost<ItemVariantAttribute>('/item-variant-attribute', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariantAttribute.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Variant Attribute.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemVariantAttribute(
  options?: UseMutationOptions<ItemVariantAttribute, Error, { id: string; data: Partial<ItemVariantAttribute> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemVariantAttribute> }) =>
      apiPut<ItemVariantAttribute>(`/item-variant-attribute/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariantAttribute.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariantAttribute.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Variant Attribute by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemVariantAttribute(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-variant-attribute/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariantAttribute.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
