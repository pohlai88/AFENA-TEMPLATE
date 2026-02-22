import type { MigrationJob, MigrationResult, GateResult } from '../types/migration-job.js';

/**
 * Preflight and postflight gates are distinct types
 * so they can't accidentally be mixed.
 */

export interface PreflightGate {
  readonly name: string;
  check(job: MigrationJob): Promise<GateResult>;
}

export interface PostflightGate {
  readonly name: string;
  check(job: MigrationJob, result: MigrationResult): Promise<GateResult>;
}

export class PreflightGateChain {
  private gates: PreflightGate[] = [];

  addGate(gate: PreflightGate): this {
    this.gates.push(gate);
    return this;
  }

  async run(job: MigrationJob): Promise<GateResult> {
    for (const gate of this.gates) {
      const result = await gate.check(job);
      if (!result.passed) return result;
    }
    return { passed: true };
  }
}

export class PostflightGateChain {
  private gates: PostflightGate[] = [];

  addGate(gate: PostflightGate): this {
    this.gates.push(gate);
    return this;
  }

  async run(job: MigrationJob, result: MigrationResult): Promise<GateResult> {
    for (const gate of this.gates) {
      const gateResult = await gate.check(job, result);
      if (!gateResult.passed) return gateResult;
    }
    return { passed: true };
  }
}
