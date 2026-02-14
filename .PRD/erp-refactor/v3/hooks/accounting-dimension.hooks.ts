// TanStack Query hooks for Accounting Dimension
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AccountingDimension } from '../types/accounting-dimension.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AccountingDimensionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Accounting Dimension records.
 */
export function useAccountingDimensionList(
  params: AccountingDimensionListParams = {},
  options?: Omit<UseQueryOptions<AccountingDimension[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.accountingDimension.list(params),
    queryFn: () => apiGet<AccountingDimension[]>(`/accounting-dimension${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Accounting Dimension by ID.
 */
export function useAccountingDimension(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AccountingDimension | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.accountingDimension.detail(id ?? ''),
    queryFn: () => apiGet<AccountingDimension | null>(`/accounting-dimension/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Accounting Dimension.
 * Automatically invalidates list queries on success.
 */
export function useCreateAccountingDimension(
  options?: UseMutationOptions<AccountingDimension, Error, Partial<AccountingDimension>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AccountingDimension>) => apiPost<AccountingDimension>('/accounting-dimension', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimension.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Accounting Dimension.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAccountingDimension(
  options?: UseMutationOptions<AccountingDimension, Error, { id: string; data: Partial<AccountingDimension> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccountingDimension> }) =>
      apiPut<AccountingDimension>(`/accounting-dimension/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimension.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimension.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Accounting Dimension by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAccountingDimension(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/accounting-dimension/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingDimension.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
