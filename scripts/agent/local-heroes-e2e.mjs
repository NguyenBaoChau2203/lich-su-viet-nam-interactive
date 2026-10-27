// Explicit public fixture; never reads keys or attaches to a remote/existing server.
import { spawn } from "node:child_process";
import { isMain, projectRoot, runTool } from "./runtime.mjs";
import smoke from "./smoke-env.json" with { type: "json" };
export const localHeroesEnvironment = { ...smoke, LOCAL_HEROES_E2E: "1", LOCAL_HEROES_ADMIN_E2E: "", SUPABASE_SERVICE_ROLE_KEY: "",
  NODE_OPTIONS: [process.env.NODE_OPTIONS, "--use-system-ca"].filter(Boolean).join(" "),
  NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54329", NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3114", NoDefaultCurrentDirectoryInExePath: "1" };
if (isMain(import.meta.url)) {
  if (process.env.E2E_BASE_URL) throw new Error("Existing/remote server overrides are forbidden.");
  const env = { ...process.env, ...localHeroesEnvironment };
  if (process.argv[2] === "build") {
    const r = runTool("pnpm", ["build"], { env, timeout: 240000, maxBuffer: 8 * 1024 * 1024 });
    process.stdout.write(r.stdout ?? ""); process.stderr.write(r.stderr ?? ""); process.exitCode = r.status ?? 1;
  } else if (process.argv[2] === "start") {
    const child = spawn(process.execPath, ["tests/e2e/local-heroes-catalog-server.mjs"], { cwd: projectRoot, env, stdio: "inherit", windowsHide: true });
    process.on("SIGTERM", () => child.kill()); process.on("SIGINT", () => child.kill()); child.on("exit", (code) => { process.exitCode = code ?? 1; });
  } else throw new Error("Use build or start.");
}
