// TanStack Query hooks for Item Supplier
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemSupplier } from '../types/item-supplier.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemSupplierListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Supplier records.
 */
export function useItemSupplierList(
  params: ItemSupplierListParams = {},
  options?: Omit<UseQueryOptions<ItemSupplier[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemSupplier.list(params),
    queryFn: () => apiGet<ItemSupplier[]>(`/item-supplier${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Supplier by ID.
 */
export function useItemSupplier(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemSupplier | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemSupplier.detail(id ?? ''),
    queryFn: () => apiGet<ItemSupplier | null>(`/item-supplier/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Supplier.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemSupplier(
  options?: UseMutationOptions<ItemSupplier, Error, Partial<ItemSupplier>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemSupplier>) => apiPost<ItemSupplier>('/item-supplier', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemSupplier.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Supplier.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemSupplier(
  options?: UseMutationOptions<ItemSupplier, Error, { id: string; data: Partial<ItemSupplier> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemSupplier> }) =>
      apiPut<ItemSupplier>(`/item-supplier/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemSupplier.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemSupplier.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Supplier by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemSupplier(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-supplier/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemSupplier.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
