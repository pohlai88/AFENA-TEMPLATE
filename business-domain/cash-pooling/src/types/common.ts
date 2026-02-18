/**
 * Cash Pooling Types
 * 
 * Type definitions for multi-entity cash concentration and pooling
 */

import { z } from 'zod';

// ── Enums ──────────────────────────────────────────────────────────

export enum PoolingStructure {
  NOTIONAL = 'NOTIONAL', // Virtual pooling, no physical movement
  PHYSICAL = 'PHYSICAL', // Actual cash sweeps
  ZERO_BALANCING = 'ZERO_BALANCING', // Sweep to zero daily
  TARGET_BALANCING = 'TARGET_BALANCING', // Maintain target balance
}

export enum ParticipantRole {
  HEADER_ACCOUNT = 'HEADER_ACCOUNT', // Master/pool leader
  PARTICIPANT = 'PARTICIPANT', // Sub-account
}

export enum SweepStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REVERSED = 'REVERSED',
}

// ── Schemas ────────────────────────────────────────────────────────

export const cashPoolSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  poolName: z.string(),
  poolingStructure: z.nativeEnum(PoolingStructure),
  headerAccountId: z.string().uuid(),
  currency: z.string().length(3), // ISO 4217
  interestRateBasis: z.number().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const poolParticipantSchema = z.object({
  id: z.string().uuid(),
  poolId: z.string().uuid(),
  legalEntityId: z.string().uuid(),
  legalEntityName: z.string(),
  accountNumber: z.string(),
  role: z.nativeEnum(ParticipantRole),
  targetBalance: z.number().min(0).optional(),
  minimumBalance: z.number().min(0).optional(),
  maximumBalance: z.number().positive().optional(),
  isActive: z.boolean().default(true),
  joinedDate: z.coerce.date(),
});

export const sweepTransactionSchema = z.object({
  id: z.string().uuid(),
  poolId: z.string().uuid(),
  fromParticipantId: z.string().uuid(),
  toParticipantId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  sweepDate: z.coerce.date(),
  valueDate: z.coerce.date(),
  status: z.nativeEnum(SweepStatus),
  interestCharge: z.number().optional(),
  notes: z.string().optional(),
  createdAt: z.coerce.date(),
});

export const interestCalculationSchema = z.object({
  id: z.string().uuid(),
  poolId: z.string().uuid(),
  participantId: z.string().uuid(),
  calculationDate: z.coerce.date(),
  averageBalance: z.number(),
  interestRate: z.number(),
  interestAmount: z.number(),
  daysInPeriod: z.number().int().positive(),
});

// ── Types ──────────────────────────────────────────────────────────

export type CashPool = z.infer<typeof cashPoolSchema>;
export type PoolParticipant = z.infer<typeof poolParticipantSchema>;
export type SweepTransaction = z.infer<typeof sweepTransactionSchema>;
export type InterestCalculation = z.infer<typeof interestCalculationSchema>;

export interface PoolBalance {
  poolId: string;
  poolName: string;
  asOfDate: Date;
  headerBalance: number;
  totalParticipantBalance: number;
  netPoolPosition: number;
  participants: Array<{
    participantId: string;
    entityName: string;
    currentBalance: number;
    targetBalance: number;
    variance: number;
  }>;
}

export interface SweepSummary {
  sweepDate: Date;
  totalSwept: number;
  transactionsCount: number;
  interestCharges: number;
  byParticipant: Map<string, {
    sweptIn: number;
    sweptOut: number;
    netPosition: number;
  }>;
}
