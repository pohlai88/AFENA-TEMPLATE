// TanStack Query hooks for BOM
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Bom } from '../types/bom.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM records.
 */
export function useBomList(
  params: BomListParams = {},
  options?: Omit<UseQueryOptions<Bom[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bom.list(params),
    queryFn: () => apiGet<Bom[]>(`/bom${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM by ID.
 */
export function useBom(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Bom | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bom.detail(id ?? ''),
    queryFn: () => apiGet<Bom | null>(`/bom/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM.
 * Automatically invalidates list queries on success.
 */
export function useCreateBom(
  options?: UseMutationOptions<Bom, Error, Partial<Bom>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Bom>) => apiPost<Bom>('/bom', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bom.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBom(
  options?: UseMutationOptions<Bom, Error, { id: string; data: Partial<Bom> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bom> }) =>
      apiPut<Bom>(`/bom/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bom.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bom.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBom(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bom.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a BOM (set docstatus = 1).
 */
export function useSubmitBom(
  options?: UseMutationOptions<Bom, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Bom>(`/bom/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bom.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bom.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a BOM (set docstatus = 2).
 */
export function useCancelBom(
  options?: UseMutationOptions<Bom, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Bom>(`/bom/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bom.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bom.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
