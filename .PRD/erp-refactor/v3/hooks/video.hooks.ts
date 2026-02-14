// TanStack Query hooks for Video
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Video } from '../types/video.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface VideoListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Video records.
 */
export function useVideoList(
  params: VideoListParams = {},
  options?: Omit<UseQueryOptions<Video[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.video.list(params),
    queryFn: () => apiGet<Video[]>(`/video${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Video by ID.
 */
export function useVideo(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Video | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.video.detail(id ?? ''),
    queryFn: () => apiGet<Video | null>(`/video/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Video.
 * Automatically invalidates list queries on success.
 */
export function useCreateVideo(
  options?: UseMutationOptions<Video, Error, Partial<Video>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Video>) => apiPost<Video>('/video', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.video.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Video.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateVideo(
  options?: UseMutationOptions<Video, Error, { id: string; data: Partial<Video> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Video> }) =>
      apiPut<Video>(`/video/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.video.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.video.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Video by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteVideo(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/video/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.video.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
