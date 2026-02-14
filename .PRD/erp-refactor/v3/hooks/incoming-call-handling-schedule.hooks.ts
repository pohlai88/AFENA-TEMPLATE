// TanStack Query hooks for Incoming Call Handling Schedule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { IncomingCallHandlingSchedule } from '../types/incoming-call-handling-schedule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface IncomingCallHandlingScheduleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Incoming Call Handling Schedule records.
 */
export function useIncomingCallHandlingScheduleList(
  params: IncomingCallHandlingScheduleListParams = {},
  options?: Omit<UseQueryOptions<IncomingCallHandlingSchedule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.incomingCallHandlingSchedule.list(params),
    queryFn: () => apiGet<IncomingCallHandlingSchedule[]>(`/incoming-call-handling-schedule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Incoming Call Handling Schedule by ID.
 */
export function useIncomingCallHandlingSchedule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<IncomingCallHandlingSchedule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.incomingCallHandlingSchedule.detail(id ?? ''),
    queryFn: () => apiGet<IncomingCallHandlingSchedule | null>(`/incoming-call-handling-schedule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Incoming Call Handling Schedule.
 * Automatically invalidates list queries on success.
 */
export function useCreateIncomingCallHandlingSchedule(
  options?: UseMutationOptions<IncomingCallHandlingSchedule, Error, Partial<IncomingCallHandlingSchedule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<IncomingCallHandlingSchedule>) => apiPost<IncomingCallHandlingSchedule>('/incoming-call-handling-schedule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingCallHandlingSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Incoming Call Handling Schedule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateIncomingCallHandlingSchedule(
  options?: UseMutationOptions<IncomingCallHandlingSchedule, Error, { id: string; data: Partial<IncomingCallHandlingSchedule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IncomingCallHandlingSchedule> }) =>
      apiPut<IncomingCallHandlingSchedule>(`/incoming-call-handling-schedule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingCallHandlingSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingCallHandlingSchedule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Incoming Call Handling Schedule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteIncomingCallHandlingSchedule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/incoming-call-handling-schedule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incomingCallHandlingSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
