// TanStack Query hooks for Serial and Batch Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SerialAndBatchEntry } from '../types/serial-and-batch-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SerialAndBatchEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Serial and Batch Entry records.
 */
export function useSerialAndBatchEntryList(
  params: SerialAndBatchEntryListParams = {},
  options?: Omit<UseQueryOptions<SerialAndBatchEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.serialAndBatchEntry.list(params),
    queryFn: () => apiGet<SerialAndBatchEntry[]>(`/serial-and-batch-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Serial and Batch Entry by ID.
 */
export function useSerialAndBatchEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SerialAndBatchEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.serialAndBatchEntry.detail(id ?? ''),
    queryFn: () => apiGet<SerialAndBatchEntry | null>(`/serial-and-batch-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Serial and Batch Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateSerialAndBatchEntry(
  options?: UseMutationOptions<SerialAndBatchEntry, Error, Partial<SerialAndBatchEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SerialAndBatchEntry>) => apiPost<SerialAndBatchEntry>('/serial-and-batch-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Serial and Batch Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSerialAndBatchEntry(
  options?: UseMutationOptions<SerialAndBatchEntry, Error, { id: string; data: Partial<SerialAndBatchEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SerialAndBatchEntry> }) =>
      apiPut<SerialAndBatchEntry>(`/serial-and-batch-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Serial and Batch Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSerialAndBatchEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/serial-and-batch-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
