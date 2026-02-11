/**
 * Formatting utilities for enterprise UI — numbers, currencies, dates, file sizes.
 * Uses the `Intl` API for locale-aware formatting.
 */

/**
 * Formats a number with locale-aware grouping and decimal separators.
 *
 * @example
 * ```tsx
 * formatNumber(1234567.89);       // "1,234,567.89"
 * formatNumber(0.156, { style: "percent" }); // "16%"
 * ```
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions & { locale?: string },
): string {
  const { locale = 'en-US', ...formatOptions } = options ?? {};
  return new Intl.NumberFormat(locale, formatOptions).format(value);
}

/**
 * Formats a number as currency.
 *
 * @example
 * ```tsx
 * formatCurrency(1234.5);                    // "$1,234.50"
 * formatCurrency(1234.5, { currency: "EUR" }); // "€1,234.50"
 * ```
 */
export function formatCurrency(
  value: number,
  options?: { currency?: string; locale?: string } & Omit<
    Intl.NumberFormatOptions,
    'style' | 'currency'
  >,
): string {
  const { currency = 'USD', locale = 'en-US', ...rest } = options ?? {};
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...rest,
  }).format(value);
}

/**
 * Formats a number as a compact representation (e.g. 1.2K, 3.4M).
 *
 * @example
 * ```tsx
 * formatCompact(1234);    // "1.2K"
 * formatCompact(1234567); // "1.2M"
 * ```
 */
export function formatCompact(
  value: number,
  options?: { locale?: string; maximumFractionDigits?: number },
): string {
  const { locale = 'en-US', maximumFractionDigits = 1 } = options ?? {};
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits,
  }).format(value);
}

/**
 * Formats a Date as a relative time string (e.g. "2 hours ago", "in 3 days").
 *
 * @example
 * ```tsx
 * formatRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
 * ```
 */
export function formatRelativeTime(
  date: Date,
  options?: { locale?: string; now?: Date },
): string {
  const { locale = 'en-US', now = new Date() } = options ?? {};
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, 'hour');
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');
  if (Math.abs(diffDay) < 365)
    return rtf.format(Math.round(diffDay / 30), 'month');
  return rtf.format(Math.round(diffDay / 365), 'year');
}

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;

/**
 * Formats a byte count into a human-readable file size.
 *
 * @example
 * ```tsx
 * formatFileSize(1024);       // "1 KB"
 * formatFileSize(1536000);    // "1.46 MB"
 * ```
 */
export function formatFileSize(
  bytes: number,
  options?: { decimals?: number },
): string {
  const { decimals = 2 } = options ?? {};
  if (bytes === 0) return '0 B';

  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  return `${size.toFixed(decimals)} ${FILE_SIZE_UNITS[i] ?? 'B'}`;
}

/**
 * Truncates a string to a maximum length, appending an ellipsis if truncated.
 *
 * @example
 * ```tsx
 * truncate("Hello, World!", 8); // "Hello..."
 * ```
 */
export function truncate(
  str: string,
  maxLength: number,
  suffix = '...',
): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Generates initials from a full name (up to 2 characters).
 * Commonly used for avatar fallbacks.
 *
 * @example
 * ```tsx
 * getInitials("John Doe");     // "JD"
 * getInitials("Alice");        // "A"
 * getInitials("John van Doe"); // "JD"
 * ```
 */
export function getInitials(name: string, maxLength = 2): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .slice(0, maxLength)
    .join('');
}
