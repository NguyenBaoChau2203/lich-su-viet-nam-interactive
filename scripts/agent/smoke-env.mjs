import { isMain, runTool } from "./runtime.mjs";
import fixture from "./smoke-env.json" with { type: "json" };

// Synthetic public configuration only. No Supabase service or valid key is needed.
// Next.js embeds NEXT_PUBLIC values at build time, so startup env alone is insufficient.
export const publicSmokeEnvironment = fixture;

if (isMain(import.meta.url)) {
  const result = runTool("pnpm", ["build"], { env: { ...process.env, ...publicSmokeEnvironment },
    timeout: 180_000, maxBuffer: 8 * 1024 * 1024 });
  process.stdout.write(result.stdout ?? "");
  process.stderr.write(result.stderr ?? "");
  process.exitCode = result.status ?? 1;
}
