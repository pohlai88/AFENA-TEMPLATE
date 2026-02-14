// TanStack Query hooks for SLA Fulfilled On Status
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SlaFulfilledOnStatus } from '../types/sla-fulfilled-on-status.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SlaFulfilledOnStatusListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of SLA Fulfilled On Status records.
 */
export function useSlaFulfilledOnStatusList(
  params: SlaFulfilledOnStatusListParams = {},
  options?: Omit<UseQueryOptions<SlaFulfilledOnStatus[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.slaFulfilledOnStatus.list(params),
    queryFn: () => apiGet<SlaFulfilledOnStatus[]>(`/sla-fulfilled-on-status${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single SLA Fulfilled On Status by ID.
 */
export function useSlaFulfilledOnStatus(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SlaFulfilledOnStatus | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.slaFulfilledOnStatus.detail(id ?? ''),
    queryFn: () => apiGet<SlaFulfilledOnStatus | null>(`/sla-fulfilled-on-status/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new SLA Fulfilled On Status.
 * Automatically invalidates list queries on success.
 */
export function useCreateSlaFulfilledOnStatus(
  options?: UseMutationOptions<SlaFulfilledOnStatus, Error, Partial<SlaFulfilledOnStatus>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SlaFulfilledOnStatus>) => apiPost<SlaFulfilledOnStatus>('/sla-fulfilled-on-status', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.slaFulfilledOnStatus.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing SLA Fulfilled On Status.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSlaFulfilledOnStatus(
  options?: UseMutationOptions<SlaFulfilledOnStatus, Error, { id: string; data: Partial<SlaFulfilledOnStatus> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SlaFulfilledOnStatus> }) =>
      apiPut<SlaFulfilledOnStatus>(`/sla-fulfilled-on-status/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.slaFulfilledOnStatus.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.slaFulfilledOnStatus.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a SLA Fulfilled On Status by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSlaFulfilledOnStatus(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sla-fulfilled-on-status/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.slaFulfilledOnStatus.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
