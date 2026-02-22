/**
 * Mapping Warnings
 *
 * Warning structures for lossy or fallback type mappings.
 * All mapping outputs include warnings array (even if empty).
 */

import type { DataType } from '../enums/data-types';
import type { MappingReasonCode } from './reason-codes';

/**
 * Warning emitted during type mapping
 * Always present when LOSSY_FALLBACK occurs
 */
export interface MappingWarning {
  code: MappingReasonCode;
  message: string;
  pgType?: string;
  fallbackType?: DataType;
}
