// TanStack Query hooks for Workstation Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WorkstationType } from '../types/workstation-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WorkstationTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Workstation Type records.
 */
export function useWorkstationTypeList(
  params: WorkstationTypeListParams = {},
  options?: Omit<UseQueryOptions<WorkstationType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.workstationType.list(params),
    queryFn: () => apiGet<WorkstationType[]>(`/workstation-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Workstation Type by ID.
 */
export function useWorkstationType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WorkstationType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.workstationType.detail(id ?? ''),
    queryFn: () => apiGet<WorkstationType | null>(`/workstation-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Workstation Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateWorkstationType(
  options?: UseMutationOptions<WorkstationType, Error, Partial<WorkstationType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkstationType>) => apiPost<WorkstationType>('/workstation-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Workstation Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWorkstationType(
  options?: UseMutationOptions<WorkstationType, Error, { id: string; data: Partial<WorkstationType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkstationType> }) =>
      apiPut<WorkstationType>(`/workstation-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Workstation Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWorkstationType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/workstation-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
