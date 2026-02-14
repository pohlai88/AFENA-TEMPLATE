// TanStack Query hooks for BOM Operation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { BomOperation } from '../types/bom-operation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface BomOperationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of BOM Operation records.
 */
export function useBomOperationList(
  params: BomOperationListParams = {},
  options?: Omit<UseQueryOptions<BomOperation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.bomOperation.list(params),
    queryFn: () => apiGet<BomOperation[]>(`/bom-operation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single BOM Operation by ID.
 */
export function useBomOperation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<BomOperation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.bomOperation.detail(id ?? ''),
    queryFn: () => apiGet<BomOperation | null>(`/bom-operation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new BOM Operation.
 * Automatically invalidates list queries on success.
 */
export function useCreateBomOperation(
  options?: UseMutationOptions<BomOperation, Error, Partial<BomOperation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<BomOperation>) => apiPost<BomOperation>('/bom-operation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomOperation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing BOM Operation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateBomOperation(
  options?: UseMutationOptions<BomOperation, Error, { id: string; data: Partial<BomOperation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BomOperation> }) =>
      apiPut<BomOperation>(`/bom-operation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomOperation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.bomOperation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a BOM Operation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteBomOperation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/bom-operation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bomOperation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
