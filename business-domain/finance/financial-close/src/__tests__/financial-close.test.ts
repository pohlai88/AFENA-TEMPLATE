import { describe, expect, it, vi } from 'vitest';

import type { EvidenceRequirement } from '../calculators/close-validation';
import { summarizeValidation, validateCloseEvidence } from '../calculators/close-validation';
import type { CloseTaskNode } from '../calculators/dependency-resolver';
import {
  computeCloseProgress,
  isCloseComplete,
  resolveCloseDependencies,
} from '../calculators/dependency-resolver';
import {
  buildAdjustmentPostIntent,
  buildCompleteTaskIntent,
  buildFinalizeRunIntent,
  buildHardLockIntent,
} from '../commands/close-intent';

vi.mock('afenda-database', () => ({
  db: {},
  dbSession: vi.fn(),
}));

/* ────────── Dependency Resolver ────────── */

describe('resolveCloseDependencies', () => {
  const baseTasks: CloseTaskNode[] = [
    {
      id: 't1',
      taskCode: 'RECONCILE',
      category: 'pre-close',
      sequenceOrder: 1,
      taskStatus: 'completed',
      dependsOn: [],
    },
    {
      id: 't2',
      taskCode: 'ACCRUE',
      category: 'close',
      sequenceOrder: 1,
      taskStatus: 'pending',
      dependsOn: ['t1'],
    },
    {
      id: 't3',
      taskCode: 'RECLASS',
      category: 'close',
      sequenceOrder: 2,
      taskStatus: 'pending',
      dependsOn: ['t1'],
    },
    {
      id: 't4',
      taskCode: 'REVIEW',
      category: 'review',
      sequenceOrder: 1,
      taskStatus: 'pending',
      dependsOn: ['t2', 't3'],
    },
  ];

  it('sorts tasks in dependency order', () => {
    const { result } = resolveCloseDependencies(baseTasks);
    expect(result.hasCycle).toBe(false);
    expect(result.executionOrder.map((t) => t.id)).toEqual(['t1', 't2', 't3', 't4']);
  });

  it('identifies ready tasks (dependencies satisfied)', () => {
    const { result } = resolveCloseDependencies(baseTasks);
    // t1 is completed, so t2 and t3 are ready
    expect(result.readyTasks.map((t) => t.id)).toEqual(['t2', 't3']);
  });

  it('detects circular dependencies with full cyclePath', () => {
    const cycleTasks: CloseTaskNode[] = [
      {
        id: 'a',
        taskCode: 'A',
        category: 'close',
        sequenceOrder: 1,
        taskStatus: 'pending',
        dependsOn: ['b'],
      },
      {
        id: 'b',
        taskCode: 'B',
        category: 'close',
        sequenceOrder: 2,
        taskStatus: 'pending',
        dependsOn: ['a'],
      },
    ];
    const { result } = resolveCloseDependencies(cycleTasks);
    expect(result.hasCycle).toBe(true);
    expect(result.cycleIds.length).toBeGreaterThan(0);
    expect(result.cyclePath.length).toBeGreaterThanOrEqual(3);
    expect(result.cyclePath[0]).toBe(result.cyclePath[result.cyclePath.length - 1]);
  });

  it('returns full cycle path for 3-node cycle (A → B → C → A)', () => {
    const cycleTasks: CloseTaskNode[] = [
      { id: 'a', taskCode: 'A', category: 'close', sequenceOrder: 1, taskStatus: 'pending', dependsOn: ['c'] },
      { id: 'b', taskCode: 'B', category: 'close', sequenceOrder: 2, taskStatus: 'pending', dependsOn: ['a'] },
      { id: 'c', taskCode: 'C', category: 'close', sequenceOrder: 3, taskStatus: 'pending', dependsOn: ['b'] },
    ];
    const { result } = resolveCloseDependencies(cycleTasks);
    expect(result.hasCycle).toBe(true);
    expect(result.cyclePath.length).toBe(4);
    expect(result.cycleIds).toEqual(expect.arrayContaining(['a', 'b', 'c']));
  });

  it('excludes in-progress tasks from readyTasks by default (G-04)', () => {
    const tasks: CloseTaskNode[] = [
      { id: 't1', taskCode: 'A', category: 'pre-close', sequenceOrder: 1, taskStatus: 'completed', dependsOn: [] },
      { id: 't2', taskCode: 'B', category: 'close', sequenceOrder: 1, taskStatus: 'in-progress', dependsOn: ['t1'] },
      { id: 't3', taskCode: 'C', category: 'close', sequenceOrder: 2, taskStatus: 'pending', dependsOn: ['t1'] },
    ];
    const { result } = resolveCloseDependencies(tasks);
    expect(result.readyTasks.map((t) => t.id)).toEqual(['t3']);
  });

  it('includes in-progress tasks in readyTasks when allowRestart is true (G-04)', () => {
    const tasks: CloseTaskNode[] = [
      { id: 't1', taskCode: 'A', category: 'pre-close', sequenceOrder: 1, taskStatus: 'completed', dependsOn: [] },
      { id: 't2', taskCode: 'B', category: 'close', sequenceOrder: 1, taskStatus: 'in-progress', dependsOn: ['t1'] },
      { id: 't3', taskCode: 'C', category: 'close', sequenceOrder: 2, taskStatus: 'pending', dependsOn: ['t1'] },
    ];
    const { result } = resolveCloseDependencies(tasks, { allowRestart: true });
    expect(result.readyTasks.map((t) => t.id)).toEqual(['t2', 't3']);
  });

  it('returns empty readyTasks when all are blocked', () => {
    const blockedTasks: CloseTaskNode[] = [
      {
        id: 'x',
        taskCode: 'X',
        category: 'close',
        sequenceOrder: 1,
        taskStatus: 'pending',
        dependsOn: ['y'],
      },
      {
        id: 'y',
        taskCode: 'Y',
        category: 'close',
        sequenceOrder: 2,
        taskStatus: 'pending',
        dependsOn: ['x'],
      },
    ];
    const { result } = resolveCloseDependencies(blockedTasks);
    // cycle detected, no ready tasks
    expect(result.readyTasks).toEqual([]);
  });
});

describe('isCloseComplete', () => {
  it('returns true when all completed or skipped', () => {
    const tasks: CloseTaskNode[] = [
      {
        id: '1',
        taskCode: 'A',
        category: 'close',
        sequenceOrder: 1,
        taskStatus: 'completed',
        dependsOn: [],
      },
      {
        id: '2',
        taskCode: 'B',
        category: 'close',
        sequenceOrder: 2,
        taskStatus: 'skipped',
        dependsOn: [],
      },
    ];
    expect(isCloseComplete(tasks).result).toBe(true);
  });

  it('returns false when pending tasks exist', () => {
    const tasks: CloseTaskNode[] = [
      {
        id: '1',
        taskCode: 'A',
        category: 'close',
        sequenceOrder: 1,
        taskStatus: 'completed',
        dependsOn: [],
      },
      {
        id: '2',
        taskCode: 'B',
        category: 'close',
        sequenceOrder: 2,
        taskStatus: 'pending',
        dependsOn: [],
      },
    ];
    expect(isCloseComplete(tasks).result).toBe(false);
  });
});

describe('computeCloseProgress', () => {
  it('computes correct progress percentage', () => {
    const tasks: CloseTaskNode[] = [
      {
        id: '1',
        taskCode: 'A',
        category: 'close',
        sequenceOrder: 1,
        taskStatus: 'completed',
        dependsOn: [],
      },
      {
        id: '2',
        taskCode: 'B',
        category: 'close',
        sequenceOrder: 2,
        taskStatus: 'completed',
        dependsOn: [],
      },
      {
        id: '3',
        taskCode: 'C',
        category: 'close',
        sequenceOrder: 3,
        taskStatus: 'pending',
        dependsOn: [],
      },
      {
        id: '4',
        taskCode: 'D',
        category: 'close',
        sequenceOrder: 4,
        taskStatus: 'blocked',
        dependsOn: [],
      },
    ];
    const { result: progress } = computeCloseProgress(tasks);
    expect(progress.total).toBe(4);
    expect(progress.completed).toBe(2);
    expect(progress.progressPct).toBe(50);
    expect(progress.blocked).toBe(1);
  });

  it('returns 100% for empty task list', () => {
    expect(computeCloseProgress([]).result.progressPct).toBe(100);
  });
});

/* ────────── Close Validation ────────── */

describe('validateCloseEvidence', () => {
  it('passes when evidence count meets requirement', () => {
    const reqs: EvidenceRequirement[] = [
      { taskId: 't1', taskCode: 'RECONCILE', evidenceCount: 2, requiredCount: 1 },
    ];
    const { result: checks } = validateCloseEvidence(reqs);
    expect(checks[0]!.passed).toBe(true);
  });

  it('fails when evidence is insufficient', () => {
    const reqs: EvidenceRequirement[] = [
      { taskId: 't2', taskCode: 'APPROVAL', evidenceCount: 0, requiredCount: 1 },
    ];
    const { result: checks } = validateCloseEvidence(reqs);
    expect(checks[0]!.passed).toBe(false);
    expect(checks[0]!.message).toContain('Missing evidence');
  });
});

describe('summarizeValidation', () => {
  it('aggregates pass/fail counts', () => {
    const checks = [
      { checkCode: 'a', label: 'A', passed: true, message: 'ok' },
      { checkCode: 'b', label: 'B', passed: false, message: 'fail' },
      { checkCode: 'c', label: 'C', passed: true, message: 'ok' },
    ];
    const { result: summary } = summarizeValidation(checks);
    expect(summary.allPassed).toBe(false);
    expect(summary.passedCount).toBe(2);
    expect(summary.failedCount).toBe(1);
  });
});

/* ────────── Intent Builders ────────── */

describe('buildCompleteTaskIntent', () => {
  it('builds close.task.complete intent', () => {
    const intent = buildCompleteTaskIntent({
      closeRunId: 'run-1',
      taskId: 'task-1',
      evidenceRef: 'doc.pdf',
    });
    expect(intent.type).toBe('close.task.complete');
    expect(intent.payload).toEqual({
      closeRunId: 'run-1',
      taskId: 'task-1',
      evidenceRef: 'doc.pdf',
    });
    expect(intent.idempotencyKey).toBeTruthy();
  });
});

describe('buildFinalizeRunIntent', () => {
  it('builds close.run.finalize intent', () => {
    const intent = buildFinalizeRunIntent({
      closeRunId: 'run-1',
      periodKey: '2024-P01',
      companyId: 'co-1',
      taskCount: 5,
    });
    expect(intent.type).toBe('close.run.finalize');
    expect(intent.payload).toEqual({
      closeRunId: 'run-1',
      periodKey: '2024-P01',
      companyId: 'co-1',
      taskCount: 5,
    });
  });
});

describe('buildAdjustmentPostIntent', () => {
  it('builds close.adjustment.post intent', () => {
    const intent = buildAdjustmentPostIntent({
      closeRunId: 'run-1',
      journalId: 'je-99',
      adjustmentType: 'accrual',
    });
    expect(intent.type).toBe('close.adjustment.post');
    expect(intent.payload.adjustmentType).toBe('accrual');
  });
});

describe('buildHardLockIntent', () => {
  it('builds close.lock.hard intent', () => {
    const intent = buildHardLockIntent({
      closeRunId: 'run-1',
      periodKey: '2024-P01',
      companyId: 'co-1',
      ledgerId: 'led-1',
    });
    expect(intent.type).toBe('close.lock.hard');
    expect(intent.payload.ledgerId).toBe('led-1');
  });
});
