// TanStack Query hooks for Chart of Accounts Importer
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { ChartOfAccountsImporter } from '../types/chart-of-accounts-importer.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface ChartOfAccountsImporterListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Chart of Accounts Importer records.
 */
export function useChartOfAccountsImporterList(
  params: ChartOfAccountsImporterListParams = {},
  options?: Omit<UseQueryOptions<ChartOfAccountsImporter[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.chartOfAccountsImporter.list(params),
    queryFn: () => apiGet<ChartOfAccountsImporter[]>(`/chart-of-accounts-importer${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Chart of Accounts Importer by ID.
 */
export function useChartOfAccountsImporter(
  id: string | undefined,
  options?: Omit<UseQueryOptions<ChartOfAccountsImporter | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.chartOfAccountsImporter.detail(id ?? ''),
    queryFn: () => apiGet<ChartOfAccountsImporter | null>(`/chart-of-accounts-importer/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Chart of Accounts Importer.
 * Automatically invalidates list queries on success.
 */
export function useCreateChartOfAccountsImporter(
  options?: UseMutationOptions<ChartOfAccountsImporter, Error, Partial<ChartOfAccountsImporter>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<ChartOfAccountsImporter>) => apiPost<ChartOfAccountsImporter>('/chart-of-accounts-importer', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chartOfAccountsImporter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Chart of Accounts Importer.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateChartOfAccountsImporter(
  options?: UseMutationOptions<ChartOfAccountsImporter, Error, { id: string; data: Partial<ChartOfAccountsImporter> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ChartOfAccountsImporter> }) =>
      apiPut<ChartOfAccountsImporter>(`/chart-of-accounts-importer/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chartOfAccountsImporter.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.chartOfAccountsImporter.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Chart of Accounts Importer by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteChartOfAccountsImporter(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/chart-of-accounts-importer/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chartOfAccountsImporter.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
