// TanStack Query hooks for Pause SLA On Status
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PauseSlaOnStatus } from '../types/pause-sla-on-status.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PauseSlaOnStatusListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Pause SLA On Status records.
 */
export function usePauseSlaOnStatusList(
  params: PauseSlaOnStatusListParams = {},
  options?: Omit<UseQueryOptions<PauseSlaOnStatus[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.pauseSlaOnStatus.list(params),
    queryFn: () => apiGet<PauseSlaOnStatus[]>(`/pause-sla-on-status${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Pause SLA On Status by ID.
 */
export function usePauseSlaOnStatus(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PauseSlaOnStatus | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.pauseSlaOnStatus.detail(id ?? ''),
    queryFn: () => apiGet<PauseSlaOnStatus | null>(`/pause-sla-on-status/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Pause SLA On Status.
 * Automatically invalidates list queries on success.
 */
export function useCreatePauseSlaOnStatus(
  options?: UseMutationOptions<PauseSlaOnStatus, Error, Partial<PauseSlaOnStatus>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PauseSlaOnStatus>) => apiPost<PauseSlaOnStatus>('/pause-sla-on-status', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pauseSlaOnStatus.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Pause SLA On Status.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePauseSlaOnStatus(
  options?: UseMutationOptions<PauseSlaOnStatus, Error, { id: string; data: Partial<PauseSlaOnStatus> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PauseSlaOnStatus> }) =>
      apiPut<PauseSlaOnStatus>(`/pause-sla-on-status/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pauseSlaOnStatus.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.pauseSlaOnStatus.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Pause SLA On Status by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePauseSlaOnStatus(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pause-sla-on-status/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pauseSlaOnStatus.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
