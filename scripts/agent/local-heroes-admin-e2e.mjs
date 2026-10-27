// Real Auth on the descriptor-confirmed disposable local DB; no service-role client.
import { readFileSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
// This file is also loaded by Playwright's CJS config transformer.
const projectRoot = process.cwd();
const runTool = (command, args, options = {}) => spawnSync(process.platform === "win32" ? "cmd.exe" : command,
  process.platform === "win32" ? ["/d", "/s", "/c", [command, ...args].join(" ")] : args,
  { cwd: projectRoot, encoding: "utf8", timeout: 30000, windowsHide: true, ...options });
const workdir = ".task-reports/local-heroes-phase-02-work/db";
export function localAdminEnvironment() {
  if (process.env.E2E_BASE_URL || process.env.LOCAL_HEROES_ADMIN_URL) throw new Error("Remote/existing-server overrides are forbidden.");
  const descriptor = JSON.parse(readFileSync(path.join(projectRoot, ".task-reports/local-heroes-disposable-db.json"), "utf8"));
  if (descriptor.kind !== "disposable-local-supabase" || descriptor.database !== "postgres" || descriptor.host !== "127.0.0.1" || descriptor.purpose !== "local-heroes-tests") throw new Error("Only the disposable descriptor is allowed.");
  if (descriptor.container !== "supabase_db_local-heroes-phase02-disposable") throw new Error("Unexpected disposable project.");
  const context = spawnSync("docker", ["context", "inspect"], { encoding: "utf8", windowsHide: true });
  const endpoint = context.status === 0 && JSON.parse(context.stdout)[0]?.Endpoints?.docker?.Host;
  if (!/^(npipe|unix):\/\//u.test(process.env.DOCKER_HOST || endpoint || "")) throw new Error("Only a local Docker daemon is allowed.");
  const inspection = spawnSync("docker", ["inspect", descriptor.container], { encoding: "utf8", windowsHide: true });
  if (inspection.status !== 0) throw new Error("Disposable DB unavailable.");
  const target = JSON.parse(inspection.stdout)[0];
  const config = readFileSync(path.join(projectRoot, workdir, "supabase/config.toml"), "utf8");
  if (!target.State.Running || target.Config.Labels["com.supabase.cli.project"] !== "local-heroes-phase02-disposable" || target.Config.Labels["com.docker.compose.project"] !== "local-heroes-phase02-disposable" || !target.NetworkSettings.Ports["5432/tcp"]?.some((p) => p.HostPort === "55342") || !config.includes('project_id = "local-heroes-phase02-disposable"')) throw new Error("Disposable identity mismatch.");
  const status = runTool("supabase", ["status", "--workdir", workdir, "-o", "json"]);
  if (status.status !== 0) throw new Error("Disposable Auth/API unavailable.");
  const settings = JSON.parse(status.stdout);
  if (settings.API_URL !== "http://127.0.0.1:55341" || !settings.ANON_KEY) throw new Error("Only the disposable loopback API is allowed.");
  return { ...process.env, NoDefaultCurrentDirectoryInExePath: "1", LOCAL_HEROES_ADMIN_E2E: "1", LOCAL_HEROES_E2E: "", SUPABASE_SERVICE_ROLE_KEY: "",
    NODE_OPTIONS: [process.env.NODE_OPTIONS, "--use-system-ca"].filter(Boolean).join(" "),
    NEXT_PUBLIC_SUPABASE_URL: settings.API_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: settings.ANON_KEY, NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3115" };
}
export function seedAdminFixture() {
  localAdminEnvironment();
  const args = ["exec", "-i", "supabase_db_local-heroes-phase02-disposable", "psql", "-U", "postgres", "-d", "postgres", "-X", "-v", "ON_ERROR_STOP=1"];
  const empty = spawnSync("docker", [...args, "-tA", "-c", "select count(*) from auth.users;"], { encoding: "utf8", windowsHide: true });
  if (empty.status !== 0 || empty.stdout.trim() !== "0") throw new Error("Requires an empty disposable Auth baseline; reset only that confirmed project before rerunning.");
  const sql = "begin;\n" + readFileSync(path.join(projectRoot, "supabase/tests/fixtures/local-heroes.inc"), "utf8") + readFileSync(path.join(projectRoot, "tests/e2e/fixtures/local-heroes-admin.sql"), "utf8") + "\ncommit;\n";
  const seeded = spawnSync("docker", args, { input: sql, encoding: "utf8", windowsHide: true });
  if (seeded.status !== 0) throw new Error("Synthetic local seeding failed: " + (seeded.stderr.match(/ERROR:.*$/mu)?.[0] ?? "local SQL error"));
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.join(projectRoot, "scripts/agent/local-heroes-admin-e2e.mjs")) {
  const env = localAdminEnvironment();
  if (process.argv[2] === "build") {
    const r = runTool("pnpm", ["build"], { env, timeout: 240000, maxBuffer: 8 * 1024 * 1024 });
    process.stdout.write(r.stdout ?? ""); process.stderr.write(r.stderr ?? ""); process.exitCode = r.status ?? 1;
  } else if (process.argv[2] === "start") {
    const app = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-H", "127.0.0.1", "-p", "3115"], { cwd: projectRoot, env, stdio: "inherit", windowsHide: true });
    process.on("SIGTERM", () => app.kill()); process.on("SIGINT", () => app.kill()); app.on("exit", (code) => { process.exitCode = code ?? 1; });
  } else throw new Error("Use build or start.");
}
