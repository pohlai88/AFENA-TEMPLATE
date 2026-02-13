// TanStack Query hooks for Subscription Invoice
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubscriptionInvoice } from '../types/subscription-invoice.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubscriptionInvoiceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subscription Invoice records.
 */
export function useSubscriptionInvoiceList(
  params: SubscriptionInvoiceListParams = {},
  options?: Omit<UseQueryOptions<SubscriptionInvoice[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subscriptionInvoice.list(params),
    queryFn: () => apiGet<SubscriptionInvoice[]>(`/subscription-invoice${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subscription Invoice by ID.
 */
export function useSubscriptionInvoice(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubscriptionInvoice | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subscriptionInvoice.detail(id ?? ''),
    queryFn: () => apiGet<SubscriptionInvoice | null>(`/subscription-invoice/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subscription Invoice.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubscriptionInvoice(
  options?: UseMutationOptions<SubscriptionInvoice, Error, Partial<SubscriptionInvoice>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubscriptionInvoice>) => apiPost<SubscriptionInvoice>('/subscription-invoice', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subscription Invoice.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubscriptionInvoice(
  options?: UseMutationOptions<SubscriptionInvoice, Error, { id: string; data: Partial<SubscriptionInvoice> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubscriptionInvoice> }) =>
      apiPut<SubscriptionInvoice>(`/subscription-invoice/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionInvoice.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subscription Invoice by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubscriptionInvoice(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subscription-invoice/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscriptionInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
