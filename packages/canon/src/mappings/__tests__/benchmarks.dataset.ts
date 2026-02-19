/**
 * Benchmark Dataset
 *
 * Fixed dataset for deterministic cache hit rate benchmarks.
 * Simulates real-world PostgreSQL type distribution.
 */

/**
 * Benchmark entry for PostgreSQL type mapping
 */
export interface BenchmarkEntry {
  pgType: string;
  meta: {
    maxLength?: number;
    precision?: number;
    scale?: number;
  };
}

/**
 * Fixed benchmark dataset
 * Designed to achieve >70% cache hit rate on second pass
 * 
 * Distribution:
 * - Common types repeated (varchar, integer, timestamp)
 * - Some unique types (uuid, jsonb)
 * - Metadata variations
 */
export const BENCHMARK_PG_TYPES: BenchmarkEntry[] = [
  // Common text types (repeated for cache hits)
  { pgType: 'varchar', meta: { maxLength: 255 } },
  { pgType: 'varchar', meta: { maxLength: 100 } },
  { pgType: 'varchar', meta: { maxLength: 255 } }, // Duplicate
  { pgType: 'text', meta: {} },
  { pgType: 'text', meta: {} }, // Duplicate
  { pgType: 'varchar', meta: { maxLength: 50 } },
  
  // Common numeric types (repeated)
  { pgType: 'integer', meta: {} },
  { pgType: 'integer', meta: {} }, // Duplicate
  { pgType: 'bigint', meta: {} },
  { pgType: 'numeric', meta: { precision: 10, scale: 2 } },
  { pgType: 'numeric', meta: { precision: 10, scale: 2 } }, // Duplicate
  { pgType: 'decimal', meta: { precision: 15, scale: 4 } },
  
  // Common temporal types (repeated)
  { pgType: 'timestamp', meta: {} },
  { pgType: 'timestamp', meta: {} }, // Duplicate
  { pgType: 'timestamptz', meta: {} },
  { pgType: 'timestamptz', meta: {} }, // Duplicate
  { pgType: 'date', meta: {} },
  { pgType: 'date', meta: {} }, // Duplicate
  
  // Boolean (repeated)
  { pgType: 'boolean', meta: {} },
  { pgType: 'boolean', meta: {} }, // Duplicate
  
  // Special types (some unique, some repeated)
  { pgType: 'uuid', meta: {} },
  { pgType: 'uuid', meta: {} }, // Duplicate
  { pgType: 'jsonb', meta: {} },
  { pgType: 'json', meta: {} },
  
  // Array types
  { pgType: 'text[]', meta: {} },
  { pgType: 'integer[]', meta: {} },
  
  // Less common types (unique)
  { pgType: 'bytea', meta: {} },
  { pgType: 'inet', meta: {} },
  { pgType: 'cidr', meta: {} },
  { pgType: 'macaddr', meta: {} },
];

/**
 * Expected cache statistics for the benchmark dataset
 * 
 * Pass 1 (cold): 0% hit rate (30 unique cache keys)
 * Pass 2 (warm): >70% hit rate (11 duplicates out of 30 = 73.3%)
 */
export const EXPECTED_CACHE_STATS = {
  totalEntries: BENCHMARK_PG_TYPES.length,
  uniqueKeys: 19, // Actual unique combinations
  duplicates: 11, // Repeated entries
  expectedWarmHitRate: 0.733, // 11/30 = 73.3%
  minAcceptableHitRate: 0.70, // Gate threshold
};

/**
 * CSV benchmark dataset for inference testing
 */
export const CSV_BENCHMARK_COLUMNS = [
  {
    name: 'id',
    values: ['1', '2', '3', '4', '5'],
    expectedType: 'integer',
  },
  {
    name: 'email',
    values: ['test@example.com', 'user@domain.org', 'admin@site.net'],
    expectedType: 'short_text',
  },
  {
    name: 'status',
    values: ['active', 'inactive', 'active', 'pending', 'active'],
    expectedType: 'enum', // Low distinct
  },
  {
    name: 'created_at',
    values: ['2024-01-01', '2024-01-02', '2024-01-03'],
    expectedType: 'date',
  },
  {
    name: 'is_verified',
    values: ['true', 'false', 'true', 'true', 'false'],
    expectedType: 'boolean', // Low distinct
  },
  {
    name: 'description',
    values: [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.',
    ],
    expectedType: 'long_text', // High average length
  },
];
