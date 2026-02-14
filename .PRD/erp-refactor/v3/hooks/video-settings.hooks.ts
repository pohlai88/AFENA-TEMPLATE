// TanStack Query hooks for Video Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { VideoSettings } from '../types/video-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface VideoSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Video Settings records.
 */
export function useVideoSettingsList(
  params: VideoSettingsListParams = {},
  options?: Omit<UseQueryOptions<VideoSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.videoSettings.list(params),
    queryFn: () => apiGet<VideoSettings[]>(`/video-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Video Settings by ID.
 */
export function useVideoSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<VideoSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.videoSettings.detail(id ?? ''),
    queryFn: () => apiGet<VideoSettings | null>(`/video-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Video Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateVideoSettings(
  options?: UseMutationOptions<VideoSettings, Error, Partial<VideoSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<VideoSettings>) => apiPost<VideoSettings>('/video-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videoSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Video Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateVideoSettings(
  options?: UseMutationOptions<VideoSettings, Error, { id: string; data: Partial<VideoSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VideoSettings> }) =>
      apiPut<VideoSettings>(`/video-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videoSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.videoSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Video Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteVideoSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/video-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.videoSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
