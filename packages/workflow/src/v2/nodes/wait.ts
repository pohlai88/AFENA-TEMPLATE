import { evaluateDsl } from '../dsl-evaluator';

import type { DslContext } from '../dsl-evaluator';
import type {
  StepResult,
  WaitEventConfig,
  WaitTimerConfig,
  WorkflowNodeConfig,
  WorkflowStepContext,
} from '../types';
import type { WorkflowNodeHandler } from './types';

/**
 * wait_timer handler — pause for a duration or until a datetime.
 *
 * PRD § Wait States:
 * > wait_timer sets resume_at on the step execution row.
 * > The resume scheduler scans for due steps and writes outbox events.
 *
 * This handler computes the resume time and returns it in the output.
 * The engine writes resume_at to the step_execution row.
 * The resume scheduler (separate background process) polls for due steps.
 */
export const waitTimerHandler: WorkflowNodeHandler = {
  nodeType: 'wait_timer',

  async execute(ctx: WorkflowStepContext, _config: WorkflowNodeConfig): Promise<StepResult> {
    const config = _config as WaitTimerConfig;

    let resumeAt: string;

    if (config.durationMs) {
      // Fixed duration from now
      resumeAt = new Date(Date.now() + config.durationMs).toISOString();
    } else if (config.resumeAt) {
      // DSL expression that resolves to a datetime string
      const dslCtx: DslContext = {
        entity: ctx.contextJson['entity'] as Record<string, unknown> ?? {},
        context: ctx.contextJson,
        actor: { user_id: ctx.actorUserId },
        tokens: {},
      };
      const resolved = evaluateDsl(config.resumeAt, dslCtx);
      if (typeof resolved === 'string') {
        resumeAt = resolved;
      } else if (typeof resolved === 'number') {
        resumeAt = new Date(resolved).toISOString();
      } else {
        return {
          status: 'failed',
          error: `wait_timer resumeAt expression resolved to non-datetime: ${String(resolved)}`,
        };
      }
    } else {
      return {
        status: 'failed',
        error: `wait_timer node "${ctx.nodeId}" has neither durationMs nor resumeAt configured`,
      };
    }

    // Return 'completed' with special __waitTimer output.
    // The engine recognizes this and sets the step to 'pending' with resume_at.
    return {
      status: 'completed',
      output: {
        __waitTimer: true,
        resumeAt,
        nodeId: ctx.nodeId,
        tokenId: ctx.tokenId,
      },
    };
  },
};

/**
 * wait_event handler — pause until an external event arrives.
 *
 * PRD § Wait States:
 * > wait_event sets waiting_for_event_key on the step execution row.
 * > When an external event arrives (webhook inbound), the resume scheduler
 * > matches the event key and writes an outbox event to advance the workflow.
 *
 * The event key is computed from a DSL expression template, enabling
 * dynamic event matching (e.g., "invoice:${entity.id}:approved").
 */
export const waitEventHandler: WorkflowNodeHandler = {
  nodeType: 'wait_event',

  async execute(ctx: WorkflowStepContext, _config: WorkflowNodeConfig): Promise<StepResult> {
    const config = _config as WaitEventConfig;

    if (!config.eventKeyTemplate) {
      return {
        status: 'failed',
        error: `wait_event node "${ctx.nodeId}" has no eventKeyTemplate configured`,
      };
    }

    // Evaluate the event key template
    const dslCtx: DslContext = {
      entity: ctx.contextJson['entity'] as Record<string, unknown> ?? {},
      context: ctx.contextJson,
      actor: { user_id: ctx.actorUserId },
      tokens: {},
    };

    const eventKey = evaluateDsl(config.eventKeyTemplate, dslCtx);
    if (typeof eventKey !== 'string') {
      return {
        status: 'failed',
        error: `wait_event eventKeyTemplate resolved to non-string: ${String(eventKey)}`,
      };
    }

    // Return 'completed' with special __waitEvent output.
    // The engine recognizes this and sets the step to 'pending' with waiting_for_event_key.
    return {
      status: 'completed',
      output: {
        __waitEvent: true,
        waitingForEventKey: eventKey,
        nodeId: ctx.nodeId,
        tokenId: ctx.tokenId,
      },
    };
  },
};
