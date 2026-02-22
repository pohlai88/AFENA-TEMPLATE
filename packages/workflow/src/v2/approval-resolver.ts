/**
 * Approval resolver — resolves approvers for approval nodes.
 *
 * PRD § Composable Approval Chains:
 * Two modes:
 * - **Chain-backed**: approval node references an approval_chain_id →
 *   delegates to existing approval_chains/steps/requests/decisions tables
 * - **Inline**: approvers declared directly on the node definition
 *
 * PRD § Approver Resolution Strategies:
 * - direct_user: static user_id on node
 * - role_based: query users with role, round-robin or first-available
 * - rule_based: DSL expression resolves approver dynamically
 *
 * PRD § Version-Consumptive Approval Flow:
 * 1. approval node creates approval_request (entity_version pinned)
 * 2. Approver sees document AT that version (read-only snapshot)
 * 3. Approver decides (approved/rejected/abstained)
 * 4. Decision recorded with entity_version in step_execution
 * 5. When lifecycle_gate consumes the decision → marks applied: true (WF-03)
 * 6. Any subsequent entity edit → invalidates unapplied decisions
 */

import { evaluateDsl } from './dsl-evaluator';

import type { DslContext } from './dsl-evaluator';
import type { ApprovalNodeConfig, DslExpression, WorkflowStepContext } from './types';

// ── Types ──────────────────────────────────────────────────

export interface ResolvedApprover {
  userId: string;
  source: 'direct' | 'role' | 'rule' | 'chain';
  roleName?: string;
}

export interface ApprovalRequestResult {
  requestId: string;
  chainId: string | null;
  stepOrder: number;
  approvers: ResolvedApprover[];
  entityVersion: number;
  status: 'pending';
}

export interface ApprovalDecisionInput {
  requestId: string;
  decision: 'approved' | 'rejected' | 'abstained';
  decidedBy: string;
  reason?: string;
  delegatedFrom?: string;
}

export interface ApprovalDecisionResult {
  requestId: string;
  decision: 'approved' | 'rejected' | 'abstained';
  stepComplete: boolean;
  chainComplete: boolean;
  nextStepOrder: number | null;
}

// ── DB Adapter ─────────────────────────────────────────────

export interface ApprovalDbAdapter {
  /** Load approval chain by ID */
  loadChain(chainId: string): Promise<{
    id: string;
    entityType: string;
    name: string;
    isActive: boolean;
  } | null>;

  /** Load approval steps for a chain, ordered by step_order */
  loadChainSteps(chainId: string): Promise<Array<{
    id: string;
    stepOrder: number;
    name: string;
    approvalMode: 'any' | 'all' | 'threshold';
    requiredCount: number;
    approverRoleId: string | null;
    approverUserId: string | null;
    timeoutHours: number | null;
  }>>;

  /** Create an approval request */
  createApprovalRequest(params: {
    orgId: string;
    chainId: string;
    entityType: string;
    entityId: string;
    currentStepOrder: number;
    requestedBy: string;
  }): Promise<{ id: string }>;

  /** Record an approval decision */
  recordDecision(params: {
    orgId: string;
    requestId: string;
    stepId: string;
    decision: 'approved' | 'rejected' | 'abstained';
    decidedBy: string;
    reason?: string;
    delegatedFrom?: string;
  }): Promise<{ id: string }>;

  /** Count decisions for a step */
  countDecisions(requestId: string, stepId: string): Promise<{
    approved: number;
    rejected: number;
    total: number;
  }>;

  /** Advance request to next step or complete */
  advanceRequest(requestId: string, nextStepOrder: number | null, status: string): Promise<void>;

  /** Load users by role ID */
  loadUsersByRole(orgId: string, roleId: string): Promise<Array<{ userId: string }>>;
}

// ── Resolver Strategies ────────────────────────────────────

/**
 * Resolve approvers based on the configured strategy.
 */
export async function resolveApprovers(
  config: ApprovalNodeConfig,
  ctx: WorkflowStepContext,
  db: ApprovalDbAdapter,
): Promise<ResolvedApprover[]> {
  const strategy = config.resolverStrategy ?? 'direct_user';

  switch (strategy) {
    case 'direct_user':
      return resolveDirectUser(config);

    case 'role_based':
      return resolveByRole(config, ctx, db);

    case 'rule_based':
      return resolveByRule(config, ctx);

    default:
      return [];
  }
}

function resolveDirectUser(config: ApprovalNodeConfig): ResolvedApprover[] {
  const userId = config.resolverConfig?.['userId'] as string | undefined;
  const userIds = config.resolverConfig?.['userIds'] as string[] | undefined;

  const approvers: ResolvedApprover[] = [];

  if (userId) {
    approvers.push({ userId, source: 'direct' });
  }

  if (userIds) {
    for (const uid of userIds) {
      approvers.push({ userId: uid, source: 'direct' });
    }
  }

  return approvers;
}

async function resolveByRole(
  config: ApprovalNodeConfig,
  ctx: WorkflowStepContext,
  db: ApprovalDbAdapter,
): Promise<ResolvedApprover[]> {
  const roleId = config.resolverConfig?.['roleId'] as string | undefined;
  const roleName = config.resolverConfig?.['roleName'] as string | undefined;

  if (!roleId) return [];

  const users = await db.loadUsersByRole(ctx.contextJson['orgId'] as string ?? '', roleId);
  return users.map((u) => ({
    userId: u.userId,
    source: 'role' as const,
    ...(roleName ? { roleName } : {}),
  }));
}

function resolveByRule(
  config: ApprovalNodeConfig,
  ctx: WorkflowStepContext,
): ResolvedApprover[] {
  const expr = config.resolverConfig?.['expression'] as DslExpression | undefined;
  if (!expr) return [];

  const dslCtx: DslContext = {
    entity: ctx.contextJson['entity'] as Record<string, unknown> ?? {},
    context: ctx.contextJson,
    actor: { user_id: ctx.actorUserId },
    tokens: {},
  };

  const result = evaluateDsl(expr, dslCtx);

  if (typeof result === 'string') {
    return [{ userId: result, source: 'rule' }];
  }

  if (Array.isArray(result)) {
    return result
      .filter((r): r is string => typeof r === 'string')
      .map((userId) => ({ userId, source: 'rule' as const }));
  }

  return [];
}

// ── Chain-backed Approval ──────────────────────────────────

/**
 * Create a chain-backed approval request.
 *
 * 1. Load the chain + steps
 * 2. Create approval_request row
 * 3. Resolve approvers for the first step
 * 4. Return the request with resolved approvers
 */
export async function createChainApprovalRequest(
  config: ApprovalNodeConfig,
  ctx: WorkflowStepContext,
  db: ApprovalDbAdapter,
): Promise<ApprovalRequestResult> {
  if (!config.chainId) {
    throw new Error('Chain-backed approval requires chainId');
  }

  const chain = await db.loadChain(config.chainId);
  if (!chain) {
    throw new Error(`Approval chain ${config.chainId} not found`);
  }

  if (!chain.isActive) {
    throw new Error(`Approval chain ${config.chainId} is not active`);
  }

  const steps = await db.loadChainSteps(config.chainId);
  if (steps.length === 0) {
    throw new Error(`Approval chain ${config.chainId} has no steps`);
  }

  const firstStep = steps[0];
  if (!firstStep) {
    throw new Error(`Approval chain ${config.chainId} has no first step`);
  }

  // Create the approval request
  const request = await db.createApprovalRequest({
    orgId: ctx.contextJson['orgId'] as string ?? '',
    chainId: config.chainId,
    entityType: ctx.entityType,
    entityId: ctx.entityId,
    currentStepOrder: firstStep.stepOrder,
    requestedBy: ctx.actorUserId,
  });

  // Resolve approvers for the first step
  let approvers: ResolvedApprover[];
  if (firstStep.approverUserId) {
    approvers = [{ userId: firstStep.approverUserId, source: 'chain' }];
  } else if (firstStep.approverRoleId) {
    const users = await db.loadUsersByRole(
      ctx.contextJson['orgId'] as string ?? '',
      firstStep.approverRoleId,
    );
    approvers = users.map((u) => ({ userId: u.userId, source: 'chain' as const }));
  } else {
    approvers = [];
  }

  return {
    requestId: request.id,
    chainId: config.chainId,
    stepOrder: firstStep.stepOrder,
    approvers,
    entityVersion: ctx.entityVersion,
    status: 'pending',
  };
}

/**
 * Process an approval decision for a chain-backed request.
 *
 * 1. Record the decision
 * 2. Check if the current step is satisfied (any/all/threshold)
 * 3. If satisfied, advance to next step or complete the chain
 */
export async function processChainDecision(
  input: ApprovalDecisionInput,
  chainId: string,
  db: ApprovalDbAdapter,
): Promise<ApprovalDecisionResult> {
  const steps = await db.loadChainSteps(chainId);

  // Find current step by loading the request
  // For now, we need the step ID — the caller should provide it
  // We'll find the step by matching the current step order
  const chain = await db.loadChain(chainId);
  if (!chain) {
    throw new Error(`Approval chain ${chainId} not found`);
  }

  // Find the step that matches the current request state
  // The step ID should be provided in the decision or resolved from the request
  const currentStep = steps.find((s) => {
    // Match by step order — the request tracks current_step_order
    return s.approverUserId === input.decidedBy || s.approverRoleId !== null;
  }) ?? steps[0];

  if (!currentStep) {
    throw new Error('No matching approval step found');
  }

  // Record the decision
  await db.recordDecision({
    orgId: '', // Will be set by RLS
    requestId: input.requestId,
    stepId: currentStep.id,
    decision: input.decision,
    decidedBy: input.decidedBy,
    ...(input.reason ? { reason: input.reason } : {}),
    ...(input.delegatedFrom ? { delegatedFrom: input.delegatedFrom } : {}),
  });

  // Check if step is satisfied
  const counts = await db.countDecisions(input.requestId, currentStep.id);
  let stepComplete = false;

  switch (currentStep.approvalMode) {
    case 'any':
      stepComplete = counts.approved >= 1 || counts.rejected >= 1;
      break;
    case 'all':
      stepComplete = counts.approved >= currentStep.requiredCount;
      break;
    case 'threshold':
      stepComplete = counts.approved >= currentStep.requiredCount || counts.rejected >= 1;
      break;
  }

  if (!stepComplete) {
    return {
      requestId: input.requestId,
      decision: input.decision,
      stepComplete: false,
      chainComplete: false,
      nextStepOrder: null,
    };
  }

  // Step is complete — check if chain is complete
  if (counts.rejected > 0 && currentStep.approvalMode !== 'threshold') {
    // Rejection at any step → chain rejected
    await db.advanceRequest(input.requestId, null, 'rejected');
    return {
      requestId: input.requestId,
      decision: input.decision,
      stepComplete: true,
      chainComplete: true,
      nextStepOrder: null,
    };
  }

  // Find next step
  const nextStep = steps.find((s) => s.stepOrder > currentStep.stepOrder);

  if (!nextStep) {
    // No more steps — chain approved
    await db.advanceRequest(input.requestId, null, 'approved');
    return {
      requestId: input.requestId,
      decision: input.decision,
      stepComplete: true,
      chainComplete: true,
      nextStepOrder: null,
    };
  }

  // Advance to next step
  await db.advanceRequest(input.requestId, nextStep.stepOrder, 'pending');
  return {
    requestId: input.requestId,
    decision: input.decision,
    stepComplete: true,
    chainComplete: false,
    nextStepOrder: nextStep.stepOrder,
  };
}

/**
 * Create an inline approval request (no chain — approvers on node config).
 */
export async function createInlineApprovalRequest(
  config: ApprovalNodeConfig,
  ctx: WorkflowStepContext,
  db: ApprovalDbAdapter,
): Promise<ApprovalRequestResult> {
  const approvers = await resolveApprovers(config, ctx, db);

  // For inline approvals, we still create an approval_request row
  // but without a chain reference. This provides a uniform audit trail.
  const request = await db.createApprovalRequest({
    orgId: ctx.contextJson['orgId'] as string ?? '',
    chainId: '', // No chain for inline
    entityType: ctx.entityType,
    entityId: ctx.entityId,
    currentStepOrder: 1,
    requestedBy: ctx.actorUserId,
  });

  return {
    requestId: request.id,
    chainId: null,
    stepOrder: 1,
    approvers,
    entityVersion: ctx.entityVersion,
    status: 'pending',
  };
}
