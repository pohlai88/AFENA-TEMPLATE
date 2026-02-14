// TanStack Query hooks for Request for Quotation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { RequestForQuotation } from '../types/request-for-quotation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface RequestForQuotationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Request for Quotation records.
 */
export function useRequestForQuotationList(
  params: RequestForQuotationListParams = {},
  options?: Omit<UseQueryOptions<RequestForQuotation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.requestForQuotation.list(params),
    queryFn: () => apiGet<RequestForQuotation[]>(`/request-for-quotation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Request for Quotation by ID.
 */
export function useRequestForQuotation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<RequestForQuotation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.requestForQuotation.detail(id ?? ''),
    queryFn: () => apiGet<RequestForQuotation | null>(`/request-for-quotation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Request for Quotation.
 * Automatically invalidates list queries on success.
 */
export function useCreateRequestForQuotation(
  options?: UseMutationOptions<RequestForQuotation, Error, Partial<RequestForQuotation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<RequestForQuotation>) => apiPost<RequestForQuotation>('/request-for-quotation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Request for Quotation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateRequestForQuotation(
  options?: UseMutationOptions<RequestForQuotation, Error, { id: string; data: Partial<RequestForQuotation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RequestForQuotation> }) =>
      apiPut<RequestForQuotation>(`/request-for-quotation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Request for Quotation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteRequestForQuotation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/request-for-quotation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Request for Quotation (set docstatus = 1).
 */
export function useSubmitRequestForQuotation(
  options?: UseMutationOptions<RequestForQuotation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<RequestForQuotation>(`/request-for-quotation/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Request for Quotation (set docstatus = 2).
 */
export function useCancelRequestForQuotation(
  options?: UseMutationOptions<RequestForQuotation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<RequestForQuotation>(`/request-for-quotation/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.requestForQuotation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
