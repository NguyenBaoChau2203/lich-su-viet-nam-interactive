import { describe, expect, it } from "vitest";
import { resolveJourneyMedia, type JourneyStopMedia } from "@/lib/explorer/journeys/media";
import { JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";
import fs from "node:fs";
import { createHash } from "node:crypto";

const eligible: JourneyStopMedia = { kind: "historical-photo", url: "https://example.org/image.jpg", alt: "Synthetic archival event", caption: "Synthetic archival photograph",
  creator: "Test photographer", rights: "CC BY 4.0", rightsUrl: "https://creativecommons.org/licenses/by/4.0/", sourcePage: "https://example.org/object/1",
  accessedAt: "2026-10-25", relevance: "Illustrates this test stop's location only", evidence: "verified", rightsStatus: "cleared", width: 640, height: 360 };
describe("stop-specific reviewed media", () => {
  it("rejects modern place photographs even when attribution and a license are present", () => {
    expect(resolveJourneyMedia("a", "one", { "a:one": { ...eligible, kind: "present-day-place" } })).toBeNull();
  });
  it("provides a sourced local image within the delivery bound for each authored identity", () => {
    const ledger = JSON.parse(fs.readFileSync("docs/audits/sources/2026-10-25-journey-media.json", "utf8"));
    const identities = [...new Set(JOURNEY_REGISTRY.journeys.flatMap((journey) => journey.stops.map((stop) => `${stop.origin?.journeyId ?? journey.id}:${stop.origin?.stopId ?? stop.id}`)))];
    expect(ledger.decisions.map((entry: { pair: string }) => entry.pair).sort()).toEqual(identities.sort());
    for (const journey of JOURNEY_REGISTRY.journeys) for (const stop of journey.stops) {
      const media = resolveJourneyMedia(stop.origin?.journeyId ?? journey.id, stop.origin?.stopId ?? stop.id);
      expect(media, `${journey.id}:${stop.id}`).not.toBeNull();
      const file = fs.readFileSync(`public${media!.url}`);
      expect(file.length).toBeLessThanOrEqual(200 * 1024);
      const source = ledger.assets.find((entry: { url: string }) => entry.url === media!.url);
      expect(source.sourcePage).toBe(media!.sourcePage);
      expect(source.sha256).toBe(createHash("sha256").update(file).digest("hex"));
      expect(source.locator).toBeTruthy();
      expect(["historical-photo", "document", "illustration"]).toContain(media!.kind);
    }
  });
  it("admits sourced coursework images only with the owner's explicit educational-use basis", () => {
    const records = { "a:one": { ...eligible, rightsStatus: "educational-use", useBasis: "owner-authorized-coursework-2026-10-25" } as JourneyStopMedia };
    expect(resolveJourneyMedia("a", "one", records)).not.toBeNull();
    delete records["a:one"].useBasis;
    expect(resolveJourneyMedia("a", "one", records)).toBeNull();
  });
  it("never inherits an image from a parent event or another journey/stop", () => {
    const records = { "a:one": eligible };
    expect(resolveJourneyMedia("a", "one", records)).toEqual(eligible);
    expect(resolveJourneyMedia("a", "two", records)).toBeNull();
    expect(resolveJourneyMedia("b", "one", records)).toBeNull();
  });
  it.each([{ rightsStatus: "needs_evidence" }, { evidence: "needs_evidence" }, { creator: "" }, { rightsUrl: "" }, { sourcePage: "" }, { relevance: "" }, { kind: "unknown" }])("rejects incomplete or unsupported media %o", (patch) => {
    expect(resolveJourneyMedia("a", "one", { "a:one": { ...eligible, ...patch } as JourneyStopMedia })).toBeNull();
  });
});
