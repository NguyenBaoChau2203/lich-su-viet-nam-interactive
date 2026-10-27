import { expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LocalHeroList } from "@/components/local-heroes/LocalHeroList";
import type { LocalHeroSummary } from "@/lib/local-heroes/types";
vi.mock("next/image", () => ({ default: () => null }));
it("distinguishes disputed life dates from approximate dates instead of choosing a disputed year", () => {
  const person: LocalHeroSummary = { id: "synthetic", slug: "synthetic", name: "Synthetic person", aliases: [], birthYear: 1940, birthYearCertainty: "disputed", deathYear: 1960, deathYearCertainty: "approximate", contributionSummary: "Synthetic", associations: [],
    image: { id: "synthetic", url: "https://example.invalid/image", width: 240, height: 160, altText: "Synthetic", caption: "Synthetic", depictionKind: "historical_context", era: "illustration", labels: [], photographer: null, sourcePageUrl: "https://example.invalid/source", license: null, licenseUrl: null, usageBasis: "coursework_reference", usageNote: "Synthetic", focalPoint: null } };
  const html = renderToStaticMarkup(createElement(LocalHeroList, { items: [person], localityCode: null, homeHref: "/?noi-dung=nhan-vat" }));
  expect(html).toContain("Năm sinh chưa thống nhất"); expect(html).not.toContain("1940"); expect(html).toContain("Mất khoảng 1960");
});
