// TanStack Query hooks for BOM Creator Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomCreatorItem } from '../types/bom-creator-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomCreatorItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Creator Item records.
 */
export function useBomCreatorItemList(
  params: BomCreatorItemListParams = {},
  options?: Omit<UseQueryOptions<BomCreatorItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomCreatorItem.list(params),
    queryFn: () => apiGet<BomCreatorItem[]>(`/bom-creator-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Creator Item by ID.
 */
export function useBomCreatorItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomCreatorItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomCreatorItem.detail(id ?? ''),
    queryFn: () => apiGet<BomCreatorItem | null>(`/bom-creator-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Creator Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomCreatorItem(
  options?: UseMutationOptions<BomCreatorItem, Error, Partial<BomCreatorItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomCreatorItem>) => apiPost<BomCreatorItem>('/bom-creator-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreatorItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Creator Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomCreatorItem(
  options?: UseMutationOptions<BomCreatorItem, Error, { id: string; data: Partial<BomCreatorItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomCreatorItem> }) =>
      apiPut<BomCreatorItem>(`/bom-creator-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreatorItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreatorItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Creator Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomCreatorItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-creator-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreatorItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
