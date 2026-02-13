// TanStack Query hooks for Financial Report Template
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { FinancialReportTemplate } from '../types/financial-report-template.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface FinancialReportTemplateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Financial Report Template records.
 */
export function useFinancialReportTemplateList(
  params: FinancialReportTemplateListParams = {},
  options?: Omit<UseQueryOptions<FinancialReportTemplate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.financialReportTemplate.list(params),
    queryFn: () => apiGet<FinancialReportTemplate[]>(`/financial-report-template${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Financial Report Template by ID.
 */
export function useFinancialReportTemplate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<FinancialReportTemplate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.financialReportTemplate.detail(id ?? ''),
    queryFn: () => apiGet<FinancialReportTemplate | null>(`/financial-report-template/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Financial Report Template.
 * Automatically invalidates list queries on success.
 */
export function useCreateFinancialReportTemplate(
  options?: UseMutationOptions<FinancialReportTemplate, Error, Partial<FinancialReportTemplate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<FinancialReportTemplate>) => apiPost<FinancialReportTemplate>('/financial-report-template', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.financialReportTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Financial Report Template.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateFinancialReportTemplate(
  options?: UseMutationOptions<FinancialReportTemplate, Error, { id: string; data: Partial<FinancialReportTemplate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FinancialReportTemplate> }) =>
      apiPut<FinancialReportTemplate>(`/financial-report-template/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.financialReportTemplate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.financialReportTemplate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Financial Report Template by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteFinancialReportTemplate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/financial-report-template/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.financialReportTemplate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
