// TanStack Query hooks for UAE VAT Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { UaeVatAccount } from '../types/uae-vat-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface UaeVatAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of UAE VAT Account records.
 */
export function useUaeVatAccountList(
  params: UaeVatAccountListParams = {},
  options?: Omit<UseQueryOptions<UaeVatAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.uaeVatAccount.list(params),
    queryFn: () => apiGet<UaeVatAccount[]>(`/uae-vat-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single UAE VAT Account by ID.
 */
export function useUaeVatAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<UaeVatAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.uaeVatAccount.detail(id ?? ''),
    queryFn: () => apiGet<UaeVatAccount | null>(`/uae-vat-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new UAE VAT Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateUaeVatAccount(
  options?: UseMutationOptions<UaeVatAccount, Error, Partial<UaeVatAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UaeVatAccount>) => apiPost<UaeVatAccount>('/uae-vat-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uaeVatAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing UAE VAT Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateUaeVatAccount(
  options?: UseMutationOptions<UaeVatAccount, Error, { id: string; data: Partial<UaeVatAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UaeVatAccount> }) =>
      apiPut<UaeVatAccount>(`/uae-vat-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uaeVatAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uaeVatAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a UAE VAT Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteUaeVatAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/uae-vat-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uaeVatAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
