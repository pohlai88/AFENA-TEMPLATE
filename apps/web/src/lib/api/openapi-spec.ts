import { ENTITY_TYPES } from 'afena-canon';

import { toOpenApiPath } from './route-types';

import type { RouteFileEntry } from './route-types';

/**
 * Generate OpenAPI 3.1 spec from manifest (SSOT).
 * For contract entries, ensures every path+method is in the spec.
 * Falls back to ENTITY_TYPES for entity paths (legacy); manifest drives validation.
 */
export function generateOpenApiFromManifest(manifest: RouteFileEntry[]) {
  const spec = generateOpenApiSpec();
  const paths = spec.paths as Record<string, Record<string, unknown>>;

  const errorResponse = {
    description: 'Error response',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  };

  for (const e of manifest) {
    if (e.tier !== 'contract' || !e.exposeInOpenApi) continue;

    const openApiPath = toOpenApiPath(e.path);
    paths[openApiPath] ??= {};

    for (const m of e.methods) {
      const methodKey = m.toLowerCase();
      paths[openApiPath][methodKey] ??= {
        summary: `${m} ${e.path}`,
        tags: [e.kind === 'webhook' ? 'Webhooks' : 'Entities'],
        responses: { '200': { description: 'Success' }, '401': errorResponse },
      };
    }
  }

  return spec;
}

/**
 * Generate OpenAPI 3.1 spec from ENTITY_TYPES registry.
 * Auto-derives all CRUD endpoints for every registered entity.
 */
export function generateOpenApiSpec() {
  const entityEnum = [...ENTITY_TYPES];

  const paths: Record<string, unknown> = {};

  // Standard error response
  const errorResponse = {
    description: 'Error response',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
      },
    },
  };

  const successResponse = (description: string, dataSchema?: Record<string, unknown>) => ({
    description,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', enum: [true] },
            data: dataSchema ?? { type: 'object' },
            meta: { $ref: '#/components/schemas/ResponseMeta' },
          },
          required: ['ok', 'meta'],
        },
      },
    },
  });

  // Collection: GET + POST /api/entities/{entityType}
  paths['/api/entities/{entityType}'] = {
    get: {
      summary: 'List entities',
      operationId: 'listEntities',
      tags: ['Entities'],
      parameters: [
        { name: 'entityType', in: 'path', required: true, schema: { type: 'string', enum: entityEnum } },
        { name: 'limit', in: 'query', schema: { type: 'integer', default: 50, maximum: 200 } },
        { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
        { name: 'includeDeleted', in: 'query', schema: { type: 'boolean', default: false } },
      ],
      responses: {
        '200': successResponse('List of entities', { type: 'array', items: { type: 'object' } }),
        '401': errorResponse,
        '404': errorResponse,
      },
    },
    post: {
      summary: 'Create entity',
      operationId: 'createEntity',
      tags: ['Entities'],
      parameters: [
        { name: 'entityType', in: 'path', required: true, schema: { type: 'string', enum: entityEnum } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { type: 'object', description: 'Entity-specific input fields' },
          },
        },
      },
      responses: {
        '200': successResponse('Created entity'),
        '400': errorResponse,
        '401': errorResponse,
      },
    },
  };

  // Item: GET + PATCH + DELETE /api/entities/{entityType}/{id}
  paths['/api/entities/{entityType}/{id}'] = {
    get: {
      summary: 'Read entity by ID',
      operationId: 'readEntity',
      tags: ['Entities'],
      parameters: [
        { name: 'entityType', in: 'path', required: true, schema: { type: 'string', enum: entityEnum } },
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': successResponse('Entity data'),
        '401': errorResponse,
        '404': errorResponse,
      },
    },
    patch: {
      summary: 'Update entity',
      operationId: 'updateEntity',
      tags: ['Entities'],
      parameters: [
        { name: 'entityType', in: 'path', required: true, schema: { type: 'string', enum: entityEnum } },
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                expectedVersion: { type: 'integer', description: 'Optimistic lock version (K-04)' },
                input: { type: 'object', description: 'Fields to update' },
              },
              required: ['expectedVersion'],
            },
          },
        },
      },
      responses: {
        '200': successResponse('Updated entity'),
        '400': errorResponse,
        '401': errorResponse,
        '404': errorResponse,
        '409': { description: 'Version conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
    delete: {
      summary: 'Soft-delete entity',
      operationId: 'deleteEntity',
      tags: ['Entities'],
      parameters: [
        { name: 'entityType', in: 'path', required: true, schema: { type: 'string', enum: entityEnum } },
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        { name: 'expectedVersion', in: 'query', required: true, schema: { type: 'integer' } },
      ],
      responses: {
        '200': successResponse('Deleted entity'),
        '400': errorResponse,
        '401': errorResponse,
        '409': { description: 'Version conflict', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
      },
    },
  };

  // Restore: POST /api/entities/{entityType}/{id}/restore
  paths['/api/entities/{entityType}/{id}/restore'] = {
    post: {
      summary: 'Restore soft-deleted entity',
      operationId: 'restoreEntity',
      tags: ['Entities'],
      parameters: [
        { name: 'entityType', in: 'path', required: true, schema: { type: 'string', enum: entityEnum } },
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: { expectedVersion: { type: 'integer' } },
              required: ['expectedVersion'],
            },
          },
        },
      },
      responses: {
        '200': successResponse('Restored entity'),
        '400': errorResponse,
        '401': errorResponse,
      },
    },
  };

  // Versions: GET /api/entities/{entityType}/{id}/versions
  paths['/api/entities/{entityType}/{id}/versions'] = {
    get: {
      summary: 'Entity version history',
      operationId: 'getEntityVersions',
      tags: ['History'],
      parameters: [
        { name: 'entityType', in: 'path', required: true, schema: { type: 'string', enum: entityEnum } },
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': successResponse('Version history', { type: 'array', items: { $ref: '#/components/schemas/EntityVersion' } }),
        '401': errorResponse,
      },
    },
  };

  // Audit: GET /api/entities/{entityType}/{id}/audit
  paths['/api/entities/{entityType}/{id}/audit'] = {
    get: {
      summary: 'Entity audit trail',
      operationId: 'getEntityAuditLogs',
      tags: ['History'],
      parameters: [
        { name: 'entityType', in: 'path', required: true, schema: { type: 'string', enum: entityEnum } },
        { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
      ],
      responses: {
        '200': successResponse('Audit log entries', { type: 'array', items: { $ref: '#/components/schemas/AuditLogEntry' } }),
        '401': errorResponse,
      },
    },
  };

  return {
    openapi: '3.1.0',
    info: {
      title: 'Afena ERP API',
      version: '1.0.0',
      description: 'Auto-generated REST API for all registered entity types. Authentication required via session cookie.',
    },
    servers: [
      { url: '/', description: 'Current server' },
    ],
    paths,
    components: {
      schemas: {
        ResponseMeta: {
          type: 'object',
          properties: {
            requestId: { type: 'string', format: 'uuid' },
          },
          required: ['requestId'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            ok: { type: 'boolean', enum: [false] },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
              },
              required: ['code', 'message'],
            },
            meta: { $ref: '#/components/schemas/ResponseMeta' },
          },
          required: ['ok', 'error', 'meta'],
        },
        EntityVersion: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            entityType: { type: 'string' },
            entityId: { type: 'string', format: 'uuid' },
            version: { type: 'integer' },
            snapshot: { type: 'object' },
            patch: { type: 'array', items: { type: 'object' } },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        AuditLogEntry: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            entityType: { type: 'string' },
            entityId: { type: 'string', format: 'uuid' },
            actionType: { type: 'string' },
            actorId: { type: 'string' },
            actorName: { type: 'string', nullable: true },
            snapshot: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      securitySchemes: {
        session: {
          type: 'apiKey',
          in: 'cookie',
          name: 'neon-auth-session',
          description: 'Neon Auth session cookie',
        },
      },
    },
    security: [{ session: [] }],
  };
}
