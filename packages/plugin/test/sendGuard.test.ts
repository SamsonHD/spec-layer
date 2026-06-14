import { describe, it, expect } from 'vitest';
import { canSendToDocs, UNKNOWN_FILE_KEY } from '../src/ui/sendGuard';

describe('canSendToDocs', () => {
  it('allows sending when a real file key is present', () => {
    expect(canSendToDocs('AbC123xyz789')).toEqual({ allowed: true });
    expect(canSendToDocs('REALKEY')).toEqual({ allowed: true });
  });

  it('blocks sending when the key is the "unknown" sentinel', () => {
    const result = canSendToDocs(UNKNOWN_FILE_KEY);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/No Figma file detected/);
  });

  it('blocks sending when the key is empty string', () => {
    const result = canSendToDocs('');
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/No Figma file detected/);
  });

  it('blocks sending when the key is null', () => {
    const result = canSendToDocs(null);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/No Figma file detected/);
  });

  it('blocks sending when the key is undefined', () => {
    const result = canSendToDocs(undefined);
    expect(result.allowed).toBe(false);
    expect(result.reason).toMatch(/No Figma file detected/);
  });

  it('UNKNOWN_FILE_KEY constant matches the sentinel value', () => {
    expect(UNKNOWN_FILE_KEY).toBe('unknown');
  });
});
