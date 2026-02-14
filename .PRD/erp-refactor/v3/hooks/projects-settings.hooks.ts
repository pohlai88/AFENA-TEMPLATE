// TanStack Query hooks for Projects Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ProjectsSettings } from '../types/projects-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ProjectsSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Projects Settings records.
 */
export function useProjectsSettingsList(
  params: ProjectsSettingsListParams = {},
  options?: Omit<UseQueryOptions<ProjectsSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.projectsSettings.list(params),
    queryFn: () => apiGet<ProjectsSettings[]>(`/projects-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Projects Settings by ID.
 */
export function useProjectsSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ProjectsSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.projectsSettings.detail(id ?? ''),
    queryFn: () => apiGet<ProjectsSettings | null>(`/projects-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Projects Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateProjectsSettings(
  options?: UseMutationOptions<ProjectsSettings, Error, Partial<ProjectsSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ProjectsSettings>) => apiPost<ProjectsSettings>('/projects-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectsSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Projects Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateProjectsSettings(
  options?: UseMutationOptions<ProjectsSettings, Error, { id: string; data: Partial<ProjectsSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectsSettings> }) =>
      apiPut<ProjectsSettings>(`/projects-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectsSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.projectsSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Projects Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteProjectsSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/projects-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projectsSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
