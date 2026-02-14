// TanStack Query hooks for Quotation Lost Reason Detail
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QuotationLostReasonDetail } from '../types/quotation-lost-reason-detail.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QuotationLostReasonDetailListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quotation Lost Reason Detail records.
 */
export function useQuotationLostReasonDetailList(
  params: QuotationLostReasonDetailListParams = {},
  options?: Omit<UseQueryOptions<QuotationLostReasonDetail[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.quotationLostReasonDetail.list(params),
    queryFn: () => apiGet<QuotationLostReasonDetail[]>(`/quotation-lost-reason-detail${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quotation Lost Reason Detail by ID.
 */
export function useQuotationLostReasonDetail(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QuotationLostReasonDetail | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.quotationLostReasonDetail.detail(id ?? ''),
    queryFn: () => apiGet<QuotationLostReasonDetail | null>(`/quotation-lost-reason-detail/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quotation Lost Reason Detail.
 * Automatically invalidates list queries on success.
 */
export function useCreateQuotationLostReasonDetail(
  options?: UseMutationOptions<QuotationLostReasonDetail, Error, Partial<QuotationLostReasonDetail>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QuotationLostReasonDetail>) => apiPost<QuotationLostReasonDetail>('/quotation-lost-reason-detail', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationLostReasonDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quotation Lost Reason Detail.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQuotationLostReasonDetail(
  options?: UseMutationOptions<QuotationLostReasonDetail, Error, { id: string; data: Partial<QuotationLostReasonDetail> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QuotationLostReasonDetail> }) =>
      apiPut<QuotationLostReasonDetail>(`/quotation-lost-reason-detail/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationLostReasonDetail.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationLostReasonDetail.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quotation Lost Reason Detail by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQuotationLostReasonDetail(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quotation-lost-reason-detail/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationLostReasonDetail.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
