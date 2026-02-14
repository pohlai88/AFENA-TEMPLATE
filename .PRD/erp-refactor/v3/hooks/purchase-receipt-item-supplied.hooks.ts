// TanStack Query hooks for Purchase Receipt Item Supplied
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseReceiptItemSupplied } from '../types/purchase-receipt-item-supplied.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseReceiptItemSuppliedListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Receipt Item Supplied records.
 */
export function usePurchaseReceiptItemSuppliedList(
  params: PurchaseReceiptItemSuppliedListParams = {},
  options?: Omit<UseQueryOptions<PurchaseReceiptItemSupplied[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseReceiptItemSupplied.list(params),
    queryFn: () => apiGet<PurchaseReceiptItemSupplied[]>(`/purchase-receipt-item-supplied${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Receipt Item Supplied by ID.
 */
export function usePurchaseReceiptItemSupplied(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseReceiptItemSupplied | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseReceiptItemSupplied.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseReceiptItemSupplied | null>(`/purchase-receipt-item-supplied/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Receipt Item Supplied.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseReceiptItemSupplied(
  options?: UseMutationOptions<PurchaseReceiptItemSupplied, Error, Partial<PurchaseReceiptItemSupplied>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseReceiptItemSupplied>) => apiPost<PurchaseReceiptItemSupplied>('/purchase-receipt-item-supplied', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceiptItemSupplied.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Receipt Item Supplied.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseReceiptItemSupplied(
  options?: UseMutationOptions<PurchaseReceiptItemSupplied, Error, { id: string; data: Partial<PurchaseReceiptItemSupplied> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseReceiptItemSupplied> }) =>
      apiPut<PurchaseReceiptItemSupplied>(`/purchase-receipt-item-supplied/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceiptItemSupplied.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceiptItemSupplied.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Receipt Item Supplied by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseReceiptItemSupplied(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-receipt-item-supplied/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceiptItemSupplied.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
