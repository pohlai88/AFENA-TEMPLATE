// TanStack Query hooks for Territory Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TerritoryItem } from '../types/territory-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TerritoryItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Territory Item records.
 */
export function useTerritoryItemList(
  params: TerritoryItemListParams = {},
  options?: Omit<UseQueryOptions<TerritoryItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.territoryItem.list(params),
    queryFn: () => apiGet<TerritoryItem[]>(`/territory-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Territory Item by ID.
 */
export function useTerritoryItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TerritoryItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.territoryItem.detail(id ?? ''),
    queryFn: () => apiGet<TerritoryItem | null>(`/territory-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Territory Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateTerritoryItem(
  options?: UseMutationOptions<TerritoryItem, Error, Partial<TerritoryItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TerritoryItem>) => apiPost<TerritoryItem>('/territory-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.territoryItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Territory Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTerritoryItem(
  options?: UseMutationOptions<TerritoryItem, Error, { id: string; data: Partial<TerritoryItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TerritoryItem> }) =>
      apiPut<TerritoryItem>(`/territory-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.territoryItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.territoryItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Territory Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTerritoryItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/territory-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.territoryItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
