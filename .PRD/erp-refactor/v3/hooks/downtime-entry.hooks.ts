// TanStack Query hooks for Downtime Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DowntimeEntry } from '../types/downtime-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DowntimeEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Downtime Entry records.
 */
export function useDowntimeEntryList(
  params: DowntimeEntryListParams = {},
  options?: Omit<UseQueryOptions<DowntimeEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.downtimeEntry.list(params),
    queryFn: () => apiGet<DowntimeEntry[]>(`/downtime-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Downtime Entry by ID.
 */
export function useDowntimeEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DowntimeEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.downtimeEntry.detail(id ?? ''),
    queryFn: () => apiGet<DowntimeEntry | null>(`/downtime-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Downtime Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateDowntimeEntry(
  options?: UseMutationOptions<DowntimeEntry, Error, Partial<DowntimeEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DowntimeEntry>) => apiPost<DowntimeEntry>('/downtime-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.downtimeEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Downtime Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDowntimeEntry(
  options?: UseMutationOptions<DowntimeEntry, Error, { id: string; data: Partial<DowntimeEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DowntimeEntry> }) =>
      apiPut<DowntimeEntry>(`/downtime-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.downtimeEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.downtimeEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Downtime Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDowntimeEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/downtime-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.downtimeEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
