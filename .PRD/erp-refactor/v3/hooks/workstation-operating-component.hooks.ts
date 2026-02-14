// TanStack Query hooks for Workstation Operating Component
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WorkstationOperatingComponent } from '../types/workstation-operating-component.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WorkstationOperatingComponentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Workstation Operating Component records.
 */
export function useWorkstationOperatingComponentList(
  params: WorkstationOperatingComponentListParams = {},
  options?: Omit<UseQueryOptions<WorkstationOperatingComponent[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.workstationOperatingComponent.list(params),
    queryFn: () => apiGet<WorkstationOperatingComponent[]>(`/workstation-operating-component${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Workstation Operating Component by ID.
 */
export function useWorkstationOperatingComponent(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WorkstationOperatingComponent | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.workstationOperatingComponent.detail(id ?? ''),
    queryFn: () => apiGet<WorkstationOperatingComponent | null>(`/workstation-operating-component/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Workstation Operating Component.
 * Automatically invalidates list queries on success.
 */
export function useCreateWorkstationOperatingComponent(
  options?: UseMutationOptions<WorkstationOperatingComponent, Error, Partial<WorkstationOperatingComponent>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkstationOperatingComponent>) => apiPost<WorkstationOperatingComponent>('/workstation-operating-component', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationOperatingComponent.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Workstation Operating Component.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWorkstationOperatingComponent(
  options?: UseMutationOptions<WorkstationOperatingComponent, Error, { id: string; data: Partial<WorkstationOperatingComponent> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkstationOperatingComponent> }) =>
      apiPut<WorkstationOperatingComponent>(`/workstation-operating-component/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationOperatingComponent.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationOperatingComponent.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Workstation Operating Component by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWorkstationOperatingComponent(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/workstation-operating-component/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationOperatingComponent.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
