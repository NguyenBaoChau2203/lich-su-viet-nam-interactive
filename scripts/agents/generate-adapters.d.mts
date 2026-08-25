export interface CanonicalRole {
  id: string;
  description: string;
  canonicalFile: string;
  readOnly: boolean;
}

export function renderAntigravityAgent(role: CanonicalRole): string;
export function renderOpenCodeAgent(role: CanonicalRole): string;
export function renderCodexAgent(role: CanonicalRole): string;
export function generateAdapters(rootDir?: string): Promise<void>;
