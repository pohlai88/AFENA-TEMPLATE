// TanStack Query hooks for POS Payment Method
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosPaymentMethod } from '../types/pos-payment-method.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosPaymentMethodListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Payment Method records.
 */
export function usePosPaymentMethodList(
  params: PosPaymentMethodListParams = {},
  options?: Omit<UseQueryOptions<PosPaymentMethod[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posPaymentMethod.list(params),
    queryFn: () => apiGet<PosPaymentMethod[]>(`/pos-payment-method${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Payment Method by ID.
 */
export function usePosPaymentMethod(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosPaymentMethod | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posPaymentMethod.detail(id ?? ''),
    queryFn: () => apiGet<PosPaymentMethod | null>(`/pos-payment-method/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Payment Method.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosPaymentMethod(
  options?: UseMutationOptions<PosPaymentMethod, Error, Partial<PosPaymentMethod>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosPaymentMethod>) => apiPost<PosPaymentMethod>('/pos-payment-method', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posPaymentMethod.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Payment Method.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosPaymentMethod(
  options?: UseMutationOptions<PosPaymentMethod, Error, { id: string; data: Partial<PosPaymentMethod> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosPaymentMethod> }) =>
      apiPut<PosPaymentMethod>(`/pos-payment-method/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posPaymentMethod.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posPaymentMethod.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Payment Method by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosPaymentMethod(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-payment-method/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posPaymentMethod.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
