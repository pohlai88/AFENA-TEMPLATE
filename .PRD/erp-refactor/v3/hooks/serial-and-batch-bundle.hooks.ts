// TanStack Query hooks for Serial and Batch Bundle
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SerialAndBatchBundle } from '../types/serial-and-batch-bundle.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SerialAndBatchBundleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Serial and Batch Bundle records.
 */
export function useSerialAndBatchBundleList(
  params: SerialAndBatchBundleListParams = {},
  options?: Omit<UseQueryOptions<SerialAndBatchBundle[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.serialAndBatchBundle.list(params),
    queryFn: () => apiGet<SerialAndBatchBundle[]>(`/serial-and-batch-bundle${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Serial and Batch Bundle by ID.
 */
export function useSerialAndBatchBundle(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SerialAndBatchBundle | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.serialAndBatchBundle.detail(id ?? ''),
    queryFn: () => apiGet<SerialAndBatchBundle | null>(`/serial-and-batch-bundle/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Serial and Batch Bundle.
 * Automatically invalidates list queries on success.
 */
export function useCreateSerialAndBatchBundle(
  options?: UseMutationOptions<SerialAndBatchBundle, Error, Partial<SerialAndBatchBundle>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SerialAndBatchBundle>) => apiPost<SerialAndBatchBundle>('/serial-and-batch-bundle', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchBundle.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Serial and Batch Bundle.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSerialAndBatchBundle(
  options?: UseMutationOptions<SerialAndBatchBundle, Error, { id: string; data: Partial<SerialAndBatchBundle> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SerialAndBatchBundle> }) =>
      apiPut<SerialAndBatchBundle>(`/serial-and-batch-bundle/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchBundle.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchBundle.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Serial and Batch Bundle by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSerialAndBatchBundle(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/serial-and-batch-bundle/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchBundle.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Serial and Batch Bundle (set docstatus = 1).
 */
export function useSubmitSerialAndBatchBundle(
  options?: UseMutationOptions<SerialAndBatchBundle, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SerialAndBatchBundle>(`/serial-and-batch-bundle/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchBundle.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchBundle.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Serial and Batch Bundle (set docstatus = 2).
 */
export function useCancelSerialAndBatchBundle(
  options?: UseMutationOptions<SerialAndBatchBundle, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SerialAndBatchBundle>(`/serial-and-batch-bundle/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchBundle.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serialAndBatchBundle.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
