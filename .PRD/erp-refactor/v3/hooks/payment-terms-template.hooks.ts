// TanStack Query hooks for Payment Terms Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentTermsTemplate } from '../types/payment-terms-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentTermsTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Terms Template records.
 */
export function usePaymentTermsTemplateList(
  params: PaymentTermsTemplateListParams = {},
  options?: Omit<UseQueryOptions<PaymentTermsTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentTermsTemplate.list(params),
    queryFn: () => apiGet<PaymentTermsTemplate[]>(`/payment-terms-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Terms Template by ID.
 */
export function usePaymentTermsTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentTermsTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentTermsTemplate.detail(id ?? ''),
    queryFn: () => apiGet<PaymentTermsTemplate | null>(`/payment-terms-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Terms Template.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentTermsTemplate(
  options?: UseMutationOptions<PaymentTermsTemplate, Error, Partial<PaymentTermsTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentTermsTemplate>) => apiPost<PaymentTermsTemplate>('/payment-terms-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTermsTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Terms Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentTermsTemplate(
  options?: UseMutationOptions<PaymentTermsTemplate, Error, { id: string; data: Partial<PaymentTermsTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentTermsTemplate> }) =>
      apiPut<PaymentTermsTemplate>(`/payment-terms-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTermsTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTermsTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Terms Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentTermsTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-terms-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTermsTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
