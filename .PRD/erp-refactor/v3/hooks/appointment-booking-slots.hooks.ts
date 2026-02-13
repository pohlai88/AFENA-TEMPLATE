// TanStack Query hooks for Appointment Booking Slots
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AppointmentBookingSlots } from '../types/appointment-booking-slots.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AppointmentBookingSlotsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Appointment Booking Slots records.
 */
export function useAppointmentBookingSlotsList(
  params: AppointmentBookingSlotsListParams = {},
  options?: Omit<UseQueryOptions<AppointmentBookingSlots[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.appointmentBookingSlots.list(params),
    queryFn: () => apiGet<AppointmentBookingSlots[]>(`/appointment-booking-slots${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Appointment Booking Slots by ID.
 */
export function useAppointmentBookingSlots(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AppointmentBookingSlots | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.appointmentBookingSlots.detail(id ?? ''),
    queryFn: () => apiGet<AppointmentBookingSlots | null>(`/appointment-booking-slots/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Appointment Booking Slots.
 * Automatically invalidates list queries on success.
 */
export function useCreateAppointmentBookingSlots(
  options?: UseMutationOptions<AppointmentBookingSlots, Error, Partial<AppointmentBookingSlots>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AppointmentBookingSlots>) => apiPost<AppointmentBookingSlots>('/appointment-booking-slots', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentBookingSlots.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Appointment Booking Slots.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAppointmentBookingSlots(
  options?: UseMutationOptions<AppointmentBookingSlots, Error, { id: string; data: Partial<AppointmentBookingSlots> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AppointmentBookingSlots> }) =>
      apiPut<AppointmentBookingSlots>(`/appointment-booking-slots/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentBookingSlots.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentBookingSlots.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Appointment Booking Slots by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAppointmentBookingSlots(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/appointment-booking-slots/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentBookingSlots.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
