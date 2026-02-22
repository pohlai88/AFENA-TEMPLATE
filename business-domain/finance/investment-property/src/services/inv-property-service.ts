import type { DomainContext, DomainResult } from 'afenda-canon';
import type { DbSession } from 'afenda-database';

import {
  buildInvPropertyMeasureIntent,
  buildInvPropertyTransferIntent,
} from '../commands/inv-property-intent';

export async function measureProperty(
  db: DbSession,
  ctx: DomainContext,
  input: {
    propertyId: string;
    model: 'fair-value' | 'cost';
    prevValueMinor: number;
    currValueMinor: number;
    periodKey: string;
    valuerId?: string;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildInvPropertyMeasureIntent({
        propertyId: input.propertyId,
        model: input.model,
        prevValueMinor: input.prevValueMinor,
        currValueMinor: input.currValueMinor,
        periodKey: input.periodKey,
        ...(input.valuerId ? { valuerId: input.valuerId } : {}),
      }),
    ],
  };
}

export async function transferProperty(
  db: DbSession,
  ctx: DomainContext,
  input: {
    propertyId: string;
    direction: 'to-investment' | 'from-investment';
    fromCategory: 'ppe' | 'inventory' | 'owner-occupied';
    toCategory: 'ppe' | 'inventory' | 'owner-occupied' | 'investment-property';
    transferDate: string;
    carryingMinor: number;
    fairValueMinor?: number;
  },
): Promise<DomainResult> {
  return {
    kind: 'intent',
    intents: [
      buildInvPropertyTransferIntent({
        propertyId: input.propertyId,
        direction: input.direction,
        fromCategory: input.fromCategory,
        toCategory: input.toCategory,
        transferDate: input.transferDate,
        carryingMinor: input.carryingMinor,
        ...(input.fairValueMinor !== undefined ? { fairValueMinor: input.fairValueMinor } : {}),
      }),
    ],
  };
}
