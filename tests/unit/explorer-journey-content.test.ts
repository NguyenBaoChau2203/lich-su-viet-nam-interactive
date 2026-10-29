import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getJourneyById, getJourneyConnections, getJourneyStop } from "@/lib/explorer/journey";
import { JOURNEY_REGISTRY, DEFAULT_JOURNEY_ID } from "@/lib/explorer/journeys/registry";
import { buildMapExplorerUrl, parseMapExplorerState } from "@/lib/explorer/map-state";
import { getExplorerReturnHref } from "@/lib/explorer/url";
import { getSgkLesson, SGK_SERIES } from "@/lib/sgk/curriculum";
import { isRealDate } from "@/lib/validation/content";
import geography from "@/docs/audits/sources/2026-10-24-additional-journey-geography.json";

// Reviewed local expectations catch content/identity regressions. Neither these tests
// nor the dated public-inventory snapshot establish external historical verification.
// Direct passage review and rejected claims are recorded in the accompanying ledger.
const sequences = [
  { id: "mua-thu-doc-lap-1945", lesson: "6-cach-mang-thang-tam-nam-1945", stops: [
    ["ha-noi-1945", "1945-08-19"], ["hue-1945", "1945-08-23"], ["sai-gon-1945", "1945-08-25"], ["ba-dinh-1945", "1945-09-02"],
  ] },
  { id: "khang-chien-chong-phap-1946-1954", lesson: "7-khang-chien-chong-phap", stops: [
    ["ha-noi-1946", "1946-12-19"], ["viet-bac-1947", "1947-10-07"], ["bien-gioi-1950", "1950-09-16"],
    ["dien-bien-phu-1954", "1954-05-07"], ["geneve-1954", "1954-07-21"],
  ] },
  { id: "mua-xuan-1975", lesson: "8-khang-chien-chong-my-cuu-nuoc", stops: [
    ["buon-ma-thuot-1975", "1975-03-10"], ["hue-1975", "1975-03-26"], ["da-nang-1975", "1975-03-29"], ["sai-gon-1975", "1975-04-30"],
  ] },
] as const;
const limits = { minYear: 1954, maxYear: 1975, eventSlugs: [] };

describe("accepted milestone content contracts", () => {
  it("exposes the four authored journeys plus the derived total without changing the legacy default", () => {
    expect(JOURNEY_REGISTRY.journeys.map((journey) => journey.id)).toEqual([
      "ho-chi-minh-1911-1941", "mua-thu-doc-lap-1945", "khang-chien-chong-phap-1946-1954", "mua-xuan-1975", "hanh-trinh-tong-hop",
    ]);
    expect(DEFAULT_JOURNEY_ID).toBe("ho-chi-minh-1911-1941");
  });

  for (const sequence of sequences) {
    it(`${sequence.id}: preserves the authored identities and chronological milestones`, () => {
      const journey = getJourneyById(sequence.id)!;
      expect(journey).toBeDefined();
      expect(journey.stops.map((stop) => [stop.id, stop.sortDate])).toEqual(sequence.stops);
      expect(journey.stops.map((stop) => stop.sortDate)).toEqual([...journey.stops.map((stop) => stop.sortDate)].sort());
      expect(new Set(journey.stops.map((stop) => stop.id)).size).toBe(sequence.stops.length);
      expect(journey.note).toMatch(/sơ đồ/i);
      expect(journey.note).toMatch(/không.*(tuyến|hành trình|đường)/i);
      for (const stop of journey.stops) {
        expect(getJourneyStop(journey.id, stop.id)).toBe(stop);
        expect(isRealDate(stop.sortDate)).toBe(true);
        expect(stop.datePrecision).toBe("day");
        const [year, month, day] = stop.sortDate.split("-");
        expect(stop.date).toContain(`${day}/${month}/${year}`);
        expect(stop.summary.length).toBeGreaterThan(35);
        expect(stop.summary.length).toBeLessThan(380);
      }
    });

    it(`${sequence.id}: carries claim sources and separately scoped coordinate provenance`, () => {
      const journey = getJourneyById(sequence.id)!;
      expect(journey).toBeDefined();
      for (const stop of journey.stops) {
        expect(stop.sources.length).toBeGreaterThan(0);
        for (const source of [...stop.sources, stop.coordinateSource]) {
          expect(source.title.trim().length).toBeGreaterThan(10);
          expect(source.publisher.trim().length).toBeGreaterThan(5);
          expect(isRealDate(source.accessedAt)).toBe(true);
          expect(source.scope.trim().length).toBeGreaterThan(30);
          expect(source.url).toMatch(/^(https:\/\/|\/dia-diem\/[a-z0-9-]+$)/);
        }
        expect(stop.sources.every((source) => source.url.startsWith("https://"))).toBe(true);
        expect(stop.accuracy).toBe("approximate");
        expect(stop.accuracyNote.length).toBeGreaterThan(60);
        expect(stop.accuracyNote).toMatch(/không/i);
        expect(Number.isFinite(stop.view.lat) && Math.abs(stop.view.lat) <= 90).toBe(true);
        expect(Number.isFinite(stop.view.lng) && Math.abs(stop.view.lng) <= 180).toBe(true);
        expect(stop.view.zoom).toBeLessThanOrEqual(7.5);

        if (stop.coordinateSource.url.startsWith("/dia-diem/")) {
          const location = geography.publication.locations.find((item) => stop.coordinateSource.url === `/dia-diem/${item.slug}`)!;
          expect(location).toBeDefined();
          expect([stop.view.lng, stop.view.lat]).toEqual([location.longitude, location.latitude]);
        } else {
          expect(stop.coordinateSource.url).toBe(geography.naturalEarth.sourceUrl);
          const record = geography.naturalEarth.features.find((item) => item.longitude === stop.view.lng && item.latitude === stop.view.lat);
          expect(record).toBeDefined();
          expect(stop.coordinateSource.scope).toContain(record!.name);
        }
      }
    });

    it(`${sequence.id}: maps to the existing grade-12 topic and round trips every selected pair`, () => {
      const journey = getJourneyById(sequence.id)!;
      expect(journey).toBeDefined();
      expect(SGK_SERIES).toContain("Kết nối tri thức");
      expect(journey.lessonSlugs).toEqual([sequence.lesson]);
      expect(getSgkLesson(sequence.lesson)?.topic.slug).toBe("chu-de-3");
      for (const stop of journey.stops) {
        const href = `/?tu=1954&den=1975&hanh-trinh=${journey.id}&moc=${stop.id}`;
        const state = parseMapExplorerState(new URL(href, "http://local").searchParams, limits);
        expect(state.journey).toEqual({ id: journey.id, stop: stop.id });
        expect(buildMapExplorerUrl(state)).toBe(href);
        expect(getExplorerReturnHref(href, "fallback")).toBe(href);
      }
    });
  }

  it("returns to Hanoi after Saigon while retaining two distinct published venue anchors", () => {
    const journey = getJourneyById("mua-thu-doc-lap-1945")!;
    expect(journey).toBeDefined();
    expect(journey.stops.map((stop) => stop.mapLabel)).toEqual(["Hà Nội", "Huế", "Sài Gòn", "Hà Nội"]);
    expect([journey.stops[0].view.lng, journey.stops[0].view.lat]).toEqual([105.8578, 21.0245]);
    expect([journey.stops[3].view.lng, journey.stops[3].view.lat]).toEqual([105.8342, 21.0369]);
    expect(getJourneyConnections(journey.id, "ba-dinh-1945").features[0].geometry.coordinates).toEqual([
      [105.8578, 21.0245], [107.5909, 16.4637], [106.7009, 10.7769], [105.8342, 21.0369],
    ]);
  });

  it("keeps a city anchor for each Hue milestone and a separate palace anchor for April 1975", () => {
    const first = getJourneyStop("mua-thu-doc-lap-1945", "hue-1945")!;
    const second = getJourneyStop("mua-xuan-1975", "hue-1975")!;
    expect(first).toBeDefined(); expect(second).toBeDefined();
    expect([first.view.lng, first.view.lat]).toEqual([second.view.lng, second.view.lat]);
    const palace = getJourneyStop("mua-xuan-1975", "sai-gon-1975")!;
    expect(palace).toBeDefined();
    expect([palace.view.lng, palace.view.lat]).toEqual([106.6953, 10.7772]);
  });

  it("distinguishes the Buon Ma Thuot attack from capture and states campaign anchor limitations", () => {
    const attack = getJourneyStop("mua-xuan-1975", "buon-ma-thuot-1975")!;
    expect(attack).toBeDefined();
    expect(attack.title).toMatch(/tiến công/i);
    expect(attack.summary).toContain("11/3");
    expect(attack.accuracyNote).toMatch(/đô thị|thành phố/i);
    for (const id of ["viet-bac-1947", "bien-gioi-1950"]) {
      const campaign = getJourneyStop("khang-chien-chong-phap-1946-1954", id)!;
      expect(campaign).toBeDefined();
      expect(campaign.accuracyNote).toMatch(/đại diện/i);
      expect(campaign.accuracyNote).toMatch(/không/i);
    }
    const geneva = getJourneyStop("khang-chien-chong-phap-1946-1954", "geneve-1954")!;
    expect(geneva).toBeDefined();
    expect(geneva.title).toMatch(/Tuyên bố/i);
    expect(geneva.summary).not.toMatch(/tất cả.*ký/i);
  });

  it("uses only real published event slugs and leaves source-only milestones unlinked", () => {
    const stops = sequences.flatMap((sequence) => getJourneyById(sequence.id)?.stops ?? []);
    expect(stops).toHaveLength(13);
    const links = stops.flatMap((stop) => stop.eventSlug ? [stop.eventSlug] : []);
    expect(links).toEqual([
      "tong-khoi-nghia-gianh-chinh-quyen-o-ha-noi", "tuyen-ngon-doc-lap", "chien-dich-dien-bien-phu",
      "hiep-dinh-geneve-ve-dong-duong", "chien-dich-ho-chi-minh",
    ]);
    for (const slug of links) {
      expect(geography.publication.publishedEventSlugs).toContain(slug);
      expect(readFileSync(`supabase/content/su-kien/${slug}.md`, "utf8")).toContain(`slug: ${slug}`);
    }
    expect(getJourneyStop("khang-chien-chong-phap-1946-1954", "ha-noi-1946")?.eventSlug).toBeUndefined();
    // Shared city names never allow a stop belonging to another journey.
    expect(getJourneyStop("mua-xuan-1975", "hue-1945")).toBeUndefined();
  });
});
