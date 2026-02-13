// TanStack Query hooks for Advance Taxes and Charges
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AdvanceTaxesAndCharges } from '../types/advance-taxes-and-charges.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface AdvanceTaxesAndChargesListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Advance Taxes and Charges records.
 */
export function useAdvanceTaxesAndChargesList(
  params: AdvanceTaxesAndChargesListParams = {},
  options?: Omit<UseQueryOptions<AdvanceTaxesAndCharges[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.advanceTaxesAndCharges.list(params),
    queryFn: () => apiGet<AdvanceTaxesAndCharges[]>(`/advance-taxes-and-charges${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Advance Taxes and Charges by ID.
 */
export function useAdvanceTaxesAndCharges(
  id: string | undefined,
  options?: Omit<UseQueryOptions<AdvanceTaxesAndCharges | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.advanceTaxesAndCharges.detail(id ?? ''),
    queryFn: () => apiGet<AdvanceTaxesAndCharges | null>(`/advance-taxes-and-charges/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Advance Taxes and Charges.
 * Automatically invalidates list queries on success.
 */
export function useCreateAdvanceTaxesAndCharges(
  options?: UseMutationOptions<AdvanceTaxesAndCharges, Error, Partial<AdvanceTaxesAndCharges>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AdvanceTaxesAndCharges>) => apiPost<AdvanceTaxesAndCharges>('/advance-taxes-and-charges', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.advanceTaxesAndCharges.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Advance Taxes and Charges.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateAdvanceTaxesAndCharges(
  options?: UseMutationOptions<AdvanceTaxesAndCharges, Error, { id: string; data: Partial<AdvanceTaxesAndCharges> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AdvanceTaxesAndCharges> }) =>
      apiPut<AdvanceTaxesAndCharges>(`/advance-taxes-and-charges/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.advanceTaxesAndCharges.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.advanceTaxesAndCharges.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Advance Taxes and Charges by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteAdvanceTaxesAndCharges(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/advance-taxes-and-charges/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.advanceTaxesAndCharges.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
