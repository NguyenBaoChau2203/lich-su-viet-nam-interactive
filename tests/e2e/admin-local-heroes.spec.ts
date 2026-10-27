import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createServerClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { mkdirSync, writeFileSync } from "node:fs";

const diagnostics = new WeakMap<Page, { kind: string; message?: string; path?: string; status?: number }[]>();
test.beforeEach(async ({ page }) => {
  const records: NonNullable<ReturnType<typeof diagnostics.get>> = [];
  diagnostics.set(page, records);
  page.on("pageerror", (error) => records.push({ kind: "pageerror", message: error.message.slice(0, 500) }));
  page.on("response", (response) => {
    if (response.status() >= 400) records.push({ kind: "http-error", path: new URL(response.url()).pathname, status: response.status() });
  });
  page.on("requestfailed", (request) => records.push({ kind: "requestfailed", path: new URL(request.url()).pathname, message: request.failure()?.errorText }));
});
test.afterEach(async ({ page }, info) => {
  mkdirSync("output/playwright/local-heroes-admin/diagnostics", { recursive: true });
  const records = diagnostics.get(page) ?? [];
  writeFileSync(`output/playwright/local-heroes-admin/diagnostics/${info.title.replace(/[^a-z0-9]+/giu, "-")}.json`, JSON.stringify(records, null, 2) + "\n");
  expect(records.filter((record) => record.kind === "pageerror")).toEqual([]);
});

const VIEWPORTS = [
  { width: 1280, height: 720 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;

const id = "cc000000-0000-4000-8000-000000000001";
const edit = `/quan-tri/noi-dung/nhan-vat/${id}`;
const review = `/quan-tri/kiem-duyet/nhan-vat/${id}`;
async function login(context: BrowserContext, role: string) {
  const client = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: { getAll: () => [], setAll: async (cookies) => {
      await context.addCookies(cookies.map(({ name, value }) => ({ name, value, url: "http://127.0.0.1:3115", sameSite: "Lax" as const })));
    } },
  });
  const { error } = await client.auth.signInWithPassword({ email: `lh-${role}@example.invalid`, password: "LocalHeroes-Synthetic-2026!" });
  if (error) throw new Error(`Disposable synthetic sign-in failed (${error.code}).`);
}
const form = (page: Page) => page.locator("form").filter({ has: page.locator('input[name="catalog_graph_json"]') });

test("anonymous, reviewer and locked staff cannot edit; editor cannot review", async ({ page, context }) => {
  await page.goto(edit); await expect(page).toHaveURL(/quan-tri\/dang-nhap/);
  await login(context, "reviewer"); await page.goto(edit); await expect(page).toHaveURL(/khong-co-quyen/);
  await context.clearCookies(); await login(context, "locked-editor"); await page.goto(edit); await expect(page).toHaveURL(/tai-khoan-bi-khoa/);
  await context.clearCookies(); await login(context, "editor"); await page.goto(review); await expect(page).toHaveURL(/khong-co-quyen/);
});

for (const viewport of VIEWPORTS) test(`real editor form, keyboard and scrolling ${viewport.width}x${viewport.height}`, async ({ page, context }) => {
  await page.setViewportSize(viewport); await login(context, "editor"); await page.goto(edit);
  await expect(page.getByRole("heading", { name: "Đóng góp cách mạng và thời kỳ lịch sử" })).toBeVisible();
  await expect(page.locator("select").filter({ has: page.locator('option[value="01"]') }).last().locator("option")).toHaveCount(34);
  const name = form(page).getByLabel("Tên nhân vật", { exact: false });
  await name.focus(); await expect(name).toBeFocused(); await page.keyboard.press("Tab");
  expect(await page.evaluate(() => document.activeElement?.tagName)).toBe("INPUT");
  expect(await page.evaluate(() => document.activeElement && getComputedStyle(document.activeElement).outlineStyle)).not.toBe("none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await form(page).getByRole("button", { name: "Lưu", exact: true }).scrollIntoViewIfNeeded();
  await expect(form(page).getByRole("button", { name: "Lưu", exact: true })).toBeInViewport();
  mkdirSync("output/playwright/local-heroes-admin", { recursive: true });
  const axe = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  writeFileSync(`output/playwright/local-heroes-admin/axe-${viewport.width}x${viewport.height}.json`, JSON.stringify({ viewport, violations: axe.violations, passedRules: axe.passes.map((p) => p.id) }, null, 2) + "\n");
  expect(axe.violations).toEqual([]);
  await page.screenshot({ path: `output/playwright/local-heroes-admin/editor-${viewport.width}x${viewport.height}.png` });
});

test("saves twice with fresh revisions, preserves invalid input and rejects a stale tab", async ({ page, context }) => {
  await login(context, "editor"); await page.goto(edit);
  const stale = await context.newPage(); await stale.goto(edit);
  const summary = form(page).getByLabel("Tóm tắt đóng góp tiêu biểu", { exact: false });
  const firstRevision = await form(page).locator('input[name="expected_revision"]').inputValue();
  await summary.fill("Synthetic contribution after edit"); await form(page).getByRole("button", { name: "Lưu", exact: true }).click();
  await expect(form(page).getByRole("status")).toContainText("Đã lưu hồ sơ");
  await expect(form(page).locator('input[name="expected_revision"]')).not.toHaveValue(firstRevision);
  const secondRevision = await form(page).locator('input[name="expected_revision"]').inputValue();
  await summary.fill("Synthetic contribution after second edit"); await form(page).getByRole("button", { name: "Lưu", exact: true }).click();
  // The previous success notice remains visible while the second action is pending.
  // Wait for its new revision before typing into inputs reset by the successful action.
  await expect(form(page).locator('input[name="expected_revision"]')).not.toHaveValue(secondRevision);
  await expect(form(page).getByRole("status")).toContainText("Đã lưu hồ sơ");
  await form(stale).getByLabel("Tóm tắt đóng góp tiêu biểu", { exact: false }).fill("Synthetic stale edits retained");
  await form(stale).getByRole("button", { name: "Lưu", exact: true }).click();
  await expect(form(stale).getByRole("alert")).toContainText("Hồ sơ đã thay đổi");
  await expect(form(stale).getByLabel("Tóm tắt đóng góp tiêu biểu", { exact: false })).toHaveValue("Synthetic stale edits retained");
  await stale.close();
  await form(page).getByLabel("Năm sinh", { exact: true }).fill("invalid-year");
  await expect(form(page).getByLabel("Năm sinh", { exact: true })).toHaveValue("invalid-year");
  await form(page).getByRole("button", { name: "Lưu", exact: true }).click();
  await expect(form(page).getByRole("alert")).toBeVisible();
  await expect(form(page).getByLabel("Năm sinh", { exact: true })).toHaveValue("invalid-year");
});

test("editor/reviewer revision loop, atomic publish/hide/republish and admin restore", async ({ page, context }) => {
  page.on("dialog", (dialog) => dialog.accept());
  await login(context, "editor"); await page.goto(edit);
  await page.getByRole("button", { name: "Gửi kiểm duyệt", exact: true }).click();
  await expect(page).toHaveURL(/thong-bao=da-gui-duyet/);
  await context.clearCookies(); await login(context, "reviewer"); await page.goto(review);
  await expect(page.getByText("Synthetic sourced story", { exact: true })).toBeVisible();
  await expect(page.locator('a[href="#nguon-bb000000-0000-4000-8000-000000000002"]')).toHaveCount(1);
  await expect(page.locator("#nguon-bb000000-0000-4000-8000-000000000002")).toContainText("Synthetic source 2");
  await page.getByLabel("Lý do yêu cầu chỉnh sửa", { exact: false }).fill("Synthetic reviewer request for clearer wording");
  await page.getByRole("button", { name: "Yêu cầu chỉnh sửa", exact: true }).click();
  await expect(page).toHaveURL(/thong-bao=/);
  await context.clearCookies(); await login(context, "editor"); await page.goto(edit);
  await expect(page.getByText("Synthetic reviewer request for clearer wording", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Gửi kiểm duyệt", exact: true }).click(); await expect(page).toHaveURL(/thong-bao=da-gui-duyet/);
  await context.clearCookies(); await login(context, "reviewer"); await page.goto(review);
  await page.getByRole("button", { name: "Công bố", exact: true }).click(); await expect(page).toHaveURL(/thong-bao=/);
  // Real Next GET -> anonymous Supabase RPC -> disposable Postgres, even with a staff cookie.
  const publicResponse = await page.request.get("/api/local-heroes"); expect(publicResponse.status()).toBe(200);
  const published = (await publicResponse.json()).data;
  expect(published.totalPeople).toBe(1); expect(published.items).toHaveLength(1);
  expect(published.coverage.byLocality.find((l: { code: string }) => l.code === "01").eligiblePeople).toBe(1);
  expect(published.coverage.byLocality.find((l: { code: string }) => l.code === "04").eligiblePeople).toBe(1);
  expect(published.coverage.byLocality.find((l: { code: string }) => l.code === "08").eligiblePeople).toBe(0);
  expect(JSON.stringify(published)).not.toContain("PRIVATE_");
  const publicDetail = await page.request.get("/nhan-vat/lh-synthetic-one"); expect(publicDetail.status()).toBe(200); expect(await publicDetail.text()).not.toContain("PRIVATE_STORY_SENTINEL");
  await page.goto(review); await page.getByRole("button", { name: "Ẩn", exact: true }).click(); await expect(page).toHaveURL(/thong-bao=/);
  expect((await (await page.request.get("/api/local-heroes")).json()).data.totalPeople).toBe(0);
  expect((await page.request.get("/nhan-vat/lh-synthetic-one")).status()).toBe(404);
  await page.goto(review); await page.getByRole("button", { name: "Công bố lại", exact: true }).click(); await expect(page).toHaveURL(/thong-bao=/);
  await context.clearCookies(); await login(context, "admin"); await page.goto(edit);
  await expect(page.getByRole("button", { name: "Xóa vĩnh viễn", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Khôi phục về bản nháp", exact: true }).click();
  await expect(page.getByText("Đã khôi phục về bản nháp.", { exact: false })).toBeVisible();
  await expect(form(page).getByRole("button", { name: "Lưu", exact: true })).toBeVisible();
  expect((await (await page.request.get("/api/local-heroes")).json()).data.totalPeople).toBe(0);
});

test("raw Auth and PostgREST prove all eight roles and protected graph denial", async () => {
  // Config/globalSetup have already checked the exact disposable descriptor and container identity.
  expect(process.env.NEXT_PUBLIC_SUPABASE_URL).toBe("http://127.0.0.1:55341");
  const clients = new Map<string, SupabaseClient<Database>>();
  const roles = ["anon", "learner", "editor", "reviewer", "admin", "locked-editor", "locked-reviewer", "locked-admin"];
  const matrix: { role: string; draftRows: number; protectedMutationDenied: boolean; ownerSpoofDenied: boolean; sourceEditDenied: boolean }[] = [];
  for (const role of roles) {
    const client = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    if (role !== "anon") {
      const auth = await client.auth.signInWithPassword({ email: `lh-${role}@example.invalid`, password: "LocalHeroes-Synthetic-2026!" });
      if (auth.error) throw new Error(`Disposable role sign-in failed (${auth.error.code}).`);
    }
    clients.set(role, client);
    const drafts = await client.from("figure_stories").select("id").eq("figure_id", id);
    expect(drafts.error).toBeNull();
    const staff = ["editor", "reviewer", "admin"].includes(role);
    if (staff) expect(drafts.data!.length).toBeGreaterThanOrEqual(2);
    else expect(drafts.data).toEqual([]);
    matrix.push({ role, draftRows: drafts.data!.length, protectedMutationDenied: false, ownerSpoofDenied: false, sourceEditDenied: false });
  }
  const revision = async (client: SupabaseClient<Database>) => {
    const row = await client.from("historical_figures").select("revision:local_hero_revision::text").eq("id", id).single();
    expect(row.error).toBeNull(); expect(typeof row.data?.revision).toBe("string");
    return row.data!.revision;
  };
  const editor = clients.get("editor")!, reviewer = clients.get("reviewer")!, admin = clients.get("admin")!, anon = clients.get("anon")!;
  const submit = await editor.rpc("local_hero_submit_graph", { p_command: { figureId: id, expectedRevision: await revision(editor), storyIds: ["ee000000-0000-4000-8000-000000000001"] } });
  expect(submit.error).toBeNull(); expect(submit.data).toMatchObject({ ok: true });
  const promotion = await reviewer.rpc("local_hero_review_graph", { p_command: { figureId: id, expectedRevision: await revision(reviewer), action: "publish" } });
  expect(promotion.error).toBeNull(); expect(promotion.data).toMatchObject({ ok: true });
  const denied = (result: { data: unknown[] | null; error: { code: string } | null }) => {
    if (result.error) expect(["42501", "LH002"]).toContain(result.error.code);
    else expect(result.data).toEqual([]); // RLS UPDATE can correctly affect zero visible rows.
  };
  for (const entry of matrix) {
    const client = clients.get(entry.role)!;
    const publicGraph = await client.rpc("local_hero_profile", { p_slug: "lh-synthetic-one" }, { get: true });
    expect(publicGraph.error).toBeNull(); expect(publicGraph.data).not.toBeNull();
    expect(JSON.stringify(publicGraph.data)).not.toContain("PRIVATE_");
    const source = await client.from("sources").select("id").eq("id", "bb000000-0000-4000-8000-000000000002");
    expect(source.error).toBeNull(); expect(source.data).toHaveLength(1);
    const privateSource = await client.from("sources").select("id").eq("id", "bb000000-0000-4000-8000-000000000006");
    if (!["editor", "reviewer", "admin"].includes(entry.role)) expect(privateSource.data).toEqual([]);
    denied(await client.from("figure_localities").update({ explanation: "Synthetic forbidden raw rewrite" }).eq("figure_id", id).select("id"));
    entry.protectedMutationDenied = true;
    denied(await client.from("figure_sources").update({ figure_id: "cc000000-0000-4000-8000-000000000002" }).eq("figure_id", id).eq("claim_key", "identity").select("figure_id"));
    entry.ownerSpoofDenied = true;
    denied(await client.from("sources").update({ title: "Synthetic forbidden source rewrite" }).eq("id", "bb000000-0000-4000-8000-000000000001").select("id"));
    entry.sourceEditDenied = true;
    if (["learner", "reviewer", "locked-editor", "locked-reviewer", "locked-admin"].includes(entry.role)) {
      const save = await client.rpc("local_hero_save_graph", { p_command: {} });
      expect(save.error).toBeNull(); expect(save.data).toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
    }
  }
  const unchanged = await anon.from("figure_sources").select("claim_text").eq("figure_id", id).eq("claim_key", "identity");
  expect(unchanged.data?.[0].claim_text).toBe("Synthetic claim identity");
  const restore = await admin.rpc("local_hero_restore_draft", { p_command: { figureId: id, expectedRevision: await revision(admin) } });
  expect(restore.error).toBeNull(); expect(restore.data).toMatchObject({ ok: true });
  const hidden = await anon.rpc("local_hero_profile", { p_slug: "lh-synthetic-one" }, { get: true });
  expect(hidden.data).toBeNull();
  writeFileSync("output/playwright/local-heroes-admin/raw-role-matrix.json", JSON.stringify({ target: "disposable-loopback-only", roles: matrix, localPromotionWithdrawnToDraft: true }, null, 2) + "\n");
});
