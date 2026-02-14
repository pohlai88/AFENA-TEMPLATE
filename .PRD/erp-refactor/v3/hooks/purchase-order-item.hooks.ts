// TanStack Query hooks for Purchase Order Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseOrderItem } from '../types/purchase-order-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseOrderItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Order Item records.
 */
export function usePurchaseOrderItemList(
  params: PurchaseOrderItemListParams = {},
  options?: Omit<UseQueryOptions<PurchaseOrderItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseOrderItem.list(params),
    queryFn: () => apiGet<PurchaseOrderItem[]>(`/purchase-order-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Order Item by ID.
 */
export function usePurchaseOrderItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseOrderItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseOrderItem.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseOrderItem | null>(`/purchase-order-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Order Item.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseOrderItem(
  options?: UseMutationOptions<PurchaseOrderItem, Error, Partial<PurchaseOrderItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseOrderItem>) => apiPost<PurchaseOrderItem>('/purchase-order-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Order Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseOrderItem(
  options?: UseMutationOptions<PurchaseOrderItem, Error, { id: string; data: Partial<PurchaseOrderItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseOrderItem> }) =>
      apiPut<PurchaseOrderItem>(`/purchase-order-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrderItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrderItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Order Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseOrderItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-order-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrderItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
