import { describe, expect, it } from "vitest";
import { hasRemoteMatch } from "next/dist/shared/lib/match-remote-pattern";
import config from "../../next.config";
import { loadPackage } from "../../scripts/content/local-heroes-validator.mjs";

describe("reviewed original figure image delivery policy", () => {
  it("permits each accepted original while rejecting unrelated files on newly admitted hosts", () => {
    const d = loadPackage().documents as { media: { records: { id: string; decision: string; fileUrl: string }[] } };
    const patterns = config.images?.remotePatterns ?? [];
    const accepted = d.media.records.filter((m: { decision: string }) => m.decision === "accepted");
    expect(accepted).toHaveLength(35);
    for (const media of accepted) expect(hasRemoteMatch([], patterns, new URL(media.fileUrl)), media.id).toBe(true);
    for (const host of ["laichau.dcs.vn", "media.baosonla.org.vn", "bqn.1cdn.vn", "file.qdnd.vn"])
      expect(hasRemoteMatch([], patterns, new URL(`https://${host}/SYNTHETIC-UNREVIEWED.jpg`)), host).toBe(false);
  });
});
