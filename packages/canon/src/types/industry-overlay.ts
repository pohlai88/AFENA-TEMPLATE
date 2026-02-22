import type { IndustryOverlayKey } from './branded';

export type KnownOverlay =
  | 'retail'
  | 'fb'
  | 'agri'
  | 'manufacturing';

export function resolveActiveOverlays(
  enabled: IndustryOverlayKey[] | undefined,
): Set<IndustryOverlayKey> {
  return new Set(enabled ?? []);
}
