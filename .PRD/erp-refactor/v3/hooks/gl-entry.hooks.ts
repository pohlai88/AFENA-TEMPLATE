// TanStack Query hooks for GL Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { GlEntry } from '../types/gl-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface GlEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of GL Entry records.
 */
export function useGlEntryList(
  params: GlEntryListParams = {},
  options?: Omit<UseQueryOptions<GlEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.glEntry.list(params),
    queryFn: () => apiGet<GlEntry[]>(`/gl-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single GL Entry by ID.
 */
export function useGlEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<GlEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.glEntry.detail(id ?? ''),
    queryFn: () => apiGet<GlEntry | null>(`/gl-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new GL Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateGlEntry(
  options?: UseMutationOptions<GlEntry, Error, Partial<GlEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<GlEntry>) => apiPost<GlEntry>('/gl-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.glEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing GL Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateGlEntry(
  options?: UseMutationOptions<GlEntry, Error, { id: string; data: Partial<GlEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GlEntry> }) =>
      apiPut<GlEntry>(`/gl-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.glEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.glEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a GL Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteGlEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/gl-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.glEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
