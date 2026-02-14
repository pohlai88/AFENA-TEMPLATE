// TanStack Query hooks for Payment Gateway Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentGatewayAccount } from '../types/payment-gateway-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentGatewayAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Gateway Account records.
 */
export function usePaymentGatewayAccountList(
  params: PaymentGatewayAccountListParams = {},
  options?: Omit<UseQueryOptions<PaymentGatewayAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentGatewayAccount.list(params),
    queryFn: () => apiGet<PaymentGatewayAccount[]>(`/payment-gateway-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Gateway Account by ID.
 */
export function usePaymentGatewayAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentGatewayAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentGatewayAccount.detail(id ?? ''),
    queryFn: () => apiGet<PaymentGatewayAccount | null>(`/payment-gateway-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Gateway Account.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentGatewayAccount(
  options?: UseMutationOptions<PaymentGatewayAccount, Error, Partial<PaymentGatewayAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentGatewayAccount>) => apiPost<PaymentGatewayAccount>('/payment-gateway-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentGatewayAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Gateway Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentGatewayAccount(
  options?: UseMutationOptions<PaymentGatewayAccount, Error, { id: string; data: Partial<PaymentGatewayAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentGatewayAccount> }) =>
      apiPut<PaymentGatewayAccount>(`/payment-gateway-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentGatewayAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentGatewayAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Gateway Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentGatewayAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-gateway-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentGatewayAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
