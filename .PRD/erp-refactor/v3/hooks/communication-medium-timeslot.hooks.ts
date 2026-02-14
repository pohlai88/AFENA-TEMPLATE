// TanStack Query hooks for Communication Medium Timeslot
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CommunicationMediumTimeslot } from '../types/communication-medium-timeslot.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CommunicationMediumTimeslotListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Communication Medium Timeslot records.
 */
export function useCommunicationMediumTimeslotList(
  params: CommunicationMediumTimeslotListParams = {},
  options?: Omit<UseQueryOptions<CommunicationMediumTimeslot[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.communicationMediumTimeslot.list(params),
    queryFn: () => apiGet<CommunicationMediumTimeslot[]>(`/communication-medium-timeslot${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Communication Medium Timeslot by ID.
 */
export function useCommunicationMediumTimeslot(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CommunicationMediumTimeslot | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.communicationMediumTimeslot.detail(id ?? ''),
    queryFn: () => apiGet<CommunicationMediumTimeslot | null>(`/communication-medium-timeslot/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Communication Medium Timeslot.
 * Automatically invalidates list queries on success.
 */
export function useCreateCommunicationMediumTimeslot(
  options?: UseMutationOptions<CommunicationMediumTimeslot, Error, Partial<CommunicationMediumTimeslot>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CommunicationMediumTimeslot>) => apiPost<CommunicationMediumTimeslot>('/communication-medium-timeslot', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communicationMediumTimeslot.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Communication Medium Timeslot.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCommunicationMediumTimeslot(
  options?: UseMutationOptions<CommunicationMediumTimeslot, Error, { id: string; data: Partial<CommunicationMediumTimeslot> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CommunicationMediumTimeslot> }) =>
      apiPut<CommunicationMediumTimeslot>(`/communication-medium-timeslot/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communicationMediumTimeslot.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.communicationMediumTimeslot.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Communication Medium Timeslot by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCommunicationMediumTimeslot(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/communication-medium-timeslot/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.communicationMediumTimeslot.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
