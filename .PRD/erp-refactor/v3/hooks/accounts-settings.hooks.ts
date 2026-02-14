// TanStack Query hooks for Accounts Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AccountsSettings } from '../types/accounts-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AccountsSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Accounts Settings records.
 */
export function useAccountsSettingsList(
  params: AccountsSettingsListParams = {},
  options?: Omit<UseQueryOptions<AccountsSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.accountsSettings.list(params),
    queryFn: () => apiGet<AccountsSettings[]>(`/accounts-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Accounts Settings by ID.
 */
export function useAccountsSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AccountsSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.accountsSettings.detail(id ?? ''),
    queryFn: () => apiGet<AccountsSettings | null>(`/accounts-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Accounts Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateAccountsSettings(
  options?: UseMutationOptions<AccountsSettings, Error, Partial<AccountsSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AccountsSettings>) => apiPost<AccountsSettings>('/accounts-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountsSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Accounts Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAccountsSettings(
  options?: UseMutationOptions<AccountsSettings, Error, { id: string; data: Partial<AccountsSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AccountsSettings> }) =>
      apiPut<AccountsSettings>(`/accounts-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountsSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.accountsSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Accounts Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAccountsSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/accounts-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accountsSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
