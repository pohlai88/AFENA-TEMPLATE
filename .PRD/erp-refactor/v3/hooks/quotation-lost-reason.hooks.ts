// TanStack Query hooks for Quotation Lost Reason
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { QuotationLostReason } from '../types/quotation-lost-reason.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QuotationLostReasonListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quotation Lost Reason records.
 */
export function useQuotationLostReasonList(
  params: QuotationLostReasonListParams = {},
  options?: Omit<UseQueryOptions<QuotationLostReason[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.quotationLostReason.list(params),
    queryFn: () => apiGet<QuotationLostReason[]>(`/quotation-lost-reason${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quotation Lost Reason by ID.
 */
export function useQuotationLostReason(
  id: string | undefined,
  options?: Omit<UseQueryOptions<QuotationLostReason | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.quotationLostReason.detail(id ?? ''),
    queryFn: () => apiGet<QuotationLostReason | null>(`/quotation-lost-reason/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quotation Lost Reason.
 * Automatically invalidates list queries on success.
 */
export function useCreateQuotationLostReason(
  options?: UseMutationOptions<QuotationLostReason, Error, Partial<QuotationLostReason>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<QuotationLostReason>) => apiPost<QuotationLostReason>('/quotation-lost-reason', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationLostReason.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quotation Lost Reason.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQuotationLostReason(
  options?: UseMutationOptions<QuotationLostReason, Error, { id: string; data: Partial<QuotationLostReason> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QuotationLostReason> }) =>
      apiPut<QuotationLostReason>(`/quotation-lost-reason/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationLostReason.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationLostReason.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quotation Lost Reason by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQuotationLostReason(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quotation-lost-reason/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotationLostReason.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
