// TanStack Query hooks for Workstation Working Hour
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WorkstationWorkingHour } from '../types/workstation-working-hour.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WorkstationWorkingHourListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Workstation Working Hour records.
 */
export function useWorkstationWorkingHourList(
  params: WorkstationWorkingHourListParams = {},
  options?: Omit<UseQueryOptions<WorkstationWorkingHour[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.workstationWorkingHour.list(params),
    queryFn: () => apiGet<WorkstationWorkingHour[]>(`/workstation-working-hour${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Workstation Working Hour by ID.
 */
export function useWorkstationWorkingHour(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WorkstationWorkingHour | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.workstationWorkingHour.detail(id ?? ''),
    queryFn: () => apiGet<WorkstationWorkingHour | null>(`/workstation-working-hour/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Workstation Working Hour.
 * Automatically invalidates list queries on success.
 */
export function useCreateWorkstationWorkingHour(
  options?: UseMutationOptions<WorkstationWorkingHour, Error, Partial<WorkstationWorkingHour>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkstationWorkingHour>) => apiPost<WorkstationWorkingHour>('/workstation-working-hour', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationWorkingHour.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Workstation Working Hour.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWorkstationWorkingHour(
  options?: UseMutationOptions<WorkstationWorkingHour, Error, { id: string; data: Partial<WorkstationWorkingHour> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkstationWorkingHour> }) =>
      apiPut<WorkstationWorkingHour>(`/workstation-working-hour/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationWorkingHour.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationWorkingHour.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Workstation Working Hour by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWorkstationWorkingHour(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/workstation-working-hour/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationWorkingHour.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
