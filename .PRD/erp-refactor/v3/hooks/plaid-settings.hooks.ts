// TanStack Query hooks for Plaid Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PlaidSettings } from '../types/plaid-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PlaidSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Plaid Settings records.
 */
export function usePlaidSettingsList(
  params: PlaidSettingsListParams = {},
  options?: Omit<UseQueryOptions<PlaidSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.plaidSettings.list(params),
    queryFn: () => apiGet<PlaidSettings[]>(`/plaid-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Plaid Settings by ID.
 */
export function usePlaidSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PlaidSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.plaidSettings.detail(id ?? ''),
    queryFn: () => apiGet<PlaidSettings | null>(`/plaid-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Plaid Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreatePlaidSettings(
  options?: UseMutationOptions<PlaidSettings, Error, Partial<PlaidSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PlaidSettings>) => apiPost<PlaidSettings>('/plaid-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plaidSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Plaid Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePlaidSettings(
  options?: UseMutationOptions<PlaidSettings, Error, { id: string; data: Partial<PlaidSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PlaidSettings> }) =>
      apiPut<PlaidSettings>(`/plaid-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plaidSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.plaidSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Plaid Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePlaidSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/plaid-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plaidSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
