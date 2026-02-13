// TanStack Query hooks for Item Alternative
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ItemAlternative } from '../types/item-alternative.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ItemAlternativeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Item Alternative records.
 */
export function useItemAlternativeList(
  params: ItemAlternativeListParams = {},
  options?: Omit<UseQueryOptions<ItemAlternative[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.itemAlternative.list(params),
    queryFn: () => apiGet<ItemAlternative[]>(`/item-alternative${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Item Alternative by ID.
 */
export function useItemAlternative(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ItemAlternative | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.itemAlternative.detail(id ?? ''),
    queryFn: () => apiGet<ItemAlternative | null>(`/item-alternative/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Item Alternative.
 * Automatically invalidates list queries on success.
 */
export function useCreateItemAlternative(
  options?: UseMutationOptions<ItemAlternative, Error, Partial<ItemAlternative>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ItemAlternative>) => apiPost<ItemAlternative>('/item-alternative', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAlternative.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Item Alternative.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateItemAlternative(
  options?: UseMutationOptions<ItemAlternative, Error, { id: string; data: Partial<ItemAlternative> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ItemAlternative> }) =>
      apiPut<ItemAlternative>(`/item-alternative/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAlternative.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAlternative.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Item Alternative by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteItemAlternative(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/item-alternative/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itemAlternative.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
