export type HarnessId = 'codex' | 'antigravity' | 'opencode';

export interface ToolchainUpstream {
  id: string;
  repository: string;
  revision: string;
  license: string;
  purpose: string;
}

export interface ToolchainLock {
  schemaVersion: 1;
  approvedOn: string;
  upstreams: ToolchainUpstream[];
}

export function loadToolchain(rootDir: string): Promise<ToolchainLock>;
export function commandsForHarness(lock: ToolchainLock, harness: HarnessId): string[];
