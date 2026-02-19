/**
 * ESLint Rule: no-db-transaction-outside-session
 * 
 * Enforces Gate SESSION-02: db.transaction() must only be called inside DbSession
 * 
 * Prevents calling db.transaction() or dbRo.transaction() directly.
 * All transactions must go through DbSession.rw() or DbSession.ro().
 * 
 * @type {import('eslint').Rule.RuleModule}
 */

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow db.transaction() calls outside DbSession',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      noDirectTransaction:
        'Direct db.transaction() is forbidden. Use DbSession.rw() instead.\n' +
        'The session automatically wraps your code in a transaction with auth context.\n' +
        'Example: await session.rw(tx => tx.insert(table).values(data));',
      noDirectRoTransaction:
        'Direct dbRo.transaction() is forbidden. Use DbSession.ro() instead.\n' +
        'The session automatically handles read routing and auth context.\n' +
        'Example: await session.ro(tx => tx.select().from(table));',
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();
    
    // Allowed paths where direct transactions are permitted
    const allowedPaths = [
      '/packages/database/src/db-session.ts', // Session implementation
      '/packages/database/src/auth-context.ts', // Auth context helpers
      '/packages/database/scripts/', // Admin scripts
      '/packages/database/src/__tests__/', // Tests
      '/tools/', // CLI tools
    ];
    
    // Check if current file is in an allowed path
    const isAllowedPath = allowedPaths.some(path => 
      filename.replace(/\\/g, '/').includes(path)
    );
    
    if (isAllowedPath) {
      return {}; // Skip validation for allowed paths
    }
    
    return {
      CallExpression(node) {
        // Check for db.transaction() calls
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'transaction'
        ) {
          const objectName = node.callee.object.name;
          
          // Check if calling on db or dbRo
          if (objectName === 'db') {
            context.report({
              node,
              messageId: 'noDirectTransaction',
            });
          }
          
          if (objectName === 'dbRo') {
            context.report({
              node,
              messageId: 'noDirectRoTransaction',
            });
          }
        }
      },
    };
  },
};
