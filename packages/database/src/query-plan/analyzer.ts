/**
 * Query Plan Analyzer
 * 
 * Analyzes PostgreSQL query plans for performance issues.
 * Used by PLAN-01 gate to validate hot path queries.
 * 
 * Checks:
 * - No sequential scans on large tables
 * - Index usage on filtered columns
 * - Tenant isolation in WHERE clause
 * - Join strategy appropriateness
 * - Estimated row counts
 */

/**
 * Query plan node from EXPLAIN (FORMAT JSON)
 */
export interface PlanNode {
  'Node Type': string;
  'Relation Name'?: string;
  'Schema'?: string;
  'Alias'?: string;
  'Startup Cost': number;
  'Total Cost': number;
  'Plan Rows': number;
  'Plan Width': number;
  'Filter'?: string;
  'Index Cond'?: string;
  'Index Name'?: string;
  'Join Type'?: string;
  'Hash Cond'?: string;
  'Plans'?: PlanNode[];
  'Output'?: string[];
}

/**
 * Query plan from EXPLAIN
 */
export interface QueryPlan {
  Plan: PlanNode;
  'Planning Time': number;
  'Execution Time'?: number;
}

/**
 * Plan validation issue
 */
export interface PlanIssue {
  severity: 'error' | 'warning' | 'info';
  type: string;
  message: string;
  node?: PlanNode;
  suggestion?: string;
}

/**
 * Plan validation result
 */
export interface PlanValidationResult {
  valid: boolean;
  issues: PlanIssue[];
  metrics: {
    totalCost: number;
    estimatedRows: number;
    hasSeqScan: boolean;
    hasIndexScan: boolean;
    hasTenantFilter: boolean;
  };
}

/**
 * Check if node is a sequential scan
 */
function isSeqScan(node: PlanNode): boolean {
  return node['Node Type'] === 'Seq Scan';
}

/**
 * Check if node is an index scan
 */
function isIndexScan(node: PlanNode): boolean {
  return ['Index Scan', 'Index Only Scan', 'Bitmap Index Scan'].includes(node['Node Type']);
}

/**
 * Check if filter contains tenant isolation (org_id)
 */
function hasTenantFilter(filter?: string): boolean {
  if (!filter) return false;
  return /org_id\s*=|auth\.org_id\(\)/.test(filter);
}

/**
 * Extract table name from plan node
 */
function getTableName(node: PlanNode): string | null {
  return node['Relation Name'] || null;
}

/**
 * Recursively collect all nodes from plan tree
 */
function collectNodes(node: PlanNode): PlanNode[] {
  const nodes: PlanNode[] = [node];
  
  if (node.Plans) {
    for (const child of node.Plans) {
      nodes.push(...collectNodes(child));
    }
  }
  
  return nodes;
}

/**
 * Validate sequential scans
 */
function validateSeqScans(
  nodes: PlanNode[],
  largeTableThreshold: number = 10000
): PlanIssue[] {
  const issues: PlanIssue[] = [];
  
  for (const node of nodes) {
    if (isSeqScan(node)) {
      const tableName = getTableName(node);
      const estimatedRows = node['Plan Rows'];
      
      // Sequential scan on large table is a problem
      if (estimatedRows > largeTableThreshold) {
        issues.push({
          severity: 'error',
          type: 'seq_scan_large_table',
          message: `Sequential scan on large table: ${tableName} (${estimatedRows} rows)`,
          node,
          suggestion: `Add index on filtered columns or use LIMIT to reduce rows`,
        });
      } else if (estimatedRows > 1000) {
        issues.push({
          severity: 'warning',
          type: 'seq_scan_medium_table',
          message: `Sequential scan on medium table: ${tableName} (${estimatedRows} rows)`,
          node,
          suggestion: `Consider adding index if this is a hot path query`,
        });
      }
    }
  }
  
  return issues;
}

/**
 * Validate tenant isolation
 */
function validateTenantIsolation(nodes: PlanNode[]): PlanIssue[] {
  const issues: PlanIssue[] = [];
  
  for (const node of nodes) {
    const tableName = getTableName(node);
    
    // Skip system tables and non-tenant tables
    if (!tableName || tableName.startsWith('pg_')) {
      continue;
    }
    
    // Check if filter includes org_id
    const filter = node.Filter || node['Index Cond'];
    const hasTenant = hasTenantFilter(filter);
    
    if (!hasTenant && (isSeqScan(node) || isIndexScan(node))) {
      issues.push({
        severity: 'error',
        type: 'missing_tenant_filter',
        message: `Missing tenant isolation filter on table: ${tableName}`,
        node,
        suggestion: `Add WHERE org_id = auth.org_id() or equivalent filter`,
      });
    }
  }
  
  return issues;
}

/**
 * Validate index usage
 */
function validateIndexUsage(nodes: PlanNode[]): PlanIssue[] {
  const issues: PlanIssue[] = [];
  
  for (const node of nodes) {
    if (node.Filter && !isIndexScan(node)) {
      const tableName = getTableName(node);
      
      issues.push({
        severity: 'warning',
        type: 'filter_without_index',
        message: `Filter applied without index on table: ${tableName}`,
        node,
        suggestion: `Consider adding index on filtered columns: ${node.Filter}`,
      });
    }
  }
  
  return issues;
}

/**
 * Validate join strategies
 */
function validateJoins(nodes: PlanNode[]): PlanIssue[] {
  const issues: PlanIssue[] = [];
  
  for (const node of nodes) {
    if (node['Node Type'] === 'Nested Loop' && node['Plan Rows'] > 1000) {
      issues.push({
        severity: 'warning',
        type: 'nested_loop_large_result',
        message: `Nested loop join with large result set (${node['Plan Rows']} rows)`,
        node,
        suggestion: `Consider hash join or merge join for better performance`,
      });
    }
    
    if (node['Node Type'] === 'Hash Join' && !node['Hash Cond']) {
      issues.push({
        severity: 'error',
        type: 'hash_join_no_condition',
        message: `Hash join without condition (possible cartesian product)`,
        node,
        suggestion: `Add join condition to prevent cartesian product`,
      });
    }
  }
  
  return issues;
}

/**
 * Calculate plan metrics
 */
function calculateMetrics(plan: QueryPlan): PlanValidationResult['metrics'] {
  const nodes = collectNodes(plan.Plan);
  
  return {
    totalCost: plan.Plan['Total Cost'],
    estimatedRows: plan.Plan['Plan Rows'],
    hasSeqScan: nodes.some(isSeqScan),
    hasIndexScan: nodes.some(isIndexScan),
    hasTenantFilter: nodes.some(n => hasTenantFilter(n.Filter || n['Index Cond'])),
  };
}

/**
 * Validate query plan
 * 
 * @param plan - Query plan from EXPLAIN (FORMAT JSON)
 * @param options - Validation options
 * @returns Validation result with issues and metrics
 */
export function validateQueryPlan(
  plan: QueryPlan,
  options: {
    largeTableThreshold?: number;
    requireTenantFilter?: boolean;
    maxCost?: number;
  } = {}
): PlanValidationResult {
  const {
    largeTableThreshold = 10000,
    requireTenantFilter = true,
    maxCost,
  } = options;
  
  const nodes = collectNodes(plan.Plan);
  const issues: PlanIssue[] = [];
  
  // Validate sequential scans
  issues.push(...validateSeqScans(nodes, largeTableThreshold));
  
  // Validate tenant isolation
  if (requireTenantFilter) {
    issues.push(...validateTenantIsolation(nodes));
  }
  
  // Validate index usage
  issues.push(...validateIndexUsage(nodes));
  
  // Validate joins
  issues.push(...validateJoins(nodes));
  
  // Check total cost
  if (maxCost && plan.Plan['Total Cost'] > maxCost) {
    issues.push({
      severity: 'warning',
      type: 'high_cost',
      message: `Query cost (${plan.Plan['Total Cost'].toFixed(2)}) exceeds threshold (${maxCost})`,
      suggestion: `Optimize query or add indexes to reduce cost`,
    });
  }
  
  const metrics = calculateMetrics(plan);
  const errors = issues.filter(i => i.severity === 'error');
  
  return {
    valid: errors.length === 0,
    issues,
    metrics,
  };
}

/**
 * Format plan validation result for display
 */
export function formatValidationResult(result: PlanValidationResult): string {
  const lines: string[] = [];
  
  lines.push('Query Plan Validation Result:');
  lines.push('');
  
  // Metrics
  lines.push('Metrics:');
  lines.push(`  Total Cost: ${result.metrics.totalCost.toFixed(2)}`);
  lines.push(`  Estimated Rows: ${result.metrics.estimatedRows}`);
  lines.push(`  Has Seq Scan: ${result.metrics.hasSeqScan ? 'Yes' : 'No'}`);
  lines.push(`  Has Index Scan: ${result.metrics.hasIndexScan ? 'Yes' : 'No'}`);
  lines.push(`  Has Tenant Filter: ${result.metrics.hasTenantFilter ? 'Yes' : 'No'}`);
  lines.push('');
  
  // Issues
  if (result.issues.length === 0) {
    lines.push('✅ No issues found');
  } else {
    const errors = result.issues.filter(i => i.severity === 'error');
    const warnings = result.issues.filter(i => i.severity === 'warning');
    
    if (errors.length > 0) {
      lines.push(`❌ Errors (${errors.length}):`);
      for (const issue of errors) {
        lines.push(`  - ${issue.message}`);
        if (issue.suggestion) {
          lines.push(`    Suggestion: ${issue.suggestion}`);
        }
      }
      lines.push('');
    }
    
    if (warnings.length > 0) {
      lines.push(`⚠️  Warnings (${warnings.length}):`);
      for (const issue of warnings) {
        lines.push(`  - ${issue.message}`);
        if (issue.suggestion) {
          lines.push(`    Suggestion: ${issue.suggestion}`);
        }
      }
    }
  }
  
  return lines.join('\n');
}
