// TanStack Query hooks for BOM Creator
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomCreator } from '../types/bom-creator.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomCreatorListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Creator records.
 */
export function useBomCreatorList(
  params: BomCreatorListParams = {},
  options?: Omit<UseQueryOptions<BomCreator[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomCreator.list(params),
    queryFn: () => apiGet<BomCreator[]>(`/bom-creator${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Creator by ID.
 */
export function useBomCreator(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomCreator | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomCreator.detail(id ?? ''),
    queryFn: () => apiGet<BomCreator | null>(`/bom-creator/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Creator.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomCreator(
  options?: UseMutationOptions<BomCreator, Error, Partial<BomCreator>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomCreator>) => apiPost<BomCreator>('/bom-creator', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreator.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Creator.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomCreator(
  options?: UseMutationOptions<BomCreator, Error, { id: string; data: Partial<BomCreator> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomCreator> }) =>
      apiPut<BomCreator>(`/bom-creator/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreator.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreator.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Creator by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomCreator(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-creator/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreator.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a BOM Creator (set docstatus = 1).
 */
export function useSubmitBomCreator(
  options?: UseMutationOptions<BomCreator, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<BomCreator>(`/bom-creator/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreator.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreator.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a BOM Creator (set docstatus = 2).
 */
export function useCancelBomCreator(
  options?: UseMutationOptions<BomCreator, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<BomCreator>(`/bom-creator/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreator.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomCreator.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
