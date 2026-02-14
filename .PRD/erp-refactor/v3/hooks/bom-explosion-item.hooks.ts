// TanStack Query hooks for BOM Explosion Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomExplosionItem } from '../types/bom-explosion-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomExplosionItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Explosion Item records.
 */
export function useBomExplosionItemList(
  params: BomExplosionItemListParams = {},
  options?: Omit<UseQueryOptions<BomExplosionItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomExplosionItem.list(params),
    queryFn: () => apiGet<BomExplosionItem[]>(`/bom-explosion-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Explosion Item by ID.
 */
export function useBomExplosionItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomExplosionItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomExplosionItem.detail(id ?? ''),
    queryFn: () => apiGet<BomExplosionItem | null>(`/bom-explosion-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Explosion Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomExplosionItem(
  options?: UseMutationOptions<BomExplosionItem, Error, Partial<BomExplosionItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomExplosionItem>) => apiPost<BomExplosionItem>('/bom-explosion-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomExplosionItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Explosion Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomExplosionItem(
  options?: UseMutationOptions<BomExplosionItem, Error, { id: string; data: Partial<BomExplosionItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomExplosionItem> }) =>
      apiPut<BomExplosionItem>(`/bom-explosion-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomExplosionItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomExplosionItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Explosion Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomExplosionItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-explosion-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomExplosionItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
