// TanStack Query hooks for Subcontracting Receipt
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SubcontractingReceipt } from '../types/subcontracting-receipt.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SubcontractingReceiptListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Subcontracting Receipt records.
 */
export function useSubcontractingReceiptList(
  params: SubcontractingReceiptListParams = {},
  options?: Omit<UseQueryOptions<SubcontractingReceipt[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.subcontractingReceipt.list(params),
    queryFn: () => apiGet<SubcontractingReceipt[]>(`/subcontracting-receipt${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Subcontracting Receipt by ID.
 */
export function useSubcontractingReceipt(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SubcontractingReceipt | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.subcontractingReceipt.detail(id ?? ''),
    queryFn: () => apiGet<SubcontractingReceipt | null>(`/subcontracting-receipt/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Subcontracting Receipt.
 * Automatically invalidates list queries on success.
 */
export function useCreateSubcontractingReceipt(
  options?: UseMutationOptions<SubcontractingReceipt, Error, Partial<SubcontractingReceipt>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SubcontractingReceipt>) => apiPost<SubcontractingReceipt>('/subcontracting-receipt', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceipt.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Subcontracting Receipt.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSubcontractingReceipt(
  options?: UseMutationOptions<SubcontractingReceipt, Error, { id: string; data: Partial<SubcontractingReceipt> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SubcontractingReceipt> }) =>
      apiPut<SubcontractingReceipt>(`/subcontracting-receipt/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceipt.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceipt.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Subcontracting Receipt by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSubcontractingReceipt(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/subcontracting-receipt/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceipt.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Subcontracting Receipt (set docstatus = 1).
 */
export function useSubmitSubcontractingReceipt(
  options?: UseMutationOptions<SubcontractingReceipt, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SubcontractingReceipt>(`/subcontracting-receipt/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceipt.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceipt.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Subcontracting Receipt (set docstatus = 2).
 */
export function useCancelSubcontractingReceipt(
  options?: UseMutationOptions<SubcontractingReceipt, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<SubcontractingReceipt>(`/subcontracting-receipt/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceipt.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.subcontractingReceipt.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
