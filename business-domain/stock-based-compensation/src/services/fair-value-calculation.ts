import { logger } from '@afenda/logger';
import { Decimal } from 'decimal.js';
import type {
    FairValueInputs,
    StockGrant,
    Valuation409A,
} from '../types/common.js';
import { ValuationMethod } from '../types/common.js';

/**
 * Calculate fair value of a stock grant using specified valuation method
 * 
 * @param grant - Stock grant
 * @param inputs - Fair value calculation inputs
 * @param method - Valuation method to use
 * @returns Fair value per share
 */
export async function calculateFairValue(
  grant: StockGrant,
  inputs: FairValueInputs,
  method: ValuationMethod = ValuationMethod.BLACK_SCHOLES
): Promise<number> {
  logger.info('Calculating fair value', {
    grantId: grant.id,
    grantType: grant.grantType,
    method,
  });

  // Validate inputs
  validateFairValueInputs(inputs);

  let fairValue: number;

  switch (method) {
    case ValuationMethod.BLACK_SCHOLES:
      fairValue = calculateBlackScholes(inputs);
      break;

    case ValuationMethod.MONTE_CARLO:
      fairValue = calculateMonteCarlo(inputs);
      break;

    case ValuationMethod.LATTICE:
      fairValue = calculateLattice(inputs);
      break;

    case ValuationMethod.VALUATION_409A:
      // Use latest 409A valuation
      fairValue = inputs.stockPrice; // Will be replaced with actual 409A value
      break;

    default:
      throw new Error(`Unsupported valuation method: ${method}`);
  }

  logger.info('Fair value calculated', {
    grantId: grant.id,
    fairValue,
    method,
  });

  return fairValue;
}

/**
 * Calculate option fair value using Black-Scholes model
 * Industry standard for European-style options
 * 
 * @param inputs - Fair value inputs
 * @returns Fair value per option
 */
export function calculateBlackScholes(inputs: FairValueInputs): number {
  logger.info('Calculating Black-Scholes fair value');

  const S = new Decimal(inputs.stockPrice);
  const K = new Decimal(inputs.strikePrice);
  const r = new Decimal(inputs.riskFreeRate);
  const q = new Decimal(inputs.dividendYield);
  const T = new Decimal(inputs.timeToExpiration);
  const sigma = new Decimal(inputs.volatility);

  // d1 = (ln(S/K) + (r - q + σ²/2) * T) / (σ * √T)
  const d1 = S.div(K)
    .ln()
    .plus(r.minus(q).plus(sigma.pow(2).div(2)).times(T))
    .div(sigma.times(T.sqrt()));

  // d2 = d1 - σ * √T
  const d2 = d1.minus(sigma.times(T.sqrt()));

  // N(d1) and N(d2) - cumulative standard normal distribution
  const Nd1 = cumulativeNormalDistribution(d1.toNumber());
  const Nd2 = cumulativeNormalDistribution(d2.toNumber());

  // Call option value: S * e^(-qT) * N(d1) - K * e^(-rT) * N(d2)
  const fairValue = S.times(q.neg().times(T).exp())
    .times(Nd1)
    .minus(K.times(r.neg().times(T).exp()).times(Nd2));

  return fairValue.toNumber();
}

/**
 * Calculate option fair value using Monte Carlo simulation
 * Better for complex instruments with path-dependent features
 * 
 * @param inputs - Fair value inputs
 * @param simulations - Number of simulation paths (default: 10,000)
 * @returns Fair value per option
 */
export function calculateMonteCarlo(
  inputs: FairValueInputs,
  simulations: number = 10000
): number {
  logger.info('Calculating Monte Carlo fair value', { simulations });

  const S = inputs.stockPrice;
  const K = inputs.strikePrice;
  const r = inputs.riskFreeRate;
  const q = inputs.dividendYield;
  const T = inputs.timeToExpiration;
  const sigma = inputs.volatility;

  let totalPayoff = 0;

  // Run Monte Carlo simulations
  for (let i = 0; i < simulations; i++) {
    // Generate random stock price at maturity using geometric Brownian motion
    // ST = S * exp((r - q - σ²/2) * T + σ * √T * Z)
    const Z = randomStandardNormal();
    const drift = (r - q - Math.pow(sigma, 2) / 2) * T;
    const diffusion = sigma * Math.sqrt(T) * Z;
    const ST = S * Math.exp(drift + diffusion);

    // Payoff for call option: max(ST - K, 0)
    const payoff = Math.max(ST - K, 0);
    totalPayoff += payoff;
  }

  // Average payoff discounted to present value
  const fairValue = (totalPayoff / simulations) * Math.exp(-r * T);

  return fairValue;
}

/**
 * Calculate option fair value using Lattice (Binomial) model
 * Accounts for early exercise and complex vesting conditions
 * 
 * @param inputs - Fair value inputs
 * @param steps - Number of time steps (default: 100)
 * @returns Fair value per option
 */
export function calculateLattice(
  inputs: FairValueInputs,
  steps: number = 100
): number {
  logger.info('Calculating Lattice fair value', { steps });

  const S = inputs.stockPrice;
  const K = inputs.strikePrice;
  const r = inputs.riskFreeRate;
  const q = inputs.dividendYield;
  const T = inputs.timeToExpiration;
  const sigma = inputs.volatility;
  const earlyExerciseMultiple = inputs.earlyExerciseMultiple ?? 2.2; // Typically 2.0-2.5x

  const dt = T / steps; // Time step
  const u = Math.exp(sigma * Math.sqrt(dt)); // Up factor
  const d = 1 / u; // Down factor
  const p = (Math.exp((r - q) * dt) - d) / (u - d); // Risk-neutral probability

  // Build stock price tree
  const stockPrices: number[][] = [];
  for (let i = 0; i <= steps; i++) {
    stockPrices[i] = [];
    for (let j = 0; j <= i; j++) {
      stockPrices[i][j] = S * Math.pow(u, j) * Math.pow(d, i - j);
    }
  }

  // Calculate option values at maturity
  const optionValues: number[][] = [];
  for (let i = 0; i <= steps; i++) {
    optionValues[i] = [];
  }

  for (let j = 0; j <= steps; j++) {
    optionValues[steps][j] = Math.max(stockPrices[steps][j] - K, 0);
  }

  // Backward induction with early exercise
  for (let i = steps - 1; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      // Continuation value (hold option)
      const hold =
        Math.exp(-r * dt) *
        (p * optionValues[i + 1][j + 1] + (1 - p) * optionValues[i + 1][j]);

      // Early exercise value (if in-the-money and above threshold)
      const intrinsicValue = stockPrices[i][j] - K;
      const exercise =
        intrinsicValue > 0 &&
        stockPrices[i][j] >= K * earlyExerciseMultiple
          ? intrinsicValue
          : 0;

      // Take maximum of hold vs exercise
      optionValues[i][j] = Math.max(hold, exercise);
    }
  }

  return optionValues[0][0];
}

/**
 * Get applicable 409A fair market value for a grant date
 * 
 * @param companyId - Company ID
 * @param grantDate - Grant date
 * @returns 409A valuation record
 */
export async function get409AValuation(
  companyId: string,
  grantDate: Date
): Promise<Valuation409A> {
  logger.info('Getting 409A valuation', { companyId, grantDate });

  // TODO: Query database for most recent 409A valuation before grant date
  // const valuation = await crud.list('valuation_409a', {
  //   companyId,
  //   valuationDate_lte: grantDate,
  //   orderBy: { valuationDate: 'desc' },
  //   limit: 1,
  // });

  // Placeholder return
  const valuation: Valuation409A = {
    id: '409a-001',
    companyId,
    valuationDate: new Date(),
    fairMarketValue: 10.0,
    priorValuation: null,
    valuationFirm: 'Placeholder Valuation LLC',
    valuationReport: null,
    boardApprovalDate: new Date(),
    expirationDate: new Date(),
    notes: 'TODO: Fetch from database',
    createdAt: new Date(),
    updatedAt: new Date(),
    erpId: null,
  };

  logger.info('409A valuation retrieved', {
    valuationId: valuation.id,
    fmv: valuation.fairMarketValue,
  });

  return valuation;
}

/**
 * Record a new 409A valuation
 * 
 * @param companyId - Company ID
 * @param fairMarketValue - Fair market value per share
 * @param valuationDate - Date of valuation
 * @param valuationFirm - Valuation firm name
 * @returns Created valuation record
 */
export async function record409AValuation(
  companyId: string,
  fairMarketValue: number,
  valuationDate: Date,
  valuationFirm: string
): Promise<Valuation409A> {
  logger.info('Recording 409A valuation', {
    companyId,
    fairMarketValue,
    valuationDate,
  });

  if (fairMarketValue <= 0) {
    throw new Error('Fair market value must be positive');
  }

  // Calculate expiration (typically 12 months or until material event)
  const expirationDate = new Date(valuationDate);
  expirationDate.setFullYear(expirationDate.getFullYear() + 1);

  const valuation: Valuation409A = {
    id: generate409AId(),
    companyId,
    valuationDate,
    fairMarketValue,
    priorValuation: null, // TODO: Get previous valuation
    valuationFirm,
    valuationReport: null,
    boardApprovalDate: null, // TBD
    expirationDate,
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    erpId: null,
  };

  // TODO: Save to database
  // await crud.create('valuation_409a', valuation);

  logger.info('409A valuation recorded', { valuationId: valuation.id });

  return valuation;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Validate fair value calculation inputs
 */
function validateFairValueInputs(inputs: FairValueInputs): void {
  if (inputs.stockPrice <= 0) {
    throw new Error('Stock price must be positive');
  }

  if (inputs.strikePrice < 0) {
    throw new Error('Strike price cannot be negative');
  }

  if (inputs.volatility < 0 || inputs.volatility > 2) {
    throw new Error('Volatility must be between 0 and 2 (0% to 200%)');
  }

  if (inputs.riskFreeRate < 0 || inputs.riskFreeRate > 0.2) {
    throw new Error('Risk-free rate must be between 0 and 0.2 (0% to 20%)');
  }

  if (inputs.dividendYield < 0 || inputs.dividendYield > 0.5) {
    throw new Error('Dividend yield must be between 0 and 0.5 (0% to 50%)');
  }

  if (inputs.timeToExpiration <= 0) {
    throw new Error('Time to expiration must be positive');
  }
}

/**
 * Cumulative standard normal distribution function
 * Approximation using error function
 */
function cumulativeNormalDistribution(x: number): number {
  // Using complementary error function approximation
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const prob =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return x > 0 ? 1 - prob : prob;
}

/**
 * Generate random number from standard normal distribution
 * Using Box-Muller transform
 */
function randomStandardNormal(): number {
  const u1 = Math.random();
  const u2 = Math.random();

  // Box-Muller transform
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

  return z;
}

/**
 * Generate unique 409A valuation ID
 * TODO: Replace with proper ID generation from database
 */
function generate409AId(): string {
  return `409a-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}

