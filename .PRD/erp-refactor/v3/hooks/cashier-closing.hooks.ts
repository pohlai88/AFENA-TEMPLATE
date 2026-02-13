// TanStack Query hooks for Cashier Closing
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CashierClosing } from '../types/cashier-closing.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CashierClosingListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Cashier Closing records.
 */
export function useCashierClosingList(
  params: CashierClosingListParams = {},
  options?: Omit<UseQueryOptions<CashierClosing[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.cashierClosing.list(params),
    queryFn: () => apiGet<CashierClosing[]>(`/cashier-closing${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Cashier Closing by ID.
 */
export function useCashierClosing(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CashierClosing | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.cashierClosing.detail(id ?? ''),
    queryFn: () => apiGet<CashierClosing | null>(`/cashier-closing/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Cashier Closing.
 * Automatically invalidates list queries on success.
 */
export function useCreateCashierClosing(
  options?: UseMutationOptions<CashierClosing, Error, Partial<CashierClosing>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CashierClosing>) => apiPost<CashierClosing>('/cashier-closing', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosing.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Cashier Closing.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCashierClosing(
  options?: UseMutationOptions<CashierClosing, Error, { id: string; data: Partial<CashierClosing> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CashierClosing> }) =>
      apiPut<CashierClosing>(`/cashier-closing/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosing.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosing.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Cashier Closing by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCashierClosing(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/cashier-closing/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosing.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Cashier Closing (set docstatus = 1).
 */
export function useSubmitCashierClosing(
  options?: UseMutationOptions<CashierClosing, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<CashierClosing>(`/cashier-closing/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosing.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosing.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Cashier Closing (set docstatus = 2).
 */
export function useCancelCashierClosing(
  options?: UseMutationOptions<CashierClosing, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<CashierClosing>(`/cashier-closing/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosing.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.cashierClosing.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
