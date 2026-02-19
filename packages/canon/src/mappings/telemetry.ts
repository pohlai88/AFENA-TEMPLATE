/**
 * Mapping Telemetry
 *
 * Zero-overhead telemetry hooks for type mapping operations.
 * No performance.now() when disabled, counter-based sampling.
 */

import type { MappingReasonCode } from './reason-codes';

/**
 * Telemetry event for mapping operations
 */
export interface MappingTelemetryEvent {
  operation: 'postgres_map' | 'csv_infer' | 'compat_check';
  durationMs: number;
  confidence?: number;
  reasonCodes?: MappingReasonCode[];
  fromType?: string;
  toType?: string;
  cached?: boolean;
}

/**
 * Telemetry callback function
 */
export type TelemetryCallback = (event: MappingTelemetryEvent) => void;

/**
 * Current telemetry callback (null = disabled)
 */
let telemetryCallback: TelemetryCallback | null = null;

/**
 * Sampling rate (1.0 = 100%, 0.1 = 10%)
 */
let samplingRate = 1.0;

/**
 * Event counter for sampling
 */
let eventCounter = 0;

/**
 * Set telemetry callback and sampling rate
 *
 * @param callback - Callback function (null to disable)
 * @param sampling - Sampling rate between 0 and 1 (default 1.0)
 */
export function setMappingTelemetry(
  callback: TelemetryCallback | null,
  sampling: number = 1.0
): void {
  telemetryCallback = callback;
  samplingRate = Math.max(0, Math.min(1, sampling));
  eventCounter = 0; // Reset counter
}

/**
 * Record a mapping event
 * Zero overhead when telemetry is disabled
 *
 * @param event - Telemetry event to record
 */
export function recordMappingEvent(event: MappingTelemetryEvent): void {
  // Zero overhead when disabled
  if (!telemetryCallback) return;

  // Counter-based sampling (cheaper than Math.random())
  if (samplingRate < 1.0) {
    eventCounter++;
    const threshold = Math.floor(1 / samplingRate);
    if (eventCounter % threshold !== 0) return;
  }

  // Swallow errors (telemetry must never break mapping)
  try {
    telemetryCallback(event);
  } catch {
    // Silent failure - telemetry errors should not propagate
  }
}
