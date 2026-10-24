import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { JourneyChooser } from "@/components/explorer/JourneyChooser";
import { JOURNEY_REGISTRY } from "@/lib/explorer/journeys/registry";
import type { HistoryJourney } from "@/lib/explorer/journey";

describe("JourneyChooser component", () => {
  const journeys = JOURNEY_REGISTRY.journeys;
  const selectedJourney = journeys[0]; // ho-chi-minh-1911-1941
  const selectedStop = selectedJourney.stops[0]; // sai-gon-1911
  const state = {
    from: 1911,
    to: 1941,
    selectedEvent: null,
    view: null,
    journey: { id: selectedJourney.id, stop: selectedStop.id },
  };

  const defaultProps = {
    journeys,
    selectedJourney,
    selectedStop,
    state,
    onChooseJourney: vi.fn(),
    onSeekStop: vi.fn(),
  };

  it("renders all 4 verified journeys with title, period, and stop count in native selector", () => {
    const html = renderToStaticMarkup(createElement(JourneyChooser, defaultProps));

    // Form and label
    expect(html).toContain('for="journey-select"');
    expect(html).toContain("Chọn hành trình");

    // Select with 4 options
    expect(html).toContain('id="journey-select"');
    expect(html).toContain('value="ho-chi-minh-1911-1941"');
    expect(html).toContain('value="mua-thu-doc-lap-1945"');
    expect(html).toContain('value="khang-chien-chong-phap-1946-1954"');
    expect(html).toContain('value="mua-xuan-1975"');

    // Labels inside options
    expect(html).toContain("Hành trình của Chủ tịch Hồ Chí Minh (1911 — 1941) · 7 mốc");
    expect(html).toContain("Mùa thu độc lập 1945 (19/08 — 02/09/1945) · 4 mốc");
    expect(html).toContain("Những mốc kháng chiến chống Pháp (1946 — 1954) · 5 mốc");
    expect(html).toContain("Mùa Xuân 1975 (10/03 — 30/04/1975) · 4 mốc");
  });

  it("filters out unsupported/unregistered entries so they never appear as functioning choices", () => {
    const fakeJourney: HistoryJourney = {
      id: "unsupported-synthetic",
      title: "Unsupported synthetic journey",
      period: "2026",
      note: "Not in registry",
      lessonSlugs: [],
      stops: [],
    };
    const html = renderToStaticMarkup(
      createElement(JourneyChooser, {
        ...defaultProps,
        journeys: [...journeys, fakeJourney],
      })
    );
    expect(html).not.toContain("unsupported-synthetic");
    expect(html).not.toContain("Unsupported synthetic journey");
  });

  it("shows active state on the currently selected journey and highlights active stops", () => {
    const html = renderToStaticMarkup(createElement(JourneyChooser, defaultProps));
    // The active journey link in the choices list has aria-current="true"
    expect(html).toContain('data-journey-id="ho-chi-minh-1911-1941"');
    expect(html).toMatch(/data-journey-id="ho-chi-minh-1911-1941"[^>]*aria-current="true"/);

    // Selected title, period, and note are present
    expect(html).toContain(selectedJourney.title);
    expect(html).toContain(selectedJourney.note);
    expect(html).toContain(selectedJourney.period);

    // Stop count and stops list
    expect(html).toContain("7 mốc");
    expect(html).toContain("data-stop-id=\"sai-gon-1911\"");
    expect(html).toMatch(/data-stop-id="sai-gon-1911"[^>]*aria-current="step"/);
  });

  it("provides meaningful HTML GET/link navigation when JavaScript is absent", () => {
    const html = renderToStaticMarkup(createElement(JourneyChooser, defaultProps));
    // Form uses GET method
    expect(html).toContain('method="get"');
    expect(html).toContain('action="/"');
    expect(html).toContain('name="hanh-trinh"');

    // No-JS submit button exists inside noscript
    expect(html).toContain("<noscript>");
    expect(html).toContain('type="submit"');

    // Stop links use valid URL with hanh-trinh and moc query parameters
    expect(html).toContain("hanh-trinh=ho-chi-minh-1911-1941&amp;moc=sai-gon-1911");
    expect(html).toContain("hanh-trinh=mua-thu-doc-lap-1945&amp;moc=ha-noi-1945");
  });

  it("switches display correctly when a different journey is passed as selectedJourney", () => {
    const autumn = journeys[1]; // mua-thu-doc-lap-1945
    const autumnStop = autumn.stops[0];
    const autumnState = {
      ...state,
      journey: { id: autumn.id, stop: autumnStop.id },
    };
    const html = renderToStaticMarkup(
      createElement(JourneyChooser, {
        ...defaultProps,
        selectedJourney: autumn,
        selectedStop: autumnStop,
        state: autumnState,
      })
    );

    expect(html).toContain(autumn.title);
    expect(html).toContain(autumn.period);
    expect(html).toContain(autumn.note);
    expect(html).toContain("4 mốc");
    expect(html).toMatch(/data-journey-id="mua-thu-doc-lap-1945"[^>]*aria-current="true"/);
    expect(html).toMatch(/data-stop-id="ha-noi-1945"[^>]*aria-current="step"/);
  });
});
