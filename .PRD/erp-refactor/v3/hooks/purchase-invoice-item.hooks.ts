// TanStack Query hooks for Purchase Invoice Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseInvoiceItem } from '../types/purchase-invoice-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseInvoiceItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Invoice Item records.
 */
export function usePurchaseInvoiceItemList(
  params: PurchaseInvoiceItemListParams = {},
  options?: Omit<UseQueryOptions<PurchaseInvoiceItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseInvoiceItem.list(params),
    queryFn: () => apiGet<PurchaseInvoiceItem[]>(`/purchase-invoice-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Invoice Item by ID.
 */
export function usePurchaseInvoiceItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseInvoiceItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseInvoiceItem.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseInvoiceItem | null>(`/purchase-invoice-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Invoice Item.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseInvoiceItem(
  options?: UseMutationOptions<PurchaseInvoiceItem, Error, Partial<PurchaseInvoiceItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseInvoiceItem>) => apiPost<PurchaseInvoiceItem>('/purchase-invoice-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Invoice Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseInvoiceItem(
  options?: UseMutationOptions<PurchaseInvoiceItem, Error, { id: string; data: Partial<PurchaseInvoiceItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseInvoiceItem> }) =>
      apiPut<PurchaseInvoiceItem>(`/purchase-invoice-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoiceItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoiceItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Invoice Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseInvoiceItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-invoice-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoiceItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
