// TanStack Query hooks for POS Invoice Reference
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosInvoiceReference } from '../types/pos-invoice-reference.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosInvoiceReferenceListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Invoice Reference records.
 */
export function usePosInvoiceReferenceList(
  params: PosInvoiceReferenceListParams = {},
  options?: Omit<UseQueryOptions<PosInvoiceReference[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posInvoiceReference.list(params),
    queryFn: () => apiGet<PosInvoiceReference[]>(`/pos-invoice-reference${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Invoice Reference by ID.
 */
export function usePosInvoiceReference(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosInvoiceReference | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posInvoiceReference.detail(id ?? ''),
    queryFn: () => apiGet<PosInvoiceReference | null>(`/pos-invoice-reference/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Invoice Reference.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosInvoiceReference(
  options?: UseMutationOptions<PosInvoiceReference, Error, Partial<PosInvoiceReference>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosInvoiceReference>) => apiPost<PosInvoiceReference>('/pos-invoice-reference', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceReference.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Invoice Reference.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosInvoiceReference(
  options?: UseMutationOptions<PosInvoiceReference, Error, { id: string; data: Partial<PosInvoiceReference> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosInvoiceReference> }) =>
      apiPut<PosInvoiceReference>(`/pos-invoice-reference/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceReference.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceReference.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Invoice Reference by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosInvoiceReference(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-invoice-reference/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posInvoiceReference.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
