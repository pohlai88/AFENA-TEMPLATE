// TanStack Query hooks for Accounting Dimension Filter
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AccountingDimensionFilter } from '../types/accounting-dimension-filter.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AccountingDimensionFilterListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Accounting Dimension Filter records.
 */
export function useAccountingDimensionFilterList(
  params: AccountingDimensionFilterListParams = {},
  options?: Omit<UseQueryOptions<AccountingDimensionFilter[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.accountingDimensionFilter.list(params),
    queryFn: () => apiGet<AccountingDimensionFilter[]>(`/accounting-dimension-filter${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Accounting Dimension Filter by ID.
 */
export function useAccountingDimensionFilter(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AccountingDimensionFilter | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.accountingDimensionFilter.detail(id ?? ''),
    queryFn: () => apiGet<AccountingDimensionFilter | null>(`/accounting-dimension-filter/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Accounting Dimension Filter.
 * Automatically invalidates list queries on success.
 */
export function useCreateAccountingDimensionFilter(
  options?: UseMutationOptions<AccountingDimensionFilter, Error, Partial<AccountingDimensionFilter>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AccountingDimensionFilter>) => apiPost<AccountingDimensionFilter>('/accounting-dimension-filter', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimensionFilter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Accounting Dimension Filter.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAccountingDimensionFilter(
  options?: UseMutationOptions<AccountingDimensionFilter, Error, { id: string; data: Partial<AccountingDimensionFilter> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccountingDimensionFilter> }) =>
      apiPut<AccountingDimensionFilter>(`/accounting-dimension-filter/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimensionFilter.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimensionFilter.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Accounting Dimension Filter by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAccountingDimensionFilter(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/accounting-dimension-filter/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimensionFilter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
