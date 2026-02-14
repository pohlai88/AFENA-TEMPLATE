// TanStack Query hooks for Purchase Receipt Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseReceiptItem } from '../types/purchase-receipt-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseReceiptItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Receipt Item records.
 */
export function usePurchaseReceiptItemList(
  params: PurchaseReceiptItemListParams = {},
  options?: Omit<UseQueryOptions<PurchaseReceiptItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseReceiptItem.list(params),
    queryFn: () => apiGet<PurchaseReceiptItem[]>(`/purchase-receipt-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Receipt Item by ID.
 */
export function usePurchaseReceiptItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseReceiptItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseReceiptItem.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseReceiptItem | null>(`/purchase-receipt-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Receipt Item.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseReceiptItem(
  options?: UseMutationOptions<PurchaseReceiptItem, Error, Partial<PurchaseReceiptItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseReceiptItem>) => apiPost<PurchaseReceiptItem>('/purchase-receipt-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceiptItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Receipt Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseReceiptItem(
  options?: UseMutationOptions<PurchaseReceiptItem, Error, { id: string; data: Partial<PurchaseReceiptItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseReceiptItem> }) =>
      apiPut<PurchaseReceiptItem>(`/purchase-receipt-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceiptItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceiptItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Receipt Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseReceiptItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-receipt-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceiptItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
