// TanStack Query hooks for Purchase Receipt
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseReceipt } from '../types/purchase-receipt.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseReceiptListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Receipt records.
 */
export function usePurchaseReceiptList(
  params: PurchaseReceiptListParams = {},
  options?: Omit<UseQueryOptions<PurchaseReceipt[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseReceipt.list(params),
    queryFn: () => apiGet<PurchaseReceipt[]>(`/purchase-receipt${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Receipt by ID.
 */
export function usePurchaseReceipt(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseReceipt | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseReceipt.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseReceipt | null>(`/purchase-receipt/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Receipt.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseReceipt(
  options?: UseMutationOptions<PurchaseReceipt, Error, Partial<PurchaseReceipt>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseReceipt>) => apiPost<PurchaseReceipt>('/purchase-receipt', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceipt.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Receipt.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseReceipt(
  options?: UseMutationOptions<PurchaseReceipt, Error, { id: string; data: Partial<PurchaseReceipt> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseReceipt> }) =>
      apiPut<PurchaseReceipt>(`/purchase-receipt/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceipt.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceipt.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Receipt by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseReceipt(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-receipt/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceipt.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Purchase Receipt (set docstatus = 1).
 */
export function useSubmitPurchaseReceipt(
  options?: UseMutationOptions<PurchaseReceipt, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PurchaseReceipt>(`/purchase-receipt/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceipt.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceipt.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Purchase Receipt (set docstatus = 2).
 */
export function useCancelPurchaseReceipt(
  options?: UseMutationOptions<PurchaseReceipt, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PurchaseReceipt>(`/purchase-receipt/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceipt.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseReceipt.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
