// TanStack Query hooks for UOM
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Uom } from '../types/uom.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface UomListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of UOM records.
 */
export function useUomList(
  params: UomListParams = {},
  options?: Omit<UseQueryOptions<Uom[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.uom.list(params),
    queryFn: () => apiGet<Uom[]>(`/uom${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single UOM by ID.
 */
export function useUom(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Uom | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.uom.detail(id ?? ''),
    queryFn: () => apiGet<Uom | null>(`/uom/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new UOM.
 * Automatically invalidates list queries on success.
 */
export function useCreateUom(
  options?: UseMutationOptions<Uom, Error, Partial<Uom>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Uom>) => apiPost<Uom>('/uom', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uom.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing UOM.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateUom(
  options?: UseMutationOptions<Uom, Error, { id: string; data: Partial<Uom> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Uom> }) =>
      apiPut<Uom>(`/uom/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uom.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.uom.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a UOM by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteUom(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/uom/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.uom.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
