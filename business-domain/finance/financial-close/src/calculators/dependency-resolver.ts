import type { CalculatorResult } from 'afenda-canon';

/**
 * Close Dependency Resolver
 *
 * Topologically sorts close tasks based on their dependsOn relationships,
 * detects circular dependencies, and identifies tasks ready for execution.
 */

export interface CloseTaskNode {
  id: string;
  taskCode: string;
  category: 'pre-close' | 'close' | 'post-close' | 'review';
  sequenceOrder: number;
  taskStatus: 'pending' | 'in-progress' | 'completed' | 'skipped' | 'blocked';
  dependsOn: string[]; // array of task IDs
}

export interface DependencyResult {
  /** Tasks in execution order (topologically sorted) */
  executionOrder: CloseTaskNode[];
  /** Tasks with no unfinished dependencies — ready to run */
  readyTasks: CloseTaskNode[];
  /** True if a cycle was detected */
  hasCycle: boolean;
  /** If cycle detected, the IDs involved */
  cycleIds: string[];
  /** Full cycle path showing the loop (e.g. ['A', 'B', 'C', 'A']) */
  cyclePath: string[];
}

/**
 * Topological sort of close tasks, returning execution order and ready tasks.
 */
export function resolveCloseDependencies(
  tasks: CloseTaskNode[],
  options?: { allowRestart?: boolean },
): CalculatorResult<DependencyResult> {
  const allowRestart = options?.allowRestart ?? false;
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const visited = new Set<string>();
  const inStack = new Set<string>();
  const stackList: string[] = [];
  const sorted: CloseTaskNode[] = [];
  const cycleIds: string[] = [];
  let cyclePath: string[] = [];
  let hasCycle = false;

  function dfs(taskId: string): void {
    if (hasCycle) return;
    if (inStack.has(taskId)) {
      hasCycle = true;
      // Extract full cycle from the stack: find where taskId first appears, slice to end, append taskId
      const cycleStart = stackList.indexOf(taskId);
      cyclePath = [...stackList.slice(cycleStart), taskId];
      // Unique IDs in the cycle (without the closing duplicate)
      for (const id of cyclePath.slice(0, -1)) {
        if (!cycleIds.includes(id)) cycleIds.push(id);
      }
      return;
    }
    if (visited.has(taskId)) return;

    inStack.add(taskId);
    stackList.push(taskId);
    visited.add(taskId);

    const task = taskMap.get(taskId);
    if (task) {
      for (const depId of task.dependsOn) {
        dfs(depId);
      }
      sorted.push(task);
    }

    inStack.delete(taskId);
    stackList.pop();
  }

  // Sort by category weight then sequenceOrder for deterministic traversal
  const categoryWeight: Record<string, number> = {
    'pre-close': 0,
    close: 1,
    'post-close': 2,
    review: 3,
  };

  const orderedTasks = [...tasks].sort(
    (a, b) =>
      (categoryWeight[a.category] ?? 99) - (categoryWeight[b.category] ?? 99) ||
      a.sequenceOrder - b.sequenceOrder,
  );

  for (const task of orderedTasks) {
    if (!visited.has(task.id)) {
      dfs(task.id);
    }
  }

  // Ready tasks: pending/in-progress tasks whose dependencies are all completed/skipped
  const completedIds = new Set(
    tasks
      .filter((t) => t.taskStatus === 'completed' || t.taskStatus === 'skipped')
      .map((t) => t.id),
  );

  const readyTasks = sorted.filter(
    (t) =>
      (t.taskStatus === 'pending' || (allowRestart && t.taskStatus === 'in-progress')) &&
      t.dependsOn.every((depId) => completedIds.has(depId)),
  );

  return {
    result: { executionOrder: sorted, readyTasks, hasCycle, cycleIds, cyclePath },
    inputs: { taskCount: tasks.length },
    explanation: `Resolved ${tasks.length} tasks: ${sorted.length} ordered, ${readyTasks.length} ready, cycle=${hasCycle}`,
  };
}

/**
 * Check if all tasks are completed or skipped.
 */
export function isCloseComplete(tasks: CloseTaskNode[]): CalculatorResult<boolean> {
  const complete = tasks.every((t) => t.taskStatus === 'completed' || t.taskStatus === 'skipped');
  return {
    result: complete,
    inputs: { taskCount: tasks.length },
    explanation: `Close complete: ${complete} (${tasks.length} tasks)`,
  };
}

/**
 * Compute close progress as a percentage.
 */
export function computeCloseProgress(tasks: CloseTaskNode[]): CalculatorResult<{
  total: number;
  completed: number;
  skipped: number;
  pending: number;
  blocked: number;
  progressPct: number;
}> {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.taskStatus === 'completed').length;
  const skipped = tasks.filter((t) => t.taskStatus === 'skipped').length;
  const pending = tasks.filter(
    (t) => t.taskStatus === 'pending' || t.taskStatus === 'in-progress',
  ).length;
  const blocked = tasks.filter((t) => t.taskStatus === 'blocked').length;
  const progressPct = total === 0 ? 100 : Math.round(((completed + skipped) / total) * 100);

  return {
    result: { total, completed, skipped, pending, blocked, progressPct },
    inputs: { taskCount: tasks.length },
    explanation: `Progress: ${progressPct}% (${completed} completed, ${skipped} skipped, ${pending} pending, ${blocked} blocked)`,
  };
}
