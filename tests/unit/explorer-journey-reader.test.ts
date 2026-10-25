import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { JourneyPanel } from "@/components/explorer/JourneyPanel";
import { JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";

vi.mock("@/lib/explorer/journeys/registry", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/explorer/journeys/registry")>();
  const legacy = original.JOURNEY_REGISTRY.journeys[0];
  const selected = { ...legacy, id: "synthetic-reader", title: "Synthetic reader", period: "Synthetic period", stops: legacy.stops.slice(2, 4) };
  return { ...original, JOURNEY_REGISTRY: original.createJourneyRegistry([legacy, selected]) };
});

describe("selected journey reader", () => {
  const journey = JOURNEY_REGISTRY.getJourneyById("synthetic-reader")!;
  const stop = journey.stops[1];
  const props = { journey, stop, state: { from: 1954, to: 1954, selectedEvent: null, view: null, journey: { id: journey.id, stop: stop.id } },
    playing: false, settled: true, travelling: false, readerActive: false, reducedMotion: false, mapAvailable: true,
    eventAvailable: false, onSeek: vi.fn(), onPlay: vi.fn(), onExit: vi.fn(), onReadingChange: vi.fn() };

  it("uses selected period, stop count, sequence and pair-aware links despite exploration years", () => {
    const html = renderToStaticMarkup(createElement(JourneyPanel, props));
    expect(html).toContain("Synthetic period");
    expect(html).toContain("Mốc 2 / 2");
    expect(html).toContain("hanh-trinh=synthetic-reader&amp;moc=london-1913");
    expect(html).toContain("hanh-trinh=synthetic-reader&amp;moc=paris-1919");
    expect(html).not.toContain("moc=sai-gon-1911");
    expect(html).not.toContain("1911 — 1941");
  });

  it("keeps a source-only/unpublished stop readable without manufacturing a detail link", () => {
    const html = renderToStaticMarkup(createElement(JourneyPanel, props));
    expect(html).toContain(stop.summary);
    expect(html).toContain(stop.sources[0].url);
    expect(html).not.toContain("/su-kien/");
    const published = renderToStaticMarkup(createElement(JourneyPanel, { ...props, eventAvailable: true }));
    expect(published).toContain(`/su-kien/${stop.eventSlug}?`);
    expect(decodeURIComponent(published)).toContain("hanh-trinh=synthetic-reader");
  });

  it("keeps Pause available during the final flight and disables playback after its arrival", () => {
    const travelling = renderToStaticMarkup(createElement(JourneyPanel, { ...props, playing: true, settled: false, travelling: true }));
    expect(travelling.match(/<button\b[^>]*aria-label="Tạm dừng hành trình"[^>]*>/)?.[0]).not.toContain("disabled");
    const arrived = renderToStaticMarkup(createElement(JourneyPanel, props));
    expect(arrived.match(/<button\b[^>]*aria-label="Phát hành trình"[^>]*>/)?.[0]).toContain("disabled");
  });

  it("dynamically configures timeline grid columns to stop count and renders noscript exit fallback", () => {
    const html = renderToStaticMarkup(createElement(JourneyPanel, props));
    expect(html).toContain("grid-template-columns:repeat(2, minmax(0, 1fr))");
    expect(html).toContain("journey-exit-noscript");
    expect(html).toContain("Thoát");
  });
});
