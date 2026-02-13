// TanStack Query hooks for Bank Account Subtype
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankAccountSubtype } from '../types/bank-account-subtype.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankAccountSubtypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Account Subtype records.
 */
export function useBankAccountSubtypeList(
  params: BankAccountSubtypeListParams = {},
  options?: Omit<UseQueryOptions<BankAccountSubtype[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankAccountSubtype.list(params),
    queryFn: () => apiGet<BankAccountSubtype[]>(`/bank-account-subtype${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Account Subtype by ID.
 */
export function useBankAccountSubtype(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankAccountSubtype | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankAccountSubtype.detail(id ?? ''),
    queryFn: () => apiGet<BankAccountSubtype | null>(`/bank-account-subtype/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Account Subtype.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankAccountSubtype(
  options?: UseMutationOptions<BankAccountSubtype, Error, Partial<BankAccountSubtype>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankAccountSubtype>) => apiPost<BankAccountSubtype>('/bank-account-subtype', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountSubtype.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Account Subtype.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankAccountSubtype(
  options?: UseMutationOptions<BankAccountSubtype, Error, { id: string; data: Partial<BankAccountSubtype> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankAccountSubtype> }) =>
      apiPut<BankAccountSubtype>(`/bank-account-subtype/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountSubtype.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountSubtype.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Account Subtype by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankAccountSubtype(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-account-subtype/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankAccountSubtype.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
