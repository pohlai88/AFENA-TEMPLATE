// TanStack Query hooks for Appointment Booking Settings
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AppointmentBookingSettings } from '../types/appointment-booking-settings.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AppointmentBookingSettingsListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Appointment Booking Settings records.
 */
export function useAppointmentBookingSettingsList(
  params: AppointmentBookingSettingsListParams = {},
  options?: Omit<UseQueryOptions<AppointmentBookingSettings[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.appointmentBookingSettings.list(params),
    queryFn: () => apiGet<AppointmentBookingSettings[]>(`/appointment-booking-settings${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Appointment Booking Settings by ID.
 */
export function useAppointmentBookingSettings(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AppointmentBookingSettings | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.appointmentBookingSettings.detail(id ?? ''),
    queryFn: () => apiGet<AppointmentBookingSettings | null>(`/appointment-booking-settings/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Appointment Booking Settings.
 * Automatically invalidates list queries on success.
 */
export function useCreateAppointmentBookingSettings(
  options?: UseMutationOptions<AppointmentBookingSettings, Error, Partial<AppointmentBookingSettings>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AppointmentBookingSettings>) => apiPost<AppointmentBookingSettings>('/appointment-booking-settings', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentBookingSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Appointment Booking Settings.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAppointmentBookingSettings(
  options?: UseMutationOptions<AppointmentBookingSettings, Error, { id: string; data: Partial<AppointmentBookingSettings> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AppointmentBookingSettings> }) =>
      apiPut<AppointmentBookingSettings>(`/appointment-booking-settings/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentBookingSettings.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentBookingSettings.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Appointment Booking Settings by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAppointmentBookingSettings(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/appointment-booking-settings/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointmentBookingSettings.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
