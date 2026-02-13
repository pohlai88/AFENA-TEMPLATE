// TanStack Query hooks for Availability Of Slots
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AvailabilityOfSlots } from '../types/availability-of-slots.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AvailabilityOfSlotsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Availability Of Slots records.
 */
export function useAvailabilityOfSlotsList(
  params: AvailabilityOfSlotsListParams = {},
  options?: Omit<UseQueryOptions<AvailabilityOfSlots[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.availabilityOfSlots.list(params),
    queryFn: () => apiGet<AvailabilityOfSlots[]>(`/availability-of-slots${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Availability Of Slots by ID.
 */
export function useAvailabilityOfSlots(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AvailabilityOfSlots | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.availabilityOfSlots.detail(id ?? ''),
    queryFn: () => apiGet<AvailabilityOfSlots | null>(`/availability-of-slots/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Availability Of Slots.
 * Automatically invalidates list queries on success.
 */
export function useCreateAvailabilityOfSlots(
  options?: UseMutationOptions<AvailabilityOfSlots, Error, Partial<AvailabilityOfSlots>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AvailabilityOfSlots>) => apiPost<AvailabilityOfSlots>('/availability-of-slots', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availabilityOfSlots.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Availability Of Slots.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAvailabilityOfSlots(
  options?: UseMutationOptions<AvailabilityOfSlots, Error, { id: string; data: Partial<AvailabilityOfSlots> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AvailabilityOfSlots> }) =>
      apiPut<AvailabilityOfSlots>(`/availability-of-slots/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availabilityOfSlots.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.availabilityOfSlots.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Availability Of Slots by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAvailabilityOfSlots(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/availability-of-slots/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.availabilityOfSlots.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
