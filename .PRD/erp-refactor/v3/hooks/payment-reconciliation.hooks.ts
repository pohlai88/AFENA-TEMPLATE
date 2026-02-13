// TanStack Query hooks for Payment Reconciliation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentReconciliation } from '../types/payment-reconciliation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentReconciliationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Reconciliation records.
 */
export function usePaymentReconciliationList(
  params: PaymentReconciliationListParams = {},
  options?: Omit<UseQueryOptions<PaymentReconciliation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentReconciliation.list(params),
    queryFn: () => apiGet<PaymentReconciliation[]>(`/payment-reconciliation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Reconciliation by ID.
 */
export function usePaymentReconciliation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentReconciliation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentReconciliation.detail(id ?? ''),
    queryFn: () => apiGet<PaymentReconciliation | null>(`/payment-reconciliation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Reconciliation.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentReconciliation(
  options?: UseMutationOptions<PaymentReconciliation, Error, Partial<PaymentReconciliation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentReconciliation>) => apiPost<PaymentReconciliation>('/payment-reconciliation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Reconciliation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentReconciliation(
  options?: UseMutationOptions<PaymentReconciliation, Error, { id: string; data: Partial<PaymentReconciliation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentReconciliation> }) =>
      apiPut<PaymentReconciliation>(`/payment-reconciliation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Reconciliation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentReconciliation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-reconciliation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentReconciliation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
