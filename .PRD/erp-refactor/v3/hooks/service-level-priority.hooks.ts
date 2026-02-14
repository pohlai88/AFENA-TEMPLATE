// TanStack Query hooks for Service Level Priority
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ServiceLevelPriority } from '../types/service-level-priority.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ServiceLevelPriorityListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Service Level Priority records.
 */
export function useServiceLevelPriorityList(
  params: ServiceLevelPriorityListParams = {},
  options?: Omit<UseQueryOptions<ServiceLevelPriority[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.serviceLevelPriority.list(params),
    queryFn: () => apiGet<ServiceLevelPriority[]>(`/service-level-priority${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Service Level Priority by ID.
 */
export function useServiceLevelPriority(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ServiceLevelPriority | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.serviceLevelPriority.detail(id ?? ''),
    queryFn: () => apiGet<ServiceLevelPriority | null>(`/service-level-priority/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Service Level Priority.
 * Automatically invalidates list queries on success.
 */
export function useCreateServiceLevelPriority(
  options?: UseMutationOptions<ServiceLevelPriority, Error, Partial<ServiceLevelPriority>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ServiceLevelPriority>) => apiPost<ServiceLevelPriority>('/service-level-priority', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceLevelPriority.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Service Level Priority.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateServiceLevelPriority(
  options?: UseMutationOptions<ServiceLevelPriority, Error, { id: string; data: Partial<ServiceLevelPriority> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceLevelPriority> }) =>
      apiPut<ServiceLevelPriority>(`/service-level-priority/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceLevelPriority.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceLevelPriority.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Service Level Priority by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteServiceLevelPriority(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/service-level-priority/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceLevelPriority.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
