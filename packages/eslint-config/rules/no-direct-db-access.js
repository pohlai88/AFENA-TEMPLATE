/**
 * ESLint Rule: no-direct-db-access
 * 
 * Enforces Gate SESSION-01: All database access must go through DbSession
 * 
 * Prevents direct imports of db/dbRo from afenda-database outside allowed paths.
 * 
 * Allowed paths:
 * - packages/database/src/db-session.ts (session implementation)
 * - packages/database/src/ddl/* (DDL helpers)
 * - packages/database/scripts/* (admin scripts)
 * - packages/workers/* (projection rebuilders with BYPASSRLS)
 * 
 * @type {import('eslint').Rule.RuleModule}
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow direct database access outside DbSession',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noDirectDbAccess:
        'Direct database access is forbidden. Use createDbSession() instead.\n' +
        'Import: import { createDbSession } from \'afenda-database\';\n' +
        'Usage: const session = createDbSession({ orgId, userId });\n' +
        '       await session.rw(tx => tx.insert(table).values(data));',
      noDirectDbRoAccess:
        'Direct dbRo access is forbidden. Use createDbSession() instead.\n' +
        'The session automatically routes reads to replica or primary based on writes.',
      noDrizzleOperators:
        'Import Drizzle operators from \'drizzle-orm\' directly, not from afenda-database.\n' +
        'Import: import { eq, and, or } from \'drizzle-orm\';',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Allowed paths (use forward slashes for cross-platform compatibility)
    const allowedPaths = [
      '/packages/database/src/db-session.ts',
      '/packages/database/src/db.ts',
      '/packages/database/src/ddl/',
      '/packages/database/scripts/',
      '/packages/crud/',    // Kernel — allowed to use db directly (K-01)
      '/packages/search/',  // Read-only queries via db.select()
      '/packages/workers/', // Projection rebuilders with BYPASSRLS
      '/tools/',            // CLI tools
    ];

    // Check if current file is in an allowed path
    const isAllowedPath = allowedPaths.some(path =>
      filename.replace(/\\/g, '/').includes(path)
    );

    if (isAllowedPath) {
      return {}; // Skip validation for allowed paths
    }

    return {
      ImportDeclaration(node) {
        // Check if importing from afenda-database
        if (node.source.value !== 'afenda-database') {
          return;
        }

        // Check each imported specifier
        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportSpecifier') {
            const importedName = specifier.imported.name;

            // Check for direct db/dbRo imports
            if (importedName === 'db') {
              context.report({
                node: specifier,
                messageId: 'noDirectDbAccess',
              });
            }

            if (importedName === 'dbRo') {
              context.report({
                node: specifier,
                messageId: 'noDirectDbRoAccess',
              });
            }

            // Check for Drizzle operator imports (should use drizzle-orm directly)
            const drizzleOperators = ['eq', 'and', 'or', 'sql', 'desc', 'asc', 'like', 'ilike', 'inArray', 'notInArray', 'isNull', 'isNotNull'];
            if (drizzleOperators.includes(importedName)) {
              context.report({
                node: specifier,
                messageId: 'noDrizzleOperators',
              });
            }
          }
        }
      },
    };
  },
};
