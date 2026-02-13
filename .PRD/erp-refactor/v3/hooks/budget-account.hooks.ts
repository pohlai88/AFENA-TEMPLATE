// TanStack Query hooks for Budget Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BudgetAccount } from '../types/budget-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BudgetAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Budget Account records.
 */
export function useBudgetAccountList(
  params: BudgetAccountListParams = {},
  options?: Omit<UseQueryOptions<BudgetAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.budgetAccount.list(params),
    queryFn: () => apiGet<BudgetAccount[]>(`/budget-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Budget Account by ID.
 */
export function useBudgetAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BudgetAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.budgetAccount.detail(id ?? ''),
    queryFn: () => apiGet<BudgetAccount | null>(`/budget-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Budget Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateBudgetAccount(
  options?: UseMutationOptions<BudgetAccount, Error, Partial<BudgetAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BudgetAccount>) => apiPost<BudgetAccount>('/budget-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Budget Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBudgetAccount(
  options?: UseMutationOptions<BudgetAccount, Error, { id: string; data: Partial<BudgetAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BudgetAccount> }) =>
      apiPut<BudgetAccount>(`/budget-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Budget Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBudgetAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/budget-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.budgetAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
