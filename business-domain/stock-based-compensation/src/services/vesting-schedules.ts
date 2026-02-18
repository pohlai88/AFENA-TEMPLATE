import { logger } from '@afenda/logger';
import type {
    MarketCondition,
    PerformanceCondition,
    StockGrant,
    VestingFrequency,
    VestingTranche
} from '../types/common.js';

/**
 * Calculate complete vesting schedule for a grant
 * Generates all vesting tranches based on time/performance/market conditions
 * 
 * @param grant - Stock grant
 * @returns Array of vesting tranches
 */
export async function calculateVestingSchedule(
  grant: StockGrant
): Promise<VestingTranche[]> {
  logger.info('Calculating vesting schedule', {
    grantId: grant.id,
    vestingType: grant.vestingType,
  });

  const tranches: VestingTranche[] = [];

  // Handle cliff period
  if (grant.vestingSchedule.cliffMonths > 0) {
    const cliffTranche = calculateCliffTranche(grant);
    tranches.push(cliffTranche);
  }

  // Calculate post-cliff tranches based on frequency
  const postCliffTranches = calculateGradedTranches(grant);
  tranches.push(...postCliffTranches);

  // Validate total shares match grant
  const totalShares = tranches.reduce((sum, t) => sum + t.sharesVesting, 0);
  if (Math.abs(totalShares - grant.sharesGranted) > 0.01) {
    logger.warn('Vesting schedule shares mismatch', {
      grantId: grant.id,
      expected: grant.sharesGranted,
      calculated: totalShares,
    });
  }

  logger.info('Vesting schedule calculated', {
    grantId: grant.id,
    trancheCount: tranches.length,
  });

  return tranches;
}

/**
 * Evaluate performance conditions for a grant
 * Determines vesting percentage based on actual vs target metrics
 * 
 * @param conditions - Performance conditions
 * @param actualMetrics - Actual metric values
 * @returns Vesting percentage (0-100)
 */
export async function evaluatePerformanceConditions(
  conditions: PerformanceCondition[],
  actualMetrics: Record<string, number>
): Promise<number> {
  logger.info('Evaluating performance conditions', {
    conditionCount: conditions.length,
    metrics: Object.keys(actualMetrics),
  });

  if (conditions.length === 0) {
    return 100; // No conditions = 100% vesting
  }

  // Calculate weighted average of all conditions
  let totalWeight = 0;
  let weightedSum = 0;

  for (const condition of conditions) {
    const actualValue = actualMetrics[condition.metric];

    if (actualValue === undefined) {
      logger.warn('Missing metric for performance condition', {
        metric: condition.metric,
      });
      continue;
    }

    const vestingPct = calculatePerformanceVestingPct(condition, actualValue);
    const weight = 1 / conditions.length; // Equal weighting for now

    weightedSum += vestingPct * weight;
    totalWeight += weight;
  }

  const finalPct = totalWeight > 0 ? weightedSum / totalWeight : 0;

  logger.info('Performance conditions evaluated', {
    vestingPercentage: finalPct,
  });

  return finalPct;
}

/**
 * Evaluate market conditions for a grant
 * For ASC 718, market conditions affect fair value but not vesting
 * This is for informational/tracking purposes
 * 
 * @param conditions - Market conditions
 * @param actualValues - Actual market values
 * @returns Whether conditions are met
 */
export async function evaluateMarketConditions(
  conditions: MarketCondition[],
  actualValues: Record<string, number>
): Promise<boolean> {
  logger.info('Evaluating market conditions', {
    conditionCount: conditions.length,
  });

  if (conditions.length === 0) {
    return true;
  }

  // All market conditions must be met
  for (const condition of conditions) {
    const actualValue = actualValues[condition.metric];

    if (actualValue === undefined) {
      logger.warn('Missing metric for market condition', {
        metric: condition.metric,
      });
      return false;
    }

    // Simple target comparison (can be enhanced for TSR percentile ranking)
    if (actualValue < condition.target) {
      logger.info('Market condition not met', {
        metric: condition.metric,
        target: condition.target,
        actual: actualValue,
      });
      return false;
    }
  }

  logger.info('All market conditions met');
  return true;
}

/**
 * Get current vesting status for a grant
 * Calculates vested, unvested, and forfeited shares as of a date
 * 
 * @param grantId - Grant ID
 * @param asOfDate - Date to calculate status
 * @returns Vesting status
 */
export async function getVestingStatus(
  grantId: string,
  asOfDate: Date = new Date()
): Promise<{
  totalGranted: number;
  vested: number;
  unvested: number;
  forfeited: number;
  nextVestDate: Date | null;
  nextVestShares: number;
}> {
  logger.info('Getting vesting status', { grantId, asOfDate });

  // TODO: Fetch grant and tranches from database
  // const grant = await crud.read('stock_grant', grantId);
  // const tranches = await crud.list('vesting_tranche', { grantId });

  // Calculate vested shares
  // const vested = tranches
  //   .filter(t => t.vestDate <= asOfDate && t.status === 'vested')
  //   .reduce((sum, t) => sum + t.sharesVesting, 0);

  // Find next vesting event
  // const nextTranche = tranches
  //   .filter(t => t.vestDate > asOfDate && t.status === 'scheduled')
  //   .sort((a, b) => a.vestDate.getTime() - b.vestDate.getTime())[0];

  const status = {
    totalGranted: 0, // grant.sharesGranted
    vested: 0,
    unvested: 0,
    forfeited: 0,
    nextVestDate: null as Date | null,
    nextVestShares: 0,
  };

  logger.info('Vesting status calculated', status);

  return status;
}

/**
 * Forecast future vesting for reporting/planning
 * Generates projected vesting schedule assuming no forfeitures
 * 
 * @param grant - Stock grant
 * @param forecastMonths - Number of months to forecast
 * @returns Forecasted vesting by period
 */
export async function forecastVesting(
  grant: StockGrant,
  forecastMonths: number = 12
): Promise<{
  month: string;
  sharesVesting: number;
  cumulativeVested: number;
}[]> {
  logger.info('Forecasting vesting', {
    grantId: grant.id,
    forecastMonths,
  });

  const tranches = await calculateVestingSchedule(grant);
  const forecast: {
    month: string;
    sharesVesting: number;
    cumulativeVested: number;
  }[] = [];

  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + forecastMonths);

  let cumulative = 0;

  // Group tranches by month
  const tranchesByMonth = new Map<string, number>();

  for (const tranche of tranches) {
    if (tranche.vestDate <= endDate) {
      const monthKey = tranche.vestDate.toISOString().substring(0, 7); // YYYY-MM
      const current = tranchesByMonth.get(monthKey) ?? 0;
      tranchesByMonth.set(monthKey, current + tranche.sharesVesting);
    }
  }

  // Convert to array and sort
  const sortedMonths = Array.from(tranchesByMonth.entries())
    .sort((a, b) => a[0].localeCompare(b[0]));

  for (const [month, shares] of sortedMonths) {
    cumulative += shares;
    forecast.push({
      month,
      sharesVesting: shares,
      cumulativeVested: cumulative,
    });
  }

  logger.info('Vesting forecast generated', {
    grantId: grant.id,
    periods: forecast.length,
  });

  return forecast;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Calculate cliff vesting tranche
 */
function calculateCliffTranche(grant: StockGrant): VestingTranche {
  const cliffDate = new Date(grant.grantDate);
  cliffDate.setMonth(cliffDate.getMonth() + grant.vestingSchedule.cliffMonths);

  // Cliff typically vests proportional amount
  const cliffPct =
    grant.vestingSchedule.cliffMonths / grant.vestingSchedule.vestingMonths;
  const sharesVesting = Math.floor(grant.sharesGranted * cliffPct);

  return {
    grantId: grant.id,
    vestDate: cliffDate,
    sharesVesting,
    cumulativeShares: sharesVesting,
    status: 'scheduled',
    actualVestDate: null,
  };
}

/**
 * Calculate post-cliff graded vesting tranches
 */
function calculateGradedTranches(grant: StockGrant): VestingTranche[] {
  const tranches: VestingTranche[] = [];
  const schedule = grant.vestingSchedule;

  // Calculate number of vesting periods
  const postCliffMonths = schedule.vestingMonths - schedule.cliffMonths;
  const periodMonths = getMonthsPerPeriod(schedule.vestingFrequency);
  const numPeriods = Math.floor(postCliffMonths / periodMonths);

  if (numPeriods === 0) {
    return []; // All vesting at cliff
  }

  // Calculate shares already vested at cliff
  const cliffShares =
    schedule.cliffMonths > 0
      ? Math.floor(
          grant.sharesGranted *
            (schedule.cliffMonths / schedule.vestingMonths)
        )
      : 0;

  // Remaining shares to vest post-cliff
  const remainingShares = grant.sharesGranted - cliffShares;
  const sharesPerPeriod = Math.floor(remainingShares / numPeriods);
  let cumulativeShares = cliffShares;

  for (let i = 1; i <= numPeriods; i++) {
    const vestDate = new Date(grant.grantDate);
    vestDate.setMonth(
      vestDate.getMonth() + schedule.cliffMonths + i * periodMonths
    );

    // Last period gets any rounding remainder
    const shares =
      i === numPeriods
        ? grant.sharesGranted - cumulativeShares
        : sharesPerPeriod;

    cumulativeShares += shares;

    tranches.push({
      grantId: grant.id,
      vestDate,
      sharesVesting: shares,
      cumulativeShares,
      status: 'scheduled',
      actualVestDate: null,
    });
  }

  return tranches;
}

/**
 * Convert vesting frequency to months
 */
function getMonthsPerPeriod(frequency: VestingFrequency): number {
  switch (frequency) {
    case 'monthly':
      return 1;
    case 'quarterly':
      return 3;
    case 'annually':
      return 12;
    case 'milestone':
      return 0; // Irregular, handled separately
    default:
      throw new Error(`Unsupported vesting frequency: ${frequency}`);
  }
}

/**
 * Calculate vesting percentage for a performance condition
 */
function calculatePerformanceVestingPct(
  condition: PerformanceCondition,
  actualValue: number
): number {
  // Below threshold = 0%
  if (actualValue < condition.threshold) {
    return 0;
  }

  // At or above maximum = 100%
  if (actualValue >= condition.maximum) {
    return condition.maximumPct;
  }

  // Between threshold and target - linear interpolation
  if (actualValue < condition.target) {
    const range = condition.target - condition.threshold;
    const position = actualValue - condition.threshold;
    const pctRange = condition.targetPct - condition.thresholdPct;

    return condition.thresholdPct + (position / range) * pctRange;
  }

  // Between target and maximum - linear interpolation
  const range = condition.maximum - condition.target;
  const position = actualValue - condition.target;
  const pctRange = condition.maximumPct - condition.targetPct;

  return condition.targetPct + (position / range) * pctRange;
}

