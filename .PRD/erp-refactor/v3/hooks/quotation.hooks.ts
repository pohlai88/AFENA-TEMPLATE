// TanStack Query hooks for Quotation
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Quotation } from '../types/quotation.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface QuotationListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Quotation records.
 */
export function useQuotationList(
  params: QuotationListParams = {},
  options?: Omit<UseQueryOptions<Quotation[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.quotation.list(params),
    queryFn: () => apiGet<Quotation[]>(`/quotation${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Quotation by ID.
 */
export function useQuotation(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Quotation | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.quotation.detail(id ?? ''),
    queryFn: () => apiGet<Quotation | null>(`/quotation/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Quotation.
 * Automatically invalidates list queries on success.
 */
export function useCreateQuotation(
  options?: UseMutationOptions<Quotation, Error, Partial<Quotation>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Quotation>) => apiPost<Quotation>('/quotation', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Quotation.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateQuotation(
  options?: UseMutationOptions<Quotation, Error, { id: string; data: Partial<Quotation> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Quotation> }) =>
      apiPut<Quotation>(`/quotation/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotation.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Quotation by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteQuotation(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/quotation/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotation.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Quotation (set docstatus = 1).
 */
export function useSubmitQuotation(
  options?: UseMutationOptions<Quotation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Quotation>(`/quotation/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Quotation (set docstatus = 2).
 */
export function useCancelQuotation(
  options?: UseMutationOptions<Quotation, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<Quotation>(`/quotation/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.quotation.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.quotation.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
