// TanStack Query hooks for Share Transfer
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ShareTransfer } from '../types/share-transfer.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ShareTransferListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Share Transfer records.
 */
export function useShareTransferList(
  params: ShareTransferListParams = {},
  options?: Omit<UseQueryOptions<ShareTransfer[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.shareTransfer.list(params),
    queryFn: () => apiGet<ShareTransfer[]>(`/share-transfer${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Share Transfer by ID.
 */
export function useShareTransfer(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ShareTransfer | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.shareTransfer.detail(id ?? ''),
    queryFn: () => apiGet<ShareTransfer | null>(`/share-transfer/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Share Transfer.
 * Automatically invalidates list queries on success.
 */
export function useCreateShareTransfer(
  options?: UseMutationOptions<ShareTransfer, Error, Partial<ShareTransfer>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ShareTransfer>) => apiPost<ShareTransfer>('/share-transfer', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareTransfer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Share Transfer.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateShareTransfer(
  options?: UseMutationOptions<ShareTransfer, Error, { id: string; data: Partial<ShareTransfer> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ShareTransfer> }) =>
      apiPut<ShareTransfer>(`/share-transfer/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareTransfer.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shareTransfer.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Share Transfer by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteShareTransfer(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/share-transfer/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareTransfer.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Share Transfer (set docstatus = 1).
 */
export function useSubmitShareTransfer(
  options?: UseMutationOptions<ShareTransfer, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ShareTransfer>(`/share-transfer/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareTransfer.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shareTransfer.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Share Transfer (set docstatus = 2).
 */
export function useCancelShareTransfer(
  options?: UseMutationOptions<ShareTransfer, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<ShareTransfer>(`/share-transfer/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.shareTransfer.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.shareTransfer.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
