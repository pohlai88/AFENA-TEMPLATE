import { type DbInstance } from 'afenda-database';
import { Result, err, ok } from 'afenda-canon';
import { z } from 'zod';

const ScreenRestrictedPartyParams = z.object({
  partyName: z.string(),
  partyType: z.enum(['customer', 'supplier', 'carrier', 'individual']),
  address: z.object({
    country: z.string(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  screeningLists: z.array(z.enum(['OFAC', 'BIS', 'EU', 'UN', 'ALL'])).optional(),
});

export interface RestrictedPartyScreening {
  screeningId: string;
  partyName: string;
  partyType: string;
  screeningDate: Date;
  status: 'clear' | 'potential_match' | 'denied';
  matches: {
    listName: string;
    matchedName: string;
    matchScore: number;
    sanctionType: string;
    effectiveDate: Date;
    notes: string;
  }[];
  requiresReview: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export async function screenRestrictedParty(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof ScreenRestrictedPartyParams>,
): Promise<Result<RestrictedPartyScreening>> {
  const validated = ScreenRestrictedPartyParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Screen against denied party lists (OFAC, BIS, EU, UN)
  return ok({
    screeningId: `screen-${Date.now()}`,
    partyName: validated.data.partyName,
    partyType: validated.data.partyType,
    screeningDate: new Date(),
    status: 'clear',
    matches: [],
    requiresReview: false,
    approvalStatus: undefined,
  });
}

const UpdateDeniedPartyListParams = z.object({
  listName: z.string(),
  source: z.string(),
  lastUpdated: z.date(),
  recordCount: z.number(),
});

export interface DeniedPartyListUpdate {
  listName: string;
  source: string;
  previousUpdate: Date;
  newUpdate: Date;
  recordsAdded: number;
  recordsRemoved: number;
  recordsModified: number;
  totalRecords: number;
}

export async function updateDeniedPartyList(
  db: DbInstance,
  orgId: string,
  userId: string,
  params: z.infer<typeof UpdateDeniedPartyListParams>,
): Promise<Result<DeniedPartyListUpdate>> {
  const validated = UpdateDeniedPartyListParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Update denied party list from government sources
  return ok({
    listName: validated.data.listName,
    source: validated.data.source,
    previousUpdate: new Date(),
    newUpdate: validated.data.lastUpdated,
    recordsAdded: 0,
    recordsRemoved: 0,
    recordsModified: 0,
    totalRecords: validated.data.recordCount,
  });
}

const CheckExportLicenseParams = z.object({
  itemId: z.string(),
  destinationCountry: z.string(),
  endUser: z.string(),
  endUse: z.string(),
});

export interface ExportLicenseCheck {
  itemId: string;
  destinationCountry: string;
  eccn?: string; // Export Control Classification Number
  licenseRequired: boolean;
  licenseType?: string;
  restrictionReason?: string;
  exemptions: string[];
  recommendedAction: string;
}

export async function checkExportLicense(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof CheckExportLicenseParams>,
): Promise<Result<ExportLicenseCheck>> {
  const validated = CheckExportLicenseParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Check export control regulations (EAR, ITAR)
  return ok({
    itemId: validated.data.itemId,
    destinationCountry: validated.data.destinationCountry,
    eccn: undefined,
    licenseRequired: false,
    licenseType: undefined,
    restrictionReason: undefined,
    exemptions: [],
    recommendedAction: 'No license required - proceed with shipment',
  });
}

const GetScreeningHistoryParams = z.object({
  partyName: z.string().optional(),
  fromDate: z.date(),
  toDate: z.date(),
  status: z.enum(['clear', 'potential_match', 'denied', 'all']).optional(),
});

export interface ScreeningHistory {
  totalScreenings: number;
  clearScreenings: number;
  potentialMatches: number;
  deniedParties: number;
  screenings: {
    screeningId: string;
    partyName: string;
    partyType: string;
    screeningDate: Date;
    status: string;
    matchCount: number;
    reviewedBy?: string;
  }[];
}

export async function getScreeningHistory(
  db: DbInstance,
  orgId: string,
  params: z.infer<typeof GetScreeningHistoryParams>,
): Promise<Result<ScreeningHistory>> {
  const validated = GetScreeningHistoryParams.safeParse(params);
  if (!validated.success)
    return err({ code: 'VALIDATION_ERROR', message: validated.error.message });

  // TODO: Query screening history
  return ok({
    totalScreenings: 0,
    clearScreenings: 0,
    potentialMatches: 0,
    deniedParties: 0,
    screenings: [],
  });
}
