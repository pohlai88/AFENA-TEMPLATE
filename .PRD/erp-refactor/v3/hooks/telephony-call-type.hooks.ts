// TanStack Query hooks for Telephony Call Type
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TelephonyCallType } from '../types/telephony-call-type.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TelephonyCallTypeListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Telephony Call Type records.
 */
export function useTelephonyCallTypeList(
  params: TelephonyCallTypeListParams = {},
  options?: Omit<UseQueryOptions<TelephonyCallType[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.telephonyCallType.list(params),
    queryFn: () => apiGet<TelephonyCallType[]>(`/telephony-call-type${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Telephony Call Type by ID.
 */
export function useTelephonyCallType(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TelephonyCallType | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.telephonyCallType.detail(id ?? ''),
    queryFn: () => apiGet<TelephonyCallType | null>(`/telephony-call-type/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Telephony Call Type.
 * Automatically invalidates list queries on success.
 */
export function useCreateTelephonyCallType(
  options?: UseMutationOptions<TelephonyCallType, Error, Partial<TelephonyCallType>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TelephonyCallType>) => apiPost<TelephonyCallType>('/telephony-call-type', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.telephonyCallType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Telephony Call Type.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTelephonyCallType(
  options?: UseMutationOptions<TelephonyCallType, Error, { id: string; data: Partial<TelephonyCallType> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TelephonyCallType> }) =>
      apiPut<TelephonyCallType>(`/telephony-call-type/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.telephonyCallType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.telephonyCallType.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Telephony Call Type by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTelephonyCallType(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/telephony-call-type/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.telephonyCallType.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Submit a Telephony Call Type (set docstatus = 1).
 */
export function useSubmitTelephonyCallType(
  options?: UseMutationOptions<TelephonyCallType, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<TelephonyCallType>(`/telephony-call-type/${id}/submit`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.telephonyCallType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.telephonyCallType.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}

/**
 * Cancel a Telephony Call Type (set docstatus = 2).
 */
export function useCancelTelephonyCallType(
  options?: UseMutationOptions<TelephonyCallType, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiPost<TelephonyCallType>(`/telephony-call-type/${id}/cancel`, {}),
    onSuccess: (result, id, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.telephonyCallType.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.telephonyCallType.detail(id) });
      options?.onSuccess?.(result, id, ...rest);
    },
    ...options,
  });
}
