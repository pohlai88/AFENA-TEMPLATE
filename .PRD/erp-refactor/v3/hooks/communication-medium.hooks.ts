// TanStack Query hooks for Communication Medium
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CommunicationMedium } from '../types/communication-medium.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CommunicationMediumListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Communication Medium records.
 */
export function useCommunicationMediumList(
  params: CommunicationMediumListParams = {},
  options?: Omit<UseQueryOptions<CommunicationMedium[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.communicationMedium.list(params),
    queryFn: () => apiGet<CommunicationMedium[]>(`/communication-medium${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Communication Medium by ID.
 */
export function useCommunicationMedium(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CommunicationMedium | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.communicationMedium.detail(id ?? ''),
    queryFn: () => apiGet<CommunicationMedium | null>(`/communication-medium/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Communication Medium.
 * Automatically invalidates list queries on success.
 */
export function useCreateCommunicationMedium(
  options?: UseMutationOptions<CommunicationMedium, Error, Partial<CommunicationMedium>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CommunicationMedium>) => apiPost<CommunicationMedium>('/communication-medium', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communicationMedium.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Communication Medium.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCommunicationMedium(
  options?: UseMutationOptions<CommunicationMedium, Error, { id: string; data: Partial<CommunicationMedium> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CommunicationMedium> }) =>
      apiPut<CommunicationMedium>(`/communication-medium/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communicationMedium.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.communicationMedium.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Communication Medium by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCommunicationMedium(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/communication-medium/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communicationMedium.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
