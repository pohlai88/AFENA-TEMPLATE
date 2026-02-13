// TanStack Query hooks for Tax Withholding Entry
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TaxWithholdingEntry } from '../types/tax-withholding-entry.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TaxWithholdingEntryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Tax Withholding Entry records.
 */
export function useTaxWithholdingEntryList(
  params: TaxWithholdingEntryListParams = {},
  options?: Omit<UseQueryOptions<TaxWithholdingEntry[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.taxWithholdingEntry.list(params),
    queryFn: () => apiGet<TaxWithholdingEntry[]>(`/tax-withholding-entry${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Tax Withholding Entry by ID.
 */
export function useTaxWithholdingEntry(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TaxWithholdingEntry | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.taxWithholdingEntry.detail(id ?? ''),
    queryFn: () => apiGet<TaxWithholdingEntry | null>(`/tax-withholding-entry/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Tax Withholding Entry.
 * Automatically invalidates list queries on success.
 */
export function useCreateTaxWithholdingEntry(
  options?: UseMutationOptions<TaxWithholdingEntry, Error, Partial<TaxWithholdingEntry>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TaxWithholdingEntry>) => apiPost<TaxWithholdingEntry>('/tax-withholding-entry', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Tax Withholding Entry.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTaxWithholdingEntry(
  options?: UseMutationOptions<TaxWithholdingEntry, Error, { id: string; data: Partial<TaxWithholdingEntry> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaxWithholdingEntry> }) =>
      apiPut<TaxWithholdingEntry>(`/tax-withholding-entry/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingEntry.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingEntry.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Tax Withholding Entry by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTaxWithholdingEntry(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/tax-withholding-entry/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingEntry.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
