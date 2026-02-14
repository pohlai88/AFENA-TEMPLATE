// TanStack Query hooks for Installation Note
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { InstallationNote } from '../types/installation-note.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface InstallationNoteListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Installation Note records.
 */
export function useInstallationNoteList(
  params: InstallationNoteListParams = {},
  options?: Omit<UseQueryOptions<InstallationNote[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.installationNote.list(params),
    queryFn: () => apiGet<InstallationNote[]>(`/installation-note${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Installation Note by ID.
 */
export function useInstallationNote(
  id: string | undefined,
  options?: Omit<UseQueryOptions<InstallationNote | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.installationNote.detail(id ?? ''),
    queryFn: () => apiGet<InstallationNote | null>(`/installation-note/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Installation Note.
 * Automatically invalidates list queries on success.
 */
export function useCreateInstallationNote(
  options?: UseMutationOptions<InstallationNote, Error, Partial<InstallationNote>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<InstallationNote>) => apiPost<InstallationNote>('/installation-note', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNote.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Installation Note.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateInstallationNote(
  options?: UseMutationOptions<InstallationNote, Error, { id: string; data: Partial<InstallationNote> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InstallationNote> }) =>
      apiPut<InstallationNote>(`/installation-note/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNote.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNote.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Installation Note by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteInstallationNote(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/installation-note/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNote.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Installation Note (set docstatus = 1).
 */
export function useSubmitInstallationNote(
  options?: UseMutationOptions<InstallationNote, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<InstallationNote>(`/installation-note/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNote.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNote.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Installation Note (set docstatus = 2).
 */
export function useCancelInstallationNote(
  options?: UseMutationOptions<InstallationNote, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<InstallationNote>(`/installation-note/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNote.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNote.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
