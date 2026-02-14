// TanStack Query hooks for Workstation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Workstation } from '../types/workstation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WorkstationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Workstation records.
 */
export function useWorkstationList(
  params: WorkstationListParams = {},
  options?: Omit<UseQueryOptions<Workstation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.workstation.list(params),
    queryFn: () => apiGet<Workstation[]>(`/workstation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Workstation by ID.
 */
export function useWorkstation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Workstation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.workstation.detail(id ?? ''),
    queryFn: () => apiGet<Workstation | null>(`/workstation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Workstation.
 * Automatically invalidates list queries on success.
 */
export function useCreateWorkstation(
  options?: UseMutationOptions<Workstation, Error, Partial<Workstation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Workstation>) => apiPost<Workstation>('/workstation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Workstation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWorkstation(
  options?: UseMutationOptions<Workstation, Error, { id: string; data: Partial<Workstation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Workstation> }) =>
      apiPut<Workstation>(`/workstation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workstation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Workstation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWorkstation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/workstation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
