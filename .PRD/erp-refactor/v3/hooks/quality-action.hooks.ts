// TanStack Query hooks for Quality Action
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QualityAction } from '../types/quality-action.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QualityActionListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quality Action records.
 */
export function useQualityActionList(
  params: QualityActionListParams = {},
  options?: Omit<UseQueryOptions<QualityAction[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.qualityAction.list(params),
    queryFn: () => apiGet<QualityAction[]>(`/quality-action${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quality Action by ID.
 */
export function useQualityAction(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QualityAction | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.qualityAction.detail(id ?? ''),
    queryFn: () => apiGet<QualityAction | null>(`/quality-action/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quality Action.
 * Automatically invalidates list queries on success.
 */
export function useCreateQualityAction(
  options?: UseMutationOptions<QualityAction, Error, Partial<QualityAction>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QualityAction>) => apiPost<QualityAction>('/quality-action', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityAction.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quality Action.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQualityAction(
  options?: UseMutationOptions<QualityAction, Error, { id: string; data: Partial<QualityAction> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QualityAction> }) =>
      apiPut<QualityAction>(`/quality-action/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityAction.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityAction.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quality Action by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQualityAction(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quality-action/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.qualityAction.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
