// TanStack Query hooks for Unreconcile Payment Entries
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { UnreconcilePaymentEntries } from '../types/unreconcile-payment-entries.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface UnreconcilePaymentEntriesListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Unreconcile Payment Entries records.
 */
export function useUnreconcilePaymentEntriesList(
  params: UnreconcilePaymentEntriesListParams = {},
  options?: Omit<UseQueryOptions<UnreconcilePaymentEntries[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.unreconcilePaymentEntries.list(params),
    queryFn: () => apiGet<UnreconcilePaymentEntries[]>(`/unreconcile-payment-entries${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Unreconcile Payment Entries by ID.
 */
export function useUnreconcilePaymentEntries(
  id: string | undefined,
  options?: Omit<UseQueryOptions<UnreconcilePaymentEntries | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.unreconcilePaymentEntries.detail(id ?? ''),
    queryFn: () => apiGet<UnreconcilePaymentEntries | null>(`/unreconcile-payment-entries/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Unreconcile Payment Entries.
 * Automatically invalidates list queries on success.
 */
export function useCreateUnreconcilePaymentEntries(
  options?: UseMutationOptions<UnreconcilePaymentEntries, Error, Partial<UnreconcilePaymentEntries>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<UnreconcilePaymentEntries>) => apiPost<UnreconcilePaymentEntries>('/unreconcile-payment-entries', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePaymentEntries.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Unreconcile Payment Entries.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateUnreconcilePaymentEntries(
  options?: UseMutationOptions<UnreconcilePaymentEntries, Error, { id: string; data: Partial<UnreconcilePaymentEntries> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UnreconcilePaymentEntries> }) =>
      apiPut<UnreconcilePaymentEntries>(`/unreconcile-payment-entries/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePaymentEntries.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePaymentEntries.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Unreconcile Payment Entries by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteUnreconcilePaymentEntries(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/unreconcile-payment-entries/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.unreconcilePaymentEntries.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
