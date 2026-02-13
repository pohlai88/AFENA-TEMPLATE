// TanStack Query hooks for Quality Meeting Agenda
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityMeetingAgenda } from '../types/quality-meeting-agenda.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityMeetingAgendaListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Meeting Agenda records.
 */
export function useQualityMeetingAgendaList(
  params: QualityMeetingAgendaListParams = {},
  options?: Omit<UseQueryOptions<QualityMeetingAgenda[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityMeetingAgenda.list(params),
    queryFn: () => apiGet<QualityMeetingAgenda[]>(`/quality-meeting-agenda${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Meeting Agenda by ID.
 */
export function useQualityMeetingAgenda(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityMeetingAgenda | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityMeetingAgenda.detail(id ?? ''),
    queryFn: () => apiGet<QualityMeetingAgenda | null>(`/quality-meeting-agenda/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Meeting Agenda.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityMeetingAgenda(
  options?: UseMutationOptions<QualityMeetingAgenda, Error, Partial<QualityMeetingAgenda>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityMeetingAgenda>) => apiPost<QualityMeetingAgenda>('/quality-meeting-agenda', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeetingAgenda.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Meeting Agenda.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityMeetingAgenda(
  options?: UseMutationOptions<QualityMeetingAgenda, Error, { id: string; data: Partial<QualityMeetingAgenda> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityMeetingAgenda> }) =>
      apiPut<QualityMeetingAgenda>(`/quality-meeting-agenda/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeetingAgenda.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeetingAgenda.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Meeting Agenda by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityMeetingAgenda(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-meeting-agenda/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityMeetingAgenda.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
