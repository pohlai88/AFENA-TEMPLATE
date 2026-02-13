// TanStack Query hooks for Voice Call Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { VoiceCallSettings } from '../types/voice-call-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface VoiceCallSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Voice Call Settings records.
 */
export function useVoiceCallSettingsList(
  params: VoiceCallSettingsListParams = {},
  options?: Omit<UseQueryOptions<VoiceCallSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.voiceCallSettings.list(params),
    queryFn: () => apiGet<VoiceCallSettings[]>(`/voice-call-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Voice Call Settings by ID.
 */
export function useVoiceCallSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<VoiceCallSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.voiceCallSettings.detail(id ?? ''),
    queryFn: () => apiGet<VoiceCallSettings | null>(`/voice-call-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Voice Call Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateVoiceCallSettings(
  options?: UseMutationOptions<VoiceCallSettings, Error, Partial<VoiceCallSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<VoiceCallSettings>) => apiPost<VoiceCallSettings>('/voice-call-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.voiceCallSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Voice Call Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateVoiceCallSettings(
  options?: UseMutationOptions<VoiceCallSettings, Error, { id: string; data: Partial<VoiceCallSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VoiceCallSettings> }) =>
      apiPut<VoiceCallSettings>(`/voice-call-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.voiceCallSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.voiceCallSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Voice Call Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteVoiceCallSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/voice-call-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.voiceCallSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
