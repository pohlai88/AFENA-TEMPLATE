// TanStack Query hooks for Unreconcile Payment
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { UnreconcilePayment } from '../types/unreconcile-payment.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface UnreconcilePaymentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Unreconcile Payment records.
 */
export function useUnreconcilePaymentList(
  params: UnreconcilePaymentListParams = {},
  options?: Omit<UseQueryOptions<UnreconcilePayment[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.unreconcilePayment.list(params),
    queryFn: () => apiGet<UnreconcilePayment[]>(`/unreconcile-payment${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Unreconcile Payment by ID.
 */
export function useUnreconcilePayment(
  id: string | undefined,
  options?: Omit<UseQueryOptions<UnreconcilePayment | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.unreconcilePayment.detail(id ?? ''),
    queryFn: () => apiGet<UnreconcilePayment | null>(`/unreconcile-payment/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Unreconcile Payment.
 * Automatically invalidates list queries on success.
 */
export function useCreateUnreconcilePayment(
  options?: UseMutationOptions<UnreconcilePayment, Error, Partial<UnreconcilePayment>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UnreconcilePayment>) => apiPost<UnreconcilePayment>('/unreconcile-payment', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePayment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Unreconcile Payment.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateUnreconcilePayment(
  options?: UseMutationOptions<UnreconcilePayment, Error, { id: string; data: Partial<UnreconcilePayment> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UnreconcilePayment> }) =>
      apiPut<UnreconcilePayment>(`/unreconcile-payment/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePayment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePayment.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Unreconcile Payment by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteUnreconcilePayment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/unreconcile-payment/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePayment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Unreconcile Payment (set docstatus = 1).
 */
export function useSubmitUnreconcilePayment(
  options?: UseMutationOptions<UnreconcilePayment, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<UnreconcilePayment>(`/unreconcile-payment/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePayment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePayment.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Unreconcile Payment (set docstatus = 2).
 */
export function useCancelUnreconcilePayment(
  options?: UseMutationOptions<UnreconcilePayment, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<UnreconcilePayment>(`/unreconcile-payment/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePayment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePayment.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
