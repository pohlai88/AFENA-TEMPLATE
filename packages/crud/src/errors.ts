/**
 * CRUD Kernel error taxonomy.
 *
 * KernelErrorCode is a type alias for Canon's ErrorCode — Canon is the SSOT
 * for the error vocabulary. This module re-exports it under the kernel name so
 * callers can depend on `afenda-crud` for error codes without a direct Canon
 * import.
 */
export { ERROR_CODES as KERNEL_ERROR_CODES } from 'afenda-canon';
export type { ErrorCode as KernelErrorCode } from 'afenda-canon';

