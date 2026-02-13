// TanStack Query hooks for Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Account } from '../types/account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Account records.
 */
export function useAccountList(
  params: AccountListParams = {},
  options?: Omit<UseQueryOptions<Account[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.account.list(params),
    queryFn: () => apiGet<Account[]>(`/account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Account by ID.
 */
export function useAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Account | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.account.detail(id ?? ''),
    queryFn: () => apiGet<Account | null>(`/account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateAccount(
  options?: UseMutationOptions<Account, Error, Partial<Account>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Account>) => apiPost<Account>('/account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAccount(
  options?: UseMutationOptions<Account, Error, { id: string; data: Partial<Account> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Account> }) =>
      apiPut<Account>(`/account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.account.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.account.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
