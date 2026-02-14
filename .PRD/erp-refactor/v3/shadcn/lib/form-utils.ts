// Shared form utilities
// Generated from Canon schema — do not edit manually

/**
 * Parse an ERPNext depends_on expression into a JS condition.
 *
 * Formats:
 *   "eval:doc.status == 'Active'"  → "formData.status === 'Active'"
 *   "status"                       → "!!formData.status"
 */
export function parseDependsOn(expr: string, dataVar = "formData"): string {
  let cleaned = expr.trim();
  if (cleaned.startsWith("eval:")) cleaned = cleaned.slice(5).trim();
  cleaned = cleaned.replace(/\bdoc\./g, `${dataVar}.`);
  cleaned = cleaned.replace(/==/g, "===");
  cleaned = cleaned.replace(/!=/g, "!==");
  cleaned = cleaned.replace(/\band\b/g, "&&");
  cleaned = cleaned.replace(/\bor\b/g, "||");
  cleaned = cleaned.replace(/\bnot\b/g, "!");
  if (new RegExp(`^${dataVar}\\.\\w+$`).test(cleaned)) return `!!${cleaned}`;
  if (/^\w+$/.test(cleaned)) return `!!${dataVar}.${cleaned}`;
  return cleaned;
}
