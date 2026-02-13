// TanStack Query hooks for Blanket Order Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BlanketOrderItem } from '../types/blanket-order-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BlanketOrderItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Blanket Order Item records.
 */
export function useBlanketOrderItemList(
  params: BlanketOrderItemListParams = {},
  options?: Omit<UseQueryOptions<BlanketOrderItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.blanketOrderItem.list(params),
    queryFn: () => apiGet<BlanketOrderItem[]>(`/blanket-order-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Blanket Order Item by ID.
 */
export function useBlanketOrderItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BlanketOrderItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.blanketOrderItem.detail(id ?? ''),
    queryFn: () => apiGet<BlanketOrderItem | null>(`/blanket-order-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Blanket Order Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateBlanketOrderItem(
  options?: UseMutationOptions<BlanketOrderItem, Error, Partial<BlanketOrderItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BlanketOrderItem>) => apiPost<BlanketOrderItem>('/blanket-order-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Blanket Order Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBlanketOrderItem(
  options?: UseMutationOptions<BlanketOrderItem, Error, { id: string; data: Partial<BlanketOrderItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlanketOrderItem> }) =>
      apiPut<BlanketOrderItem>(`/blanket-order-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrderItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrderItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Blanket Order Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBlanketOrderItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/blanket-order-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blanketOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
