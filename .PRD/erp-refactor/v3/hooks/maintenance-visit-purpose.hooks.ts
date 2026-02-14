// TanStack Query hooks for Maintenance Visit Purpose
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MaintenanceVisitPurpose } from '../types/maintenance-visit-purpose.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MaintenanceVisitPurposeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Maintenance Visit Purpose records.
 */
export function useMaintenanceVisitPurposeList(
  params: MaintenanceVisitPurposeListParams = {},
  options?: Omit<UseQueryOptions<MaintenanceVisitPurpose[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.maintenanceVisitPurpose.list(params),
    queryFn: () => apiGet<MaintenanceVisitPurpose[]>(`/maintenance-visit-purpose${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Maintenance Visit Purpose by ID.
 */
export function useMaintenanceVisitPurpose(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MaintenanceVisitPurpose | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.maintenanceVisitPurpose.detail(id ?? ''),
    queryFn: () => apiGet<MaintenanceVisitPurpose | null>(`/maintenance-visit-purpose/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Maintenance Visit Purpose.
 * Automatically invalidates list queries on success.
 */
export function useCreateMaintenanceVisitPurpose(
  options?: UseMutationOptions<MaintenanceVisitPurpose, Error, Partial<MaintenanceVisitPurpose>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MaintenanceVisitPurpose>) => apiPost<MaintenanceVisitPurpose>('/maintenance-visit-purpose', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisitPurpose.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Maintenance Visit Purpose.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMaintenanceVisitPurpose(
  options?: UseMutationOptions<MaintenanceVisitPurpose, Error, { id: string; data: Partial<MaintenanceVisitPurpose> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaintenanceVisitPurpose> }) =>
      apiPut<MaintenanceVisitPurpose>(`/maintenance-visit-purpose/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisitPurpose.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisitPurpose.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Maintenance Visit Purpose by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMaintenanceVisitPurpose(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/maintenance-visit-purpose/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisitPurpose.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
