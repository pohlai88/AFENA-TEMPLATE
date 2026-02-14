// TanStack Query hooks for Quality Meeting
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityMeeting } from '../types/quality-meeting.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityMeetingListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Meeting records.
 */
export function useQualityMeetingList(
  params: QualityMeetingListParams = {},
  options?: Omit<UseQueryOptions<QualityMeeting[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityMeeting.list(params),
    queryFn: () => apiGet<QualityMeeting[]>(`/quality-meeting${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Meeting by ID.
 */
export function useQualityMeeting(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityMeeting | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityMeeting.detail(id ?? ''),
    queryFn: () => apiGet<QualityMeeting | null>(`/quality-meeting/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Meeting.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityMeeting(
  options?: UseMutationOptions<QualityMeeting, Error, Partial<QualityMeeting>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityMeeting>) => apiPost<QualityMeeting>('/quality-meeting', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeeting.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Meeting.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityMeeting(
  options?: UseMutationOptions<QualityMeeting, Error, { id: string; data: Partial<QualityMeeting> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityMeeting> }) =>
      apiPut<QualityMeeting>(`/quality-meeting/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeeting.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeeting.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Meeting by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityMeeting(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-meeting/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeeting.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
