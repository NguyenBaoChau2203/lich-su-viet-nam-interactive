import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { setupHooks } from "./setup.mjs";

async function fixture(t) {
  const root = await mkdtemp(path.join(tmpdir(), "history agent hooks "));
  t.after(() => rm(root, { recursive: true, force: true }));
  const git = (...args) => spawnSync("git", args, { cwd: root, encoding: "utf8" });
  assert.equal(git("init", "--quiet").status, 0);
  await mkdir(path.join(root, ".githooks"));
  for (const hook of ["post-checkout", "post-merge", "post-commit"])
    await writeFile(path.join(root, ".githooks", hook), "#!/bin/sh\nexit 0\n");
  return { root, git };
}

describe("local Git hook setup", () => {
  it("is idempotent in a checkout whose path contains spaces", async (t) => {
    const { root, git } = await fixture(t);
    assert.equal((await setupHooks(root)).ok, true);
    assert.equal((await setupHooks(root)).ok, true);
    assert.equal(git("config", "--local", "--get", "core.hooksPath").stdout.trim(), ".githooks");
  });

  it("preserves an existing custom hooksPath", async (t) => {
    const { root, git } = await fixture(t);
    git("config", "--local", "core.hooksPath", "owner-hooks");
    assert.equal((await setupHooks(root)).ok, false);
    assert.equal(git("config", "--get", "core.hooksPath").stdout.trim(), "owner-hooks");
  });

  it("preserves active scripts in the default hook directory", async (t) => {
    const { root, git } = await fixture(t);
    const hook = path.join(root, ".git", "hooks", "pre-commit");
    const content = "#!/bin/sh\n# owner policy\nexit 0\n";
    await writeFile(hook, content);
    assert.equal((await setupHooks(root)).ok, false);
    assert.equal(await readFile(hook, "utf8"), content);
    assert.equal(git("config", "--local", "--get", "core.hooksPath").status, 1);
  });
});
