// TanStack Query hooks for Customs Tariff Number
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CustomsTariffNumber } from '../types/customs-tariff-number.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CustomsTariffNumberListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Customs Tariff Number records.
 */
export function useCustomsTariffNumberList(
  params: CustomsTariffNumberListParams = {},
  options?: Omit<UseQueryOptions<CustomsTariffNumber[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.customsTariffNumber.list(params),
    queryFn: () => apiGet<CustomsTariffNumber[]>(`/customs-tariff-number${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Customs Tariff Number by ID.
 */
export function useCustomsTariffNumber(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CustomsTariffNumber | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.customsTariffNumber.detail(id ?? ''),
    queryFn: () => apiGet<CustomsTariffNumber | null>(`/customs-tariff-number/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Customs Tariff Number.
 * Automatically invalidates list queries on success.
 */
export function useCreateCustomsTariffNumber(
  options?: UseMutationOptions<CustomsTariffNumber, Error, Partial<CustomsTariffNumber>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CustomsTariffNumber>) => apiPost<CustomsTariffNumber>('/customs-tariff-number', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customsTariffNumber.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Customs Tariff Number.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCustomsTariffNumber(
  options?: UseMutationOptions<CustomsTariffNumber, Error, { id: string; data: Partial<CustomsTariffNumber> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomsTariffNumber> }) =>
      apiPut<CustomsTariffNumber>(`/customs-tariff-number/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customsTariffNumber.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customsTariffNumber.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Customs Tariff Number by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCustomsTariffNumber(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/customs-tariff-number/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customsTariffNumber.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
