// TanStack Query hooks for Subcontracting Order Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingOrderItem } from '../types/subcontracting-order-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingOrderItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Order Item records.
 */
export function useSubcontractingOrderItemList(
  params: SubcontractingOrderItemListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingOrderItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingOrderItem.list(params),
    queryFn: () => apiGet<SubcontractingOrderItem[]>(`/subcontracting-order-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Order Item by ID.
 */
export function useSubcontractingOrderItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingOrderItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingOrderItem.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingOrderItem | null>(`/subcontracting-order-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Order Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingOrderItem(
  options?: UseMutationOptions<SubcontractingOrderItem, Error, Partial<SubcontractingOrderItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingOrderItem>) => apiPost<SubcontractingOrderItem>('/subcontracting-order-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Order Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingOrderItem(
  options?: UseMutationOptions<SubcontractingOrderItem, Error, { id: string; data: Partial<SubcontractingOrderItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingOrderItem> }) =>
      apiPut<SubcontractingOrderItem>(`/subcontracting-order-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Order Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingOrderItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-order-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
