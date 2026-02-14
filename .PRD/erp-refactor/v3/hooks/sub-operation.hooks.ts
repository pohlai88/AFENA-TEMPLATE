// TanStack Query hooks for Sub Operation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubOperation } from '../types/sub-operation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubOperationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Sub Operation records.
 */
export function useSubOperationList(
  params: SubOperationListParams = {},
  options?: Omit<UseQueryOptions<SubOperation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subOperation.list(params),
    queryFn: () => apiGet<SubOperation[]>(`/sub-operation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Sub Operation by ID.
 */
export function useSubOperation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubOperation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subOperation.detail(id ?? ''),
    queryFn: () => apiGet<SubOperation | null>(`/sub-operation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Sub Operation.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubOperation(
  options?: UseMutationOptions<SubOperation, Error, Partial<SubOperation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubOperation>) => apiPost<SubOperation>('/sub-operation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subOperation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Sub Operation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubOperation(
  options?: UseMutationOptions<SubOperation, Error, { id: string; data: Partial<SubOperation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubOperation> }) =>
      apiPut<SubOperation>(`/sub-operation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subOperation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subOperation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Sub Operation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubOperation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sub-operation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subOperation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
