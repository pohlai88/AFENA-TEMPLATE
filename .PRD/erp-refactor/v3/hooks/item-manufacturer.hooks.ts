// TanStack Query hooks for Item Manufacturer
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemManufacturer } from '../types/item-manufacturer.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemManufacturerListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Manufacturer records.
 */
export function useItemManufacturerList(
  params: ItemManufacturerListParams = {},
  options?: Omit<UseQueryOptions<ItemManufacturer[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemManufacturer.list(params),
    queryFn: () => apiGet<ItemManufacturer[]>(`/item-manufacturer${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Manufacturer by ID.
 */
export function useItemManufacturer(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemManufacturer | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemManufacturer.detail(id ?? ''),
    queryFn: () => apiGet<ItemManufacturer | null>(`/item-manufacturer/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Manufacturer.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemManufacturer(
  options?: UseMutationOptions<ItemManufacturer, Error, Partial<ItemManufacturer>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemManufacturer>) => apiPost<ItemManufacturer>('/item-manufacturer', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemManufacturer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Manufacturer.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemManufacturer(
  options?: UseMutationOptions<ItemManufacturer, Error, { id: string; data: Partial<ItemManufacturer> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemManufacturer> }) =>
      apiPut<ItemManufacturer>(`/item-manufacturer/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemManufacturer.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemManufacturer.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Manufacturer by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemManufacturer(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-manufacturer/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemManufacturer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
