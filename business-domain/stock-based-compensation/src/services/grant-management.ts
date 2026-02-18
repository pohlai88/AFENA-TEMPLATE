import { logger } from '@afenda/logger';
import type {
    CreateGrantParams,
    StockGrant,
} from '../types/common.js';
import { GrantStatus, GrantType } from '../types/common.js';

/**
 * Create a new stock-based compensation grant
 * 
 * @param params - Grant creation parameters
 * @returns Created stock grant
 */
export async function createStockGrant(
  params: CreateGrantParams
): Promise<StockGrant> {
  logger.info('Creating stock grant', {
    employeeId: params.employeeId,
    grantType: params.grantType,
    sharesGranted: params.sharesGranted,
  });

  // Validate input parameters
  validateGrantParams(params);

  // Calculate total fair value
  const totalFairValue = params.sharesGranted * params.fairValuePerShare;

  // Calculate expiration date for options
  const expirationDate = calculateExpirationDate(
    params.grantDate,
    params.grantType,
    params.expirationYears
  );

  // Create grant record
  const grant: StockGrant = {
    id: generateGrantId(),
    employeeId: params.employeeId,
    grantType: params.grantType,
    grantDate: params.grantDate,
    sharesGranted: params.sharesGranted,
    strikePrice: params.strikePrice ?? null,
    fairValuePerShare: params.fairValuePerShare,
    totalFairValue,
    vestingType: params.vestingType,
    vestingSchedule: params.vestingSchedule,
    status: GrantStatus.ACTIVE,
    sharesVested: 0,
    sharesExercised: 0,
    sharesForfeited: 0,
    sharesRemaining: params.sharesGranted,
    expirationDate,
    postTermExerciseDays: params.postTermExerciseDays ?? null,
    agreementId: params.agreementId ?? null,
    notes: params.notes ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
    companyId: '', // Will be set by CRUD handler
    erpId: null,
  };

  // TODO: Save to database via CRUD
  // await crud.create('stock_grant', grant);

  logger.info('Stock grant created successfully', { grantId: grant.id });

  return grant;
}

/**
 * Update an existing stock grant
 * 
 * @param grantId - Grant ID to update
 * @param updates - Fields to update
 * @returns Updated grant
 */
export async function updateGrant(
  grantId: string,
  updates: Partial<StockGrant>
): Promise<StockGrant> {
  logger.info('Updating stock grant', { grantId, updates });

  // TODO: Fetch existing grant
  // const grant = await crud.read('stock_grant', grantId);

  // Validate update doesn't violate business rules
  validateGrantUpdate(updates);

  // TODO: Apply updates and save
  // const updated = { ...grant, ...updates, updatedAt: new Date() };
  // await crud.update('stock_grant', grantId, updated);

  logger.info('Stock grant updated successfully', { grantId });

  // Placeholder return
  return {} as StockGrant;
}

/**
 * Cancel a stock grant
 * 
 * @param grantId - Grant ID to cancel
 * @param reason - Cancellation reason
 * @returns Cancelled grant
 */
export async function cancelGrant(
  grantId: string,
  reason: string
): Promise<StockGrant> {
  logger.info('Cancelling stock grant', { grantId, reason });

  // TODO: Fetch grant and validate can be cancelled
  // const grant = await crud.read('stock_grant', grantId);

  // Forbid cancellation of vested/exercised grants
  // if (grant.sharesVested > 0 || grant.sharesExercised > 0) {
  //   throw new Error('Cannot cancel grant with vested or exercised shares');
  // }

  // Update to cancelled status
  const updates = {
    status: GrantStatus.CANCELLED,
    notes: reason,
    sharesForfeited: 0, // All unvested shares are cancelled, not forfeited
  };

  // TODO: Save updates
  // const cancelled = await crud.update('stock_grant', grantId, updates);

  logger.info('Stock grant cancelled successfully', { grantId });

  return {} as StockGrant;
}

/**
 * Get stock grant by ID
 * 
 * @param grantId - Grant ID
 * @returns Stock grant
 */
export async function getGrant(grantId: string): Promise<StockGrant | null> {
  logger.debug('Fetching stock grant', { grantId });

  // TODO: Fetch from database
  // const grant = await crud.read('stock_grant', grantId);

  return null;
}

/**
 * List stock grants with filters
 * 
 * @param filters - Query filters
 * @returns List of stock grants
 */
export async function listGrants(filters: {
  employeeId?: string;
  grantType?: GrantType;
  status?: GrantStatus;
  grantDateFrom?: Date;
  grantDateTo?: Date;
}): Promise<StockGrant[]> {
  logger.debug('Listing stock grants', { filters });

  // TODO: Query database with filters
  // const grants = await crud.query('stock_grant', filters);

  return [];
}

/**
 * Record shares vested on a grant
 * 
 * @param grantId - Grant ID
 * @param sharesVested - Number of shares vesting
 * @param vestDate - Vest date
 * @returns Updated grant
 */
export async function recordVesting(
  grantId: string,
  sharesVested: number,
  vestDate: Date
): Promise<StockGrant> {
  logger.info('Recording vesting', { grantId, sharesVested, vestDate });

  // TODO: Fetch grant
  // const grant = await crud.read('stock_grant', grantId);

  // Validate shares available to vest
  // if (grant.sharesVested + sharesVested > grant.sharesGranted) {
  //   throw new Error('Cannot vest more shares than granted');
  // }

  // Update vested counts
  const updates = {
    sharesVested: 0, // grant.sharesVested + sharesVested,
    sharesRemaining: 0, // grant.sharesGranted - (grant.sharesVested + sharesVested),
    status: GrantStatus.ACTIVE, // Will be VESTED if fully vested
  };

  // TODO: Save updates
  // const updated = await crud.update('stock_grant', grantId, updates);

  logger.info('Vesting recorded successfully', { grantId, sharesVested });

  return {} as StockGrant;
}

/**
 * Accelerate vesting on a grant
 *
 * @param grantId - Grant ID
 * @param sharesToAccelerate - Number of shares to accelerate (or 'all')
 * @param accelerationDate - Date of acceleration
 * @param reason - Reason (M&A, termination, etc)
 * @returns Updated grant
 */
export async function accelerateVesting(
  grantId: string,
  sharesToAccelerate: number | 'all',
  accelerationDate: Date,
  reason: string
): Promise<StockGrant> {
  logger.info('Accelerating vesting', { grantId, sharesToAccelerate, reason });

  // TODO: Fetch grant
  // const grant = await crud.read('stock_grant', grantId);

  // Calculate shares to accelerate
  // const shares = sharesToAccelerate === 'all'
  //   ? grant.sharesRemaining
  //   : sharesToAccelerate;

  // Record acceleration as vesting event
  // const updated = await record Vesting(grantId, shares, accelerationDate);

  logger.info('Vesting accelerated successfully', { grantId });

  return {} as StockGrant;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate grant creation parameters
 */
function validateGrantParams(params: CreateGrantParams): void {
  if (params.sharesGranted <= 0) {
    throw new Error('Shares granted must be positive');
  }

  if (params.fairValuePerShare <= 0) {
    throw new Error('Fair value per share must be positive');
  }

  // Options require strike price
  if (
    (params.grantType === GrantType.ISO || params.grantType === GrantType.NSO) &&
    (!params.strikePrice || params.strikePrice <= 0)
  ) {
    throw new Error('Stock options require positive strike price');
  }

  // RSUs/PSUs should not have strike price
  if (
    (params.grantType === GrantType.RSU || params.grantType === GrantType.PSU) &&
    params.strikePrice
  ) {
    throw new Error('RSUs and PSUs should not have strike price');
  }

  // Validate vesting schedule
  if (params.vestingSchedule.cliffMonths < 0) {
    throw new Error('Cliff months cannot be negative');
  }

  if (params.vestingSchedule.vestingMonths <= 0) {
    throw new Error('Vesting months must be positive');
  }

  if (params.vestingSchedule.cliffMonths > params.vestingSchedule.vestingMonths) {
    throw new Error('Cliff cannot exceed total vesting period');
  }
}

/**
 * Validate grant update
 */
function validateGrantUpdate(updates: Partial<StockGrant>): void {
  // Cannot change fundamental grant terms after creation
  const immutableFields = [
    'grantType',
    'grantDate',
    'sharesGranted',
    'strikePrice',
  ];

  for (const field of immutableFields) {
    if (field in updates) {
      throw new Error(
        `Cannot update immutable field: ${field}. Use modification accounting instead.`
      );
    }
  }
}

/**
 * Calculate expiration date for stock options
 */
function calculateExpirationDate(
  grantDate: Date,
  grantType: GrantType,
  expirationYears?: number
): Date | null {
  // Only options have expiration
  if (grantType !== GrantType.ISO && grantType !== GrantType.NSO) {
    return null;
  }

  const years = expirationYears ?? 10; // Default 10 years
  const expiration = new Date(grantDate);
  expiration.setFullYear(expiration.getFullYear() + years);

  return expiration;
}

/**
 * Generate unique grant ID
 * TODO: Replace with proper ID generation from database
 */
function generateGrantId(): string {
  return `grant-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

