// TanStack Query hooks for Payment Schedule
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentSchedule } from '../types/payment-schedule.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentScheduleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Schedule records.
 */
export function usePaymentScheduleList(
  params: PaymentScheduleListParams = {},
  options?: Omit<UseQueryOptions<PaymentSchedule[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentSchedule.list(params),
    queryFn: () => apiGet<PaymentSchedule[]>(`/payment-schedule${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Schedule by ID.
 */
export function usePaymentSchedule(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentSchedule | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentSchedule.detail(id ?? ''),
    queryFn: () => apiGet<PaymentSchedule | null>(`/payment-schedule/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Schedule.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentSchedule(
  options?: UseMutationOptions<PaymentSchedule, Error, Partial<PaymentSchedule>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentSchedule>) => apiPost<PaymentSchedule>('/payment-schedule', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Schedule.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentSchedule(
  options?: UseMutationOptions<PaymentSchedule, Error, { id: string; data: Partial<PaymentSchedule> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentSchedule> }) =>
      apiPut<PaymentSchedule>(`/payment-schedule/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentSchedule.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentSchedule.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Schedule by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentSchedule(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-schedule/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentSchedule.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
