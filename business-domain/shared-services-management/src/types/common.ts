/**
 * Shared Services Management Types
 * 
 * Type definitions for shared services centers and cost allocation
 */

import { z } from 'zod';

// ── Enums ──────────────────────────────────────────────────────────

export enum AllocationMethod {
  HEADCOUNT = 'HEADCOUNT',
  REVENUE = 'REVENUE',
  SQUARE_FOOTAGE = 'SQUARE_FOOTAGE',
  USAGE_BASED = 'USAGE_BASED',
  EQUAL_SPLIT = 'EQUAL_SPLIT',
  CUSTOM = 'CUSTOM',
}

export enum ServiceCategory {
  IT = 'IT',
  HR = 'HR',
  FINANCE = 'FINANCE',
  LEGAL = 'LEGAL',
  FACILITIES = 'FACILITIES',
  PROCUREMENT = 'PROCUREMENT',
  MARKETING = 'MARKETING',
}

export enum AllocationStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  POSTED = 'POSTED',
  DISPUTED = 'DISPUTED',
}

// ── Schemas ────────────────────────────────────────────────────────

export const sharedServiceSchema = z.object({
  id: z.string().uuid(),
  orgId: z.string().uuid(),
  serviceName: z.string(),
  serviceCategory: z.nativeEnum(ServiceCategory),
  costCenter: z.string(),
  allocationMethod: z.nativeEnum(AllocationMethod),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const allocationRuleSchema = z.object({
  id: z.string().uuid(),
  serviceId: z.string().uuid(),
  recipientEntityId: z.string().uuid(),
  recipientEntityName: z.string(),
  allocationPercent: z.number().min(0).max(100).optional(),
  allocationDriver: z.number().optional(), // Headcount, revenue, etc.
  isActive: z.boolean().default(true),
});

export const costAllocationSchema = z.object({
  id: z.string().uuid(),
  serviceId: z.string().uuid(),
  serviceName: z.string(),
  period: z.string(), // YYYY-MM
  totalCost: z.number().positive(),
  status: z.nativeEnum(AllocationStatus),
  approvedBy: z.string().optional(),
  approvedDate: z.coerce.date().optional(),
  createdAt: z.coerce.date(),
});

export const allocationLineSchema = z.object({
  id: z.string().uuid(),
  allocationId: z.string().uuid(),
  recipientEntityId: z.string().uuid(),
  recipientEntityName: z.string(),
  allocatedAmount: z.number().positive(),
  allocationPercent: z.number().min(0).max(100),
  driver: z.string().optional(), // Description of allocation driver
});

// ── Types ──────────────────────────────────────────────────────────

export type SharedService = z.infer<typeof sharedServiceSchema>;
export type AllocationRule = z.infer<typeof allocationRuleSchema>;
export type CostAllocation = z.infer<typeof costAllocationSchema>;
export type AllocationLine = z.infer<typeof allocationLineSchema>;

export interface AllocationSummary {
  period: string;
  totalCostsAllocated: number;
  allocationCount: number;
  byService: Map<ServiceCategory, number>;
  byEntity: Map<string, {
    entityName: string;
    totalAllocated: number;
    allocationCount: number;
  }>;
}

export interface  ServiceCostReport {
  serviceId: string;
  serviceName: string;
  serviceCategory: ServiceCategory;
  totalCost: number;
  allocations: Array<{
    entityId: string;
    entityName: string;
    amount: number;
    percent: number;
  }>;
}
