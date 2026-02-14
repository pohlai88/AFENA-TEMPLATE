// TanStack Query hooks for POS Invoice
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosInvoice } from '../types/pos-invoice.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosInvoiceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Invoice records.
 */
export function usePosInvoiceList(
  params: PosInvoiceListParams = {},
  options?: Omit<UseQueryOptions<PosInvoice[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posInvoice.list(params),
    queryFn: () => apiGet<PosInvoice[]>(`/pos-invoice${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Invoice by ID.
 */
export function usePosInvoice(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosInvoice | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posInvoice.detail(id ?? ''),
    queryFn: () => apiGet<PosInvoice | null>(`/pos-invoice/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Invoice.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosInvoice(
  options?: UseMutationOptions<PosInvoice, Error, Partial<PosInvoice>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosInvoice>) => apiPost<PosInvoice>('/pos-invoice', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Invoice.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosInvoice(
  options?: UseMutationOptions<PosInvoice, Error, { id: string; data: Partial<PosInvoice> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosInvoice> }) =>
      apiPut<PosInvoice>(`/pos-invoice/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoice.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Invoice by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosInvoice(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-invoice/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoice.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a POS Invoice (set docstatus = 1).
 */
export function useSubmitPosInvoice(
  options?: UseMutationOptions<PosInvoice, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PosInvoice>(`/pos-invoice/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoice.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a POS Invoice (set docstatus = 2).
 */
export function useCancelPosInvoice(
  options?: UseMutationOptions<PosInvoice, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PosInvoice>(`/pos-invoice/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoice.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoice.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
