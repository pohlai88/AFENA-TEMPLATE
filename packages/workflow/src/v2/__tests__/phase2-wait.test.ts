import { describe, expect, it } from 'vitest';

import { waitEventHandler, waitTimerHandler } from '../nodes/wait';

import type { CompiledWorkflow, WorkflowStepContext } from '../types';

// ── Helpers ────────────────────────────────────────────────

function makeCompiled(overrides: Partial<CompiledWorkflow> = {}): CompiledWorkflow {
  return {
    adjacency: {},
    reverseAdjacency: {},
    edgesById: {},
    topologicalOrder: [],
    joinRequirements: {},
    editWindows: {},
    stableRegionNodes: [],
    slotMap: {},
    systemGateIntegrity: { requiredGates: [], presentGates: [], valid: true },
    envelopeVersion: 1,
    compilerVersion: '1.0.0',
    hash: 'test-hash',
    ...overrides,
  };
}

function makeCtx(overrides: Partial<WorkflowStepContext> = {}): WorkflowStepContext {
  return {
    instanceId: 'inst-1',
    nodeId: 'wait-1',
    tokenId: 'tok-1',
    entityType: 'invoice',
    entityId: 'inv-1',
    entityVersion: 1,
    actorUserId: 'user-1',
    compiled: makeCompiled(),
    contextJson: {},
    ...overrides,
  };
}

// ── wait_timer ─────────────────────────────────────────────

describe('waitTimerHandler', () => {
  it('computes resumeAt from durationMs', async () => {
    const ctx = makeCtx();
    const before = Date.now();

    const result = await waitTimerHandler.execute(ctx, {
      nodeType: 'wait_timer',
      durationMs: 60_000,
    });

    const after = Date.now();

    expect(result.status).toBe('completed');
    expect(result.output?.['__waitTimer']).toBe(true);

    const resumeAt = new Date(result.output?.['resumeAt'] as string).getTime();
    expect(resumeAt).toBeGreaterThanOrEqual(before + 60_000);
    expect(resumeAt).toBeLessThanOrEqual(after + 60_000);
  });

  it('resolves resumeAt from DSL expression', async () => {
    const ctx = makeCtx({
      contextJson: {
        entity: { dueDate: '2026-06-15T00:00:00Z' },
      },
    });

    const result = await waitTimerHandler.execute(ctx, {
      nodeType: 'wait_timer',
      resumeAt: { expr: 'entity.dueDate', returnType: 'string' },
    });

    expect(result.status).toBe('completed');
    expect(result.output?.['resumeAt']).toBe('2026-06-15T00:00:00Z');
  });

  it('fails when neither durationMs nor resumeAt configured', async () => {
    const ctx = makeCtx();

    const result = await waitTimerHandler.execute(ctx, {
      nodeType: 'wait_timer',
    });

    expect(result.status).toBe('failed');
    expect(result.error).toContain('neither durationMs nor resumeAt');
  });
});

// ── wait_event ─────────────────────────────────────────────

describe('waitEventHandler', () => {
  it('resolves event key from template', async () => {
    const ctx = makeCtx({
      contextJson: {
        entity: { id: 'inv-123' },
      },
    });

    const result = await waitEventHandler.execute(ctx, {
      nodeType: 'wait_event',
      eventKeyTemplate: { expr: 'entity.id', returnType: 'string' },
    });

    expect(result.status).toBe('completed');
    expect(result.output?.['__waitEvent']).toBe(true);
    expect(result.output?.['waitingForEventKey']).toBe('inv-123');
  });

  it('fails when no eventKeyTemplate configured', async () => {
    const ctx = makeCtx();

    const result = await waitEventHandler.execute(ctx, {
      nodeType: 'wait_event',
    } as any);

    expect(result.status).toBe('failed');
    expect(result.error).toContain('no eventKeyTemplate');
  });

  it('fails when template resolves to non-string', async () => {
    const ctx = makeCtx({
      contextJson: {
        entity: { count: 42 },
      },
    });

    const result = await waitEventHandler.execute(ctx, {
      nodeType: 'wait_event',
      eventKeyTemplate: { expr: 'entity.count', returnType: 'number' },
    });

    expect(result.status).toBe('failed');
    expect(result.error).toContain('non-string');
  });
});
