/**
 * Stock-Based Compensation Package
 * 
 * Equity compensation management with ASC 718 / IFRS 2 compliance
 */

// Export types
export * from './types/common.js';

// Export services
export * from './services/fair-value-calculation.js';
export * from './services/grant-management.js';
export * from './services/vesting-schedules.js';

// Package metadata
export const PACKAGE_NAME = '@afenda/domain-stock-based-compensation';
export const PACKAGE_VERSION = '0.1.0';

