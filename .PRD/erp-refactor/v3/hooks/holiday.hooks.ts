// TanStack Query hooks for Holiday
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Holiday } from '../types/holiday.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface HolidayListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Holiday records.
 */
export function useHolidayList(
  params: HolidayListParams = {},
  options?: Omit<UseQueryOptions<Holiday[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.holiday.list(params),
    queryFn: () => apiGet<Holiday[]>(`/holiday${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Holiday by ID.
 */
export function useHoliday(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Holiday | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.holiday.detail(id ?? ''),
    queryFn: () => apiGet<Holiday | null>(`/holiday/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Holiday.
 * Automatically invalidates list queries on success.
 */
export function useCreateHoliday(
  options?: UseMutationOptions<Holiday, Error, Partial<Holiday>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Holiday>) => apiPost<Holiday>('/holiday', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.holiday.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Holiday.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateHoliday(
  options?: UseMutationOptions<Holiday, Error, { id: string; data: Partial<Holiday> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Holiday> }) =>
      apiPut<Holiday>(`/holiday/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.holiday.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.holiday.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Holiday by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteHoliday(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/holiday/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.holiday.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
