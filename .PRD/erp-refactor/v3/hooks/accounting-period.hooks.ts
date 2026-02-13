// TanStack Query hooks for Accounting Period
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AccountingPeriod } from '../types/accounting-period.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AccountingPeriodListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Accounting Period records.
 */
export function useAccountingPeriodList(
  params: AccountingPeriodListParams = {},
  options?: Omit<UseQueryOptions<AccountingPeriod[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.accountingPeriod.list(params),
    queryFn: () => apiGet<AccountingPeriod[]>(`/accounting-period${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Accounting Period by ID.
 */
export function useAccountingPeriod(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AccountingPeriod | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.accountingPeriod.detail(id ?? ''),
    queryFn: () => apiGet<AccountingPeriod | null>(`/accounting-period/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Accounting Period.
 * Automatically invalidates list queries on success.
 */
export function useCreateAccountingPeriod(
  options?: UseMutationOptions<AccountingPeriod, Error, Partial<AccountingPeriod>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AccountingPeriod>) => apiPost<AccountingPeriod>('/accounting-period', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingPeriod.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Accounting Period.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAccountingPeriod(
  options?: UseMutationOptions<AccountingPeriod, Error, { id: string; data: Partial<AccountingPeriod> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccountingPeriod> }) =>
      apiPut<AccountingPeriod>(`/accounting-period/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingPeriod.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingPeriod.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Accounting Period by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAccountingPeriod(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/accounting-period/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountingPeriod.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
