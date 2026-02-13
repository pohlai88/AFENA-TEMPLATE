import { describe, expect, it } from 'vitest';

import type { CompiledWorkflow } from '../types';
import { checkEditWindow, getEffectiveEditWindow } from '../edit-window';
import { WorkflowEngineError } from '../engine';

function mockCompiled(editWindows: Record<string, 'editable' | 'locked' | 'amend_only'>): CompiledWorkflow {
  return {
    adjacency: {},
    reverseAdjacency: {},
    edgesById: {},
    topologicalOrder: [],
    joinRequirements: {},
    editWindows,
    stableRegionNodes: [],
    slotMap: {},
    systemGateIntegrity: { requiredGates: [], presentGates: [], valid: true },
    envelopeVersion: 1,
    compilerVersion: '1.0.0',
    hash: 'test',
  };
}

describe('checkEditWindow', () => {
  it('allows any mutation in editable window', () => {
    const compiled = mockCompiled({ 'node-a': 'editable' });
    expect(() => checkEditWindow(compiled, ['node-a'], 'update')).not.toThrow();
    expect(() => checkEditWindow(compiled, ['node-a'], 'create')).not.toThrow();
  });

  it('blocks non-amendment verbs in amend_only window', () => {
    const compiled = mockCompiled({ 'node-a': 'amend_only' });
    expect(() => checkEditWindow(compiled, ['node-a'], 'update')).toThrow(WorkflowEngineError);
    expect(() => checkEditWindow(compiled, ['node-a'], 'create')).toThrow(WorkflowEngineError);
  });

  it('allows amendment verbs in amend_only window', () => {
    const compiled = mockCompiled({ 'node-a': 'amend_only' });
    expect(() => checkEditWindow(compiled, ['node-a'], 'amend')).not.toThrow();
    expect(() => checkEditWindow(compiled, ['node-a'], 'cancel')).not.toThrow();
    expect(() => checkEditWindow(compiled, ['node-a'], 'approve')).not.toThrow();
    expect(() => checkEditWindow(compiled, ['node-a'], 'reject')).not.toThrow();
    expect(() => checkEditWindow(compiled, ['node-a'], 'submit')).not.toThrow();
  });

  it('blocks all mutations in locked window', () => {
    const compiled = mockCompiled({ 'node-a': 'locked' });
    expect(() => checkEditWindow(compiled, ['node-a'], 'update')).toThrow(WorkflowEngineError);
    expect(() => checkEditWindow(compiled, ['node-a'], 'amend')).toThrow(WorkflowEngineError);
  });

  it('skips nodes without edit window', () => {
    const compiled = mockCompiled({});
    expect(() => checkEditWindow(compiled, ['node-a'], 'update')).not.toThrow();
  });

  it('checks all current nodes — strictest wins', () => {
    const compiled = mockCompiled({ 'node-a': 'editable', 'node-b': 'locked' });
    expect(() => checkEditWindow(compiled, ['node-a', 'node-b'], 'update')).toThrow(WorkflowEngineError);
  });
});

describe('getEffectiveEditWindow', () => {
  it('returns editable when no nodes have windows', () => {
    const compiled = mockCompiled({});
    expect(getEffectiveEditWindow(compiled, ['node-a'])).toBe('editable');
  });

  it('returns the strictest window across nodes', () => {
    const compiled = mockCompiled({ 'node-a': 'editable', 'node-b': 'amend_only', 'node-c': 'locked' });
    expect(getEffectiveEditWindow(compiled, ['node-a', 'node-b', 'node-c'])).toBe('locked');
  });

  it('returns amend_only when mixed editable + amend_only', () => {
    const compiled = mockCompiled({ 'node-a': 'editable', 'node-b': 'amend_only' });
    expect(getEffectiveEditWindow(compiled, ['node-a', 'node-b'])).toBe('amend_only');
  });
});
