// TanStack Query hooks for Variant Field
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { VariantField } from '../types/variant-field.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface VariantFieldListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Variant Field records.
 */
export function useVariantFieldList(
  params: VariantFieldListParams = {},
  options?: Omit<UseQueryOptions<VariantField[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.variantField.list(params),
    queryFn: () => apiGet<VariantField[]>(`/variant-field${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Variant Field by ID.
 */
export function useVariantField(
  id: string | undefined,
  options?: Omit<UseQueryOptions<VariantField | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.variantField.detail(id ?? ''),
    queryFn: () => apiGet<VariantField | null>(`/variant-field/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Variant Field.
 * Automatically invalidates list queries on success.
 */
export function useCreateVariantField(
  options?: UseMutationOptions<VariantField, Error, Partial<VariantField>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<VariantField>) => apiPost<VariantField>('/variant-field', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.variantField.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Variant Field.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateVariantField(
  options?: UseMutationOptions<VariantField, Error, { id: string; data: Partial<VariantField> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<VariantField> }) =>
      apiPut<VariantField>(`/variant-field/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.variantField.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.variantField.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Variant Field by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteVariantField(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/variant-field/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.variantField.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
