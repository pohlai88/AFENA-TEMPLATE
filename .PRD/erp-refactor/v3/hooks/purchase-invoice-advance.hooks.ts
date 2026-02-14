// TanStack Query hooks for Purchase Invoice Advance
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PurchaseInvoiceAdvance } from '../types/purchase-invoice-advance.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PurchaseInvoiceAdvanceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Purchase Invoice Advance records.
 */
export function usePurchaseInvoiceAdvanceList(
  params: PurchaseInvoiceAdvanceListParams = {},
  options?: Omit<UseQueryOptions<PurchaseInvoiceAdvance[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.purchaseInvoiceAdvance.list(params),
    queryFn: () => apiGet<PurchaseInvoiceAdvance[]>(`/purchase-invoice-advance${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Purchase Invoice Advance by ID.
 */
export function usePurchaseInvoiceAdvance(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PurchaseInvoiceAdvance | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.purchaseInvoiceAdvance.detail(id ?? ''),
    queryFn: () => apiGet<PurchaseInvoiceAdvance | null>(`/purchase-invoice-advance/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Purchase Invoice Advance.
 * Automatically invalidates list queries on success.
 */
export function useCreatePurchaseInvoiceAdvance(
  options?: UseMutationOptions<PurchaseInvoiceAdvance, Error, Partial<PurchaseInvoiceAdvance>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PurchaseInvoiceAdvance>) => apiPost<PurchaseInvoiceAdvance>('/purchase-invoice-advance', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoiceAdvance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Purchase Invoice Advance.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePurchaseInvoiceAdvance(
  options?: UseMutationOptions<PurchaseInvoiceAdvance, Error, { id: string; data: Partial<PurchaseInvoiceAdvance> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PurchaseInvoiceAdvance> }) =>
      apiPut<PurchaseInvoiceAdvance>(`/purchase-invoice-advance/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoiceAdvance.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoiceAdvance.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Purchase Invoice Advance by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePurchaseInvoiceAdvance(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/purchase-invoice-advance/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.purchaseInvoiceAdvance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
