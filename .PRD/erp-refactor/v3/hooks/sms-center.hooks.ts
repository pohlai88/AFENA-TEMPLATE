// TanStack Query hooks for SMS Center
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { SmsCenter } from '../types/sms-center.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface SmsCenterListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of SMS Center records.
 */
export function useSmsCenterList(
  params: SmsCenterListParams = {},
  options?: Omit<UseQueryOptions<SmsCenter[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.smsCenter.list(params),
    queryFn: () => apiGet<SmsCenter[]>(`/sms-center${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single SMS Center by ID.
 */
export function useSmsCenter(
  id: string | undefined,
  options?: Omit<UseQueryOptions<SmsCenter | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.smsCenter.detail(id ?? ''),
    queryFn: () => apiGet<SmsCenter | null>(`/sms-center/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new SMS Center.
 * Automatically invalidates list queries on success.
 */
export function useCreateSmsCenter(
  options?: UseMutationOptions<SmsCenter, Error, Partial<SmsCenter>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SmsCenter>) => apiPost<SmsCenter>('/sms-center', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.smsCenter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing SMS Center.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateSmsCenter(
  options?: UseMutationOptions<SmsCenter, Error, { id: string; data: Partial<SmsCenter> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SmsCenter> }) =>
      apiPut<SmsCenter>(`/sms-center/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.smsCenter.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.smsCenter.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a SMS Center by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteSmsCenter(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/sms-center/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.smsCenter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
