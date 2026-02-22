import type { DomainIntent } from './domain-intent';

export type DomainResult<TRead = unknown> =
  | { kind: 'read'; data: TRead }
  | { kind: 'intent'; intents: DomainIntent[] }
  | { kind: 'intent+read'; data: TRead; intents: DomainIntent[] };
