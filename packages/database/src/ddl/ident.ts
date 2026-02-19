/**
 * Safe SQL Identifier Quoting
 * 
 * Provides safe identifier quoting for DDL operations.
 * Prevents SQL injection in dynamic DDL statements.
 * 
 * CRITICAL: Only use for DDL operations in migrations.
 * Never use for runtime queries (use parameterized queries instead).
 */

/**
 * Quote a SQL identifier (table name, column name, etc.)
 * 
 * Escapes double quotes and wraps in double quotes for PostgreSQL.
 * Validates identifier to prevent injection.
 * 
 * @param identifier - Table name, column name, or other identifier
 * @returns Safely quoted identifier
 * @throws Error if identifier contains invalid characters
 * 
 * @example
 * ```typescript
 * qIdent('users') // "users"
 * qIdent('my-table') // "my-table"
 * qIdent('table"name') // "table""name" (escaped)
 * ```
 */
export function qIdent(identifier: string): string {
  // Validate identifier
  if (!identifier || typeof identifier !== 'string') {
    throw new Error('Identifier must be a non-empty string');
  }
  
  // Check for null bytes (security)
  if (identifier.includes('\0')) {
    throw new Error('Identifier cannot contain null bytes');
  }
  
  // PostgreSQL identifier rules:
  // - Max 63 bytes
  // - Can contain letters, digits, underscores, hyphens
  // - Must start with letter or underscore
  if (identifier.length > 63) {
    throw new Error(`Identifier too long (max 63 chars): "${identifier}"`);
  }
  
  // Escape double quotes by doubling them
  const escaped = identifier.replace(/"/g, '""');
  
  // Wrap in double quotes
  return `"${escaped}"`;
}

/**
 * Quote a schema-qualified identifier
 * 
 * @param schema - Schema name
 * @param identifier - Table/function name
 * @returns Safely quoted schema.identifier
 * 
 * @example
 * ```typescript
 * qSchemaIdent('public', 'users') // "public"."users"
 * qSchemaIdent('auth', 'set_context') // "auth"."set_context"
 * ```
 */
export function qSchemaIdent(schema: string, identifier: string): string {
  return `${qIdent(schema)}.${qIdent(identifier)}`;
}

/**
 * Quote multiple identifiers
 * 
 * @param identifiers - Array of identifiers
 * @returns Array of quoted identifiers
 * 
 * @example
 * ```typescript
 * qIdents(['id', 'org_id', 'name']) // ['"id"', '"org_id"', '"name"']
 * ```
 */
export function qIdents(identifiers: string[]): string[] {
  return identifiers.map(qIdent);
}

/**
 * Build a column list for DDL
 * 
 * @param columns - Array of column names
 * @returns Comma-separated quoted column list
 * 
 * @example
 * ```typescript
 * columnList(['id', 'name', 'email']) // "id", "name", "email"
 * ```
 */
export function columnList(columns: string[]): string {
  return qIdents(columns).join(', ');
}

/**
 * Validate identifier against PostgreSQL rules
 * 
 * @param identifier - Identifier to validate
 * @returns True if valid, false otherwise
 */
export function isValidIdentifier(identifier: string): boolean {
  if (!identifier || typeof identifier !== 'string') {
    return false;
  }
  
  // Check length
  if (identifier.length === 0 || identifier.length > 63) {
    return false;
  }
  
  // Check for null bytes
  if (identifier.includes('\0')) {
    return false;
  }
  
  // PostgreSQL allows letters, digits, underscores, hyphens
  // Must start with letter or underscore (when unquoted)
  // When quoted, more characters are allowed
  const validPattern = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
  return validPattern.test(identifier);
}

/**
 * Sanitize identifier for safe usage
 * 
 * Converts to lowercase, replaces spaces with underscores,
 * removes invalid characters.
 * 
 * @param identifier - Raw identifier
 * @returns Sanitized identifier
 * 
 * @example
 * ```typescript
 * sanitizeIdent('My Table Name') // 'my_table_name'
 * sanitizeIdent('user@email') // 'useremail'
 * ```
 */
export function sanitizeIdent(identifier: string): string {
  return identifier
    .toLowerCase()
    .replace(/\s+/g, '_') // Spaces to underscores
    .replace(/[^a-z0-9_-]/g, '') // Remove invalid chars
    .replace(/^[0-9]/, '_$&') // Prefix digit with underscore
    .slice(0, 63); // Truncate to max length
}
