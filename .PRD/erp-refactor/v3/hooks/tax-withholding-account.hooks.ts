// TanStack Query hooks for Tax Withholding Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TaxWithholdingAccount } from '../types/tax-withholding-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TaxWithholdingAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Tax Withholding Account records.
 */
export function useTaxWithholdingAccountList(
  params: TaxWithholdingAccountListParams = {},
  options?: Omit<UseQueryOptions<TaxWithholdingAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.taxWithholdingAccount.list(params),
    queryFn: () => apiGet<TaxWithholdingAccount[]>(`/tax-withholding-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Tax Withholding Account by ID.
 */
export function useTaxWithholdingAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TaxWithholdingAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.taxWithholdingAccount.detail(id ?? ''),
    queryFn: () => apiGet<TaxWithholdingAccount | null>(`/tax-withholding-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Tax Withholding Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateTaxWithholdingAccount(
  options?: UseMutationOptions<TaxWithholdingAccount, Error, Partial<TaxWithholdingAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TaxWithholdingAccount>) => apiPost<TaxWithholdingAccount>('/tax-withholding-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Tax Withholding Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTaxWithholdingAccount(
  options?: UseMutationOptions<TaxWithholdingAccount, Error, { id: string; data: Partial<TaxWithholdingAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaxWithholdingAccount> }) =>
      apiPut<TaxWithholdingAccount>(`/tax-withholding-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Tax Withholding Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTaxWithholdingAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/tax-withholding-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
