import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import { assessIndex, manageIndex } from "./codegraph.mjs";

const root = path.resolve(".");
function healthy() {
  return { initialized: true, projectPath: root, fileCount: 700,
    pendingChanges: { added: 0, modified: 0, removed: 0 },
    index: { state: "complete", pendingRefs: 0, reindexRecommended: false } };
}

describe("CodeGraph health", () => {
  it("accepts a complete current index and identifies each incomplete state", () => {
    assert.deepEqual(assessIndex(healthy(), root), []);
    for (const state of [
      { initialized: false },
      { ...healthy(), projectPath: path.resolve("../other-checkout") },
      { ...healthy(), pendingChanges: { added: 1, modified: 0, removed: 0 } },
      { ...healthy(), pendingChanges: {} },
      { ...healthy(), index: { ...healthy().index, state: "partial" } },
      { ...healthy(), index: { ...healthy().index, pendingRefs: 2 } },
      { ...healthy(), index: { ...healthy().index, reindexRecommended: true } },
      { ...healthy(), worktreeMismatch: { worktreeRoot: "a", indexRoot: "b" } },
      {},
    ]) assert.ok(assessIndex(state, root).length > 0, JSON.stringify(state));
  });

  it("does not initialize or rebuild an index during normal sync on a fresh clone", () => {
    const calls = [];
    const result = manageIndex("sync", { root, hasIndex: () => false,
      run: (...args) => { calls.push(args); return { status: 0 }; } });
    assert.equal(result.ok, false);
    assert.match(result.message, /agent:index/);
    assert.deepEqual(calls, []);
  });

  it("syncs first, then verifies the resulting index instead of trusting the exit code", () => {
    const calls = [];
    const result = manageIndex("sync", { root, hasIndex: () => true,
      run: (command, args) => {
        calls.push([command, args]);
        return { status: 0, stdout: args[0] === "status" ? JSON.stringify({
          ...healthy(), pendingChanges: { added: 0, modified: 1, removed: 0 },
        }) : "Sync finished" };
      } });
    assert.equal(result.ok, false);
    assert.deepEqual(calls.map(([, args]) => args[0]), ["sync", "status"]);
  });

  it("reports absent tools, failed sync and malformed status without claiming success", () => {
    for (const output of [
      { status: null, error: { code: "ENOENT" } },
      { status: 1, stderr: "locked" },
      { status: 0, stdout: "not JSON" },
    ]) {
      const result = manageIndex("status", { root, hasIndex: () => true, run: () => output });
      assert.equal(result.ok, false);
    }
    let calls = 0;
    const result = manageIndex("sync", { root, hasIndex: () => true,
      run: () => { calls++; return { status: 1, stderr: "locked" }; } });
    assert.equal(result.ok, false);
    assert.equal(calls, 1);
  });

  it("initializes a fresh clone explicitly and checks the result", () => {
    const calls = [];
    const result = manageIndex("rebuild", { root, hasIndex: () => false,
      run: (command, args) => {
        calls.push(args[0]);
        return { status: 0, stdout: args[0] === "status" ? JSON.stringify(healthy()) : "Indexed" };
      } });
    assert.equal(result.ok, true);
    assert.deepEqual(calls, ["init", "status"]);
  });
});
