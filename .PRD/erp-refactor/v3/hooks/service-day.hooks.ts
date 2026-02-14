// TanStack Query hooks for Service Day
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ServiceDay } from '../types/service-day.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ServiceDayListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Service Day records.
 */
export function useServiceDayList(
  params: ServiceDayListParams = {},
  options?: Omit<UseQueryOptions<ServiceDay[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.serviceDay.list(params),
    queryFn: () => apiGet<ServiceDay[]>(`/service-day${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Service Day by ID.
 */
export function useServiceDay(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ServiceDay | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.serviceDay.detail(id ?? ''),
    queryFn: () => apiGet<ServiceDay | null>(`/service-day/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Service Day.
 * Automatically invalidates list queries on success.
 */
export function useCreateServiceDay(
  options?: UseMutationOptions<ServiceDay, Error, Partial<ServiceDay>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ServiceDay>) => apiPost<ServiceDay>('/service-day', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceDay.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Service Day.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateServiceDay(
  options?: UseMutationOptions<ServiceDay, Error, { id: string; data: Partial<ServiceDay> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceDay> }) =>
      apiPut<ServiceDay>(`/service-day/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceDay.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceDay.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Service Day by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteServiceDay(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/service-day/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.serviceDay.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
