// TanStack Query hooks for Pick List Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PickListItem } from '../types/pick-list-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PickListItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Pick List Item records.
 */
export function usePickListItemList(
  params: PickListItemListParams = {},
  options?: Omit<UseQueryOptions<PickListItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.pickListItem.list(params),
    queryFn: () => apiGet<PickListItem[]>(`/pick-list-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Pick List Item by ID.
 */
export function usePickListItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PickListItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.pickListItem.detail(id ?? ''),
    queryFn: () => apiGet<PickListItem | null>(`/pick-list-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Pick List Item.
 * Automatically invalidates list queries on success.
 */
export function useCreatePickListItem(
  options?: UseMutationOptions<PickListItem, Error, Partial<PickListItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PickListItem>) => apiPost<PickListItem>('/pick-list-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pickListItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Pick List Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePickListItem(
  options?: UseMutationOptions<PickListItem, Error, { id: string; data: Partial<PickListItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PickListItem> }) =>
      apiPut<PickListItem>(`/pick-list-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pickListItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pickListItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Pick List Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePickListItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pick-list-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pickListItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
