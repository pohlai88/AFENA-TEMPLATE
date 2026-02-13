// TanStack Query hooks for Call Log
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CallLog } from '../types/call-log.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CallLogListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Call Log records.
 */
export function useCallLogList(
  params: CallLogListParams = {},
  options?: Omit<UseQueryOptions<CallLog[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.callLog.list(params),
    queryFn: () => apiGet<CallLog[]>(`/call-log${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Call Log by ID.
 */
export function useCallLog(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CallLog | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.callLog.detail(id ?? ''),
    queryFn: () => apiGet<CallLog | null>(`/call-log/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Call Log.
 * Automatically invalidates list queries on success.
 */
export function useCreateCallLog(
  options?: UseMutationOptions<CallLog, Error, Partial<CallLog>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CallLog>) => apiPost<CallLog>('/call-log', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.callLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Call Log.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCallLog(
  options?: UseMutationOptions<CallLog, Error, { id: string; data: Partial<CallLog> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CallLog> }) =>
      apiPut<CallLog>(`/call-log/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.callLog.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.callLog.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Call Log by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCallLog(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/call-log/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.callLog.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
