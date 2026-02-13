// TanStack Query hooks for Bank Clearance Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BankClearanceDetail } from '../types/bank-clearance-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BankClearanceDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bank Clearance Detail records.
 */
export function useBankClearanceDetailList(
  params: BankClearanceDetailListParams = {},
  options?: Omit<UseQueryOptions<BankClearanceDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bankClearanceDetail.list(params),
    queryFn: () => apiGet<BankClearanceDetail[]>(`/bank-clearance-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bank Clearance Detail by ID.
 */
export function useBankClearanceDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BankClearanceDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bankClearanceDetail.detail(id ?? ''),
    queryFn: () => apiGet<BankClearanceDetail | null>(`/bank-clearance-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bank Clearance Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateBankClearanceDetail(
  options?: UseMutationOptions<BankClearanceDetail, Error, Partial<BankClearanceDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BankClearanceDetail>) => apiPost<BankClearanceDetail>('/bank-clearance-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankClearanceDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bank Clearance Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBankClearanceDetail(
  options?: UseMutationOptions<BankClearanceDetail, Error, { id: string; data: Partial<BankClearanceDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BankClearanceDetail> }) =>
      apiPut<BankClearanceDetail>(`/bank-clearance-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankClearanceDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bankClearanceDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bank Clearance Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBankClearanceDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bank-clearance-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bankClearanceDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
