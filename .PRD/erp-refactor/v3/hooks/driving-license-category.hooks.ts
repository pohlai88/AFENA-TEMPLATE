// TanStack Query hooks for Driving License Category
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { DrivingLicenseCategory } from '../types/driving-license-category.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface DrivingLicenseCategoryListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Driving License Category records.
 */
export function useDrivingLicenseCategoryList(
  params: DrivingLicenseCategoryListParams = {},
  options?: Omit<UseQueryOptions<DrivingLicenseCategory[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.drivingLicenseCategory.list(params),
    queryFn: () => apiGet<DrivingLicenseCategory[]>(`/driving-license-category${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Driving License Category by ID.
 */
export function useDrivingLicenseCategory(
  id: string | undefined,
  options?: Omit<UseQueryOptions<DrivingLicenseCategory | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.drivingLicenseCategory.detail(id ?? ''),
    queryFn: () => apiGet<DrivingLicenseCategory | null>(`/driving-license-category/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Driving License Category.
 * Automatically invalidates list queries on success.
 */
export function useCreateDrivingLicenseCategory(
  options?: UseMutationOptions<DrivingLicenseCategory, Error, Partial<DrivingLicenseCategory>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<DrivingLicenseCategory>) => apiPost<DrivingLicenseCategory>('/driving-license-category', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drivingLicenseCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Driving License Category.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateDrivingLicenseCategory(
  options?: UseMutationOptions<DrivingLicenseCategory, Error, { id: string; data: Partial<DrivingLicenseCategory> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<DrivingLicenseCategory> }) =>
      apiPut<DrivingLicenseCategory>(`/driving-license-category/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drivingLicenseCategory.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.drivingLicenseCategory.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Driving License Category by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteDrivingLicenseCategory(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/driving-license-category/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drivingLicenseCategory.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
