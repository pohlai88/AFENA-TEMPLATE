// TanStack Query hooks for Cashier Closing Payments
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CashierClosingPayments } from '../types/cashier-closing-payments.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CashierClosingPaymentsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Cashier Closing Payments records.
 */
export function useCashierClosingPaymentsList(
  params: CashierClosingPaymentsListParams = {},
  options?: Omit<UseQueryOptions<CashierClosingPayments[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.cashierClosingPayments.list(params),
    queryFn: () => apiGet<CashierClosingPayments[]>(`/cashier-closing-payments${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Cashier Closing Payments by ID.
 */
export function useCashierClosingPayments(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CashierClosingPayments | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.cashierClosingPayments.detail(id ?? ''),
    queryFn: () => apiGet<CashierClosingPayments | null>(`/cashier-closing-payments/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Cashier Closing Payments.
 * Automatically invalidates list queries on success.
 */
export function useCreateCashierClosingPayments(
  options?: UseMutationOptions<CashierClosingPayments, Error, Partial<CashierClosingPayments>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CashierClosingPayments>) => apiPost<CashierClosingPayments>('/cashier-closing-payments', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosingPayments.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Cashier Closing Payments.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCashierClosingPayments(
  options?: UseMutationOptions<CashierClosingPayments, Error, { id: string; data: Partial<CashierClosingPayments> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CashierClosingPayments> }) =>
      apiPut<CashierClosingPayments>(`/cashier-closing-payments/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosingPayments.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosingPayments.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Cashier Closing Payments by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCashierClosingPayments(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/cashier-closing-payments/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosingPayments.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
