// TanStack Query hooks for Payment Order
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentOrder } from '../types/payment-order.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentOrderListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Order records.
 */
export function usePaymentOrderList(
  params: PaymentOrderListParams = {},
  options?: Omit<UseQueryOptions<PaymentOrder[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentOrder.list(params),
    queryFn: () => apiGet<PaymentOrder[]>(`/payment-order${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Order by ID.
 */
export function usePaymentOrder(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentOrder | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentOrder.detail(id ?? ''),
    queryFn: () => apiGet<PaymentOrder | null>(`/payment-order/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Order.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentOrder(
  options?: UseMutationOptions<PaymentOrder, Error, Partial<PaymentOrder>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentOrder>) => apiPost<PaymentOrder>('/payment-order', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Order.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentOrder(
  options?: UseMutationOptions<PaymentOrder, Error, { id: string; data: Partial<PaymentOrder> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentOrder> }) =>
      apiPut<PaymentOrder>(`/payment-order/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrder.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Order by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentOrder(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-order/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrder.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Payment Order (set docstatus = 1).
 */
export function useSubmitPaymentOrder(
  options?: UseMutationOptions<PaymentOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PaymentOrder>(`/payment-order/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Payment Order (set docstatus = 2).
 */
export function useCancelPaymentOrder(
  options?: UseMutationOptions<PaymentOrder, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PaymentOrder>(`/payment-order/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrder.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentOrder.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
