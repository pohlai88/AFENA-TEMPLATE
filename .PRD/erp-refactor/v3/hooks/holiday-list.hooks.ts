// TanStack Query hooks for Holiday List
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { HolidayList } from '../types/holiday-list.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface HolidayListListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Holiday List records.
 */
export function useHolidayListList(
  params: HolidayListListParams = {},
  options?: Omit<UseQueryOptions<HolidayList[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.holidayList.list(params),
    queryFn: () => apiGet<HolidayList[]>(`/holiday-list${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Holiday List by ID.
 */
export function useHolidayList(
  id: string | undefined,
  options?: Omit<UseQueryOptions<HolidayList | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.holidayList.detail(id ?? ''),
    queryFn: () => apiGet<HolidayList | null>(`/holiday-list/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Holiday List.
 * Automatically invalidates list queries on success.
 */
export function useCreateHolidayList(
  options?: UseMutationOptions<HolidayList, Error, Partial<HolidayList>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<HolidayList>) => apiPost<HolidayList>('/holiday-list', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.holidayList.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Holiday List.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateHolidayList(
  options?: UseMutationOptions<HolidayList, Error, { id: string; data: Partial<HolidayList> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HolidayList> }) =>
      apiPut<HolidayList>(`/holiday-list/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.holidayList.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.holidayList.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Holiday List by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteHolidayList(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/holiday-list/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.holidayList.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
