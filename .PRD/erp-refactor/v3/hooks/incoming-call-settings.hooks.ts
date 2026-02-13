// TanStack Query hooks for Incoming Call Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { IncomingCallSettings } from '../types/incoming-call-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface IncomingCallSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Incoming Call Settings records.
 */
export function useIncomingCallSettingsList(
  params: IncomingCallSettingsListParams = {},
  options?: Omit<UseQueryOptions<IncomingCallSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.incomingCallSettings.list(params),
    queryFn: () => apiGet<IncomingCallSettings[]>(`/incoming-call-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Incoming Call Settings by ID.
 */
export function useIncomingCallSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<IncomingCallSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.incomingCallSettings.detail(id ?? ''),
    queryFn: () => apiGet<IncomingCallSettings | null>(`/incoming-call-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Incoming Call Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateIncomingCallSettings(
  options?: UseMutationOptions<IncomingCallSettings, Error, Partial<IncomingCallSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IncomingCallSettings>) => apiPost<IncomingCallSettings>('/incoming-call-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingCallSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Incoming Call Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateIncomingCallSettings(
  options?: UseMutationOptions<IncomingCallSettings, Error, { id: string; data: Partial<IncomingCallSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IncomingCallSettings> }) =>
      apiPut<IncomingCallSettings>(`/incoming-call-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingCallSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingCallSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Incoming Call Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteIncomingCallSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/incoming-call-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingCallSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
