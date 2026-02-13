// TanStack Query hooks for Material Request
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { MaterialRequest } from '../types/material-request.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface MaterialRequestListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Material Request records.
 */
export function useMaterialRequestList(
  params: MaterialRequestListParams = {},
  options?: Omit<UseQueryOptions<MaterialRequest[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.materialRequest.list(params),
    queryFn: () => apiGet<MaterialRequest[]>(`/material-request${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Material Request by ID.
 */
export function useMaterialRequest(
  id: string | undefined,
  options?: Omit<UseQueryOptions<MaterialRequest | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.materialRequest.detail(id ?? ''),
    queryFn: () => apiGet<MaterialRequest | null>(`/material-request/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Material Request.
 * Automatically invalidates list queries on success.
 */
export function useCreateMaterialRequest(
  options?: UseMutationOptions<MaterialRequest, Error, Partial<MaterialRequest>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<MaterialRequest>) => apiPost<MaterialRequest>('/material-request', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequest.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Material Request.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateMaterialRequest(
  options?: UseMutationOptions<MaterialRequest, Error, { id: string; data: Partial<MaterialRequest> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MaterialRequest> }) =>
      apiPut<MaterialRequest>(`/material-request/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequest.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequest.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Material Request by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteMaterialRequest(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/material-request/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequest.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Material Request (set docstatus = 1).
 */
export function useSubmitMaterialRequest(
  options?: UseMutationOptions<MaterialRequest, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<MaterialRequest>(`/material-request/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequest.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequest.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Material Request (set docstatus = 2).
 */
export function useCancelMaterialRequest(
  options?: UseMutationOptions<MaterialRequest, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<MaterialRequest>(`/material-request/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequest.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.materialRequest.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
