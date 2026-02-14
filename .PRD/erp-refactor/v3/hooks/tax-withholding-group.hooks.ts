// TanStack Query hooks for Tax Withholding Group
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { TaxWithholdingGroup } from '../types/tax-withholding-group.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface TaxWithholdingGroupListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Tax Withholding Group records.
 */
export function useTaxWithholdingGroupList(
  params: TaxWithholdingGroupListParams = {},
  options?: Omit<UseQueryOptions<TaxWithholdingGroup[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.taxWithholdingGroup.list(params),
    queryFn: () => apiGet<TaxWithholdingGroup[]>(`/tax-withholding-group${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Tax Withholding Group by ID.
 */
export function useTaxWithholdingGroup(
  id: string | undefined,
  options?: Omit<UseQueryOptions<TaxWithholdingGroup | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.taxWithholdingGroup.detail(id ?? ''),
    queryFn: () => apiGet<TaxWithholdingGroup | null>(`/tax-withholding-group/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Tax Withholding Group.
 * Automatically invalidates list queries on success.
 */
export function useCreateTaxWithholdingGroup(
  options?: UseMutationOptions<TaxWithholdingGroup, Error, Partial<TaxWithholdingGroup>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TaxWithholdingGroup>) => apiPost<TaxWithholdingGroup>('/tax-withholding-group', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Tax Withholding Group.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateTaxWithholdingGroup(
  options?: UseMutationOptions<TaxWithholdingGroup, Error, { id: string; data: Partial<TaxWithholdingGroup> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaxWithholdingGroup> }) =>
      apiPut<TaxWithholdingGroup>(`/tax-withholding-group/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingGroup.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingGroup.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Tax Withholding Group by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteTaxWithholdingGroup(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/tax-withholding-group/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.taxWithholdingGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
