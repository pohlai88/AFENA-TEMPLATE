// TanStack Query hooks for Mode of Payment
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ModeOfPayment } from '../types/mode-of-payment.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ModeOfPaymentListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Mode of Payment records.
 */
export function useModeOfPaymentList(
  params: ModeOfPaymentListParams = {},
  options?: Omit<UseQueryOptions<ModeOfPayment[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.modeOfPayment.list(params),
    queryFn: () => apiGet<ModeOfPayment[]>(`/mode-of-payment${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Mode of Payment by ID.
 */
export function useModeOfPayment(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ModeOfPayment | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.modeOfPayment.detail(id ?? ''),
    queryFn: () => apiGet<ModeOfPayment | null>(`/mode-of-payment/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Mode of Payment.
 * Automatically invalidates list queries on success.
 */
export function useCreateModeOfPayment(
  options?: UseMutationOptions<ModeOfPayment, Error, Partial<ModeOfPayment>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ModeOfPayment>) => apiPost<ModeOfPayment>('/mode-of-payment', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modeOfPayment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Mode of Payment.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateModeOfPayment(
  options?: UseMutationOptions<ModeOfPayment, Error, { id: string; data: Partial<ModeOfPayment> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ModeOfPayment> }) =>
      apiPut<ModeOfPayment>(`/mode-of-payment/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modeOfPayment.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.modeOfPayment.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Mode of Payment by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteModeOfPayment(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/mode-of-payment/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.modeOfPayment.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
