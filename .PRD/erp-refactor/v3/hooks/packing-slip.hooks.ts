// TanStack Query hooks for Packing Slip
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PackingSlip } from '../types/packing-slip.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PackingSlipListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Packing Slip records.
 */
export function usePackingSlipList(
  params: PackingSlipListParams = {},
  options?: Omit<UseQueryOptions<PackingSlip[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.packingSlip.list(params),
    queryFn: () => apiGet<PackingSlip[]>(`/packing-slip${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Packing Slip by ID.
 */
export function usePackingSlip(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PackingSlip | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.packingSlip.detail(id ?? ''),
    queryFn: () => apiGet<PackingSlip | null>(`/packing-slip/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Packing Slip.
 * Automatically invalidates list queries on success.
 */
export function useCreatePackingSlip(
  options?: UseMutationOptions<PackingSlip, Error, Partial<PackingSlip>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PackingSlip>) => apiPost<PackingSlip>('/packing-slip', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlip.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Packing Slip.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePackingSlip(
  options?: UseMutationOptions<PackingSlip, Error, { id: string; data: Partial<PackingSlip> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PackingSlip> }) =>
      apiPut<PackingSlip>(`/packing-slip/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlip.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlip.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Packing Slip by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePackingSlip(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/packing-slip/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlip.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Packing Slip (set docstatus = 1).
 */
export function useSubmitPackingSlip(
  options?: UseMutationOptions<PackingSlip, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PackingSlip>(`/packing-slip/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlip.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlip.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Packing Slip (set docstatus = 2).
 */
export function useCancelPackingSlip(
  options?: UseMutationOptions<PackingSlip, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<PackingSlip>(`/packing-slip/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlip.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.packingSlip.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
