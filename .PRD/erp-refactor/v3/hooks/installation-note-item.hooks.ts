// TanStack Query hooks for Installation Note Item
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { InstallationNoteItem } from '../types/installation-note-item.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface InstallationNoteItemListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Installation Note Item records.
 */
export function useInstallationNoteItemList(
  params: InstallationNoteItemListParams = {},
  options?: Omit<UseQueryOptions<InstallationNoteItem[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.installationNoteItem.list(params),
    queryFn: () => apiGet<InstallationNoteItem[]>(`/installation-note-item${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Installation Note Item by ID.
 */
export function useInstallationNoteItem(
  id: string | undefined,
  options?: Omit<UseQueryOptions<InstallationNoteItem | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.installationNoteItem.detail(id ?? ''),
    queryFn: () => apiGet<InstallationNoteItem | null>(`/installation-note-item/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Installation Note Item.
 * Automatically invalidates list queries on success.
 */
export function useCreateInstallationNoteItem(
  options?: UseMutationOptions<InstallationNoteItem, Error, Partial<InstallationNoteItem>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<InstallationNoteItem>) => apiPost<InstallationNoteItem>('/installation-note-item', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNoteItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Installation Note Item.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateInstallationNoteItem(
  options?: UseMutationOptions<InstallationNoteItem, Error, { id: string; data: Partial<InstallationNoteItem> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InstallationNoteItem> }) =>
      apiPut<InstallationNoteItem>(`/installation-note-item/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNoteItem.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNoteItem.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Installation Note Item by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteInstallationNoteItem(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/installation-note-item/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.installationNoteItem.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
