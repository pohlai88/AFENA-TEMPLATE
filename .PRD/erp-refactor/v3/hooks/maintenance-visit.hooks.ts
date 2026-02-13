// TanStack Query hooks for Maintenance Visit
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MaintenanceVisit } from '../types/maintenance-visit.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MaintenanceVisitListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Maintenance Visit records.
 */
export function useMaintenanceVisitList(
  params: MaintenanceVisitListParams = {},
  options?: Omit<UseQueryOptions<MaintenanceVisit[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.maintenanceVisit.list(params),
    queryFn: () => apiGet<MaintenanceVisit[]>(`/maintenance-visit${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Maintenance Visit by ID.
 */
export function useMaintenanceVisit(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MaintenanceVisit | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.maintenanceVisit.detail(id ?? ''),
    queryFn: () => apiGet<MaintenanceVisit | null>(`/maintenance-visit/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Maintenance Visit.
 * Automatically invalidates list queries on success.
 */
export function useCreateMaintenanceVisit(
  options?: UseMutationOptions<MaintenanceVisit, Error, Partial<MaintenanceVisit>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MaintenanceVisit>) => apiPost<MaintenanceVisit>('/maintenance-visit', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisit.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Maintenance Visit.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMaintenanceVisit(
  options?: UseMutationOptions<MaintenanceVisit, Error, { id: string; data: Partial<MaintenanceVisit> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaintenanceVisit> }) =>
      apiPut<MaintenanceVisit>(`/maintenance-visit/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisit.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisit.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Maintenance Visit by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMaintenanceVisit(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/maintenance-visit/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisit.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Maintenance Visit (set docstatus = 1).
 */
export function useSubmitMaintenanceVisit(
  options?: UseMutationOptions<MaintenanceVisit, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<MaintenanceVisit>(`/maintenance-visit/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisit.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisit.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Maintenance Visit (set docstatus = 2).
 */
export function useCancelMaintenanceVisit(
  options?: UseMutationOptions<MaintenanceVisit, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<MaintenanceVisit>(`/maintenance-visit/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisit.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceVisit.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
