// TanStack Query hooks for Purchase Order
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseOrder } from '../types/purchase-order.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseOrderListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Order records.
 */
export function usePurchaseOrderList(
  params: PurchaseOrderListParams = {},
  options?: Omit<UseQueryOptions<PurchaseOrder[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseOrder.list(params),
    queryFn: () => apiGet<PurchaseOrder[]>(`/purchase-order${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Order by ID.
 */
export function usePurchaseOrder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseOrder | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseOrder.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseOrder | null>(`/purchase-order/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Order.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseOrder(
  options?: UseMutationOptions<PurchaseOrder, Error, Partial<PurchaseOrder>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseOrder>) => apiPost<PurchaseOrder>('/purchase-order', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Order.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseOrder(
  options?: UseMutationOptions<PurchaseOrder, Error, { id: string; data: Partial<PurchaseOrder> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseOrder> }) =>
      apiPut<PurchaseOrder>(`/purchase-order/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrder.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Order by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseOrder(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-order/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Purchase Order (set docstatus = 1).
 */
export function useSubmitPurchaseOrder(
  options?: UseMutationOptions<PurchaseOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PurchaseOrder>(`/purchase-order/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Purchase Order (set docstatus = 2).
 */
export function useCancelPurchaseOrder(
  options?: UseMutationOptions<PurchaseOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PurchaseOrder>(`/purchase-order/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
