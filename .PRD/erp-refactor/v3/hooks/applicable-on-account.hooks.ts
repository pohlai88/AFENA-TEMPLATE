// TanStack Query hooks for Applicable On Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ApplicableOnAccount } from '../types/applicable-on-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ApplicableOnAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Applicable On Account records.
 */
export function useApplicableOnAccountList(
  params: ApplicableOnAccountListParams = {},
  options?: Omit<UseQueryOptions<ApplicableOnAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.applicableOnAccount.list(params),
    queryFn: () => apiGet<ApplicableOnAccount[]>(`/applicable-on-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Applicable On Account by ID.
 */
export function useApplicableOnAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ApplicableOnAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.applicableOnAccount.detail(id ?? ''),
    queryFn: () => apiGet<ApplicableOnAccount | null>(`/applicable-on-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Applicable On Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateApplicableOnAccount(
  options?: UseMutationOptions<ApplicableOnAccount, Error, Partial<ApplicableOnAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ApplicableOnAccount>) => apiPost<ApplicableOnAccount>('/applicable-on-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applicableOnAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Applicable On Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateApplicableOnAccount(
  options?: UseMutationOptions<ApplicableOnAccount, Error, { id: string; data: Partial<ApplicableOnAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ApplicableOnAccount> }) =>
      apiPut<ApplicableOnAccount>(`/applicable-on-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applicableOnAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.applicableOnAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Applicable On Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteApplicableOnAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/applicable-on-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applicableOnAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
