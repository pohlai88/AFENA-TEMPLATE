// TanStack Query hooks for Item Variant
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemVariant } from '../types/item-variant.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemVariantListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Variant records.
 */
export function useItemVariantList(
  params: ItemVariantListParams = {},
  options?: Omit<UseQueryOptions<ItemVariant[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemVariant.list(params),
    queryFn: () => apiGet<ItemVariant[]>(`/item-variant${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Variant by ID.
 */
export function useItemVariant(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemVariant | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemVariant.detail(id ?? ''),
    queryFn: () => apiGet<ItemVariant | null>(`/item-variant/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Variant.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemVariant(
  options?: UseMutationOptions<ItemVariant, Error, Partial<ItemVariant>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemVariant>) => apiPost<ItemVariant>('/item-variant', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariant.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Variant.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemVariant(
  options?: UseMutationOptions<ItemVariant, Error, { id: string; data: Partial<ItemVariant> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemVariant> }) =>
      apiPut<ItemVariant>(`/item-variant/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariant.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariant.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Variant by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemVariant(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-variant/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemVariant.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
