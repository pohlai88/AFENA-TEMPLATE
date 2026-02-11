/**
 * Explanation template version constants.
 * When templates change, bump the version. Old advisories keep their
 * original explain_version so explanations are reproducible.
 */
export const EXPLAIN_VERSION = 'v1' as const;

export type ExplainVersion = typeof EXPLAIN_VERSION;
