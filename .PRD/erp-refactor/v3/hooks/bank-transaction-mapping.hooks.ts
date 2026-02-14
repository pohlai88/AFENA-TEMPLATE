// TanStack Query hooks for Bank Transaction Mapping
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankTransactionMapping } from '../types/bank-transaction-mapping.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankTransactionMappingListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Transaction Mapping records.
 */
export function useBankTransactionMappingList(
  params: BankTransactionMappingListParams = {},
  options?: Omit<UseQueryOptions<BankTransactionMapping[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankTransactionMapping.list(params),
    queryFn: () => apiGet<BankTransactionMapping[]>(`/bank-transaction-mapping${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Transaction Mapping by ID.
 */
export function useBankTransactionMapping(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankTransactionMapping | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankTransactionMapping.detail(id ?? ''),
    queryFn: () => apiGet<BankTransactionMapping | null>(`/bank-transaction-mapping/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Transaction Mapping.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankTransactionMapping(
  options?: UseMutationOptions<BankTransactionMapping, Error, Partial<BankTransactionMapping>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankTransactionMapping>) => apiPost<BankTransactionMapping>('/bank-transaction-mapping', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransactionMapping.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Transaction Mapping.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankTransactionMapping(
  options?: UseMutationOptions<BankTransactionMapping, Error, { id: string; data: Partial<BankTransactionMapping> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankTransactionMapping> }) =>
      apiPut<BankTransactionMapping>(`/bank-transaction-mapping/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransactionMapping.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransactionMapping.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Transaction Mapping by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankTransactionMapping(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-transaction-mapping/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankTransactionMapping.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
