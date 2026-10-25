import assert from "node:assert/strict";
import { it } from "node:test";
import { assessRuntime } from "./doctor.mjs";

it("requires the repository runtime rather than any installed Node/pnpm version", () => {
  assert.deepEqual(assessRuntime("v24.14.0", "11.7.0"), []);
  assert.match(assessRuntime("v22.0.0", "11.7.0").join(" "), /Node/);
  assert.match(assessRuntime("v24.14.0", "10.0.0").join(" "), /pnpm/);
  assert.equal(assessRuntime(null, null).length, 2);
});
