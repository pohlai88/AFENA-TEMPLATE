// TanStack Query hooks for Overdue Payment
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { OverduePayment } from '../types/overdue-payment.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface OverduePaymentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Overdue Payment records.
 */
export function useOverduePaymentList(
  params: OverduePaymentListParams = {},
  options?: Omit<UseQueryOptions<OverduePayment[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.overduePayment.list(params),
    queryFn: () => apiGet<OverduePayment[]>(`/overdue-payment${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Overdue Payment by ID.
 */
export function useOverduePayment(
  id: string | undefined,
  options?: Omit<UseQueryOptions<OverduePayment | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.overduePayment.detail(id ?? ''),
    queryFn: () => apiGet<OverduePayment | null>(`/overdue-payment/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Overdue Payment.
 * Automatically invalidates list queries on success.
 */
export function useCreateOverduePayment(
  options?: UseMutationOptions<OverduePayment, Error, Partial<OverduePayment>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<OverduePayment>) => apiPost<OverduePayment>('/overdue-payment', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.overduePayment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Overdue Payment.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateOverduePayment(
  options?: UseMutationOptions<OverduePayment, Error, { id: string; data: Partial<OverduePayment> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<OverduePayment> }) =>
      apiPut<OverduePayment>(`/overdue-payment/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.overduePayment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.overduePayment.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Overdue Payment by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteOverduePayment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/overdue-payment/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.overduePayment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
