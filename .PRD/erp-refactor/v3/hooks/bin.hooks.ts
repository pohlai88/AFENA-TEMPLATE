// TanStack Query hooks for Bin
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Bin } from '../types/bin.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BinListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Bin records.
 */
export function useBinList(
  params: BinListParams = {},
  options?: Omit<UseQueryOptions<Bin[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bin.list(params),
    queryFn: () => apiGet<Bin[]>(`/bin${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Bin by ID.
 */
export function useBin(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Bin | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bin.detail(id ?? ''),
    queryFn: () => apiGet<Bin | null>(`/bin/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Bin.
 * Automatically invalidates list queries on success.
 */
export function useCreateBin(
  options?: UseMutationOptions<Bin, Error, Partial<Bin>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Bin>) => apiPost<Bin>('/bin', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bin.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Bin.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBin(
  options?: UseMutationOptions<Bin, Error, { id: string; data: Partial<Bin> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bin> }) =>
      apiPut<Bin>(`/bin/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bin.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bin.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Bin by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBin(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bin/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bin.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
