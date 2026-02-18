/**
 * Section Management Service
 * 
 * Manage SEC filing sections and narrative disclosure
 */

import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import type { SectionContent } from '../types/common.js';
import { SECSection, sectionContentSchema } from '../types/common.js';

// ── Schemas ────────────────────────────────────────────────────────

export const createSectionSchema = sectionContentSchema.omit({ id: true, version: true });

export const updateSectionSchema = sectionContentSchema.partial().omit({ id: true, filingId: true, section: true });

// ── Types ──────────────────────────────────────────────────────────

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;

// ── Functions ──────────────────────────────────────────────────────

/**
 * Create or update section content
 */
export async function upsertSectionContent(
  db: NeonHttpDatabase,
  orgId: string,
  input: CreateSectionInput,
): Promise<SectionContent> {
  const validated = createSectionSchema.parse(input);

  // TODO: Implement database logic
  // 1. Check if section exists for filing
  // 2. If exists, increment version and update
  // 3. If not, create new section
  // 4. Return section

  throw new Error('Not implemented');
}

/**
 * Get section content
 */
export async function getSectionContent(
  db: NeonHttpDatabase,
  orgId: string,
  filingId: string,
  section: SECSection,
): Promise<SectionContent | null> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get all sections for a filing
 */
export async function getAllSections(
  db: NeonHttpDatabase,
  orgId: string,
  filingId: string,
): Promise<SectionContent[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get section version history
 */
export async function getSectionHistory(
  db: NeonHttpDatabase,
  orgId: string,
  filingId: string,
  section: SECSection,
): Promise<SectionContent[]> {
  // TODO: Implement database query

  throw new Error('Not implemented');
}

/**
 * Get MD&A template
 */
export function getMDATemplate(): string {
  return `# Management's Discussion and Analysis of Financial Condition and Results of Operations

## Overview
[Provide overview of business, strategy, and key developments during the period]

## Results of Operations
[Discuss operating results including:]
- Revenue analysis
- Cost structure and gross margins
- Operating expenses
- Income/loss from operations
- Other income/expense
- Net income/loss

## Liquidity and Capital Resources
[Discuss cash position, cash flows, and capital resources:]
- Cash and cash equivalents
- Operating activities
- Investing activities
- Financing activities
- Debt and credit facilities
- Capital expenditures

## Critical Accounting Policies and Estimates
[Describe critical accounting policies and estimates]

## Recent Accounting Pronouncements
[Discuss new accounting standards and their impact]

## Forward-Looking Statements
[Include safe harbor statement for forward-looking statements]
`;
}

/**
 * Get Risk Factors template
 */
export function getRiskFactorsTemplate(): string {
  return `# Risk Factors

An investment in our securities involves a high degree of risk. You should carefully consider the risks and uncertainties described below, together with all of the other information contained in this report, before making a decision to invest in our securities.

## Risks Related to Our Business and Industry

### [Risk Category 1: Business Operations]
- [Specific risk 1]
- [Specific risk 2]

### [Risk Category 2: Market and Competition]
- [Specific risk 1]
- [Specific risk 2]

### [Risk Category 3: Regulatory and Compliance]
- [Specific risk 1]
- [Specific risk 2]

## Risks Related to Our Financial Condition

### [Risk Category: Financial Performance]
- [Specific risk 1]
- [Specific risk 2]

## Risks Related to Ownership of Our Securities

### [Risk Category: Stock Price and Trading]
- [Specific risk 1]
- [Specific risk 2]

## General Risks
- [General macro risks]
`;
}

/**
 * Get Business Description template
 */
export function getBusinessDescriptionTemplate(): string {
  return `# Business

## Overview
[Provide overview of the company, its history, and evolution]

## Our Products and Services
[Describe products, services, and revenue streams]

## Our Market
[Describe target markets, customers, and market opportunity]

## Our Competitive Strengths
[Describe competitive advantages and differentiation]

## Our Growth Strategy
[Outline strategic priorities and growth initiatives]

## Competition
[Describe competitive landscape and key competitors]

## Intellectual Property
[Describe patents, trademarks, and other IP]

## Employees and Human Capital
[Describe workforce, culture, and human capital management]

## Facilities
[Describe principal facilities and locations]

## Legal Proceedings
[Describe material legal proceedings]

## Available Information
[Company website and investor relations information]
`;
}

/**
 * Validate section completeness
 */
export function validateSectionCompleteness(section: SectionContent): {
  isComplete: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check minimum word count
  const wordCount = countWords(section.content);
  if (wordCount < 100) {
    issues.push(`Section is too short (${wordCount} words). Minimum 100 words required.`);
  }

  // Check for placeholder text
  if (section.content.includes('[TODO]') || section.content.includes('[TBD]')) {
    issues.push('Section contains placeholder text that must be completed.');
  }

  // Check for required sections based on type
  if (section.section === SECSection.MD_AND_A) {
    const required = ['Results of Operations', 'Liquidity', 'Capital Resources'];
    for (const req of required) {
      if (!section.content.includes(req)) {
        issues.push(`MD&A missing required subsection: ${req}`);
      }
    }
  }

  return {
    isComplete: issues.length === 0,
    issues,
  };
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  const cleaned = text.replace(/[#*_`]/g, ''); // Remove markdown formatting
  const words = cleaned.trim().split(/\s+/);
  return words.filter(word => word.length > 0).length;
}

/**
 * Extract metrics from MD&A
 */
export function extractMetrics(mdaContent: string): {
  revenue?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netIncome?: number;
  cash?: number;
} {
  const metrics: Record<string, number> = {};

  // Simple regex patterns for common metrics (in production, use NLP)
  const patterns = {
    revenue: /revenue.*?\$?([\d,.]+)\s*(million|billion)?/gi,
    grossMargin: /gross\s+margin.*?([\d.]+)%/gi,
    operatingMargin: /operating\s+margin.*?([\d.]+)%/gi,
    netIncome: /net\s+income.*?\$?([\d,.]+)\s*(million|billion)?/gi,
    cash: /cash\s+and\s+cash\s+equivalents.*?\$?([\d,.]+)\s*(million|billion)?/gi,
  };

  for (const [key, pattern] of Object.entries(patterns)) {
    const match = pattern.exec(mdaContent);
    if (match) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      const multiplier = match[2]?.toLowerCase() === 'billion' ? 1000 : match[2]?.toLowerCase() === 'million' ? 1 : 1;
      metrics[key] = value * multiplier;
    }
  }

  return metrics;
}

