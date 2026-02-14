// TanStack Query hooks for Accounting Dimension Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AccountingDimensionDetail } from '../types/accounting-dimension-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AccountingDimensionDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Accounting Dimension Detail records.
 */
export function useAccountingDimensionDetailList(
  params: AccountingDimensionDetailListParams = {},
  options?: Omit<UseQueryOptions<AccountingDimensionDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.accountingDimensionDetail.list(params),
    queryFn: () => apiGet<AccountingDimensionDetail[]>(`/accounting-dimension-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Accounting Dimension Detail by ID.
 */
export function useAccountingDimensionDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AccountingDimensionDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.accountingDimensionDetail.detail(id ?? ''),
    queryFn: () => apiGet<AccountingDimensionDetail | null>(`/accounting-dimension-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Accounting Dimension Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateAccountingDimensionDetail(
  options?: UseMutationOptions<AccountingDimensionDetail, Error, Partial<AccountingDimensionDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AccountingDimensionDetail>) => apiPost<AccountingDimensionDetail>('/accounting-dimension-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimensionDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Accounting Dimension Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAccountingDimensionDetail(
  options?: UseMutationOptions<AccountingDimensionDetail, Error, { id: string; data: Partial<AccountingDimensionDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccountingDimensionDetail> }) =>
      apiPut<AccountingDimensionDetail>(`/accounting-dimension-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimensionDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimensionDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Accounting Dimension Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAccountingDimensionDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/accounting-dimension-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimensionDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
