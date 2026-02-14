// TanStack Query hooks for Payment Terms Template Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PaymentTermsTemplateDetail } from '../types/payment-terms-template-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PaymentTermsTemplateDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Payment Terms Template Detail records.
 */
export function usePaymentTermsTemplateDetailList(
  params: PaymentTermsTemplateDetailListParams = {},
  options?: Omit<UseQueryOptions<PaymentTermsTemplateDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.paymentTermsTemplateDetail.list(params),
    queryFn: () => apiGet<PaymentTermsTemplateDetail[]>(`/payment-terms-template-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Payment Terms Template Detail by ID.
 */
export function usePaymentTermsTemplateDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PaymentTermsTemplateDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.paymentTermsTemplateDetail.detail(id ?? ''),
    queryFn: () => apiGet<PaymentTermsTemplateDetail | null>(`/payment-terms-template-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Payment Terms Template Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreatePaymentTermsTemplateDetail(
  options?: UseMutationOptions<PaymentTermsTemplateDetail, Error, Partial<PaymentTermsTemplateDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PaymentTermsTemplateDetail>) => apiPost<PaymentTermsTemplateDetail>('/payment-terms-template-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTermsTemplateDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Payment Terms Template Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePaymentTermsTemplateDetail(
  options?: UseMutationOptions<PaymentTermsTemplateDetail, Error, { id: string; data: Partial<PaymentTermsTemplateDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentTermsTemplateDetail> }) =>
      apiPut<PaymentTermsTemplateDetail>(`/payment-terms-template-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTermsTemplateDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTermsTemplateDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Payment Terms Template Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePaymentTermsTemplateDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/payment-terms-template-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.paymentTermsTemplateDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
