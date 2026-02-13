// TanStack Query hooks for BOM Website Operation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomWebsiteOperation } from '../types/bom-website-operation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomWebsiteOperationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Website Operation records.
 */
export function useBomWebsiteOperationList(
  params: BomWebsiteOperationListParams = {},
  options?: Omit<UseQueryOptions<BomWebsiteOperation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomWebsiteOperation.list(params),
    queryFn: () => apiGet<BomWebsiteOperation[]>(`/bom-website-operation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Website Operation by ID.
 */
export function useBomWebsiteOperation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomWebsiteOperation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomWebsiteOperation.detail(id ?? ''),
    queryFn: () => apiGet<BomWebsiteOperation | null>(`/bom-website-operation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Website Operation.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomWebsiteOperation(
  options?: UseMutationOptions<BomWebsiteOperation, Error, Partial<BomWebsiteOperation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomWebsiteOperation>) => apiPost<BomWebsiteOperation>('/bom-website-operation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomWebsiteOperation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Website Operation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomWebsiteOperation(
  options?: UseMutationOptions<BomWebsiteOperation, Error, { id: string; data: Partial<BomWebsiteOperation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomWebsiteOperation> }) =>
      apiPut<BomWebsiteOperation>(`/bom-website-operation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomWebsiteOperation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomWebsiteOperation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Website Operation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomWebsiteOperation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-website-operation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomWebsiteOperation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
