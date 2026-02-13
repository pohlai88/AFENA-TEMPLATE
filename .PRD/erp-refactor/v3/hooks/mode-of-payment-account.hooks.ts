// TanStack Query hooks for Mode of Payment Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ModeOfPaymentAccount } from '../types/mode-of-payment-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ModeOfPaymentAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Mode of Payment Account records.
 */
export function useModeOfPaymentAccountList(
  params: ModeOfPaymentAccountListParams = {},
  options?: Omit<UseQueryOptions<ModeOfPaymentAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.modeOfPaymentAccount.list(params),
    queryFn: () => apiGet<ModeOfPaymentAccount[]>(`/mode-of-payment-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Mode of Payment Account by ID.
 */
export function useModeOfPaymentAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ModeOfPaymentAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.modeOfPaymentAccount.detail(id ?? ''),
    queryFn: () => apiGet<ModeOfPaymentAccount | null>(`/mode-of-payment-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Mode of Payment Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateModeOfPaymentAccount(
  options?: UseMutationOptions<ModeOfPaymentAccount, Error, Partial<ModeOfPaymentAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ModeOfPaymentAccount>) => apiPost<ModeOfPaymentAccount>('/mode-of-payment-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modeOfPaymentAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Mode of Payment Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateModeOfPaymentAccount(
  options?: UseMutationOptions<ModeOfPaymentAccount, Error, { id: string; data: Partial<ModeOfPaymentAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ModeOfPaymentAccount> }) =>
      apiPut<ModeOfPaymentAccount>(`/mode-of-payment-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modeOfPaymentAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.modeOfPaymentAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Mode of Payment Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteModeOfPaymentAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/mode-of-payment-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modeOfPaymentAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
