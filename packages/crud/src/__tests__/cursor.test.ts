/**
 * Cursor codec unit tests — Phase 2B.
 *
 * Verifies:
 * - encodeCursor / decodeCursor round-trip
 * - Invalid cursor throws (base64url, JSON, keys, createdAt, id)
 * - buildCursorWhere produces correct WHERE shape
 */

import { describe, expect, it } from 'vitest';

import { buildCursorWhere, decodeCursor, encodeCursor } from '../cursor';

describe('cursor codec', () => {
  it('encodeCursor produces base64url string', () => {
    const payload = { createdAt: '2024-01-15T12:00:00.000Z', id: '550e8400-e29b-41d4-a716-446655440000' };
    const encoded = encodeCursor(payload);
    expect(encoded).toBeTypeOf('string');
    expect(encoded).not.toContain('+');
    expect(encoded).not.toContain('/');
    expect(encoded).not.toContain('=');
  });

  it('decodeCursor round-trips valid payload', () => {
    const payload = { createdAt: '2024-01-15T12:00:00.000Z', id: '550e8400-e29b-41d4-a716-446655440000' };
    const encoded = encodeCursor(payload);
    const decoded = decodeCursor(encoded);
    expect(decoded.createdAtIso).toBe(payload.createdAt);
    expect(decoded.createdAt.getTime()).toBe(new Date(payload.createdAt).getTime());
    expect(decoded.id).toBe(payload.id);
  });

  it('invalid base64url throws', () => {
    expect(() => decodeCursor('!!!invalid!!!')).toThrow('Invalid cursor');
  });

  it('invalid JSON throws', () => {
    const bad = Buffer.from('not json', 'utf8').toString('base64url');
    expect(() => decodeCursor(bad)).toThrow('Invalid cursor');
  });

  it('non-object JSON throws', () => {
    const bad = Buffer.from('"string"', 'utf8').toString('base64url');
    expect(() => decodeCursor(bad)).toThrow('Invalid cursor');
  });

  it('unknown key throws', () => {
    const bad = Buffer.from(JSON.stringify({ createdAt: '2024-01-15T12:00:00.000Z', id: '550e8400-e29b-41d4-a716-446655440000', extra: true }), 'utf8').toString('base64url');
    expect(() => decodeCursor(bad)).toThrow('Invalid cursor');
  });

  it('invalid createdAt throws', () => {
    const bad = Buffer.from(JSON.stringify({ createdAt: 'x', id: '550e8400-e29b-41d4-a716-446655440000' }), 'utf8').toString('base64url');
    expect(() => decodeCursor(bad)).toThrow('Invalid cursor');
  });

  it('invalid id (too short) throws', () => {
    const bad = Buffer.from(JSON.stringify({ createdAt: '2024-01-15T12:00:00.000Z', id: 'short' }), 'utf8').toString('base64url');
    expect(() => decodeCursor(bad)).toThrow('Invalid cursor');
  });

  it('buildCursorWhere returns valid WHERE clause', () => {
    const table = { createdAt: 'created_at' as const, id: 'id' as const };
    const decoded = decodeCursor(encodeCursor({ createdAt: '2024-01-15T12:00:00.000Z', id: '550e8400-e29b-41d4-a716-446655440000' }));
    const where = buildCursorWhere(table as any, decoded);
    expect(where).toBeDefined();
    expect(where).toBeTruthy();
  });
});
