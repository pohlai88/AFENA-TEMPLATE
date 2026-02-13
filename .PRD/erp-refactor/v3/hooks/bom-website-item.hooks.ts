// TanStack Query hooks for BOM Website Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomWebsiteItem } from '../types/bom-website-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomWebsiteItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Website Item records.
 */
export function useBomWebsiteItemList(
  params: BomWebsiteItemListParams = {},
  options?: Omit<UseQueryOptions<BomWebsiteItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomWebsiteItem.list(params),
    queryFn: () => apiGet<BomWebsiteItem[]>(`/bom-website-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Website Item by ID.
 */
export function useBomWebsiteItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomWebsiteItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomWebsiteItem.detail(id ?? ''),
    queryFn: () => apiGet<BomWebsiteItem | null>(`/bom-website-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Website Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomWebsiteItem(
  options?: UseMutationOptions<BomWebsiteItem, Error, Partial<BomWebsiteItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomWebsiteItem>) => apiPost<BomWebsiteItem>('/bom-website-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomWebsiteItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Website Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomWebsiteItem(
  options?: UseMutationOptions<BomWebsiteItem, Error, { id: string; data: Partial<BomWebsiteItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomWebsiteItem> }) =>
      apiPut<BomWebsiteItem>(`/bom-website-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomWebsiteItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomWebsiteItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Website Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomWebsiteItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-website-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomWebsiteItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
