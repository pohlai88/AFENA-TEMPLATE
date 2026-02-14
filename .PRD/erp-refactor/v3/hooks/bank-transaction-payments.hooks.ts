// TanStack Query hooks for Bank Transaction Payments
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankTransactionPayments } from '../types/bank-transaction-payments.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankTransactionPaymentsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Transaction Payments records.
 */
export function useBankTransactionPaymentsList(
  params: BankTransactionPaymentsListParams = {},
  options?: Omit<UseQueryOptions<BankTransactionPayments[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankTransactionPayments.list(params),
    queryFn: () => apiGet<BankTransactionPayments[]>(`/bank-transaction-payments${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Transaction Payments by ID.
 */
export function useBankTransactionPayments(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankTransactionPayments | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankTransactionPayments.detail(id ?? ''),
    queryFn: () => apiGet<BankTransactionPayments | null>(`/bank-transaction-payments/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Transaction Payments.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankTransactionPayments(
  options?: UseMutationOptions<BankTransactionPayments, Error, Partial<BankTransactionPayments>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankTransactionPayments>) => apiPost<BankTransactionPayments>('/bank-transaction-payments', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransactionPayments.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Transaction Payments.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankTransactionPayments(
  options?: UseMutationOptions<BankTransactionPayments, Error, { id: string; data: Partial<BankTransactionPayments> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankTransactionPayments> }) =>
      apiPut<BankTransactionPayments>(`/bank-transaction-payments/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransactionPayments.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransactionPayments.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Transaction Payments by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankTransactionPayments(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-transaction-payments/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransactionPayments.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
