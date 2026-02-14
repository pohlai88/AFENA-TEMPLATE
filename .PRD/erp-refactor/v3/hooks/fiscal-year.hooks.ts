// TanStack Query hooks for Fiscal Year
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { FiscalYear } from '../types/fiscal-year.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface FiscalYearListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Fiscal Year records.
 */
export function useFiscalYearList(
  params: FiscalYearListParams = {},
  options?: Omit<UseQueryOptions<FiscalYear[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.fiscalYear.list(params),
    queryFn: () => apiGet<FiscalYear[]>(`/fiscal-year${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Fiscal Year by ID.
 */
export function useFiscalYear(
  id: string | undefined,
  options?: Omit<UseQueryOptions<FiscalYear | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.fiscalYear.detail(id ?? ''),
    queryFn: () => apiGet<FiscalYear | null>(`/fiscal-year/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Fiscal Year.
 * Automatically invalidates list queries on success.
 */
export function useCreateFiscalYear(
  options?: UseMutationOptions<FiscalYear, Error, Partial<FiscalYear>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<FiscalYear>) => apiPost<FiscalYear>('/fiscal-year', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fiscalYear.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Fiscal Year.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateFiscalYear(
  options?: UseMutationOptions<FiscalYear, Error, { id: string; data: Partial<FiscalYear> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FiscalYear> }) =>
      apiPut<FiscalYear>(`/fiscal-year/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fiscalYear.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.fiscalYear.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Fiscal Year by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteFiscalYear(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/fiscal-year/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fiscalYear.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
