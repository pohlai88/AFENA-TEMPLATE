// TanStack Query hooks for Party Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PartyAccount } from '../types/party-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PartyAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Party Account records.
 */
export function usePartyAccountList(
  params: PartyAccountListParams = {},
  options?: Omit<UseQueryOptions<PartyAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.partyAccount.list(params),
    queryFn: () => apiGet<PartyAccount[]>(`/party-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Party Account by ID.
 */
export function usePartyAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PartyAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.partyAccount.detail(id ?? ''),
    queryFn: () => apiGet<PartyAccount | null>(`/party-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Party Account.
 * Automatically invalidates list queries on success.
 */
export function useCreatePartyAccount(
  options?: UseMutationOptions<PartyAccount, Error, Partial<PartyAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PartyAccount>) => apiPost<PartyAccount>('/party-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partyAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Party Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePartyAccount(
  options?: UseMutationOptions<PartyAccount, Error, { id: string; data: Partial<PartyAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PartyAccount> }) =>
      apiPut<PartyAccount>(`/party-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partyAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.partyAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Party Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePartyAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/party-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partyAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
