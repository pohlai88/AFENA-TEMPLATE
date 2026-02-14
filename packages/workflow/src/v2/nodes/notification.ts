import { evaluateDsl } from '../dsl-evaluator';

import type { DslContext } from '../dsl-evaluator';
import type {
  NotificationConfig,
  StepResult,
  WorkflowNodeConfig,
  WorkflowStepContext,
} from '../types';
import type { WorkflowNodeHandler } from './types';

/**
 * notification handler — send email/SMS/in-app notification.
 *
 * PRD § WF-10: Enqueue-only handler.
 * Must NOT do direct SMTP/push in the TX. Writes to workflow_side_effects_outbox
 * and returns immediately. The IO worker processes them asynchronously.
 */
export const notificationHandler: WorkflowNodeHandler = {
  nodeType: 'notification',

  async execute(ctx: WorkflowStepContext, _config: WorkflowNodeConfig): Promise<StepResult> {
    const config = _config as NotificationConfig;

    if (!config.channel) {
      return {
        status: 'failed',
        error: `notification node "${ctx.nodeId}" has no channel configured`,
      };
    }

    const dslCtx: DslContext = {
      entity: ctx.contextJson['entity'] as Record<string, unknown> ?? {},
      context: ctx.contextJson,
      actor: { user_id: ctx.actorUserId },
      tokens: {},
    };

    // Resolve recipients from DSL expression
    const resolvedRecipients = evaluateDsl(config.recipientTemplate, dslCtx);
    const recipientList: string[] = Array.isArray(resolvedRecipients)
      ? resolvedRecipients.filter((r): r is string => typeof r === 'string')
      : typeof resolvedRecipients === 'string'
        ? [resolvedRecipients]
        : [];

    // Resolve subject + body
    const resolvedSubject = config.subjectTemplate
      ? String(evaluateDsl(config.subjectTemplate, dslCtx))
      : null;
    const resolvedBody = String(evaluateDsl(config.bodyTemplate, dslCtx));

    const payload: Record<string, unknown> = {
      channel: config.channel,
      recipients: recipientList,
      subject: resolvedSubject,
      body: resolvedBody,
      context: {
        entityType: ctx.entityType,
        entityId: ctx.entityId,
        entityVersion: ctx.entityVersion,
        instanceId: ctx.instanceId,
        nodeId: ctx.nodeId,
      },
    };

    return {
      status: 'completed',
      output: {
        enqueued: true,
        channel: config.channel,
        recipientCount: recipientList.length,
      },
      sideEffects: [
        {
          effectType: config.channel === 'email' ? 'email' : config.channel === 'sms' ? 'sms' : 'integration',
          payload,
        },
      ],
    };
  },
};
