// TanStack Query hooks for Purchase Order Item Supplied
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseOrderItemSupplied } from '../types/purchase-order-item-supplied.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseOrderItemSuppliedListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Order Item Supplied records.
 */
export function usePurchaseOrderItemSuppliedList(
  params: PurchaseOrderItemSuppliedListParams = {},
  options?: Omit<UseQueryOptions<PurchaseOrderItemSupplied[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseOrderItemSupplied.list(params),
    queryFn: () => apiGet<PurchaseOrderItemSupplied[]>(`/purchase-order-item-supplied${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Order Item Supplied by ID.
 */
export function usePurchaseOrderItemSupplied(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseOrderItemSupplied | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseOrderItemSupplied.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseOrderItemSupplied | null>(`/purchase-order-item-supplied/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Order Item Supplied.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseOrderItemSupplied(
  options?: UseMutationOptions<PurchaseOrderItemSupplied, Error, Partial<PurchaseOrderItemSupplied>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseOrderItemSupplied>) => apiPost<PurchaseOrderItemSupplied>('/purchase-order-item-supplied', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrderItemSupplied.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Order Item Supplied.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseOrderItemSupplied(
  options?: UseMutationOptions<PurchaseOrderItemSupplied, Error, { id: string; data: Partial<PurchaseOrderItemSupplied> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseOrderItemSupplied> }) =>
      apiPut<PurchaseOrderItemSupplied>(`/purchase-order-item-supplied/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrderItemSupplied.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrderItemSupplied.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Order Item Supplied by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseOrderItemSupplied(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-order-item-supplied/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseOrderItemSupplied.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
