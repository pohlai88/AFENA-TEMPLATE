// TanStack Query hooks for Vehicle
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { Vehicle } from '../types/vehicle.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface VehicleListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Vehicle records.
 */
export function useVehicleList(
  params: VehicleListParams = {},
  options?: Omit<UseQueryOptions<Vehicle[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.vehicle.list(params),
    queryFn: () => apiGet<Vehicle[]>(`/vehicle${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Vehicle by ID.
 */
export function useVehicle(
  id: string | undefined,
  options?: Omit<UseQueryOptions<Vehicle | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.vehicle.detail(id ?? ''),
    queryFn: () => apiGet<Vehicle | null>(`/vehicle/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Vehicle.
 * Automatically invalidates list queries on success.
 */
export function useCreateVehicle(
  options?: UseMutationOptions<Vehicle, Error, Partial<Vehicle>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Vehicle>) => apiPost<Vehicle>('/vehicle', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicle.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Vehicle.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateVehicle(
  options?: UseMutationOptions<Vehicle, Error, { id: string; data: Partial<Vehicle> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Vehicle> }) =>
      apiPut<Vehicle>(`/vehicle/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicle.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicle.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Vehicle by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteVehicle(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/vehicle/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicle.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
