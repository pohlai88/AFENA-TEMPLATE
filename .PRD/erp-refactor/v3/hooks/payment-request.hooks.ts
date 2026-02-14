// TanStack Query hooks for Payment Request
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentRequest } from '../types/payment-request.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentRequestListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Request records.
 */
export function usePaymentRequestList(
  params: PaymentRequestListParams = {},
  options?: Omit<UseQueryOptions<PaymentRequest[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentRequest.list(params),
    queryFn: () => apiGet<PaymentRequest[]>(`/payment-request${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Request by ID.
 */
export function usePaymentRequest(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentRequest | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentRequest.detail(id ?? ''),
    queryFn: () => apiGet<PaymentRequest | null>(`/payment-request/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Request.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentRequest(
  options?: UseMutationOptions<PaymentRequest, Error, Partial<PaymentRequest>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentRequest>) => apiPost<PaymentRequest>('/payment-request', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentRequest.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Request.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentRequest(
  options?: UseMutationOptions<PaymentRequest, Error, { id: string; data: Partial<PaymentRequest> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentRequest> }) =>
      apiPut<PaymentRequest>(`/payment-request/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentRequest.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentRequest.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Request by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentRequest(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-request/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentRequest.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Payment Request (set docstatus = 1).
 */
export function useSubmitPaymentRequest(
  options?: UseMutationOptions<PaymentRequest, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PaymentRequest>(`/payment-request/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentRequest.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentRequest.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Payment Request (set docstatus = 2).
 */
export function useCancelPaymentRequest(
  options?: UseMutationOptions<PaymentRequest, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PaymentRequest>(`/payment-request/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentRequest.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentRequest.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
