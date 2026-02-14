// TanStack Query hooks for Quality Meeting Minutes
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityMeetingMinutes } from '../types/quality-meeting-minutes.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityMeetingMinutesListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Meeting Minutes records.
 */
export function useQualityMeetingMinutesList(
  params: QualityMeetingMinutesListParams = {},
  options?: Omit<UseQueryOptions<QualityMeetingMinutes[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityMeetingMinutes.list(params),
    queryFn: () => apiGet<QualityMeetingMinutes[]>(`/quality-meeting-minutes${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Meeting Minutes by ID.
 */
export function useQualityMeetingMinutes(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityMeetingMinutes | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityMeetingMinutes.detail(id ?? ''),
    queryFn: () => apiGet<QualityMeetingMinutes | null>(`/quality-meeting-minutes/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Meeting Minutes.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityMeetingMinutes(
  options?: UseMutationOptions<QualityMeetingMinutes, Error, Partial<QualityMeetingMinutes>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityMeetingMinutes>) => apiPost<QualityMeetingMinutes>('/quality-meeting-minutes', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeetingMinutes.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Meeting Minutes.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityMeetingMinutes(
  options?: UseMutationOptions<QualityMeetingMinutes, Error, { id: string; data: Partial<QualityMeetingMinutes> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityMeetingMinutes> }) =>
      apiPut<QualityMeetingMinutes>(`/quality-meeting-minutes/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeetingMinutes.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeetingMinutes.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Meeting Minutes by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityMeetingMinutes(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-meeting-minutes/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeetingMinutes.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
