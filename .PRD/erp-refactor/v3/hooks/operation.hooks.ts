// TanStack Query hooks for Operation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Operation } from '../types/operation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface OperationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Operation records.
 */
export function useOperationList(
  params: OperationListParams = {},
  options?: Omit<UseQueryOptions<Operation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.operation.list(params),
    queryFn: () => apiGet<Operation[]>(`/operation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Operation by ID.
 */
export function useOperation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Operation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.operation.detail(id ?? ''),
    queryFn: () => apiGet<Operation | null>(`/operation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Operation.
 * Automatically invalidates list queries on success.
 */
export function useCreateOperation(
  options?: UseMutationOptions<Operation, Error, Partial<Operation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Operation>) => apiPost<Operation>('/operation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.operation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Operation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateOperation(
  options?: UseMutationOptions<Operation, Error, { id: string; data: Partial<Operation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Operation> }) =>
      apiPut<Operation>(`/operation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.operation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.operation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Operation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteOperation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/operation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.operation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
