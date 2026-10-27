import { describe, expect, it } from "vitest";
import { validateTargetDescriptor } from "../rls/local-heroes-concurrency.mjs";
describe("local hero database test target", () => {
  const target = { kind: "disposable-local-supabase", container: "supabase_db_local-heroes-phase02-disposable", database: "postgres", host: "127.0.0.1", purpose: "local-heroes-tests" };
  it("requires the exact disposable descriptor before any SQL", () => {
    expect(validateTargetDescriptor(target)).toEqual(target);
    for (const value of [null, { ...target, host: "remote.example.invalid" }, { ...target, container: "supabase_db_working-project" }, { ...target, dbUrl: "postgres://remote.invalid/postgres" }, { ...target, purpose: "development" }]) expect(() => validateTargetDescriptor(value)).toThrow();
  });
});
