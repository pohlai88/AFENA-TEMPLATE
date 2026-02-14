// TanStack Query hooks for Plant Floor
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { PlantFloor } from '../types/plant-floor.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface PlantFloorListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Plant Floor records.
 */
export function usePlantFloorList(
  params: PlantFloorListParams = {},
  options?: Omit<UseQueryOptions<PlantFloor[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.plantFloor.list(params),
    queryFn: () => apiGet<PlantFloor[]>(`/plant-floor${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Plant Floor by ID.
 */
export function usePlantFloor(
  id: string | undefined,
  options?: Omit<UseQueryOptions<PlantFloor | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.plantFloor.detail(id ?? ''),
    queryFn: () => apiGet<PlantFloor | null>(`/plant-floor/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Plant Floor.
 * Automatically invalidates list queries on success.
 */
export function useCreatePlantFloor(
  options?: UseMutationOptions<PlantFloor, Error, Partial<PlantFloor>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<PlantFloor>) => apiPost<PlantFloor>('/plant-floor', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plantFloor.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Plant Floor.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdatePlantFloor(
  options?: UseMutationOptions<PlantFloor, Error, { id: string; data: Partial<PlantFloor> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PlantFloor> }) =>
      apiPut<PlantFloor>(`/plant-floor/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plantFloor.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.plantFloor.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Plant Floor by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeletePlantFloor(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/plant-floor/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plantFloor.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
