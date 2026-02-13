// TanStack Query hooks for Customer Group
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { CustomerGroup } from '../types/customer-group.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface CustomerGroupListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Customer Group records.
 */
export function useCustomerGroupList(
  params: CustomerGroupListParams = {},
  options?: Omit<UseQueryOptions<CustomerGroup[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.customerGroup.list(params),
    queryFn: () => apiGet<CustomerGroup[]>(`/customer-group${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Customer Group by ID.
 */
export function useCustomerGroup(
  id: string | undefined,
  options?: Omit<UseQueryOptions<CustomerGroup | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.customerGroup.detail(id ?? ''),
    queryFn: () => apiGet<CustomerGroup | null>(`/customer-group/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Customer Group.
 * Automatically invalidates list queries on success.
 */
export function useCreateCustomerGroup(
  options?: UseMutationOptions<CustomerGroup, Error, Partial<CustomerGroup>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CustomerGroup>) => apiPost<CustomerGroup>('/customer-group', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Customer Group.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateCustomerGroup(
  options?: UseMutationOptions<CustomerGroup, Error, { id: string; data: Partial<CustomerGroup> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CustomerGroup> }) =>
      apiPut<CustomerGroup>(`/customer-group/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerGroup.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customerGroup.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Customer Group by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteCustomerGroup(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/customer-group/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerGroup.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
