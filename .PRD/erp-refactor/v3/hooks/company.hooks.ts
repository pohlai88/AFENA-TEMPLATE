// TanStack Query hooks for Company
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Company } from '../types/company.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CompanyListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Company records.
 */
export function useCompanyList(
  params: CompanyListParams = {},
  options?: Omit<UseQueryOptions<Company[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.company.list(params),
    queryFn: () => apiGet<Company[]>(`/company${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Company by ID.
 */
export function useCompany(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Company | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.company.detail(id ?? ''),
    queryFn: () => apiGet<Company | null>(`/company/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Company.
 * Automatically invalidates list queries on success.
 */
export function useCreateCompany(
  options?: UseMutationOptions<Company, Error, Partial<Company>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Company>) => apiPost<Company>('/company', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.company.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Company.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCompany(
  options?: UseMutationOptions<Company, Error, { id: string; data: Partial<Company> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Company> }) =>
      apiPut<Company>(`/company/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.company.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.company.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Company by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCompany(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/company/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.company.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
