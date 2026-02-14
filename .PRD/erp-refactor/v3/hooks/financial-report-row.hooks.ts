// TanStack Query hooks for Financial Report Row
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { FinancialReportRow } from '../types/financial-report-row.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface FinancialReportRowListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Financial Report Row records.
 */
export function useFinancialReportRowList(
  params: FinancialReportRowListParams = {},
  options?: Omit<UseQueryOptions<FinancialReportRow[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.financialReportRow.list(params),
    queryFn: () => apiGet<FinancialReportRow[]>(`/financial-report-row${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Financial Report Row by ID.
 */
export function useFinancialReportRow(
  id: string | undefined,
  options?: Omit<UseQueryOptions<FinancialReportRow | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.financialReportRow.detail(id ?? ''),
    queryFn: () => apiGet<FinancialReportRow | null>(`/financial-report-row/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Financial Report Row.
 * Automatically invalidates list queries on success.
 */
export function useCreateFinancialReportRow(
  options?: UseMutationOptions<FinancialReportRow, Error, Partial<FinancialReportRow>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<FinancialReportRow>) => apiPost<FinancialReportRow>('/financial-report-row', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.financialReportRow.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Financial Report Row.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateFinancialReportRow(
  options?: UseMutationOptions<FinancialReportRow, Error, { id: string; data: Partial<FinancialReportRow> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FinancialReportRow> }) =>
      apiPut<FinancialReportRow>(`/financial-report-row/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.financialReportRow.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.financialReportRow.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Financial Report Row by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteFinancialReportRow(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/financial-report-row/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.financialReportRow.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
