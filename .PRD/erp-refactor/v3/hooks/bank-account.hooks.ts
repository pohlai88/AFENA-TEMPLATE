// TanStack Query hooks for Bank Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankAccount } from '../types/bank-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Account records.
 */
export function useBankAccountList(
  params: BankAccountListParams = {},
  options?: Omit<UseQueryOptions<BankAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankAccount.list(params),
    queryFn: () => apiGet<BankAccount[]>(`/bank-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Account by ID.
 */
export function useBankAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankAccount.detail(id ?? ''),
    queryFn: () => apiGet<BankAccount | null>(`/bank-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankAccount(
  options?: UseMutationOptions<BankAccount, Error, Partial<BankAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankAccount>) => apiPost<BankAccount>('/bank-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankAccount(
  options?: UseMutationOptions<BankAccount, Error, { id: string; data: Partial<BankAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankAccount> }) =>
      apiPut<BankAccount>(`/bank-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
