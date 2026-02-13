import { evaluateDsl } from '../dsl-evaluator';

import type { ScriptConfig, StepResult, WorkflowNodeConfig, WorkflowStepContext } from '../types';
import type { WorkflowNodeHandler } from './types';

/**
 * Script node handler — executes a typed DSL expression and returns the result.
 *
 * TX-safe: executes within the same DB transaction (same category as condition).
 * Unlike condition nodes, script nodes don't branch — they compute a value
 * and store it in output_json for downstream nodes to consume.
 *
 * PRD §623: "execute typed DSL expression (see § Typed DSL — not JS)"
 */
export const scriptHandler: WorkflowNodeHandler = {
  nodeType: 'script',
  execute(ctx: WorkflowStepContext, config: WorkflowNodeConfig): Promise<StepResult> {
    const scriptConfig = config as ScriptConfig;

    if (scriptConfig.nodeType !== 'script') {
      return Promise.resolve({
        status: 'failed' as const,
        error: `Expected script config, got ${String((config as { nodeType?: string }).nodeType)}`,
      });
    }

    try {
      const result: unknown = evaluateDsl(scriptConfig.expression, {
        entity: ctx.entitySnapshot ?? {},
        context: ctx.contextJson ?? {},
        actor: { user_id: ctx.actorUserId },
        tokens: {},
      });

      return Promise.resolve({
        status: 'completed' as const,
        output: {
          expression: scriptConfig.expression.expr,
          result,
          entityVersion: ctx.entityVersion,
        },
      });
    } catch (err: unknown) {
      return Promise.resolve({
        status: 'failed' as const,
        error: `Script evaluation failed: ${err instanceof Error ? err.message : String(err)}`,
        output: {
          expression: scriptConfig.expression.expr,
          entityVersion: ctx.entityVersion,
        },
      });
    }
  },
};
