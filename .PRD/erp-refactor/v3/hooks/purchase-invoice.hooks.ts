// TanStack Query hooks for Purchase Invoice
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseInvoice } from '../types/purchase-invoice.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseInvoiceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Invoice records.
 */
export function usePurchaseInvoiceList(
  params: PurchaseInvoiceListParams = {},
  options?: Omit<UseQueryOptions<PurchaseInvoice[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseInvoice.list(params),
    queryFn: () => apiGet<PurchaseInvoice[]>(`/purchase-invoice${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Invoice by ID.
 */
export function usePurchaseInvoice(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseInvoice | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseInvoice.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseInvoice | null>(`/purchase-invoice/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Invoice.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseInvoice(
  options?: UseMutationOptions<PurchaseInvoice, Error, Partial<PurchaseInvoice>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseInvoice>) => apiPost<PurchaseInvoice>('/purchase-invoice', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Invoice.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseInvoice(
  options?: UseMutationOptions<PurchaseInvoice, Error, { id: string; data: Partial<PurchaseInvoice> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseInvoice> }) =>
      apiPut<PurchaseInvoice>(`/purchase-invoice/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoice.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Invoice by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseInvoice(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-invoice/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Purchase Invoice (set docstatus = 1).
 */
export function useSubmitPurchaseInvoice(
  options?: UseMutationOptions<PurchaseInvoice, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PurchaseInvoice>(`/purchase-invoice/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoice.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Purchase Invoice (set docstatus = 2).
 */
export function useCancelPurchaseInvoice(
  options?: UseMutationOptions<PurchaseInvoice, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PurchaseInvoice>(`/purchase-invoice/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoice.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
