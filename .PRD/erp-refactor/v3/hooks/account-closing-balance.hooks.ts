// TanStack Query hooks for Account Closing Balance
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AccountClosingBalance } from '../types/account-closing-balance.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AccountClosingBalanceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Account Closing Balance records.
 */
export function useAccountClosingBalanceList(
  params: AccountClosingBalanceListParams = {},
  options?: Omit<UseQueryOptions<AccountClosingBalance[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.accountClosingBalance.list(params),
    queryFn: () => apiGet<AccountClosingBalance[]>(`/account-closing-balance${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Account Closing Balance by ID.
 */
export function useAccountClosingBalance(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AccountClosingBalance | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.accountClosingBalance.detail(id ?? ''),
    queryFn: () => apiGet<AccountClosingBalance | null>(`/account-closing-balance/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Account Closing Balance.
 * Automatically invalidates list queries on success.
 */
export function useCreateAccountClosingBalance(
  options?: UseMutationOptions<AccountClosingBalance, Error, Partial<AccountClosingBalance>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AccountClosingBalance>) => apiPost<AccountClosingBalance>('/account-closing-balance', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountClosingBalance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Account Closing Balance.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAccountClosingBalance(
  options?: UseMutationOptions<AccountClosingBalance, Error, { id: string; data: Partial<AccountClosingBalance> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccountClosingBalance> }) =>
      apiPut<AccountClosingBalance>(`/account-closing-balance/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountClosingBalance.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.accountClosingBalance.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Account Closing Balance by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAccountClosingBalance(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/account-closing-balance/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountClosingBalance.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
