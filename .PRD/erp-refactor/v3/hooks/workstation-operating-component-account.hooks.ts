// TanStack Query hooks for Workstation Operating Component Account
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { WorkstationOperatingComponentAccount } from '../types/workstation-operating-component-account.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface WorkstationOperatingComponentAccountListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Workstation Operating Component Account records.
 */
export function useWorkstationOperatingComponentAccountList(
  params: WorkstationOperatingComponentAccountListParams = {},
  options?: Omit<UseQueryOptions<WorkstationOperatingComponentAccount[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.workstationOperatingComponentAccount.list(params),
    queryFn: () => apiGet<WorkstationOperatingComponentAccount[]>(`/workstation-operating-component-account${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Workstation Operating Component Account by ID.
 */
export function useWorkstationOperatingComponentAccount(
  id: string | undefined,
  options?: Omit<UseQueryOptions<WorkstationOperatingComponentAccount | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.workstationOperatingComponentAccount.detail(id ?? ''),
    queryFn: () => apiGet<WorkstationOperatingComponentAccount | null>(`/workstation-operating-component-account/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Workstation Operating Component Account.
 * Automatically invalidates list queries on success.
 */
export function useCreateWorkstationOperatingComponentAccount(
  options?: UseMutationOptions<WorkstationOperatingComponentAccount, Error, Partial<WorkstationOperatingComponentAccount>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkstationOperatingComponentAccount>) => apiPost<WorkstationOperatingComponentAccount>('/workstation-operating-component-account', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationOperatingComponentAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Workstation Operating Component Account.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateWorkstationOperatingComponentAccount(
  options?: UseMutationOptions<WorkstationOperatingComponentAccount, Error, { id: string; data: Partial<WorkstationOperatingComponentAccount> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkstationOperatingComponentAccount> }) =>
      apiPut<WorkstationOperatingComponentAccount>(`/workstation-operating-component-account/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationOperatingComponentAccount.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationOperatingComponentAccount.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Workstation Operating Component Account by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteWorkstationOperatingComponentAccount(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/workstation-operating-component-account/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workstationOperatingComponentAccount.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
