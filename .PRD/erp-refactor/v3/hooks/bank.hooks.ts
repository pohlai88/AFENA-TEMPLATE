// TanStack Query hooks for Bank
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Bank } from '../types/bank.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank records.
 */
export function useBankList(
  params: BankListParams = {},
  options?: Omit<UseQueryOptions<Bank[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bank.list(params),
    queryFn: () => apiGet<Bank[]>(`/bank${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank by ID.
 */
export function useBank(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Bank | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bank.detail(id ?? ''),
    queryFn: () => apiGet<Bank | null>(`/bank/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank.
 * Automatically invalidates list queries on success.
 */
export function useCreateBank(
  options?: UseMutationOptions<Bank, Error, Partial<Bank>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Bank>) => apiPost<Bank>('/bank', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBank(
  options?: UseMutationOptions<Bank, Error, { id: string; data: Partial<Bank> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bank> }) =>
      apiPut<Bank>(`/bank/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBank(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bank.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
