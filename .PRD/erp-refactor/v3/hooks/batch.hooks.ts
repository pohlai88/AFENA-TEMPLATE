// TanStack Query hooks for Batch
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Batch } from '../types/batch.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BatchListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Batch records.
 */
export function useBatchList(
  params: BatchListParams = {},
  options?: Omit<UseQueryOptions<Batch[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.batch.list(params),
    queryFn: () => apiGet<Batch[]>(`/batch${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Batch by ID.
 */
export function useBatch(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Batch | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.batch.detail(id ?? ''),
    queryFn: () => apiGet<Batch | null>(`/batch/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Batch.
 * Automatically invalidates list queries on success.
 */
export function useCreateBatch(
  options?: UseMutationOptions<Batch, Error, Partial<Batch>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Batch>) => apiPost<Batch>('/batch', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batch.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Batch.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBatch(
  options?: UseMutationOptions<Batch, Error, { id: string; data: Partial<Batch> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Batch> }) =>
      apiPut<Batch>(`/batch/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batch.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.batch.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Batch by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBatch(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/batch/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.batch.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
