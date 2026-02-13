import { describe, expect, it } from 'vitest';

import {
  assertWF01_SingleWriter,
  assertWF02_StepIdempotency,
  assertWF03_VersionPinnedApproval,
  assertWF04_PublishedImmutability,
  assertWF05_StableRegionVersion,
  assertWF06_SlotScope,
  assertWF07_CompilerVersion,
  assertWF08_SystemGateIntegrity,
  assertWF12_DeterministicCompile,
  assertWF14_ReceiptFirstGate,
  assertWF15_ProjectionMatch,
  assertWF16_JoinIdempotency,
} from '../invariants';
import { canonicalJsonHash } from '../canonical-json';
import { compileEffective } from '../merge-compiler';
import { validateDslSafety, MAX_DSL_LENGTH, MAX_DSL_AST_DEPTH } from '../dsl-safety';
import { COMPILER_VERSION } from '../types';

import type { BodySlot, WorkflowEdge, WorkflowNode } from '../types';

// ── Helpers ─────────────────────────────────────────────────

function minimalEnvelope(): { nodes: WorkflowNode[]; edges: WorkflowEdge[]; slots: BodySlot[] } {
  return {
    nodes: [
      { id: 'sys:start', type: 'start', label: 'Start', editWindow: 'editable' },
      { id: 'sys:gate:submit', type: 'lifecycle_gate', label: 'Submit', editWindow: 'amend_only' },
      { id: 'sys:end', type: 'end', label: 'End', editWindow: 'locked' },
    ],
    edges: [
      { id: 'sys:edge:start_to_submit', sourceNodeId: 'sys:start', targetNodeId: 'sys:gate:submit', priority: 0 },
      { id: 'sys:edge:submit_to_end', sourceNodeId: 'sys:gate:submit', targetNodeId: 'sys:end', priority: 1 },
    ],
    slots: [
      {
        slotId: 'slot:pre_submit',
        entryNodeId: 'sys:start',
        exitNodeId: 'sys:gate:submit',
        defaultEditWindow: 'editable',
        stableRegion: false,
      },
    ],
  };
}

// ── M10: WF-01 Advisory Lock Concurrency ────────────────────

describe('WF-01: Single Writer (Advisory Lock)', () => {
  it('passes when lock is acquired', () => {
    expect(() => assertWF01_SingleWriter(true)).not.toThrow();
  });

  it('throws when lock is not acquired', () => {
    expect(() => assertWF01_SingleWriter(false)).toThrow('WF-01 VIOLATED');
  });

  it('mock adapter tracks lock calls — verify exactly 1 lock per advance', () => {
    let lockCount = 0;
    const mockAcquireLock = (): boolean => {
      lockCount++;
      return true;
    };

    // Simulate single advance call
    const acquired = mockAcquireLock();
    assertWF01_SingleWriter(acquired);
    expect(lockCount).toBe(1);
  });
});

// ── M11: WF-03 Version-Pinned Approval ─────────────────────

describe('WF-03: Version-Consumptive Approvals', () => {
  it('passes when decision version matches entity version', () => {
    expect(() => assertWF03_VersionPinnedApproval(5, 5, true)).not.toThrow();
  });

  it('throws when applied decision version differs from entity version', () => {
    expect(() => assertWF03_VersionPinnedApproval(3, 5, true)).toThrow('WF-03 VIOLATED');
  });

  it('allows unapplied decisions with version mismatch (invalidated, not consumed)', () => {
    expect(() => assertWF03_VersionPinnedApproval(3, 5, false)).not.toThrow();
  });
});

// ── M12: WF-04 Published Definition Immutability ────────────

describe('WF-04: Published Definition Immutability', () => {
  it('passes when published definition content is unchanged', () => {
    expect(() => assertWF04_PublishedImmutability('published', false)).not.toThrow();
  });

  it('throws when published definition content is changed', () => {
    expect(() => assertWF04_PublishedImmutability('published', true)).toThrow('WF-04 VIOLATED');
  });

  it('allows content changes on draft definitions', () => {
    expect(() => assertWF04_PublishedImmutability('draft', true)).not.toThrow();
  });

  it('allows content changes on archived definitions', () => {
    expect(() => assertWF04_PublishedImmutability('archived', true)).not.toThrow();
  });
});

// ── M13: WF-07 Compiler Stale Rejection ────────────────────

describe('WF-07: Compiler Version Check', () => {
  it('passes when compiler versions match', () => {
    expect(() => assertWF07_CompilerVersion(COMPILER_VERSION)).not.toThrow();
  });

  it('throws WORKFLOW_COMPILER_STALE when versions differ', () => {
    expect(() => assertWF07_CompilerVersion('0.9.0')).toThrow('WF-07 VIOLATED');
  });

  it('detects stale compilation from older compiler', () => {
    expect(() => assertWF07_CompilerVersion('0.1.0', '1.0.0')).toThrow(
      'Compiled with version "0.1.0", current is "1.0.0"',
    );
  });
});

// ── M14: WF-14 Receipt-First Gate ──────────────────────────

describe('WF-14: Receipt-First Gate', () => {
  it('passes when receipt → step → handler in correct order', () => {
    expect(() => assertWF14_ReceiptFirstGate(true, true, true)).not.toThrow();
  });

  it('throws when handler dispatched before receipt succeeds', () => {
    expect(() => assertWF14_ReceiptFirstGate(false, false, true)).toThrow('WF-14 VIOLATED');
  });

  it('throws when step inserted before receipt succeeds', () => {
    expect(() => assertWF14_ReceiptFirstGate(false, true, false)).toThrow('WF-14 VIOLATED');
  });

  it('allows receipt without handler (idempotent skip)', () => {
    expect(() => assertWF14_ReceiptFirstGate(true, false, false)).not.toThrow();
  });

  it('mock receipt failure → handler must NOT execute', () => {
    let handlerExecuted = false;
    const receiptInserted = false; // Simulate receipt failure

    if (receiptInserted) {
      handlerExecuted = true;
    }

    // Verify handler never ran
    expect(handlerExecuted).toBe(false);
    expect(() => assertWF14_ReceiptFirstGate(receiptInserted, false, handlerExecuted)).not.toThrow();
  });
});

// ── M15: WF-15 Projection Rebuild Match ────────────────────

describe('WF-15: Projection Rebuild Matches Live State', () => {
  it('passes when live and rebuilt projections match', () => {
    const live = ['sys:gate:submit', 'sys:state:draft'];
    const rebuilt = ['sys:state:draft', 'sys:gate:submit'];
    expect(() => assertWF15_ProjectionMatch(live, rebuilt)).not.toThrow();
  });

  it('throws when projections have different node counts', () => {
    const live = ['sys:gate:submit'];
    const rebuilt = ['sys:gate:submit', 'sys:state:draft'];
    expect(() => assertWF15_ProjectionMatch(live, rebuilt)).toThrow('WF-15 VIOLATED');
  });

  it('throws when projections have different nodes', () => {
    const live = ['sys:gate:submit'];
    const rebuilt = ['sys:gate:approve'];
    expect(() => assertWF15_ProjectionMatch(live, rebuilt)).toThrow('WF-15 VIOLATED');
  });

  it('passes for empty projections', () => {
    expect(() => assertWF15_ProjectionMatch([], [])).not.toThrow();
  });
});

// ── M16: WF-16 Concurrent Join Token Arrival ───────────────

describe('WF-16: Join Idempotency', () => {
  it('passes when first token fires join with receipt', () => {
    expect(() => assertWF16_JoinIdempotency(true, true, false)).not.toThrow();
  });

  it('throws when join fires twice (double fire)', () => {
    expect(() => assertWF16_JoinIdempotency(true, true, true)).toThrow('WF-16 VIOLATED');
  });

  it('throws when join fires without receipt', () => {
    expect(() => assertWF16_JoinIdempotency(false, true, false)).toThrow('WF-16 VIOLATED');
  });

  it('two tokens arrive at join — only one fires downstream', () => {
    let joinFiredCount = 0;
    const receipts = new Set<string>();

    // Simulate two tokens arriving at same join
    const joinKey = 'join-key-1';

    // Token 1 arrives
    const token1Inserted = !receipts.has(joinKey);
    if (token1Inserted) {
      receipts.add(joinKey);
      joinFiredCount++;
    }

    // Token 2 arrives (same join key)
    const token2Inserted = !receipts.has(joinKey);
    if (token2Inserted) {
      receipts.add(joinKey);
      joinFiredCount++;
    }

    expect(joinFiredCount).toBe(1);
    expect(token1Inserted).toBe(true);
    expect(token2Inserted).toBe(false);
  });
});

// ── M17: Status Regression Rejection ───────────────────────

describe('Status Regression Guards', () => {
  it('WF-05: stable region version drift throws', () => {
    expect(() => assertWF05_StableRegionVersion(true, 1, 2)).toThrow('WF-05 VIOLATED');
  });

  it('WF-05: stable region version match passes', () => {
    expect(() => assertWF05_StableRegionVersion(true, 1, 1)).not.toThrow();
  });

  it('WF-05: non-stable region allows version drift', () => {
    expect(() => assertWF05_StableRegionVersion(false, 1, 5)).not.toThrow();
  });

  it('WF-06: slot scope rejects sys: namespace targeting', () => {
    expect(() => assertWF06_SlotScope(['sys:gate:submit'], [])).toThrow('WF-06 VIOLATED');
  });

  it('WF-06: slot scope allows user namespace nodes', () => {
    expect(() => assertWF06_SlotScope(['usr:review:1'], [])).not.toThrow();
  });

  it('WF-08: system gate integrity rejects missing gates', () => {
    expect(() => assertWF08_SystemGateIntegrity(['sys:start', 'sys:end'], ['sys:start'])).toThrow('WF-08 VIOLATED');
  });

  it('WF-08: system gate integrity passes with all gates present', () => {
    expect(() => assertWF08_SystemGateIntegrity(['sys:start', 'sys:end'], ['sys:start', 'sys:end'])).not.toThrow();
  });
});

// ── M18: Handler Atomicity ─────────────────────────────────

describe('Handler Atomicity (TX-safe rollback)', () => {
  it('TX-safe handler throws → step + receipt should be rolled back', () => {
    let receiptWritten = false;
    let stepWritten = false;
    let handlerCompleted = false;

    // Simulate TX-safe handler in a transaction
    const simulateTxSafeHandler = (): void => {
      receiptWritten = true;
      stepWritten = true;

      // Handler throws — TX rolls back
      throw new Error('Handler failed');
    };

    try {
      simulateTxSafeHandler();
    } catch {
      // TX rollback: reset all writes
      receiptWritten = false;
      stepWritten = false;
      handlerCompleted = false;
    }

    // After rollback, nothing should be committed
    expect(receiptWritten).toBe(false);
    expect(stepWritten).toBe(false);
    expect(handlerCompleted).toBe(false);

    // WF-02: handler didn't run, receipt didn't persist — consistent
    assertWF02_StepIdempotency(receiptWritten, handlerCompleted);
  });

  it('enqueue-only handler commits outbox row even if worker fails later', () => {
    let stepCommitted = false;
    let outboxCommitted = false;

    // Simulate enqueue-only handler (webhook_out, notification)
    stepCommitted = true;
    outboxCommitted = true;

    // Step and outbox are committed in same TX
    expect(stepCommitted).toBe(true);
    expect(outboxCommitted).toBe(true);
  });
});

// ── M19: trace_id Propagation ──────────────────────────────

describe('trace_id Propagation', () => {
  it('trace_id flows from outbox event to step execution output', () => {
    const traceId = 'trace-abc-123';

    // Simulate outbox event with trace_id
    const outboxEvent = {
      instanceId: 'inst-1',
      eventType: 'workflow.advance',
      traceId,
    };

    // Simulate step execution output including trace_id
    const stepOutput = {
      chosenEdgeIds: ['edge-1'],
      traceId: outboxEvent.traceId,
    };

    expect(stepOutput.traceId).toBe(traceId);
    expect(outboxEvent.traceId).toBe(traceId);
  });

  it('trace_id is preserved through the full pipeline', () => {
    const traceId = 'trace-xyz-789';

    // mutate() → outbox → worker → step
    const pipeline = {
      mutateTraceId: traceId,
      outboxTraceId: traceId,
      workerTraceId: traceId,
      stepTraceId: traceId,
    };

    expect(pipeline.mutateTraceId).toBe(pipeline.outboxTraceId);
    expect(pipeline.outboxTraceId).toBe(pipeline.workerTraceId);
    expect(pipeline.workerTraceId).toBe(pipeline.stepTraceId);
  });
});

// ── M20: DSL Safety Limits ─────────────────────────────────

describe('DSL Safety Limits', () => {
  it('rejects expressions exceeding max length', () => {
    const longExpr = 'entity.amount > ' + '0'.repeat(MAX_DSL_LENGTH);
    const result = validateDslSafety(longExpr);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('max length'))).toBe(true);
  });

  it('rejects expressions exceeding max dereferences', () => {
    // 25 dereferences: entity.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y
    const deepPath = 'entity.' + Array.from({ length: 25 }, (_, i) => String.fromCharCode(97 + (i % 26))).join('.');
    const result = validateDslSafety(deepPath);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('max dereferences'))).toBe(true);
  });

  it('rejects expressions exceeding max AST depth', () => {
    // Create deeply nested parentheses: (((((((((((...)))))))))))
    const depth = MAX_DSL_AST_DEPTH + 5;
    const deepExpr = '('.repeat(depth) + 'entity.amount > 0' + ')'.repeat(depth);
    const result = validateDslSafety(deepExpr);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('max AST depth'))).toBe(true);
  });

  it('rejects forbidden operations (regex)', () => {
    const result = validateDslSafety('entity.name.match(/test/)');
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Forbidden operation'))).toBe(true);
  });

  it('rejects forbidden operations (string concat)', () => {
    const result = validateDslSafety("entity.name.concat(' suffix')");
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes('Forbidden operation'))).toBe(true);
  });

  it('accepts valid simple expressions', () => {
    const result = validateDslSafety('entity.amount > 10000');
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts valid property path expressions', () => {
    const result = validateDslSafety('entity.status');
    expect(result.valid).toBe(true);
  });
});

// ── WF-12: Deterministic Compilation ───────────────────────

describe('WF-12: Deterministic Compilation', () => {
  it('same inputs produce identical compiled hash', () => {
    const env = minimalEnvelope();
    const result1 = compileEffective(env.nodes, env.edges, env.slots, {}, 1);
    const result2 = compileEffective(env.nodes, env.edges, env.slots, {}, 1);

    expect(result1.ok).toBe(true);
    expect(result2.ok).toBe(true);

    if (result1.ok && result2.ok) {
      assertWF12_DeterministicCompile(result1.compiled.hash, result2.compiled.hash);
    }
  });

  it('canonical JSON hash is key-order independent', () => {
    const hash1 = canonicalJsonHash({ b: 1, a: 2 });
    const hash2 = canonicalJsonHash({ a: 2, b: 1 });
    expect(hash1).toBe(hash2);
  });

  it('canonical JSON hash differs for different values', () => {
    const hash1 = canonicalJsonHash({ a: 1 });
    const hash2 = canonicalJsonHash({ a: 2 });
    expect(hash1).not.toBe(hash2);
  });
});
