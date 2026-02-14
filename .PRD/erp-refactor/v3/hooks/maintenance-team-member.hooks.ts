// TanStack Query hooks for Maintenance Team Member
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MaintenanceTeamMember } from '../types/maintenance-team-member.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MaintenanceTeamMemberListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Maintenance Team Member records.
 */
export function useMaintenanceTeamMemberList(
  params: MaintenanceTeamMemberListParams = {},
  options?: Omit<UseQueryOptions<MaintenanceTeamMember[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.maintenanceTeamMember.list(params),
    queryFn: () => apiGet<MaintenanceTeamMember[]>(`/maintenance-team-member${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Maintenance Team Member by ID.
 */
export function useMaintenanceTeamMember(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MaintenanceTeamMember | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.maintenanceTeamMember.detail(id ?? ''),
    queryFn: () => apiGet<MaintenanceTeamMember | null>(`/maintenance-team-member/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Maintenance Team Member.
 * Automatically invalidates list queries on success.
 */
export function useCreateMaintenanceTeamMember(
  options?: UseMutationOptions<MaintenanceTeamMember, Error, Partial<MaintenanceTeamMember>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MaintenanceTeamMember>) => apiPost<MaintenanceTeamMember>('/maintenance-team-member', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceTeamMember.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Maintenance Team Member.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMaintenanceTeamMember(
  options?: UseMutationOptions<MaintenanceTeamMember, Error, { id: string; data: Partial<MaintenanceTeamMember> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaintenanceTeamMember> }) =>
      apiPut<MaintenanceTeamMember>(`/maintenance-team-member/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceTeamMember.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceTeamMember.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Maintenance Team Member by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMaintenanceTeamMember(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/maintenance-team-member/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenanceTeamMember.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
