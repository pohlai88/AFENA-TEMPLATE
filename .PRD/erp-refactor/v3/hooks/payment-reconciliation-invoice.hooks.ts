// TanStack Query hooks for Payment Reconciliation Invoice
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentReconciliationInvoice } from '../types/payment-reconciliation-invoice.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentReconciliationInvoiceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Reconciliation Invoice records.
 */
export function usePaymentReconciliationInvoiceList(
  params: PaymentReconciliationInvoiceListParams = {},
  options?: Omit<UseQueryOptions<PaymentReconciliationInvoice[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentReconciliationInvoice.list(params),
    queryFn: () => apiGet<PaymentReconciliationInvoice[]>(`/payment-reconciliation-invoice${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Reconciliation Invoice by ID.
 */
export function usePaymentReconciliationInvoice(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentReconciliationInvoice | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentReconciliationInvoice.detail(id ?? ''),
    queryFn: () => apiGet<PaymentReconciliationInvoice | null>(`/payment-reconciliation-invoice/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Reconciliation Invoice.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentReconciliationInvoice(
  options?: UseMutationOptions<PaymentReconciliationInvoice, Error, Partial<PaymentReconciliationInvoice>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentReconciliationInvoice>) => apiPost<PaymentReconciliationInvoice>('/payment-reconciliation-invoice', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Reconciliation Invoice.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentReconciliationInvoice(
  options?: UseMutationOptions<PaymentReconciliationInvoice, Error, { id: string; data: Partial<PaymentReconciliationInvoice> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentReconciliationInvoice> }) =>
      apiPut<PaymentReconciliationInvoice>(`/payment-reconciliation-invoice/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationInvoice.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Reconciliation Invoice by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentReconciliationInvoice(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-reconciliation-invoice/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
