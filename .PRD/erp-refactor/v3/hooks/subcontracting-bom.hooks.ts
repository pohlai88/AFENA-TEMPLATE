// TanStack Query hooks for Subcontracting BOM
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingBom } from '../types/subcontracting-bom.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingBomListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting BOM records.
 */
export function useSubcontractingBomList(
  params: SubcontractingBomListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingBom[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingBom.list(params),
    queryFn: () => apiGet<SubcontractingBom[]>(`/subcontracting-bom${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting BOM by ID.
 */
export function useSubcontractingBom(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingBom | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingBom.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingBom | null>(`/subcontracting-bom/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting BOM.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingBom(
  options?: UseMutationOptions<SubcontractingBom, Error, Partial<SubcontractingBom>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingBom>) => apiPost<SubcontractingBom>('/subcontracting-bom', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingBom.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting BOM.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingBom(
  options?: UseMutationOptions<SubcontractingBom, Error, { id: string; data: Partial<SubcontractingBom> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingBom> }) =>
      apiPut<SubcontractingBom>(`/subcontracting-bom/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingBom.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingBom.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting BOM by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingBom(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-bom/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingBom.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
