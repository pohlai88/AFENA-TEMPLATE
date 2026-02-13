// TanStack Query hooks for Packed Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PackedItem } from '../types/packed-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PackedItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Packed Item records.
 */
export function usePackedItemList(
  params: PackedItemListParams = {},
  options?: Omit<UseQueryOptions<PackedItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.packedItem.list(params),
    queryFn: () => apiGet<PackedItem[]>(`/packed-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Packed Item by ID.
 */
export function usePackedItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PackedItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.packedItem.detail(id ?? ''),
    queryFn: () => apiGet<PackedItem | null>(`/packed-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Packed Item.
 * Automatically invalidates list queries on success.
 */
export function useCreatePackedItem(
  options?: UseMutationOptions<PackedItem, Error, Partial<PackedItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PackedItem>) => apiPost<PackedItem>('/packed-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packedItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Packed Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePackedItem(
  options?: UseMutationOptions<PackedItem, Error, { id: string; data: Partial<PackedItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PackedItem> }) =>
      apiPut<PackedItem>(`/packed-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packedItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.packedItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Packed Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePackedItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/packed-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packedItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
