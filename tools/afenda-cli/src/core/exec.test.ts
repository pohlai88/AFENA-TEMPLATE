import { describe, it, expect, vi, beforeEach } from 'vitest';
import { execCommand, commandExists } from './exec';

vi.mock('execa', () => ({
  default: vi.fn(),
}));

const execa = (await import('execa')).default;

describe('execCommand', () => {
  beforeEach(() => {
    vi.mocked(execa).mockReset();
  });

  it('returns exit code and output from execa', async () => {
    vi.mocked(execa).mockResolvedValue({
      exitCode: 0,
      stdout: 'ok',
      stderr: '',
      command: 'echo',
      escapedCommand: 'echo',
      timedOut: false,
      isCanceled: false,
      killed: false,
    } as any);
    const result = await execCommand({
      cmd: 'echo',
      args: ['hello'],
      cwd: '/tmp',
      output: 'piped',
      shell: false,
    });
    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('ok');
    expect(result.stderr).toBe('');
    expect(execa).toHaveBeenCalledWith(
      'echo',
      ['hello'],
      expect.objectContaining({ cwd: '/tmp', reject: false }),
    );
  });

  it('passes timeout to execa', async () => {
    vi.mocked(execa).mockResolvedValue({
      exitCode: 0,
      stdout: '',
      stderr: '',
      command: 'x',
      escapedCommand: 'x',
      timedOut: false,
      isCanceled: false,
      killed: false,
    } as any);
    await execCommand({
      cmd: 'x',
      args: [],
      cwd: '.',
      output: 'piped',
      shell: false,
      timeout: 60_000,
    });
    expect(execa).toHaveBeenCalledWith(
      'x',
      [],
      expect.objectContaining({ timeout: 60_000 }),
    );
  });

  it('parses JSON when output is json', async () => {
    vi.mocked(execa).mockResolvedValue({
      exitCode: 0,
      stdout: '{"a":1}',
      stderr: '',
      command: 'x',
      escapedCommand: 'x',
      timedOut: false,
      isCanceled: false,
      killed: false,
    } as any);
    const result = await execCommand({
      cmd: 'x',
      args: [],
      cwd: '.',
      output: 'json',
      shell: false,
    });
    expect(result.parsedJson).toEqual({ a: 1 });
  });
});

describe('commandExists', () => {
  beforeEach(() => {
    vi.mocked(execa).mockReset();
  });

  it('returns true when which/where finds command', async () => {
    vi.mocked(execa).mockResolvedValue({
      exitCode: 0,
      stdout: '/usr/bin/node',
      stderr: '',
      command: 'which',
      escapedCommand: 'which',
      timedOut: false,
      isCanceled: false,
      killed: false,
    } as any);
    expect(await commandExists('node')).toBe(true);
  });

  it('returns false when command not found', async () => {
    vi.mocked(execa).mockResolvedValue({
      exitCode: 1,
      stdout: '',
      stderr: 'not found',
      command: 'which',
      escapedCommand: 'which',
      timedOut: false,
      isCanceled: false,
      killed: false,
    } as any);
    expect(await commandExists('nonexistent')).toBe(false);
  });
});
