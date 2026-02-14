import { evaluateDsl } from '../dsl-evaluator';

import type { DslContext } from '../dsl-evaluator';
import type {
  StepResult,
  WebhookOutConfig,
  WorkflowNodeConfig,
  WorkflowStepContext,
} from '../types';
import type { WorkflowNodeHandler } from './types';

/**
 * webhook_out handler — fire HTTP POST to external system.
 *
 * PRD § WF-10: Enqueue-only handler.
 * Must NOT do direct HTTP in the TX. Writes to workflow_side_effects_outbox
 * and returns immediately. The IO worker processes them asynchronously.
 */
export const webhookOutHandler: WorkflowNodeHandler = {
  nodeType: 'webhook_out',

  async execute(ctx: WorkflowStepContext, _config: WorkflowNodeConfig): Promise<StepResult> {
    const config = _config as WebhookOutConfig;

    if (!config.url) {
      return {
        status: 'failed',
        error: `webhook_out node "${ctx.nodeId}" has no URL configured`,
      };
    }

    const dslCtx: DslContext = {
      entity: ctx.contextJson['entity'] as Record<string, unknown> ?? {},
      context: ctx.contextJson,
      actor: { user_id: ctx.actorUserId },
      tokens: {},
    };

    // Resolve URL from DSL expression
    const resolvedUrl = evaluateDsl(config.url, dslCtx);
    if (typeof resolvedUrl !== 'string') {
      return {
        status: 'failed',
        error: `webhook_out URL expression resolved to non-string: ${String(resolvedUrl)}`,
      };
    }

    // Resolve headers
    const resolvedHeaders: Record<string, string> = {};
    if (config.headers) {
      for (const [key, expr] of Object.entries(config.headers)) {
        const val = evaluateDsl(expr, dslCtx);
        resolvedHeaders[key] = String(val);
      }
    }

    // Resolve body template
    const resolvedBody: Record<string, unknown> = {
      entityType: ctx.entityType,
      entityId: ctx.entityId,
      entityVersion: ctx.entityVersion,
      instanceId: ctx.instanceId,
    };
    if (config.bodyTemplate) {
      for (const [key, expr] of Object.entries(config.bodyTemplate)) {
        resolvedBody[key] = evaluateDsl(expr, dslCtx);
      }
    }

    const payload: Record<string, unknown> = {
      url: resolvedUrl,
      method: config.method ?? 'POST',
      headers: resolvedHeaders,
      body: resolvedBody,
    };

    // Return as side effect — the engine writes to workflow_side_effects_outbox
    return {
      status: 'completed',
      output: {
        enqueued: true,
        url: resolvedUrl,
        method: config.method ?? 'POST',
      },
      sideEffects: [
        {
          effectType: 'webhook',
          payload,
        },
      ],
    };
  },
};
