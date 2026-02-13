// TanStack Query hooks for BOM Update Tool
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomUpdateTool } from '../types/bom-update-tool.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomUpdateToolListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Update Tool records.
 */
export function useBomUpdateToolList(
  params: BomUpdateToolListParams = {},
  options?: Omit<UseQueryOptions<BomUpdateTool[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomUpdateTool.list(params),
    queryFn: () => apiGet<BomUpdateTool[]>(`/bom-update-tool${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Update Tool by ID.
 */
export function useBomUpdateTool(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomUpdateTool | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomUpdateTool.detail(id ?? ''),
    queryFn: () => apiGet<BomUpdateTool | null>(`/bom-update-tool/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Update Tool.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomUpdateTool(
  options?: UseMutationOptions<BomUpdateTool, Error, Partial<BomUpdateTool>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomUpdateTool>) => apiPost<BomUpdateTool>('/bom-update-tool', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateTool.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Update Tool.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomUpdateTool(
  options?: UseMutationOptions<BomUpdateTool, Error, { id: string; data: Partial<BomUpdateTool> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomUpdateTool> }) =>
      apiPut<BomUpdateTool>(`/bom-update-tool/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateTool.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateTool.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Update Tool by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomUpdateTool(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-update-tool/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomUpdateTool.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
