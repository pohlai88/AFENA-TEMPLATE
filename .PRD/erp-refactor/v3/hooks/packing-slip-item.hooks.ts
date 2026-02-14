// TanStack Query hooks for Packing Slip Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PackingSlipItem } from '../types/packing-slip-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PackingSlipItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Packing Slip Item records.
 */
export function usePackingSlipItemList(
  params: PackingSlipItemListParams = {},
  options?: Omit<UseQueryOptions<PackingSlipItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.packingSlipItem.list(params),
    queryFn: () => apiGet<PackingSlipItem[]>(`/packing-slip-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Packing Slip Item by ID.
 */
export function usePackingSlipItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PackingSlipItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.packingSlipItem.detail(id ?? ''),
    queryFn: () => apiGet<PackingSlipItem | null>(`/packing-slip-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Packing Slip Item.
 * Automatically invalidates list queries on success.
 */
export function useCreatePackingSlipItem(
  options?: UseMutationOptions<PackingSlipItem, Error, Partial<PackingSlipItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PackingSlipItem>) => apiPost<PackingSlipItem>('/packing-slip-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlipItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Packing Slip Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePackingSlipItem(
  options?: UseMutationOptions<PackingSlipItem, Error, { id: string; data: Partial<PackingSlipItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PackingSlipItem> }) =>
      apiPut<PackingSlipItem>(`/packing-slip-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlipItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlipItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Packing Slip Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePackingSlipItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/packing-slip-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlipItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
