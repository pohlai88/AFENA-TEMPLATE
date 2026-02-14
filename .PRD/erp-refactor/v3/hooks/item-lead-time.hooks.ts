// TanStack Query hooks for Item Lead Time
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemLeadTime } from '../types/item-lead-time.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemLeadTimeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Lead Time records.
 */
export function useItemLeadTimeList(
  params: ItemLeadTimeListParams = {},
  options?: Omit<UseQueryOptions<ItemLeadTime[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemLeadTime.list(params),
    queryFn: () => apiGet<ItemLeadTime[]>(`/item-lead-time${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Lead Time by ID.
 */
export function useItemLeadTime(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemLeadTime | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemLeadTime.detail(id ?? ''),
    queryFn: () => apiGet<ItemLeadTime | null>(`/item-lead-time/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Lead Time.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemLeadTime(
  options?: UseMutationOptions<ItemLeadTime, Error, Partial<ItemLeadTime>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemLeadTime>) => apiPost<ItemLeadTime>('/item-lead-time', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemLeadTime.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Lead Time.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemLeadTime(
  options?: UseMutationOptions<ItemLeadTime, Error, { id: string; data: Partial<ItemLeadTime> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemLeadTime> }) =>
      apiPut<ItemLeadTime>(`/item-lead-time/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemLeadTime.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemLeadTime.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Lead Time by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemLeadTime(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-lead-time/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemLeadTime.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
