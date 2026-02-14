// TanStack Query hooks for Delivery Note
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DeliveryNote } from '../types/delivery-note.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DeliveryNoteListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Delivery Note records.
 */
export function useDeliveryNoteList(
  params: DeliveryNoteListParams = {},
  options?: Omit<UseQueryOptions<DeliveryNote[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.deliveryNote.list(params),
    queryFn: () => apiGet<DeliveryNote[]>(`/delivery-note${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Delivery Note by ID.
 */
export function useDeliveryNote(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DeliveryNote | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.deliveryNote.detail(id ?? ''),
    queryFn: () => apiGet<DeliveryNote | null>(`/delivery-note/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Delivery Note.
 * Automatically invalidates list queries on success.
 */
export function useCreateDeliveryNote(
  options?: UseMutationOptions<DeliveryNote, Error, Partial<DeliveryNote>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DeliveryNote>) => apiPost<DeliveryNote>('/delivery-note', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNote.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Delivery Note.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDeliveryNote(
  options?: UseMutationOptions<DeliveryNote, Error, { id: string; data: Partial<DeliveryNote> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DeliveryNote> }) =>
      apiPut<DeliveryNote>(`/delivery-note/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNote.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNote.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Delivery Note by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDeliveryNote(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/delivery-note/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNote.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Delivery Note (set docstatus = 1).
 */
export function useSubmitDeliveryNote(
  options?: UseMutationOptions<DeliveryNote, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<DeliveryNote>(`/delivery-note/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNote.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNote.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Delivery Note (set docstatus = 2).
 */
export function useCancelDeliveryNote(
  options?: UseMutationOptions<DeliveryNote, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<DeliveryNote>(`/delivery-note/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNote.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deliveryNote.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
