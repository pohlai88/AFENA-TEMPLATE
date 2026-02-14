// TanStack Query hooks for South Africa VAT Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SouthAfricaVatAccount } from '../types/south-africa-vat-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SouthAfricaVatAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of South Africa VAT Account records.
 */
export function useSouthAfricaVatAccountList(
  params: SouthAfricaVatAccountListParams = {},
  options?: Omit<UseQueryOptions<SouthAfricaVatAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.southAfricaVatAccount.list(params),
    queryFn: () => apiGet<SouthAfricaVatAccount[]>(`/south-africa-vat-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single South Africa VAT Account by ID.
 */
export function useSouthAfricaVatAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SouthAfricaVatAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.southAfricaVatAccount.detail(id ?? ''),
    queryFn: () => apiGet<SouthAfricaVatAccount | null>(`/south-africa-vat-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new South Africa VAT Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateSouthAfricaVatAccount(
  options?: UseMutationOptions<SouthAfricaVatAccount, Error, Partial<SouthAfricaVatAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SouthAfricaVatAccount>) => apiPost<SouthAfricaVatAccount>('/south-africa-vat-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.southAfricaVatAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing South Africa VAT Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSouthAfricaVatAccount(
  options?: UseMutationOptions<SouthAfricaVatAccount, Error, { id: string; data: Partial<SouthAfricaVatAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SouthAfricaVatAccount> }) =>
      apiPut<SouthAfricaVatAccount>(`/south-africa-vat-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.southAfricaVatAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.southAfricaVatAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a South Africa VAT Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSouthAfricaVatAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/south-africa-vat-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.southAfricaVatAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
