// TanStack Query hooks for BOM Update Batch
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomUpdateBatch } from '../types/bom-update-batch.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomUpdateBatchListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Update Batch records.
 */
export function useBomUpdateBatchList(
  params: BomUpdateBatchListParams = {},
  options?: Omit<UseQueryOptions<BomUpdateBatch[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomUpdateBatch.list(params),
    queryFn: () => apiGet<BomUpdateBatch[]>(`/bom-update-batch${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Update Batch by ID.
 */
export function useBomUpdateBatch(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomUpdateBatch | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomUpdateBatch.detail(id ?? ''),
    queryFn: () => apiGet<BomUpdateBatch | null>(`/bom-update-batch/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Update Batch.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomUpdateBatch(
  options?: UseMutationOptions<BomUpdateBatch, Error, Partial<BomUpdateBatch>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomUpdateBatch>) => apiPost<BomUpdateBatch>('/bom-update-batch', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateBatch.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Update Batch.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomUpdateBatch(
  options?: UseMutationOptions<BomUpdateBatch, Error, { id: string; data: Partial<BomUpdateBatch> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomUpdateBatch> }) =>
      apiPut<BomUpdateBatch>(`/bom-update-batch/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateBatch.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateBatch.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Update Batch by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomUpdateBatch(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-update-batch/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateBatch.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
