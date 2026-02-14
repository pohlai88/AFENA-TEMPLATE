// TanStack Query hooks for Lower Deduction Certificate
// Generated from Canon schema — do not edit manually
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { LowerDeductionCertificate } from '../types/lower-deduction-certificate.js';
import { queryKeys } from './query-keys.js';
import { apiGet, apiPost, apiPut, apiDelete } from './api-client.js';

export interface LowerDeductionCertificateListParams {
  limit?: number;
  offset?: number;
  filters?: Record<string, unknown>;
}

/**
 * Fetch a paginated list of Lower Deduction Certificate records.
 */
export function useLowerDeductionCertificateList(
  params: LowerDeductionCertificateListParams = {},
  options?: Omit<UseQueryOptions<LowerDeductionCertificate[]>, 'queryKey' | 'queryFn'>,
) {
  const queryParams = new URLSearchParams();
  if (params.limit) queryParams.set('limit', String(params.limit));
  if (params.offset) queryParams.set('offset', String(params.offset));
  const qs = queryParams.toString();

  return useQuery({
    queryKey: queryKeys.lowerDeductionCertificate.list(params),
    queryFn: () => apiGet<LowerDeductionCertificate[]>(`/lower-deduction-certificate${qs ? '?' + qs : ''}`),
    ...options,
  });
}

/**
 * Fetch a single Lower Deduction Certificate by ID.
 */
export function useLowerDeductionCertificate(
  id: string | undefined,
  options?: Omit<UseQueryOptions<LowerDeductionCertificate | null>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: queryKeys.lowerDeductionCertificate.detail(id ?? ''),
    queryFn: () => apiGet<LowerDeductionCertificate | null>(`/lower-deduction-certificate/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Create a new Lower Deduction Certificate.
 * Automatically invalidates list queries on success.
 */
export function useCreateLowerDeductionCertificate(
  options?: UseMutationOptions<LowerDeductionCertificate, Error, Partial<LowerDeductionCertificate>>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<LowerDeductionCertificate>) => apiPost<LowerDeductionCertificate>('/lower-deduction-certificate', data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lowerDeductionCertificate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}

/**
 * Update an existing Lower Deduction Certificate.
 * Automatically invalidates list and detail queries on success.
 */
export function useUpdateLowerDeductionCertificate(
  options?: UseMutationOptions<LowerDeductionCertificate, Error, { id: string; data: Partial<LowerDeductionCertificate> }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LowerDeductionCertificate> }) =>
      apiPut<LowerDeductionCertificate>(`/lower-deduction-certificate/${id}`, data),
    onSuccess: (result, variables, ...rest) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lowerDeductionCertificate.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.lowerDeductionCertificate.detail(variables.id) });
      options?.onSuccess?.(result, variables, ...rest);
    },
    ...options,
  });
}

/**
 * Delete a Lower Deduction Certificate by ID.
 * Automatically invalidates list queries on success.
 */
export function useDeleteLowerDeductionCertificate(
  options?: UseMutationOptions<void, Error, string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiDelete(`/lower-deduction-certificate/${id}`),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lowerDeductionCertificate.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
}
