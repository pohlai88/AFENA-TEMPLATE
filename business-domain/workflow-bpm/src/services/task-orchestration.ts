/**
 * Task Orchestration Service
 *
 * Orchestrates human tasks and system tasks within business processes,
 * managing task lifecycle, dependencies, and parallel execution.
 */

import { z } from 'zod';

// Schemas
export const createHumanTaskSchema = z.object({
  processInstanceId: z.string().uuid(),
  taskName: z.string(),
  taskType: z.enum(['approval', 'review', 'data-entry', 'decision', 'investigation']),
  assignedTo: z.string().uuid().optional(),
  assignedRole: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  slaHours: z.number().positive().optional(),
  instructions: z.string().optional(),
  requiredFields: z.array(z.string()).optional(),
});

export const completeHumanTaskSchema = z.object({
  taskId: z.string().uuid(),
  completedBy: z.string().uuid(),
  outcome: z.enum(['approved', 'rejected', 'completed', 'escalated']),
  comments: z.string().optional(),
  outputData: z.record(z.unknown()).optional(),
});

export const executeSystemTaskSchema = z.object({
  processInstanceId: z.string().uuid(),
  taskName: z.string(),
  taskType: z.enum(['post-to-gl', 'send-notification', 'generate-document', 'trigger-integration', 'calculate']),
  inputData: z.record(z.unknown()),
  retryOnFailure: z.boolean().default(true),
  maxRetries: z.number().default(3),
});

// Types
export type CreateHumanTaskInput = z.infer<typeof createHumanTaskSchema>;
export type CompleteHumanTaskInput = z.infer<typeof completeHumanTaskSchema>;
export type ExecuteSystemTaskInput = z.infer<typeof executeSystemTaskSchema>;

export interface HumanTask {
  id: string;
  processInstanceId: string;
  taskName: string;
  taskType: 'approval' | 'review' | 'data-entry' | 'decision' | 'investigation';
  assignedTo?: string;
  assignedRole?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  slaHours?: number;
  instructions?: string;
  requiredFields?: string[];
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  assignedAt?: string;
  completedAt?: string;
  outcome?: 'approved' | 'rejected' | 'completed' | 'escalated';
  comments?: string;
  outputData?: Record<string, unknown>;
}

export interface SystemTask {
  id: string;
  processInstanceId: string;
  taskName: string;
  taskType: 'post-to-gl' | 'send-notification' | 'generate-document' | 'trigger-integration' | 'calculate';
  inputData: Record<string, unknown>;
  outputData?: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
}

/**
 * Create a human task.
 *
 * Creates a task assignment for a user to perform manual work (approval, review, data entry).
 *
 * @param input - Human task details
 * @returns Human task
 *
 * @example
 * ```typescript
 * // Create journal entry approval task
 * const approvalTask = await createHumanTask({
 *   processInstanceId: 'proc-inst-123',
 *   taskName: 'Approve Journal Entry',
 *   taskType: 'approval',
 *   assignedTo: 'user-456', // Accounting manager
 *   priority: 'high',
 *   slaHours: 24,
 *   instructions: 'Review accrued revenue adjustment for Q4. Verify supporting documentation.',
 *   requiredFields: ['approval-decision', 'approval-comments'],
 * });
 * // Actions:
 * // - Create task in user's inbox
 * // - Start SLA timer (24 hours)
 * // - Send email notification
 * // - Add to user's task list in UI
 * ```
 */
export async function createHumanTask(
  input: CreateHumanTaskInput
): Promise<HumanTask> {
  const validated = createHumanTaskSchema.parse(input);

  // TODO: Implement human task creation:
  // 1. Validate process instance exists and is active
  // 2. Validate assignedTo user or assignedRole exists
  // 3. Insert into human_tasks table
  // 4. If assignedTo specified: status = 'assigned', send notification
  // 5. If assignedRole specified: status = 'pending', wait for user to claim
  // 6. If slaHours specified: Start SLA timer
  // 7. Create task assignment record
  // 8. Send notification (email, in-app)
  // 9. Return human task

  return {
    id: 'task-uuid',
    processInstanceId: validated.processInstanceId,
    taskName: validated.taskName,
    taskType: validated.taskType,
    assignedTo: validated.assignedTo,
    assignedRole: validated.assignedRole,
    priority: validated.priority,
    slaHours: validated.slaHours,
    instructions: validated.instructions,
    requiredFields: validated.requiredFields,
    status: validated.assignedTo ? 'assigned' : 'pending',
    createdAt: new Date().toISOString(),
    assignedAt: validated.assignedTo ? new Date().toISOString() : undefined,
  };
}

/**
 * Complete a human task.
 *
 * Records the outcome of a human task (approved, rejected, completed, escalated).
 *
 * @param input - Task completion details
 * @returns Completed human task
 *
 * @example
 * ```typescript
 * const completed = await completeHumanTask({
 *   taskId: 'task-123',
 *   completedBy: 'user-456',
 *   outcome: 'approved',
 *   comments: 'Accrual appears reasonable based on December revenue activity. Approved.',
 *   outputData: {
 *     approvalDecision: 'approved',
 *     approvalDate: '2025-01-05',
 *   },
 * });
 * // Actions:
 * // - Mark task as completed
 * // - Stop SLA timer
 * // - Record outcome (approved)
 * // - Advance process to next step (system task: post to GL)
 * // - Send notification to process initiator
 * ```
 */
export async function completeHumanTask(
  input: CompleteHumanTaskInput
): Promise<HumanTask> {
  const validated = completeHumanTaskSchema.parse(input);

  // TODO: Implement human task completion:
  // 1. Validate task exists and is assigned/in-progress
  // 2. Validate completedBy is assignedTo or has override permission
  // 3. Validate required fields are provided (if specified)
  // 4. Update status = 'completed', outcome, comments, outputData
  // 5. Stop SLA timer (mark as completed)
  // 6. Advance process instance to next step:
  //    - If outcome = 'approved': Continue to next step
  //    - If outcome = 'rejected': Route to rejection handler
  //    - If outcome = 'escalated': Route to escalation step
  // 7. Create audit trail entry
  // 8. Send completion notification to process initiator

  return {
    id: validated.taskId,
    processInstanceId: 'proc-inst-123',
    taskName: 'Approve Journal Entry',
    taskType: 'approval',
    assignedTo: 'user-456',
    priority: 'high',
    slaHours: 24,
    status: 'completed',
    createdAt: '2025-01-01T00:00:00Z',
    assignedAt: '2025-01-01T00:00:00Z',
    completedAt: new Date().toISOString(),
    outcome: validated.outcome,
    comments: validated.comments,
    outputData: validated.outputData,
  };
}

/**
 * Execute a system task.
 *
 * Executes an automated task (post to GL, send notification, generate document, etc.).
 *
 * @param input - System task details
 * @returns System task
 *
 * @example
 * ```typescript
 * // Post approved journal entry to general ledger
 * const systemTask = await executeSystemTask({
 *   processInstanceId: 'proc-inst-123',
 *   taskName: 'Post to General Ledger',
 *   taskType: 'post-to-gl',
 *   inputData: {
 *     journalEntryId: 'je-12345',
 *     debitAccount: '1200-AR',
 *     creditAccount: '4000-Revenue',
 *     amount: 15000,
 *     description: 'Accrued revenue adjustment Q4',
 *   },
 *   retryOnFailure: true,
 *   maxRetries: 3,
 * });
 * // Actions:
 * // - Execute GL posting API call
 * // - If success: Mark task as completed, advance process
 * // - If failure: Retry up to 3 times with exponential backoff
 * // - If all retries fail: Mark task as failed, send alert to admin
 * ```
 */
export async function executeSystemTask(
  input: ExecuteSystemTaskInput
): Promise<SystemTask> {
  const validated = executeSystemTaskSchema.parse(input);

  // TODO: Implement system task execution:
  // 1. Validate process instance exists and is active
  // 2. Insert into system_tasks table
  // 3. Execute task based on taskType:
  //    - post-to-gl: Call GL posting API
  //    - send-notification: Send email/SMS/in-app notification
  //    - generate-document: Generate PDF invoice, contract, etc.
  //    - trigger-integration: Call external API (payment gateway, CRM, etc.)
  //    - calculate: Perform calculation (netting, allocation, etc.)
  // 4. If task succeeds:
  //    - Update status = 'completed', outputData
  //    - Advance process to next step
  // 5. If task fails and retryOnFailure = true:
  //    - Update retryCount +1
  //    - If retryCount < maxRetries: Retry with exponential backoff (1s, 2s, 4s, ...)
  //    - If retryCount >= maxRetries: Update status = 'failed', send alert
  // 6. If task fails and retryOnFailure = false:
  //    - Update status = 'failed', send alert immediately
  // 7. Return system task

  return {
    id: 'sys-task-uuid',
    processInstanceId: validated.processInstanceId,
    taskName: validated.taskName,
    taskType: validated.taskType,
    inputData: validated.inputData,
    outputData: {
      glEntryId: 'gl-entry-789',
      postingDate: '2025-01-05',
      status: 'posted',
    },
    status: 'completed',
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    retryCount: 0,
    maxRetries: validated.maxRetries,
  };
}
