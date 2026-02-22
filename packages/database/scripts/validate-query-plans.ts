/**
 * Query Plan Validation Script
 * 
 * Validates query plans for hot path queries.
 * Enforces Gate PLAN-01: Query plan stability for hot paths.
 * 
 * Requires DATABASE_URL to connect and run EXPLAIN.
 * 
 * Usage:
 *   DATABASE_URL=... npx tsx scripts/validate-query-plans.ts
 */

import { Client } from 'pg';
import { validateQueryPlan, formatValidationResult, type QueryPlan } from '../src/query-plan/analyzer.js';
import { QUERY_SHAPES, getHotPathShapes } from '../src/observability/query-shapes.js';

interface QueryTestCase {
  shapeKey: string;
  shapeId: string;
  sql: string;
  params?: any[];
  description: string;
}

/**
 * Hot path query test cases
 * 
 * These are example queries for each hot path shape.
 * In production, these would be extracted from actual application code.
 */
const HOT_PATH_QUERIES: QueryTestCase[] = [
  {
    shapeKey: 'invoices.list',
    shapeId: 'Q.invoices.list.v1',
    sql: `
      SELECT * FROM invoices
      WHERE org_id = $1
      ORDER BY created_at DESC
      LIMIT $2
    `,
    params: ['550e8400-e29b-41d4-a716-446655440000', 100],
    description: 'List invoices for organization with pagination',
  },
  {
    shapeKey: 'invoices.getById',
    shapeId: 'Q.invoices.getById.v1',
    sql: `
      SELECT * FROM invoices
      WHERE org_id = $1 AND id = $2
    `,
    params: ['550e8400-e29b-41d4-a716-446655440000', '123e4567-e89b-12d3-a456-426614174000'],
    description: 'Get single invoice by ID',
  },
  {
    shapeKey: 'customers.list',
    shapeId: 'Q.customers.list.v1',
    sql: `
      SELECT * FROM customers
      WHERE org_id = $1
      ORDER BY name
      LIMIT $2
    `,
    params: ['550e8400-e29b-41d4-a716-446655440000', 100],
    description: 'List customers for organization',
  },
  {
    shapeKey: 'customers.search',
    shapeId: 'Q.customers.search.v1',
    sql: `
      SELECT * FROM customers
      WHERE org_id = $1
        AND (name ILIKE $2 OR email ILIKE $2)
      LIMIT $3
    `,
    params: ['550e8400-e29b-41d4-a716-446655440000', '%search%', 50],
    description: 'Search customers by name/email',
  },
  {
    shapeKey: 'products.list',
    shapeId: 'Q.products.list.v1',
    sql: `
      SELECT * FROM products
      WHERE org_id = $1
      ORDER BY name
      LIMIT $2
    `,
    params: ['550e8400-e29b-41d4-a716-446655440000', 100],
    description: 'List products for organization',
  },
];

/**
 * Get query plan from database
 */
async function getQueryPlan(
  client: Client,
  sql: string,
  params?: any[]
): Promise<QueryPlan> {
  const explainSql = `EXPLAIN (FORMAT JSON, ANALYZE) ${sql}`;
  const result = await client.query(explainSql, params);
  return result.rows[0]['QUERY PLAN'][0];
}

/**
 * Validate a single query
 */
async function validateQuery(
  client: Client,
  testCase: QueryTestCase
): Promise<{ testCase: QueryTestCase; valid: boolean; output: string }> {
  try {
    console.log(`\nValidating: ${testCase.shapeKey} (${testCase.shapeId})`);
    console.log(`Description: ${testCase.description}`);
    
    // Get query plan
    const plan = await getQueryPlan(client, testCase.sql, testCase.params);
    
    // Get shape metadata
    const shape = QUERY_SHAPES[testCase.shapeKey as keyof typeof QUERY_SHAPES];
    
    // Validate plan
    const result = validateQueryPlan(plan, {
      largeTableThreshold: 10000,
      requireTenantFilter: true,
      maxCost: shape.warnMs ? shape.warnMs * 10 : undefined, // Cost threshold based on time
    });
    
    const output = formatValidationResult(result);
    
    return {
      testCase,
      valid: result.valid,
      output,
    };
  } catch (error: any) {
    return {
      testCase,
      valid: false,
      output: `Error: ${error.message}`,
    };
  }
}

/**
 * Main validation function
 */
async function validateAllQueryPlans(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    console.error('   Set DATABASE_URL to your Neon database connection string');
    process.exit(1);
  }
  
  const client = new Client({ connectionString: databaseUrl });
  
  try {
    await client.connect();
    console.log('✅ Connected to database');
    
    // Get hot path shapes from registry
    const hotPathShapes = getHotPathShapes();
    console.log(`\n📊 Found ${hotPathShapes.length} hot path query shapes in registry`);
    console.log(`   Validating ${HOT_PATH_QUERIES.length} test queries\n`);
    
    const results: Array<{ testCase: QueryTestCase; valid: boolean; output: string }> = [];
    
    // Validate each query
    for (const testCase of HOT_PATH_QUERIES) {
      const result = await validateQuery(client, testCase);
      results.push(result);
      console.log(result.output);
    }
    
    // Summary
    console.log('\n' + '='.repeat(80));
    console.log('QUERY PLAN VALIDATION SUMMARY');
    console.log('='.repeat(80));
    
    const passed = results.filter(r => r.valid).length;
    const failed = results.filter(r => !r.valid).length;
    
    console.log(`\nTotal Queries: ${results.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${failed}`);
    
    if (failed > 0) {
      console.log('\n❌ Query plan validation FAILED');
      console.log('   Fix the issues above before deploying');
      process.exit(1);
    } else {
      console.log('\n✅ All query plans PASSED');
      console.log('   Hot path queries are optimized and stable');
    }
  } catch (error: any) {
    console.error('❌ Validation error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run validation
validateAllQueryPlans().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
