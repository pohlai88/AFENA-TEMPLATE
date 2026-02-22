/**
 * IAS 12.74 — Offset DTA/DTL
 *
 * Determines whether deferred tax assets and liabilities can be offset
 * on the balance sheet. Offsetting is permitted only when the entity has
 * a legally enforceable right and they relate to the same tax authority.
 */

import type { CalculatorResult } from 'afenda-canon';
import { DomainError } from 'afenda-canon';

export type TaxJurisdictionBalance = {
  jurisdictionId: string;
  taxAuthorityId: string;
  dtaMinor: number;
  dtlMinor: number;
  hasLegalRightToOffset: boolean;
};

export type OffsetDtaDtlResult = {
  netDtaMinor: number;
  netDtlMinor: number;
  offsetAmountMinor: number;
  jurisdictionDetails: Array<{
    jurisdictionId: string;
    grossDtaMinor: number;
    grossDtlMinor: number;
    offsetMinor: number;
    netMinor: number;
    position: 'asset' | 'liability' | 'nil';
  }>;
  explanation: string;
};

export function computeOffsetDtaDtl(
  inputs: { jurisdictions: TaxJurisdictionBalance[] },
): CalculatorResult<OffsetDtaDtlResult> {
  const { jurisdictions } = inputs;

  if (jurisdictions.length === 0) {
    throw new DomainError('VALIDATION_FAILED', 'At least one jurisdiction required');
  }

  let totalNetDta = 0;
  let totalNetDtl = 0;
  let totalOffset = 0;

  const jurisdictionDetails = jurisdictions.map((j) => {
    const offsetMinor = j.hasLegalRightToOffset ? Math.min(j.dtaMinor, j.dtlMinor) : 0;
    const netMinor = (j.dtaMinor - offsetMinor) - (j.dtlMinor - offsetMinor);

    if (netMinor > 0) totalNetDta += netMinor;
    else totalNetDtl += Math.abs(netMinor);
    totalOffset += offsetMinor;

    return {
      jurisdictionId: j.jurisdictionId,
      grossDtaMinor: j.dtaMinor,
      grossDtlMinor: j.dtlMinor,
      offsetMinor,
      netMinor,
      position: (netMinor > 0 ? 'asset' : netMinor < 0 ? 'liability' : 'nil') as 'asset' | 'liability' | 'nil',
    };
  });

  const explanation =
    `DTA/DTL offset (IAS 12.74): gross DTA ${jurisdictions.reduce((s, j) => s + j.dtaMinor, 0)}, ` +
    `gross DTL ${jurisdictions.reduce((s, j) => s + j.dtlMinor, 0)}, ` +
    `offset ${totalOffset}, net DTA ${totalNetDta}, net DTL ${totalNetDtl}`;

  return {
    result: { netDtaMinor: totalNetDta, netDtlMinor: totalNetDtl, offsetAmountMinor: totalOffset, jurisdictionDetails, explanation },
    inputs: { ...inputs },
    explanation,
  };
}
