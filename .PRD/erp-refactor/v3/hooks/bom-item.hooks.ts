// TanStack Query hooks for BOM Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomItem } from '../types/bom-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Item records.
 */
export function useBomItemList(
  params: BomItemListParams = {},
  options?: Omit<UseQueryOptions<BomItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomItem.list(params),
    queryFn: () => apiGet<BomItem[]>(`/bom-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Item by ID.
 */
export function useBomItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomItem.detail(id ?? ''),
    queryFn: () => apiGet<BomItem | null>(`/bom-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomItem(
  options?: UseMutationOptions<BomItem, Error, Partial<BomItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomItem>) => apiPost<BomItem>('/bom-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomItem(
  options?: UseMutationOptions<BomItem, Error, { id: string; data: Partial<BomItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomItem> }) =>
      apiPut<BomItem>(`/bom-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
