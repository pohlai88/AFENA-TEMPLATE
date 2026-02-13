import { describe, expect, it } from 'vitest';

import { parallelJoinHandler, parallelSplitHandler } from '../nodes/parallel';
import { rebuildInstanceProjection } from '../projection';

import type { CompiledWorkflow, WorkflowStepContext } from '../types';
import type { StepExecutionSummary } from '../projection';

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
    nodeId: 'split-1',
    tokenId: 'tok-root',
    entityType: 'invoice',
    entityId: 'inv-1',
    entityVersion: 1,
    actorUserId: 'user-1',
    compiled: makeCompiled(),
    contextJson: {},
    ...overrides,
  };
}

// ── parallel_split ─────────────────────────────────────────

describe('parallelSplitHandler', () => {
  it('returns all outgoing edge IDs as chosenEdgeIds', async () => {
    const compiled = makeCompiled({
      adjacency: { 'split-1': ['edge-a', 'edge-b', 'edge-c'] },
    });
    const ctx = makeCtx({ compiled });

    const result = await parallelSplitHandler.execute(ctx, {
      nodeType: 'parallel_split',
      branchCount: 3,
    });

    expect(result.status).toBe('completed');
    expect(result.chosenEdgeIds).toEqual(['edge-a', 'edge-b', 'edge-c']);
    expect(result.output?.['branchCount']).toBe(3);
  });

  it('fails when no outgoing edges', async () => {
    const compiled = makeCompiled({ adjacency: {} });
    const ctx = makeCtx({ compiled });

    const result = await parallelSplitHandler.execute(ctx, {
      nodeType: 'parallel_split',
      branchCount: 0,
    });

    expect(result.status).toBe('failed');
    expect(result.error).toContain('no outgoing edges');
  });

  it('uses default branchCount from edge count when not specified', async () => {
    const compiled = makeCompiled({
      adjacency: { 'split-1': ['edge-a', 'edge-b'] },
    });
    const ctx = makeCtx({ compiled });

    const result = await parallelSplitHandler.execute(ctx, {
      nodeType: 'parallel_split',
    } as any);

    expect(result.status).toBe('completed');
    // When branchCount is undefined, defaults to outgoingEdgeIds.length
    expect(result.output?.['branchCount']).toBe(2);
  });
});

// ── parallel_join ──────────────────────────────────────────

describe('parallelJoinHandler', () => {
  it('ANY mode: completes immediately on first token', async () => {
    const compiled = makeCompiled({
      joinRequirements: {
        'join-1': { requiredTokenCount: 3, mode: 'any' },
      },
    });
    const ctx = makeCtx({
      nodeId: 'join-1',
      compiled,
      contextJson: { __tokensAtJoin: 0 },
    });

    const result = await parallelJoinHandler.execute(ctx, {
      nodeType: 'parallel_join',
      mode: 'any',
      requiredTokenCount: 3,
    });

    expect(result.status).toBe('completed');
    expect(result.output?.['joinMode']).toBe('any');
    expect(result.output?.['winner']).toBe('tok-root');
  });

  it('ALL mode: skips when not all tokens arrived', async () => {
    const compiled = makeCompiled({
      joinRequirements: {
        'join-1': { requiredTokenCount: 3, mode: 'all' },
      },
    });
    const ctx = makeCtx({
      nodeId: 'join-1',
      compiled,
      contextJson: { __tokensAtJoin: 1 },
    });

    const result = await parallelJoinHandler.execute(ctx, {
      nodeType: 'parallel_join',
      mode: 'all',
      requiredTokenCount: 3,
    });

    expect(result.status).toBe('skipped');
    expect(result.output?.['allArrived']).toBe(false);
    expect(result.output?.['waiting']).toBe(true);
  });

  it('ALL mode: completes when all tokens arrived', async () => {
    const compiled = makeCompiled({
      joinRequirements: {
        'join-1': { requiredTokenCount: 3, mode: 'all' },
      },
    });
    const ctx = makeCtx({
      nodeId: 'join-1',
      compiled,
      contextJson: { __tokensAtJoin: 2 },
    });

    const result = await parallelJoinHandler.execute(ctx, {
      nodeType: 'parallel_join',
      mode: 'all',
      requiredTokenCount: 3,
    });

    expect(result.status).toBe('completed');
    expect(result.output?.['allArrived']).toBe(true);
  });

  it('fails when no join requirements found', async () => {
    const compiled = makeCompiled({ joinRequirements: {} });
    const ctx = makeCtx({ nodeId: 'join-1', compiled });

    const result = await parallelJoinHandler.execute(ctx, {
      nodeType: 'parallel_join',
      mode: 'all',
      requiredTokenCount: 2,
    });

    expect(result.status).toBe('failed');
    expect(result.error).toContain('no join requirements');
  });
});

// ── Projection Rebuild ─────────────────────────────────────

describe('rebuildInstanceProjection', () => {
  it('returns empty state for no steps', () => {
    const compiled = makeCompiled();
    const result = rebuildInstanceProjection([], compiled);

    expect(result.activeTokens).toEqual([]);
    expect(result.currentNodes).toEqual([]);
    expect(result.status).toBe('running');
  });

  it('rebuilds single-token linear flow', () => {
    const compiled = makeCompiled({
      edgesById: {
        'e1': { id: 'e1', source: 'start', target: 'action-1', priority: 0, provenance: 'envelope' },
        'e2': { id: 'e2', source: 'action-1', target: 'end', priority: 0, provenance: 'envelope' },
      },
      adjacency: {
        'start': ['e1'],
        'action-1': ['e2'],
      },
    });

    const steps: StepExecutionSummary[] = [
      { id: 's1', nodeId: 'start', nodeType: 'start', tokenId: 'tok-1', status: 'completed', entityVersion: 1, outputJson: null, chosenEdgeIds: ['e1'] },
      { id: 's2', nodeId: 'action-1', nodeType: 'action', tokenId: 'tok-1', status: 'completed', entityVersion: 1, outputJson: null, chosenEdgeIds: ['e2'] },
    ];

    const result = rebuildInstanceProjection(steps, compiled);

    expect(result.activeTokens).toHaveLength(1);
    expect(result.activeTokens[0]?.currentNodeId).toBe('end');
    expect(result.lastStepExecutionId).toBe('s2');
    expect(result.entityVersion).toBe(1);
  });

  it('rebuilds parallel split with spawned tokens', () => {
    const compiled = makeCompiled({
      edgesById: {
        'e1': { id: 'e1', source: 'split', target: 'branch-a', priority: 0, provenance: 'envelope' },
        'e2': { id: 'e2', source: 'split', target: 'branch-b', priority: 0, provenance: 'envelope' },
      },
      adjacency: {
        'split': ['e1', 'e2'],
      },
    });

    const steps: StepExecutionSummary[] = [
      {
        id: 's1',
        nodeId: 'split',
        nodeType: 'parallel_split',
        tokenId: 'tok-root',
        status: 'completed',
        entityVersion: 1,
        outputJson: { spawnedTokenIds: ['tok-a', 'tok-b'] },
        chosenEdgeIds: ['e1', 'e2'],
      },
    ];

    const result = rebuildInstanceProjection(steps, compiled);

    // Root token completed, two child tokens active
    const rootToken = result.activeTokens.find((t) => t.id === 'tok-root');
    const childA = result.activeTokens.find((t) => t.id === 'tok-a');
    const childB = result.activeTokens.find((t) => t.id === 'tok-b');

    expect(rootToken?.status).toBe('completed');
    expect(childA?.status).toBe('active');
    expect(childA?.currentNodeId).toBe('branch-a');
    expect(childB?.status).toBe('active');
    expect(childB?.currentNodeId).toBe('branch-b');
    expect(result.currentNodes).toContain('branch-a');
    expect(result.currentNodes).toContain('branch-b');
  });

  it('detects completed instance when all tokens reach end', () => {
    const compiled = makeCompiled({
      edgesById: {
        'e1': { id: 'e1', source: 'start', target: 'sys:end', priority: 0, provenance: 'envelope' },
      },
      adjacency: { 'start': ['e1'] },
    });

    const steps: StepExecutionSummary[] = [
      { id: 's1', nodeId: 'start', nodeType: 'start', tokenId: 'tok-1', status: 'completed', entityVersion: 1, outputJson: null, chosenEdgeIds: ['e1'] },
      { id: 's2', nodeId: 'sys:end', nodeType: 'end', tokenId: 'tok-1', status: 'completed', entityVersion: 1, outputJson: null, chosenEdgeIds: [] },
    ];

    const result = rebuildInstanceProjection(steps, compiled);
    expect(result.status).toBe('completed');
  });

  it('detects failed instance', () => {
    const compiled = makeCompiled();

    const steps: StepExecutionSummary[] = [
      { id: 's1', nodeId: 'action-1', nodeType: 'action', tokenId: 'tok-1', status: 'failed', entityVersion: 1, outputJson: null, chosenEdgeIds: [] },
    ];

    const result = rebuildInstanceProjection(steps, compiled);
    expect(result.status).toBe('failed');
  });
});
