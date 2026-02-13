// TanStack Query hooks for Appointment
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Appointment } from '../types/appointment.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AppointmentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Appointment records.
 */
export function useAppointmentList(
  params: AppointmentListParams = {},
  options?: Omit<UseQueryOptions<Appointment[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.appointment.list(params),
    queryFn: () => apiGet<Appointment[]>(`/appointment${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Appointment by ID.
 */
export function useAppointment(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Appointment | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.appointment.detail(id ?? ''),
    queryFn: () => apiGet<Appointment | null>(`/appointment/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Appointment.
 * Automatically invalidates list queries on success.
 */
export function useCreateAppointment(
  options?: UseMutationOptions<Appointment, Error, Partial<Appointment>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Appointment>) => apiPost<Appointment>('/appointment', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Appointment.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAppointment(
  options?: UseMutationOptions<Appointment, Error, { id: string; data: Partial<Appointment> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) =>
      apiPut<Appointment>(`/appointment/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Appointment by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAppointment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/appointment/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
