// TanStack Query hooks for Payment Reconciliation Payment
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentReconciliationPayment } from '../types/payment-reconciliation-payment.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentReconciliationPaymentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Reconciliation Payment records.
 */
export function usePaymentReconciliationPaymentList(
  params: PaymentReconciliationPaymentListParams = {},
  options?: Omit<UseQueryOptions<PaymentReconciliationPayment[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentReconciliationPayment.list(params),
    queryFn: () => apiGet<PaymentReconciliationPayment[]>(`/payment-reconciliation-payment${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Reconciliation Payment by ID.
 */
export function usePaymentReconciliationPayment(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentReconciliationPayment | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentReconciliationPayment.detail(id ?? ''),
    queryFn: () => apiGet<PaymentReconciliationPayment | null>(`/payment-reconciliation-payment/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Reconciliation Payment.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentReconciliationPayment(
  options?: UseMutationOptions<PaymentReconciliationPayment, Error, Partial<PaymentReconciliationPayment>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentReconciliationPayment>) => apiPost<PaymentReconciliationPayment>('/payment-reconciliation-payment', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationPayment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Reconciliation Payment.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentReconciliationPayment(
  options?: UseMutationOptions<PaymentReconciliationPayment, Error, { id: string; data: Partial<PaymentReconciliationPayment> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentReconciliationPayment> }) =>
      apiPut<PaymentReconciliationPayment>(`/payment-reconciliation-payment/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationPayment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationPayment.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Reconciliation Payment by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentReconciliationPayment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-reconciliation-payment/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliationPayment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
