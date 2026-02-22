import type { IndustryOverlayKey } from '../types/branded';

export const OVERLAY_DEPENDENCY_GRAPH: Record<string, IndustryOverlayKey[]> = {
  // Phase 1 stub — expand when industry overlays are implemented
};

export function resolveActiveOverlays(enabled: IndustryOverlayKey[]): Set<IndustryOverlayKey> {
  return new Set(enabled);
}
