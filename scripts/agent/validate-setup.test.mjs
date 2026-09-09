import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { validateSetup } from "./validate-setup.mjs";

describe("agent setup", () => {
  it("has valid shared instructions, skills, and harness adapters", async () => {
    const result = await validateSetup(process.cwd());

    assert.deepEqual(result.errors, []);
    assert.equal(result.skillCount, 5);
  });
});
