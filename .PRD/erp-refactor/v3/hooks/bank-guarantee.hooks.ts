// TanStack Query hooks for Bank Guarantee
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankGuarantee } from '../types/bank-guarantee.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankGuaranteeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Guarantee records.
 */
export function useBankGuaranteeList(
  params: BankGuaranteeListParams = {},
  options?: Omit<UseQueryOptions<BankGuarantee[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankGuarantee.list(params),
    queryFn: () => apiGet<BankGuarantee[]>(`/bank-guarantee${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Guarantee by ID.
 */
export function useBankGuarantee(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankGuarantee | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankGuarantee.detail(id ?? ''),
    queryFn: () => apiGet<BankGuarantee | null>(`/bank-guarantee/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Guarantee.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankGuarantee(
  options?: UseMutationOptions<BankGuarantee, Error, Partial<BankGuarantee>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankGuarantee>) => apiPost<BankGuarantee>('/bank-guarantee', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankGuarantee.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Guarantee.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankGuarantee(
  options?: UseMutationOptions<BankGuarantee, Error, { id: string; data: Partial<BankGuarantee> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankGuarantee> }) =>
      apiPut<BankGuarantee>(`/bank-guarantee/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankGuarantee.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankGuarantee.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Guarantee by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankGuarantee(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-guarantee/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankGuarantee.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Bank Guarantee (set docstatus = 1).
 */
export function useSubmitBankGuarantee(
  options?: UseMutationOptions<BankGuarantee, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<BankGuarantee>(`/bank-guarantee/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankGuarantee.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankGuarantee.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Bank Guarantee (set docstatus = 2).
 */
export function useCancelBankGuarantee(
  options?: UseMutationOptions<BankGuarantee, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<BankGuarantee>(`/bank-guarantee/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankGuarantee.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankGuarantee.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
