// TanStack Query hooks for BOM Scrap Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomScrapItem } from '../types/bom-scrap-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomScrapItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Scrap Item records.
 */
export function useBomScrapItemList(
  params: BomScrapItemListParams = {},
  options?: Omit<UseQueryOptions<BomScrapItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomScrapItem.list(params),
    queryFn: () => apiGet<BomScrapItem[]>(`/bom-scrap-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Scrap Item by ID.
 */
export function useBomScrapItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomScrapItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomScrapItem.detail(id ?? ''),
    queryFn: () => apiGet<BomScrapItem | null>(`/bom-scrap-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Scrap Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomScrapItem(
  options?: UseMutationOptions<BomScrapItem, Error, Partial<BomScrapItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomScrapItem>) => apiPost<BomScrapItem>('/bom-scrap-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomScrapItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Scrap Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomScrapItem(
  options?: UseMutationOptions<BomScrapItem, Error, { id: string; data: Partial<BomScrapItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomScrapItem> }) =>
      apiPut<BomScrapItem>(`/bom-scrap-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomScrapItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomScrapItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Scrap Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomScrapItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-scrap-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomScrapItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
