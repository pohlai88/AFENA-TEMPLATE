// TanStack Query hooks for Bank Account Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankAccountType } from '../types/bank-account-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankAccountTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Account Type records.
 */
export function useBankAccountTypeList(
  params: BankAccountTypeListParams = {},
  options?: Omit<UseQueryOptions<BankAccountType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankAccountType.list(params),
    queryFn: () => apiGet<BankAccountType[]>(`/bank-account-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Account Type by ID.
 */
export function useBankAccountType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankAccountType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankAccountType.detail(id ?? ''),
    queryFn: () => apiGet<BankAccountType | null>(`/bank-account-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Account Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankAccountType(
  options?: UseMutationOptions<BankAccountType, Error, Partial<BankAccountType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankAccountType>) => apiPost<BankAccountType>('/bank-account-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Account Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankAccountType(
  options?: UseMutationOptions<BankAccountType, Error, { id: string; data: Partial<BankAccountType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankAccountType> }) =>
      apiPut<BankAccountType>(`/bank-account-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Account Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankAccountType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-account-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
