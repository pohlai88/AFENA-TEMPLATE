// TanStack Query hooks for Item Price
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemPrice } from '../types/item-price.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemPriceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Price records.
 */
export function useItemPriceList(
  params: ItemPriceListParams = {},
  options?: Omit<UseQueryOptions<ItemPrice[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemPrice.list(params),
    queryFn: () => apiGet<ItemPrice[]>(`/item-price${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Price by ID.
 */
export function useItemPrice(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemPrice | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemPrice.detail(id ?? ''),
    queryFn: () => apiGet<ItemPrice | null>(`/item-price/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Price.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemPrice(
  options?: UseMutationOptions<ItemPrice, Error, Partial<ItemPrice>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemPrice>) => apiPost<ItemPrice>('/item-price', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemPrice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Price.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemPrice(
  options?: UseMutationOptions<ItemPrice, Error, { id: string; data: Partial<ItemPrice> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemPrice> }) =>
      apiPut<ItemPrice>(`/item-price/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemPrice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemPrice.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Price by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemPrice(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-price/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemPrice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
