// Real psql sessions, synthetic data, explicitly disposable local Docker target only.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, spawnSync } from "node:child_process";
import assert from "node:assert/strict";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export function validateTargetDescriptor(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.keys(value).sort().join(",") !== "container,database,host,kind,purpose" || value.kind !== "disposable-local-supabase" || value.database !== "postgres" || value.host !== "127.0.0.1" || value.purpose !== "local-heroes-tests" || typeof value.container !== "string" || !/^supabase_db_local-heroes-[a-z0-9-]*disposable$/u.test(value.container)) throw new Error("Only the exact disposable local Supabase target is allowed.");
  return value;
}

function docker(args) {
  const r = spawnSync("docker", args, { encoding: "utf8", timeout: 20000, maxBuffer: 8 * 1024 * 1024 });
  if (r.status !== 0) throw new Error("Local Docker target inspection failed.");
  return r.stdout;
}
async function resetLocalProject(workdir) {
  const args = ["db", "reset", "--local", "--no-seed", "--yes", "--workdir", workdir];
  let binary = "supabase", prefix = [];
  if (process.platform === "win32") {
    const found = spawnSync("where.exe", ["supabase"], { encoding: "utf8" });
    const candidates = (found.stdout ?? "").trim().split(/\r?\n/u).filter(Boolean);
    binary = candidates.find((c) => c.endsWith(".exe"));
    if (!binary) {
      const scripts = candidates.flatMap((c) => ["../../node_modules/supabase/dist/supabase.js", "../supabase/dist/supabase.js", "node_modules/supabase/dist/supabase.js"].map((p) => path.resolve(path.dirname(c), p)));
      const entry = scripts.find((p) => fs.existsSync(p));
      if (!entry) throw new Error("Installed Supabase CLI cannot be resolved without a shell.");
      binary = process.execPath; prefix = [entry];
    }
  }
  // Reset includes a database restart/health check. Keep it asynchronous so the runner can service IO.
  return new Promise((resolve) => {
    const child = spawn(binary, [...prefix, ...args], { stdio: ["ignore", "pipe", "pipe"], timeout: 180000 });
    let stdout = "", stderr = "", errorCode = null;
    child.stdout.on("data", (b) => { stdout += b; });
    child.stderr.on("data", (b) => { stderr += b; });
    child.once("error", (e) => { errorCode = e.code ?? "LOCAL_PROCESS_ERROR"; });
    child.once("close", (status, signal) => resolve({ status, signal, errorCode, stdout, stderr }));
  });
}
function verifyIdentity(target) {
  const context = docker(["context", "show"]).trim();
  const info = JSON.parse(docker(["context", "inspect", context]))[0];
  if (!/^(?:npipe|unix):\/\//u.test(process.env.DOCKER_HOST || info.Endpoints?.docker?.Host || "")) throw new Error("Remote Docker endpoints are forbidden.");
  const inspected = JSON.parse(docker(["inspect", target.container]))[0];
  const project = target.container.slice("supabase_db_".length);
  const config = fs.readFileSync(path.join(root, ".task-reports/local-heroes-phase-02-work/db/supabase/config.toml"), "utf8");
  if (inspected.Config.Labels["com.supabase.cli.project"] !== project || inspected.Config.Labels["com.docker.compose.project"] !== project || !config.includes('project_id = "' + project + '"') || !inspected.State.Running || !inspected.NetworkSettings.Ports["5432/tcp"]?.some((p) => p.HostPort === "55342")) throw new Error("Disposable CLI project/container/port identity mismatch.");
}

export async function runConcurrency(targetPath) {
  const target = validateTargetDescriptor(JSON.parse(fs.readFileSync(targetPath, "utf8")));
  verifyIdentity(target); // No SQL is sent until all of the checks above pass.
  const args = ["exec", "-i", target.container, "psql", "-U", "postgres", "-d", target.database, "-X", "-v", "ON_ERROR_STOP=1", "-tA"];
  const sql = (input, mustPass = true) => {
    const r = spawnSync("docker", args, { input, encoding: "utf8", timeout: 25000, maxBuffer: 8 * 1024 * 1024 });
    if (mustPass && r.status !== 0) throw new Error("Disposable SQL rehearsal failed: " + (r.stderr.match(/ERROR:.*$/mu)?.[0] ?? "local process error"));
    return r;
  };
  assert.equal(sql("select current_database()||'|'||current_setting('server_encoding')||'|'||exists(select 1 from pg_collation where collprovider='i');").stdout.trim(), "postgres|UTF8|true");
  assert.equal(sql("select count(*) from public.historical_figures where id::text like 'cc000000-%';").stdout.trim(), "0", "Refuse pre-existing fixture IDs");
  assert.equal(sql("select count(*) from auth.users;").stdout.trim(), "0", "This resettable disposable rehearsal requires an empty Auth baseline");
  const fixture = fs.readFileSync(path.join(root, "supabase/tests/fixtures/local-heroes.inc"), "utf8");
  const fid = "cc000000-0000-4000-8000-000000000001";
  const cas = "jsonb_build_object('figureId','" + fid + "','expectedRevision',(select local_hero_revision::text from public.historical_figures where id='" + fid + "')";
  const session = (input) => {
    const child = spawn("docker", args, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "", stderr = "";
    const timer = setTimeout(() => child.kill(), 20000);
    child.stdout.on("data", (b) => { stdout += b; });
    child.stderr.on("data", (b) => { stderr += b; });
    const done = new Promise((resolve, reject) => {
      child.once("error", reject);
      child.once("close", (status) => { clearTimeout(timer); resolve({ status, stdout, stderr }); });
    });
    child.stdin.end(input);
    return { done };
  };
  const waitForSleep = async () => {
    for (let i = 0; i < 15; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50)); // flush the spawned session's stdin on Windows
      if (sql("select exists(select 1 from pg_stat_activity where application_name='lh_race_a' and wait_event='PgSleep');").stdout.trim() === "t") return;
    }
    throw new Error("First session did not hold its transaction during the race.");
  };
  const observeWait = async () => {
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (sql("select exists(select 1 from pg_stat_activity where application_name='lh_race_b' and wait_event_type='Lock' and wait_event='advisory');").stdout.trim() === "t") return true;
    }
    return false;
  };
  const results = [];
  let seeded = false;
  try {
    sql("begin;\n" + fixture + "\nset constraints all immediate; commit;"); seeded = true;
    const a = session("set application_name='lh_race_a';begin;select pg_advisory_xact_lock(18012,3401);set local role authenticated;select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000003',true);select public.local_hero_submit_graph(" + cas + ",'storyIds',jsonb_build_array('ee000000-0000-4000-8000-000000000001')));select public.local_hero_review_graph(" + cas + ",'action','publish'));select pg_sleep(5);commit;");
    await waitForSleep();
    const b = session("set application_name='lh_race_b';begin;set local role authenticated;select set_config('request.jwt.claim.sub','aa000000-0000-4000-8000-000000000001',true);update public.sources set title='Forbidden racing source edit' where id='bb000000-0000-4000-8000-000000000001';commit;");
    const waited = await observeWait();
    const [ra, rb] = await Promise.all([a.done, b.done]);
    assert.equal(ra.status, 0);
    const commands = ra.stdout.split("\n").filter((line) => line.startsWith("{")).map((line) => JSON.parse(line));
    assert.equal(commands.length, 2); assert.ok(commands.every((c) => c.ok === true));
    assert.notEqual(rb.status, 0); assert.match(rb.stderr, /FORBIDDEN/u); assert.ok(waited, "Second session must actually wait on the advisory lock");
    assert.equal(sql("select workflow_status::text||'|'||(select title from public.sources where id='bb000000-0000-4000-8000-000000000001') from public.historical_figures where id='" + fid + "';").stdout.trim(), "published|Synthetic source 1");
    results.push({ case: "publish_vs_source_edit", passed: true, lockWaitObserved: true, publicationCommitted: true, sourceEditRolledBack: true });

    sql("insert into public.figure_sources select figure_id,claim_key,'bb000000-0000-4000-8000-000000000008',claim_text,locator,scope_note,certainty,uncertainty_note from public.figure_sources where figure_id='" + fid + "' and claim_key='identity';");
    // Database-owner sessions deliberately bypass actor guards to probe the deferred invariant itself.
    const c = session("set application_name='lh_race_a';begin;select pg_advisory_xact_lock(18012,3401);delete from public.figure_sources where figure_id='" + fid + "' and claim_key='identity' and source_id='bb000000-0000-4000-8000-000000000001';select pg_sleep(5);commit;");
    await waitForSleep();
    const d = session("set application_name='lh_race_b';begin;delete from public.figure_sources where figure_id='" + fid + "' and claim_key='identity' and source_id='bb000000-0000-4000-8000-000000000008';commit;");
    const waitedAgain = await observeWait();
    const [rc, rd] = await Promise.all([c.done, d.done]);
    assert.equal(rc.status, 0); assert.notEqual(rd.status, 0); assert.match(rd.stderr, /IDENTITY_SOURCE_REQUIRED/u); assert.ok(waitedAgain);
    assert.equal(sql("select count(*) from public.figure_sources where figure_id='" + fid + "' and claim_key='identity';").stdout.trim(), "1");
    results.push({ case: "two_last_links", passed: true, lockWaitObserved: true, firstDeletionCommitted: true, lastDeletionRolledBack: true, evidence: "deferred invariant under database-owner fixture sessions" });
  } finally {
    if (seeded) {
      // The existing last-active-admin guard intentionally prevents deleting the fixture's final admin.
      // Keep that guard intact; this dedicated throwaway project is reset from the complete migration snapshot.
      verifyIdentity(target);
      assert.equal(sql("select count(*) from auth.users where id::text not like 'aa000000-%' or email not like 'lh-%@example.invalid';").stdout.trim(), "0", "Refuse reset if unrelated auth users appeared");
      const reset = await resetLocalProject(path.join(root, ".task-reports/local-heroes-phase-02-work/db"));
      assert.equal(reset.status, 0, "Disposable migration reset must complete (local status=" + reset.status + ", signal=" + reset.signal + ", error=" + reset.errorCode + ")");
      assert.equal(sql("select count(*) from public.historical_figures where id::text like 'cc000000-%';").stdout.trim(), "0");
      assert.equal(sql("select count(*) from auth.users;").stdout.trim(), "0");
    }
  }
  return { target: { project: target.container.slice(12), database: target.database, host: target.host }, results, fixtureCleanup: true, cleanupMethod: "reset dedicated disposable project from its migration snapshot; last-admin guard unchanged" };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 4 || process.argv[2] !== "--target") { process.stderr.write("Usage: node tests/rls/local-heroes-concurrency.mjs --target <descriptor.json>\n"); process.exitCode = 64; }
  else runConcurrency(process.argv[3]).then((r) => process.stdout.write(JSON.stringify(r, null, 2) + "\n")).catch((e) => { process.stderr.write(e.message + "\n"); process.exitCode = 1; });
}
