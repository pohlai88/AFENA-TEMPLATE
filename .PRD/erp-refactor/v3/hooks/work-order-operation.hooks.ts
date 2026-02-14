// TanStack Query hooks for Work Order Operation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WorkOrderOperation } from '../types/work-order-operation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WorkOrderOperationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Work Order Operation records.
 */
export function useWorkOrderOperationList(
  params: WorkOrderOperationListParams = {},
  options?: Omit<UseQueryOptions<WorkOrderOperation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.workOrderOperation.list(params),
    queryFn: () => apiGet<WorkOrderOperation[]>(`/work-order-operation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Work Order Operation by ID.
 */
export function useWorkOrderOperation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WorkOrderOperation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.workOrderOperation.detail(id ?? ''),
    queryFn: () => apiGet<WorkOrderOperation | null>(`/work-order-operation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Work Order Operation.
 * Automatically invalidates list queries on success.
 */
export function useCreateWorkOrderOperation(
  options?: UseMutationOptions<WorkOrderOperation, Error, Partial<WorkOrderOperation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkOrderOperation>) => apiPost<WorkOrderOperation>('/work-order-operation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrderOperation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Work Order Operation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWorkOrderOperation(
  options?: UseMutationOptions<WorkOrderOperation, Error, { id: string; data: Partial<WorkOrderOperation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkOrderOperation> }) =>
      apiPut<WorkOrderOperation>(`/work-order-operation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrderOperation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrderOperation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Work Order Operation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWorkOrderOperation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/work-order-operation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workOrderOperation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
