/**
 * Glossary Types
 *
 * v1 is types-only. Functions for glossary management deferred to v2.
 * Glossary terms are stored in the database and linked to assets via TermLink.
 */

/**
 * Glossary term definition
 * Links a human-readable business term to metadata assets
 */
export interface GlossaryTerm {
  termId: string;
  name: string;
  definition: string;
  owner?: string;
  relatedTerms?: string[]; // other termIds
}

/**
 * Link between a glossary term and an asset
 * Associates business terminology with technical assets
 */
export interface TermLink {
  termId: string;
  assetKey: string;
  confidence: number; // 0.0–1.0, how certain is the link
}
