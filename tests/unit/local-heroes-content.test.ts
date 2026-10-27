import { describe, expect, it } from "vitest";
import { validatePackage, validateDocuments } from "../../scripts/content/local-heroes-validator.mjs";
import { assertSupportedSchema, parseStrictJson, validateSchema } from "../../scripts/content/local-heroes-schema.mjs";
import { negativeCases } from "./fixtures/local-heroes-negative.mjs";
import { spawnSync } from "node:child_process";

describe("local hero research content gate", () => {
  it("validates the preserved v17 research draft without claiming nationwide release readiness", () => {
    const result = validatePackage("supabase/content/local-heroes/snapshots/v17");
    expect(result.valid).toBe(true);
    expect(result.manifestHash).toBe("84d8a8a5833ec66382aa4e96b50cfdfd9495e15fc1c524f2205c4279866e8dfb");
    expect(result.acceptedPeople).toBe(35);
    expect(result.completeAcceptedPeople).toBe(22);
    expect(result.representedLocalities).toBe(21);
    expect(result.totalLocalities).toBe(34);
    expect(result.releaseReady).toBe(false);
  });
  it("rejects malformed documents without treating missing provenance as a valid draft", () => {
    const result = validateDocuments({ manifest: { schemaVersion: 1 }, people: { records: [{ personKey: "new:synthetic", name: "Synthetic" }] } });
    expect(result.valid).toBe(false);
    expect(result.issues.some((issue: { code: string }) => issue.code === "SCHEMA")).toBe(true);
  });
  it.each(negativeCases())("rejects $label", ({ code, documents }) => {
    const result = validateDocuments(documents);
    expect(result.valid).toBe(false);
    expect(result.issues.map((issue: { code: string }) => issue.code)).toContain(code);
  });
  it("enforces every conditional schema rule and rejects unsupported schema keywords", () => {
    const schema = { type: "object", properties: { decision: { enum: ["accepted", "held"] }, evidence: { type: "array" } }, required: ["decision", "evidence"], additionalProperties: false, allOf: [{ if: { properties: { decision: { const: "accepted" } } }, then: { properties: { evidence: { minItems: 1 } } } }] };
    expect(validateSchema({ decision: "accepted", evidence: [] }, schema, schema)).not.toEqual([]);
    expect(validateSchema({ decision: "held", evidence: [] }, schema, schema)).toEqual([]);
    expect(() => assertSupportedSchema({ not: {} })).toThrow("Unsupported schema keyword");
    expect(() => parseStrictJson('{"x":1,"\\u0078":2}')).toThrow("Duplicate JSON key");
  });
  it("reports all 34 release coverage states and uses distinct structural/release/usage exits", () => {
    const release = validatePackage(undefined, "release");
    expect(release.valid).toBe(true);
    expect(release.releaseReady).toBe(false);
    expect(release.issues.filter((i: { code: string }) => i.code === "COVERAGE")).toHaveLength(34);
    const run = (...args: string[]) => spawnSync(process.execPath, ["scripts/content/check-local-heroes.mjs", ...args], { encoding: "utf8" });
    expect(run("--mode", "release").status).toBe(2);
    expect(run("--mode", "forged").status).toBe(64);
    const missing = run("--package", "tests/SYNTHETIC_MISSING_PACKAGE");
    expect(missing.status).toBe(1);
    expect(JSON.parse(missing.stdout).manifestVersion).toBe(0);
  });
});
