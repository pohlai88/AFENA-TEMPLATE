// TanStack Query hooks for Fiscal Year Company
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { FiscalYearCompany } from '../types/fiscal-year-company.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface FiscalYearCompanyListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Fiscal Year Company records.
 */
export function useFiscalYearCompanyList(
  params: FiscalYearCompanyListParams = {},
  options?: Omit<UseQueryOptions<FiscalYearCompany[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.fiscalYearCompany.list(params),
    queryFn: () => apiGet<FiscalYearCompany[]>(`/fiscal-year-company${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Fiscal Year Company by ID.
 */
export function useFiscalYearCompany(
  id: string | undefined,
  options?: Omit<UseQueryOptions<FiscalYearCompany | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.fiscalYearCompany.detail(id ?? ''),
    queryFn: () => apiGet<FiscalYearCompany | null>(`/fiscal-year-company/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Fiscal Year Company.
 * Automatically invalidates list queries on success.
 */
export function useCreateFiscalYearCompany(
  options?: UseMutationOptions<FiscalYearCompany, Error, Partial<FiscalYearCompany>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<FiscalYearCompany>) => apiPost<FiscalYearCompany>('/fiscal-year-company', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fiscalYearCompany.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Fiscal Year Company.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateFiscalYearCompany(
  options?: UseMutationOptions<FiscalYearCompany, Error, { id: string; data: Partial<FiscalYearCompany> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FiscalYearCompany> }) =>
      apiPut<FiscalYearCompany>(`/fiscal-year-company/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fiscalYearCompany.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.fiscalYearCompany.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Fiscal Year Company by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteFiscalYearCompany(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/fiscal-year-company/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fiscalYearCompany.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
