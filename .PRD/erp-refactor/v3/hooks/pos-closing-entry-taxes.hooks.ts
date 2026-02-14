// TanStack Query hooks for POS Closing Entry Taxes
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PosClosingEntryTaxes } from '../types/pos-closing-entry-taxes.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PosClosingEntryTaxesListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of POS Closing Entry Taxes records.
 */
export function usePosClosingEntryTaxesList(
  params: PosClosingEntryTaxesListParams = {},
  options?: Omit<UseQueryOptions<PosClosingEntryTaxes[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.posClosingEntryTaxes.list(params),
    queryFn: () => apiGet<PosClosingEntryTaxes[]>(`/pos-closing-entry-taxes${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single POS Closing Entry Taxes by ID.
 */
export function usePosClosingEntryTaxes(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PosClosingEntryTaxes | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.posClosingEntryTaxes.detail(id ?? ''),
    queryFn: () => apiGet<PosClosingEntryTaxes | null>(`/pos-closing-entry-taxes/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new POS Closing Entry Taxes.
 * Automatically invalidates list queries on success.
 */
export function useCreatePosClosingEntryTaxes(
  options?: UseMutationOptions<PosClosingEntryTaxes, Error, Partial<PosClosingEntryTaxes>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PosClosingEntryTaxes>) => apiPost<PosClosingEntryTaxes>('/pos-closing-entry-taxes', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntryTaxes.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing POS Closing Entry Taxes.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePosClosingEntryTaxes(
  options?: UseMutationOptions<PosClosingEntryTaxes, Error, { id: string; data: Partial<PosClosingEntryTaxes> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PosClosingEntryTaxes> }) =>
      apiPut<PosClosingEntryTaxes>(`/pos-closing-entry-taxes/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntryTaxes.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntryTaxes.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a POS Closing Entry Taxes by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePosClosingEntryTaxes(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/pos-closing-entry-taxes/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.posClosingEntryTaxes.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
